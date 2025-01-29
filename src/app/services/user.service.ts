import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CommonSuccessResponse } from '../shared/models/common-success-response';
import { User } from '../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http: HttpClient = inject(HttpClient);
  private baseApiUrl = environment.apiUrl;
  public currentUser = signal<User>(new User());

  constructor() {}

  public login(
    username: string,
    password: string
  ): Observable<CommonSuccessResponse> {
    return this.http
      .post<CommonSuccessResponse>(`${this.baseApiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  public logout(): Observable<CommonSuccessResponse> {
    return this.http
      .post<CommonSuccessResponse>(`${this.baseApiUrl}/auth/logout`, {})
      .pipe(catchError(this.handleError));
  }

  public getCurrentUser(): Observable<User> {
    return this.http
      .get<User>(`${this.baseApiUrl}/auth/current`)
      .pipe(catchError(this.handleError));
  }

  public refreshAccessToken(): Observable<CommonSuccessResponse> {
    return this.http
      .post<CommonSuccessResponse>(`${this.baseApiUrl}/auth/refresh-token`, {})
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
