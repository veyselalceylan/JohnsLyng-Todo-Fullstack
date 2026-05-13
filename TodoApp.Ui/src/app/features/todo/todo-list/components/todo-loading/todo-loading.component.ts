import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: '[app-todo-loading]',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './todo-loading.component.html'
})
export class TodoLoadingComponent {}