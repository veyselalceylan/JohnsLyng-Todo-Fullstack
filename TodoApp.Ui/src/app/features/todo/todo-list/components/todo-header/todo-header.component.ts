import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: '[app-todo-header]', 
  standalone: true,
  imports: [TableModule],
  templateUrl: './todo-header.component.html'
})
export class TodoHeaderComponent {}