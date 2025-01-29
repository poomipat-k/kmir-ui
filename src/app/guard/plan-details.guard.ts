import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';
import { PlanService } from '../services/plan.service';

export const accessPlanDetailsGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const planService = inject(PlanService);
  const planName = route.params?.['planName'];
  return planService.canAccessPlanDetails(planName).pipe(
    map((res) => {
      if (res.success) {
        return true;
      }
      // Todo: redirect to error page?
      router.navigate(['/']);
      return false;
    }),
    catchError((err) => {
      // Todo: redirect to error page?
      router.navigate(['/']);
      return throwError(() => err);
    })
  );
};
