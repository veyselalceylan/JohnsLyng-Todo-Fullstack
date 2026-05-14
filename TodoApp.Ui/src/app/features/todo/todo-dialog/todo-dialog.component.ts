import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    TextareaModule,
    AutoCompleteModule,
    DatePickerModule,
    CheckboxModule,
    ButtonModule,
  ],
  templateUrl: './todo-dialog.component.html',
})
export class TodoDialogComponent implements OnInit {
  // Input/Output pattern for clean data flow between parent and child.
  @Input() todo: any = {};
  @Input() isEditMode: boolean = false;
  @Output() onSave = new EventEmitter<Todo>();
  @Output() onCancel = new EventEmitter<void>();

  items: string[] = [];
  allPriorities: string[] = ['Low', 'Medium', 'High'];

  ngOnInit(): void {
    // Ensuring the date is a real Date object for the PrimeNG DatePicker.
    if (this.todo && this.todo.deadline) {
      this.todo.deadline = new Date(this.todo.deadline);
    }

    // Default values for new tasks to avoid 'undefined' errors in the template.
    if (!this.isEditMode) {
      this.todo = {
        title: '',
        description: '',
        priority: 'Medium',
        isCompleted: false, 
        deadline: null,
      };
    }
  }

  // Providing a simple autocomplete filter for priority selection.
  search(event: any): void {
    const query = event.query.toLowerCase();
    this.items = this.allPriorities.filter((p) => 
      p.toLowerCase().includes(query)
    );
  }

  save(): void {
    if (!this.todo.title) return; // Basic validation before emitting.

    let finalTodo: Todo;

    // Spreading the object to keep the original data safe (immutability).
    if (this.isEditMode) {
      finalTodo = { ...this.todo };
    } else {
      finalTodo = {
        ...this.todo,
        isCompleted: false, // New tasks are always pending by default.
      };
    }
    this.onSave.emit(finalTodo);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}