import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  /**
   * Using Angular Signals here for reactive state management. 
   * It's much more performant than traditional Observables for simple state like 'currentUser', 
   * as it reduces unnecessary change detection cycles.
   */
  currentUser = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('username') : null
  );

  login(name: string) {
    // Persisting the user in localStorage so the session survives page refreshes.
    localStorage.setItem('username', name);
    
    // Updating the signal will automatically trigger UI updates across the app.
    this.currentUser.set(name);
    
    this.router.navigate(['/todos']);
  }

  logout() {
    // Clear the session data
    localStorage.removeItem('username');
    
    // Reset the state
    this.currentUser.set(null);
    
    // Redirect the user to the login screen
    this.router.navigate(['/login']);
  }

  /**
   * Simple helper to check auth status. 
   * Signals make this check very efficient in templates.
   */
  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}