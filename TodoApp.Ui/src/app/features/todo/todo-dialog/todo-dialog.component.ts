import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
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
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  todo: any = {}; 
  isEditMode: boolean = false;

  items: string[] = [];
  allPriorities: string[] = ['Low', 'Medium', 'High'];

  ngOnInit(): void {
    if (this.config.data) {
      this.todo = { ...this.config.data.todo };
      this.isEditMode = this.config.data.isEditMode;
    }
    if (this.todo && this.todo.deadline) {
      this.todo.deadline = new Date(this.todo.deadline);
    }

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

  search(event: any): void {
    const query = event.query.toLowerCase();
    this.items = this.allPriorities.filter((p) => 
      p.toLowerCase().includes(query)
    );
  }

  save(): void {
    if (!this.todo.title) return;

    let finalTodo: Todo;
    if (this.isEditMode) {
      finalTodo = { ...this.todo };
    } else {
      finalTodo = {
        ...this.todo,
        isCompleted: false,
      };
    }
    this.ref.close(finalTodo);
  }

  cancel(): void {
    this.ref.close();
  }
}