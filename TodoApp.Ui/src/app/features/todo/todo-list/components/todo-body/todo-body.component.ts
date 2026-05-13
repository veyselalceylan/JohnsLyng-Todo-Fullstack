import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Todo } from '../../../../../models/todo.model';

@Component({
  selector: '[app-todo-body]',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, CheckboxModule, TagModule, ButtonModule, TooltipModule],
  templateUrl: './todo-body.component.html'
})
export class TodoBodyComponent {
  @Input() todo!: Todo;
  @Input() deletingId: string | null = null;
  
  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();

  getPrioritySeverity(priority: string): any {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  }
}