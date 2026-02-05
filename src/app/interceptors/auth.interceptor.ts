// auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { from, throwError, Observable, defer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);

  // Skip tutte le chiamate al Discovery (auth/token/refresh_token/logout)
  const dsBase = environment.discovery.endpoint.replace(/\/$/, '');
  const isDiscovery =
    req.url.startsWith(dsBase) ||
    /\/(auth|token|refresh_token|logout)(\?|$)/.test(req.url);

  if (isDiscovery) {
    // console.log('[INT] skip discovery:', req.url);
    return next(req);
  }

  // Skip asset statici (assets/*, .json/.css/.js/.png/.svg/.woff2, ecc.)
  const isStaticAsset =
    /(^|\.?\/)assets\//.test(req.url) ||
    /\.(json|css|js|map|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)(\?|$)/i.test(
      req.url,
    );
  if (isStaticAsset) {
    //  console.log('[INT] skip asset:', req.url);
    return next(req);
  }

  return defer(() =>
    from(auth.getValidAccessToken(60)).pipe(
      switchMap((token) => {
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;

        //   console.log('[INT] attach token?', !!token, req.url);

        return next(authReq).pipe(
          catchError((err) => {
            // retry UNA volta se 401
            if (err instanceof HttpErrorResponse && err.status === 401) {
              return from(auth.refreshWithLock()).pipe(
                switchMap((ok) => {
                  if (!ok) {
                    auth.logout();
                    return throwError(() => err);
                  }
                  return from(auth.getValidAccessToken(60)).pipe(
                    switchMap((fresh) => {
                      const retryReq = fresh
                        ? authReq.clone({
                            setHeaders: { Authorization: `Bearer ${fresh}` },
                          })
                        : authReq;
                      return next(retryReq);
                    }),
                  );
                }),
              );
            }
            return throwError(() => err);
          }),
        );
      }),
    ),
  );
};
