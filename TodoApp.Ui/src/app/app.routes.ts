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
    canActivate: [() => inject(AuthService).isLoggedIn() ? inject(Router).navigate(['/todos']) : true] 
  },
  { 
    path: 'todos', 
    component: TodoMainComponent, 
    canActivate: [authGuard] 
  },
  { path: '', redirectTo: 'todos', pathMatch: 'full' },
  { path: '**', redirectTo: 'todos' }
];