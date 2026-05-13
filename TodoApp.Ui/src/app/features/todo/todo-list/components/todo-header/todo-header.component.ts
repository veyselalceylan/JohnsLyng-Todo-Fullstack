import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: '[app-todo-header]', // Attribute selector kullanıyoruz ki <tr> üzerine takabilelim
  standalone: true,
  imports: [TableModule],
  templateUrl: './todo-header.component.html'
})
export class TodoHeaderComponent {}