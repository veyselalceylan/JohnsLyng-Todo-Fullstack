import { Router, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { TodoListComponent } from './features/todo/todo-list/todo-list.component';
import { authGuard } from './core/guard/auth.guard';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth/auth.service';
import { TodoMainComponent } from './features/todo/todo-main.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    /**
     * Preventing logged-in users from accessing the login page.
     * If they already have a session, we redirect them straight to their todos.
     */
    canActivate: [() => inject(AuthService).isLoggedIn() ? inject(Router).navigate(['/todos']) : true] 
  },
  { 
    path: 'todos', 
    component: TodoMainComponent, 
    canActivate: [authGuard] // Only for authenticated users.
  },
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: '**', redirectTo: 'todos' }
];