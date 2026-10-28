import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, switchMap, catchError, of } from 'rxjs';

const PROTECTED = ['/api/orders', '/api/checkout/purchase'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!PROTECTED.some(path => req.url.includes(path))) {
    return next(req); // public endpoint, send as-is
  }

  const auth = inject(AuthService);

  return from(auth.getAccessTokenSilently()).pipe(
    catchError(() => of(null)), // not logged in / refresh failed
    switchMap(token =>
      next(token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req),
    ),
  );
};