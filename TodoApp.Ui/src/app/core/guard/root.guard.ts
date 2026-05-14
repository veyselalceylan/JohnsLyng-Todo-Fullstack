import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Root Guard: Handles the initial landing logic. 
 * Instead of showing an empty page at '/', i decide where the user should go.
 */
export const rootGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Quick check: If the user is already logged in, no need to show login again.
  if (authService.isLoggedIn()) {
    // Send them to the dashboard
    router.navigate(['/todos']);
  } else {
    // Otherwise, they need to sign in first
    router.navigate(['/login']);
  }

  // i return false here because this guard's only job is to redirect. 
  // The '/' route itself doesn't have a component to render.
  return false;
};