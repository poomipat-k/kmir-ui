import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CommonSuccessResponse } from '../shared/models/common-success-response';
import { PlanDetails } from '../shared/models/plan-details';
import { PreviewPlan } from '../shared/models/preview-plan';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private readonly http: HttpClient = inject(HttpClient);
  private baseApiUrl = environment.apiUrl;

  constructor() {}

  getAllPreviewPlan() {
    return this.http
      .get<PreviewPlan[]>(`${this.baseApiUrl}/plan/preview/all`)
      .pipe(catchError(this.handleError));
  }

  canAccessPlanDetails(planName: string) {
    if (!planName) {
      const res = new CommonSuccessResponse();
      res.success = false;
      res.message = 'empty planName';
      return of(res);
    }
    return this.http
      .get<CommonSuccessResponse>(`${this.baseApiUrl}/plan/access/${planName}`)
      .pipe(catchError(this.handleError));
  }

  canEditPlan(planName: string) {
    if (!planName) {
      const res = new CommonSuccessResponse();
      res.success = false;
      res.message = 'empty planName';
      return of(res);
    }
    return this.http
      .get<CommonSuccessResponse>(`${this.baseApiUrl}/plan/edit/${planName}`)
      .pipe(catchError(this.handleError));
  }

  getPlanDetails(planName: string) {
    return this.http
      .get<PlanDetails>(`${this.baseApiUrl}/plan/details/${planName}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(() => error);
  }
}
