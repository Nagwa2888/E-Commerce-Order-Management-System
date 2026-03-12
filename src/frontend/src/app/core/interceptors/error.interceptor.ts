import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message = typeof error.error?.error === 'string'
        ? error.error.error
        : error.message || 'Unexpected request error.';

      if (error.status === 401) {
        authService.logout();
        notificationService.error('Authentication error. Please login again.');
        router.navigate(['/login']);
      } else if (error.status >= 500) {
        notificationService.error(`Server error: ${message}`);
      } else if (error.status === 409) {
        notificationService.warning(message);
      } else if (error.status >= 400) {
        notificationService.warning(message);
      }

      return throwError(() => error);
    })
  );
};
