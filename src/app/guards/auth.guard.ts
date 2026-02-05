import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = async (
  route,
): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const loading = inject(LoadingService);

  // Già autenticato: se c'è ?code ripulisco l'URL
  if (auth.isAuthenticated()) {
    // Se sono già in dashboard lascio passare
    if (route.routeConfig?.path === 'dashboard') {
      return true;
    }
    // Altrimenti vado in dashboard
    return router.createUrlTree(['/dashboard']);
  }

  const codeParam = route.queryParamMap.get('code');
  if (!codeParam) return router.parseUrl('/home');

  // Decripta il "code" ricevuto dal Discovery
  const decrypted = auth.decryptCode(codeParam, environment.discovery.d);
  if (!decrypted || /failed|errore|invalida/i.test(decrypted)) {
    return router.parseUrl('/home');
  }

  // spinner mentre elabora il token
  loading.show();

  try {
    // ottieni access_token e la scadenza del token
    const tokenResp: any = await firstValueFrom(auth.getToken(decrypted));
    if (!tokenResp) throw new Error('no_token');

    const token = tokenResp.access_token;
    const expiresIn = Number(tokenResp.expires_in) || 1800; // fallback 30 min
    const refreshToken = tokenResp.refresh_token;

    auth.setTokenCookie(token, expiresIn, refreshToken);

    // Ripulisci ?code dall’URL rimanendo su /dashboard
    return router.createUrlTree(['/dashboard']);
  } catch {
    // Qualsiasi errore → torna a /home
    return router.parseUrl('/home');
  } finally {
    loading.hide();
  }
};
