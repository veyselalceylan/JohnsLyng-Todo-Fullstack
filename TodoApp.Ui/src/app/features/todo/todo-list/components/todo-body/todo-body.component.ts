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
  // Attribute selector helps to keep the table structure (tr) valid.
  selector: '[app-todo-body]', 
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    TagModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './todo-body.component.html',
})
export class TodoBodyComponent {
  @Input() todo!: Todo;
  @Input() deletingId: string | null = null;

  @Output() toggle = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Todo>();

  // Mapping priorities to PrimeNG's severity colors for better visual feedback.
  getPrioritySeverity(priority: string): any {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'secondary';
    }
  }

  /**
   * Deadline Check: Highlighting tasks that are due today to catch the user's eye.
   * UX detail: We only care about this if the task is not already completed.
   */
  isToday(date: any): boolean {
    if (!date) return false;
    const deadline = new Date(date);
    const today = new Date();

    return (
      deadline.getDate() === today.getDate() &&
      deadline.getMonth() === today.getMonth() &&
      deadline.getFullYear() === today.getFullYear() &&
      !this.todo.isCompleted
    );
  }
}