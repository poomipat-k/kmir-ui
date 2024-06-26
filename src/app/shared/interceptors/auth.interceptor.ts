import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserService } from '../../services/user.service';

const refreshTokenFragmentUrl = '/refresh-token';
const statusUnauthorized = 401;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const withCredentialReq = req.clone({ withCredentials: true });
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);
  return next(withCredentialReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error?.status === statusUnauthorized &&
        !error?.url?.includes(refreshTokenFragmentUrl)
      ) {
        return doRefreshToken(withCredentialReq, next, userService, router);
      } else {
        return throwError(() => error);
      }
    })
  );
};

const doRefreshToken = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  userService: UserService,
  router: Router
) => {
  return userService.refreshAccessToken().pipe(
    switchMap((_) => {
      return next(req);
    }),
    catchError((error) => {
      if (error?.status === statusUnauthorized) {
        console.log('====refresh login token failed');
        // userService.logout().subscribe();
        // router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
