import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
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
  // TodoList'ten (Parent) gelen veriler
  @Input() todo: any = {};
  @Input() isEditMode: boolean = false;

  // TodoList'e (Parent) gönderilecek olaylar
  @Output() onSave = new EventEmitter<Todo>();
  @Output() onCancel = new EventEmitter<void>();

  // AutoComplete (Priority) için gerekli alanlar
  items: string[] = [];
  allPriorities: string[] = ['Low', 'Medium', 'High'];

  ngOnInit(): void {
    // Backend'den gelen deadline string ise DatePicker'ın anlaması için Date nesnesine çeviriyoruz
    if (this.todo && this.todo.deadline) {
      this.todo.deadline = new Date(this.todo.deadline);
    }
  }

  /**
   * AutoComplete (Priority) alanında arama yapıldığında tetiklenir
   */
  search(event: any): void {
    const query = event.query.toLowerCase();
    this.items = this.allPriorities.filter((p) => p.toLowerCase().includes(query));
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
    this.onSave.emit(finalTodo);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
