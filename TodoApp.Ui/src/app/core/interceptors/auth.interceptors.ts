import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

/**
 * Auth Interceptor: This acts like a 'passport control' for every HTTP request.
 * Note: I'm using a simple header for now, but the system is designed to be 
 * ready for a professional token-based authentication (like JWT token) in the future.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  // If we have a user in the session, we need to let the Backend know who is asking.
  if (user) {
    // We clone the request because the original request is 'immutable'.
    const authReq = req.clone({
      setHeaders: {
        'X-User-Name': user // Identifying the user for server-side filtering
      }
    });
    
    return next(authReq);
  }

  // If no user, just let the request go through as is (e.g., for login)
  return next(req);
};