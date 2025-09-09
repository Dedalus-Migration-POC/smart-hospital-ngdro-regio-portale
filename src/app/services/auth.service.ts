import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import {
  Subscription,
  timer,
  firstValueFrom,
  of,
  map,
  Observable,
  catchError,
} from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { CookieService } from './cookie.service';
import { environment } from '../../environments/environment.development';
import { Router } from '@angular/router';

export interface JwtClaims {
  aud: string;
  entryUUID: string;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  identifier: string;
  ipaddr: string;
  iss: string;
  jti: string;
  nbf: number;
  sub: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Stato in memoria dell’access token */
  private _token = signal<string | null>(null);

  /** Timer usato per schedulare il refresh a T–60s */
  private refreshTimer?: Subscription;

  /** Promessa condivisa per evitare refresh paralleli */
  private refreshLock?: Promise<boolean>;

  /** True se esiste un token in memoria o nel cookie */
  readonly isAuthenticated = computed(
    () => !!(this._token() || this.cookies.get('access_token')),
  );

  /** Info dell'utente decodificati dal token  (o null se assenti/non validi) */
  readonly claims = computed<JwtClaims | null>(() => {
    const t = this._token() ?? this.cookies.get('access_token');
    return t ? this.decodeJwtPayload(t) : null;
  });

  constructor(
    private http: HttpClient,
    private cookies: CookieService,
    private router: Router,
  ) {
    // Ripristina token dal cookie all’avvio
    // e riprogramma il refresh in base al JWT exp
    const t = this.cookies.get('access_token');
    this._token.set(t || null);
    if (t) this.resumeRefreshTimerFromJwt(t);
  }

  /** Costruisce l’URL /auth per l’IdP (redirect) */
  login(): string {
    const params = new HttpParams()
      .set('client_id', environment.discovery.a)
      .set('redirect_uri', environment.discovery.e)
      .set('response_type', 'access_token');

    return `${environment.discovery.endpoint.replace(/\/$/, '')}/auth?${params.toString()}`;
  }

  /** Ricevi il token dal discovery */
  getToken(code: string) {
    const params = new HttpParams()
      .set('code', code)
      .set('client_id', environment.discovery.a)
      .set('grant_type', 'authorization_code');

    const url = `${environment.discovery.endpoint.replace(/\/$/, '')}/token?${params.toString()}`;
    return this.http.get(url);
  }

  /** Logout
   * prendo sid
   * faccio partire il microservizio
   * pulizia token e redirect subito in home
   * faccio logout del discovery in background usando un iframe di appoggio cosi l'utente non si rende conto perchè la navigazione "non ha tempi di attese"
   */
  logout(): void {
    const sid = this.getClaims()?.jti || null;

    const micro$ = this.serviceLogout().pipe(
      map(() => void 0),
      catchError(() => of(void 0)),
    );

    micro$.subscribe();

    // pulizia subito
    this.clearToken();

    // reindirizzo subito in home
    this.router.navigate(['/home'], { replaceUrl: true });

    // faccio Logout Discovery in background, non blocca la ux
    if (sid) this.discoveryLogoutBackground(sid);
  }

  // Info utente prese dal token
  getClaims(): JwtClaims | null {
    return this.claims();
  }

  /**
   * Imposta il cookie
   * access_token con scadenza (in secondi) e programma il refresh a T–60s.
   * refresh_token per chiamare la rest del /refresh_token
   */
  setTokenCookie(token: string, expiresInSec: number, refreshToken: string) {
    const seconds = Number(expiresInSec);
    if (!Number.isFinite(seconds) || seconds <= 0) return;

    const expires = new Date(Date.now() + seconds * 1000);

    this.cookies.set('access_token', token, {
      expires,
      path: '/',
      sameSite: 'Lax',
      secure: location.protocol === 'https:',
    });

    this.cookies.set('refresh_token', refreshToken, {
      expires,
      path: '/',
      sameSite: 'Lax',
      secure: location.protocol === 'https:',
    });

    this._token.set(token);
    this.scheduleAccessTokenRefresh(seconds); // programma refresh automatico
  }

  /** Decripta il code */
  decryptCode(encryptedCode: string, passphrase: string): string {
    try {
      const key = CryptoJS.enc.Utf8.parse(passphrase);
      if (![16, 24, 32].includes(key.sigBytes)) {
        return 'Chiave invalida: la chiave deve essere 16/24/32 byte';
      }
      const isHex =
        /^[0-9a-fA-F]+$/.test(encryptedCode) && encryptedCode.length % 2 === 0;
      const input = isHex
        ? CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Hex.parse(encryptedCode),
          })
        : encryptedCode;

