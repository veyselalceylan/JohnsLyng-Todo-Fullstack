import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { TodoListComponent } from './features/todo-list/todo-list.component';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'todos' // Burası hatayı çözen kritik dokunuş
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'todos', 
    component: TodoListComponent, 
    canActivate: [authGuard] // Guard zaten giriş kontrolü yapıp login'e atacak
  },
  { 
    path: '**', 
    redirectTo: 'todos' 
  }
];