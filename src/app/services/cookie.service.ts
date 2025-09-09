import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CookieService {
  set(
    name: string,
    value: string,
    opts?: {
      expires?: Date;
      maxAgeSec?: number;
      path?: string;
      secure?: boolean;
      sameSite?: 'Lax' | 'Strict' | 'None';
      domain?: string;
    },
  ) {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (opts?.expires) cookie += `; Expires=${opts.expires.toUTCString()}`;
    if (opts?.maxAgeSec != null) cookie += `; Max-Age=${opts.maxAgeSec}`;
    cookie += `; Path=${opts?.path ?? '/'}`;
    if (opts?.domain) cookie += `; Domain=${opts.domain}`;
    if (opts?.secure) cookie += `; Secure`;
    cookie += `; SameSite=${opts?.sameSite ?? 'Lax'}`;
    document.cookie = cookie;
  }

  get(name: string): string | null {
    const m = document.cookie.match(
      new RegExp('(?:^|; )' + encodeURIComponent(name) + '=([^;]*)'),
    );
    return m ? decodeURIComponent(m[1]) : null;
  }

  delete(name: string, path = '/', domain?: string) {
    this.set(name, '', {
      expires: new Date(0),
      path,
      ...(domain ? { domain } : {}),
    });
  }
}
