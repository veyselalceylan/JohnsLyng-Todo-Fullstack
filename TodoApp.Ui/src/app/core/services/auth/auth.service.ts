import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  currentUser = signal<string | null>(typeof window !== 'undefined' ? localStorage.getItem('username') : null);

  login(name: string) {
    localStorage.setItem('username', name);
    this.currentUser.set(name);
    this.router.navigate(['/todos']);
  }

  logout() {
    localStorage.removeItem('username');
    
    this.currentUser.set(null);
    
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }
}