import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { UserService } from '../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  return userService.getCurrentUser().pipe(
    map((user) => {
      if (user.username && user.userRole === 'admin') {
        userService.currentUser.set(user);
        return true;
      }
      return false;
    }),
    catchError((err) => {
      router.navigate(['/login']);
      return throwError(() => err);
    })
  );
};
