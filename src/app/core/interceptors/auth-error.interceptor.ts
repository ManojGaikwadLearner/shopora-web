import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { catchError, throwError } from "rxjs";

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.loginWithRedirect({ appState: { target: location.pathname } });
      }
      return throwError(() => error);
    }),
  );
};