      const decryptedWA = CryptoJS.AES.decrypt(input as any, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });

      let out = decryptedWA.toString(CryptoJS.enc.Utf8);
      if (!out) return 'Decryption failed or wrong key';

      out = out.replace(/[\x00\x10]+$/g, '');
      const idx = out.indexOf(String.fromCharCode(0x10));
      if (idx !== -1) out = out.slice(0, idx);
      return out.trim() || 'Decryption failed or wrong key';
    } catch (error) {
      console.error('Errore nella decrittazione:', error);
      return 'Errore durante la decrittazione';
    }
  }

  // Verifico se alla scadenza del token manca meno di 1 minuto lo aggiorno => minTtlSec = 60
  async getValidAccessToken(minTtlSec = 60): Promise<string | null> {
    // prendo il token in memoria o dal cookie
    let token = this._token() ?? this.cookies.get('access_token');

    if (!token) return null;

    const exp = this.jwtExp(token);
    const now = Math.floor(Date.now() / 1000);

    // se scade tra <= minTtlSec, provo il refresh
    if (!exp || exp - now <= minTtlSec) {
      const ok = await this.refreshWithLock().catch(() => false);
      if (!ok) return null;
      token = this._token() ?? this.cookies.get('access_token'); // rileggo
    }

    return token ?? null;
  }

  /** Schedula un refresh a 60s dalla scadenza (minimo 30s) */
  private scheduleAccessTokenRefresh(expiresInSec: number) {
    this.refreshTimer?.unsubscribe();
    const whenSec = Math.max(30, expiresInSec - 60);
    this.refreshTimer = timer(whenSec * 1000).subscribe(() => {
      // console.log('[AUTH] timer -> refreshWithLock');
      this.refreshWithLock().catch(() => this.logout());
    });
  }

  /** All’avvio pagina, calcola il tempo residuo del token e riprogramma il timer */
  private resumeRefreshTimerFromJwt(token: string) {
    const exp = this.jwtExp(token);
    if (!exp) return;
    const now = Math.floor(Date.now() / 1000);
    const remaining = exp - now;
    if (remaining > 0) this.scheduleAccessTokenRefresh(remaining);
  }

  /** Estrae il tempo di scadenza dal JWT */
  private jwtExp(token: string): number | undefined {
    try {
      const [, payload] = token.split('.');
      const json = this.base64UrlToUtf8Json(payload);
      return typeof json?.exp === 'number' ? json.exp : undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Per avere un nuovo token dal discovery
   */
  private refreshToken() {
    const base = environment.discovery.endpoint.replace(/\/$/, '');
    const url = `${base}/refresh_token`;

    const refreshToken = this.cookies.get('refresh_token');

    const params = new HttpParams()
      .set('client_id', environment.discovery.a)
      .set('grant_type', 'refresh_token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${refreshToken}`,
    });

    return this.http.post(url, null, {
      params,
      headers,
    });
  }

  /** Evita refresh concorrenti; ritorna true se il token è stato aggiornato */
  async refreshWithLock(): Promise<boolean> {
    if (this.refreshLock) return this.refreshLock;
    this.refreshLock = this.refreshAccessToken()
      .catch(() => false)
      .finally(() => {
        this.refreshLock = undefined;
      });
    return this.refreshLock;
  }

  /** Esegue il refresh, salva il nuovo access_token e riprogramma il timer */
  private async refreshAccessToken(): Promise<boolean> {
    // console.log('[AUTH] refreshAccessToken()');
    const resp: any = await firstValueFrom(this.refreshToken());
    const newToken = resp?.access_token as string;
    const expiresInSec = Number(resp?.expires_in) || 0;
    const refreshToken = resp?.refresh_token as string;
    if (!newToken || !expiresInSec || !refreshToken) return false;

    this.setTokenCookie(newToken, expiresInSec, refreshToken);
    return true;
  }

  /** Decodifica Base64URL, JSON UTF-8 del payload */
  private base64UrlToUtf8Json(b64url: string): any | null {
    try {
      const base64 = b64url
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(b64url.length + ((4 - (b64url.length % 4 || 4)) % 4), '=');

      const binary = atob(base64);
      const utf8 = decodeURIComponent(
        Array.from(
          binary,
          (c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'),
        ).join(''),
      );
      return JSON.parse(utf8);
    } catch {
      return null;
    }
  }

  /** Ritorna il payload (info) del JWT, oppure null */
  private decodeJwtPayload(token: string): JwtClaims | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return this.base64UrlToUtf8Json(parts[1]) as JwtClaims | null;
  }

  /** Cancella access_token e ferma il timer */
  private clearToken() {
    this.refreshTimer?.unsubscribe();
    this.cookies.delete('access_token');
    this.cookies.delete('refresh_token');
    this._token.set(null);
  }

  /** Logout del microservizio */
  private serviceLogout(): Observable<void> {
    const token = this._token() ?? this.cookies.get('access_token');
    if (!token) return of(void 0);

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http
      .get('/logout', { headers, responseType: 'text' as const })
      .pipe(map(() => void 0));
  }

  // Logout Discovery in background (iframe nascosto): non blocca la UI
  // iframe va nell'url del logout del Discovery, senza bloccare la UI
  private discoveryLogoutBackground(sid: string): void {
    const base = `${environment.discovery.endpoint.replace(/\/$/, '')}/logout`;
    const u = new URL(base);
    u.searchParams.set('sid', sid);
    // dopo il logout Discovery, rientra in /home
    u.searchParams.set('post_logout_redirect_uri', `${location.origin}/home`);

    const iframe = document.createElement('iframe');
    iframe.src = u.toString();
    iframe.hidden = true;
    iframe.width = '0';
    iframe.height = '0';
    iframe.tabIndex = -1 as any;
    iframe.title = 'logout';
    iframe.referrerPolicy = 'no-referrer';

    // cleanup immediato quando ha finito (o fallito)
    const cleanup = () => {
      iframe.removeEventListener('load', cleanup);
      iframe.removeEventListener('error', cleanup);
      iframe.remove();
    };
    iframe.addEventListener('load', cleanup);
    iframe.addEventListener('error', cleanup);

    document.body.appendChild(iframe);

    // fallback: se l'IdP è lento/non risponde, rimuovi comunque dopo 15s
    setTimeout(cleanup, 15000);
  }
}
