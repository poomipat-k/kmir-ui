import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
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
