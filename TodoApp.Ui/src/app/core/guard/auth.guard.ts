import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

/**
 * Auth Guard: The gatekeeper for protected pages (like /todos).
 * If you're not logged in, you don't get in. Simple as that.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if there is an active user in the session
  if (authService.currentUser()) {
    // User is legit, let them through
    return true;
  } else {
    // No user found? Boot them back to the login page
    router.navigate(['/login']);
    
    // Return false to cancel the original navigation attempt
    return false;
  }
};