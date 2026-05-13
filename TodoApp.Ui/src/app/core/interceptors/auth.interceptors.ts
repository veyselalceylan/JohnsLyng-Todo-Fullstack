
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  if (user) {
    const authReq = req.clone({
      setHeaders: {
        'X-User-Name': user 
      }
    });
    return next(authReq);
  }

  return next(req);
};