import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const rootGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/todos']);
  } else {
    router.navigate(['/login']);
  }
  return false; // Doğrudan boş sayfayı açmaması için false dönüp navigate ile yönlendiriyoruz
};