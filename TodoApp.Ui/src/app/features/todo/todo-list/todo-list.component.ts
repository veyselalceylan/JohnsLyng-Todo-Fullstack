import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize } from 'rxjs/operators';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { Todo } from '../../../models/todo.model';
import { TodoService } from '../../../core/services/todo/todo.service';
import { PaginationParams } from '../../../core/services/todo/todo-service.interface';
import { NotificationService } from '../../../core/services/utils/utils.service';

import { TodoToolbarComponent } from './components/todo-toolbar/todo-toolbar.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoBodyComponent } from './components/todo-body/todo-body.component';
import { TodoLoadingComponent } from './components/todo-loading/todo-loading.component';
import { TodoEmptymessageComponent } from './components/todo-emptymessage/todo-emptymessage.component';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    CheckboxModule,
    SkeletonModule,
    ToolbarModule,
    TooltipModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TodoToolbarComponent,
    TodoHeaderComponent,
    TodoBodyComponent,
    TodoLoadingComponent,
    TodoEmptymessageComponent,
    TodoDialogComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);
  private cdr = inject(ChangeDetectorRef);
  private notify = inject(NotificationService);

  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedTodo: any = {};
  todos: Todo[] = [];
  loading: boolean = false;
  hasError: boolean = false;
  totalRecords: number = 0;
  rows: number = 5;
  deletingId: string | null = null;
  selectedTodos: Todo[] = [];
  currentParams: PaginationParams = {
    pageNumber: 1,
    pageSize: 5,
    sortBy: 'createdAt',
    isDescending: true,
  };

  ngOnInit(): void {}

  openDialog(todo?: Todo) {
    this.isEditMode = !!todo;
    this.selectedTodo = todo ? { ...todo } : { title: '', priority: 'Medium', isCompleted: false };
    this.displayDialog = true;
  }

  handleSave(todo: Todo) {
    const message = this.isEditMode
      ? 'Are you sure you want to update this task?'
      : 'Do you want to add a new task?';

    this.notify.confirm(
      message,
      () => {
        if (this.isEditMode) {
          this.todoService.updateTodo(todo.id, todo).subscribe({
            next: () => {
              this.notify.showSuccess('Task updated successfully');
              this.displayDialog = false;
              this.fetchTodos();
            },
          });
        } else {
          this.todoService.createTodo(todo).subscribe({
            next: () => {
              this.notify.showSuccess('New task created successfully');
              this.displayDialog = false;
              this.fetchTodos();
            },
          });
        }
      },
      () => {
        this.notify.showInfo('Operation cancelled');
      },
    );
  }

  onLazyLoad(event: any): void {
    this.currentParams = {
      pageNumber: event.first / event.rows + 1,
      pageSize: event.rows,
      sortBy: event.sortField ?? 'createdAt',
      isDescending: event.sortOrder === -1,
    };
    this.fetchTodos(this.currentParams);
  }

  fetchTodos(params?: PaginationParams): void {
    setTimeout(() => {
      this.loading = true;
      this.hasError = false;
      this.cdr.detectChanges();
    });

    const requestParams = params ?? this.currentParams;

    this.todoService
      .getTodos(requestParams)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: any) => {
          this.todos = res.items || [];
          this.totalRecords = res.totalCount;
        },
        error: (err) => {
          this.hasError = true;
          this.todos = [];
          this.totalRecords = 0;
          this.notify.showError('An error occurred while loading data');
        },
      });
  }

  toggleComplete(todo: Todo): void {
    if (!todo.id) return;
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
    this.todoService.updateTodo(todo.id, updatedTodo).subscribe({
      next: (response) => {
        Object.assign(todo, response);
        this.notify.showSuccess(
          'Task status updated to ' + (todo.isCompleted ? 'Completed' : 'Pending'),
        );
        this.cdr.detectChanges();
      },
      error: (err) => this.notify.showError('Could not update status'),
    });
  }

  deleteTodo(id: string): void {
    this.notify.confirm('Are you sure you want to delete this task?', () => {
      this.deletingId = id;
      this.todoService.deleteTodo(id).subscribe({
        next: () => {
          this.notify.showInfo('Task deleted');
          this.fetchTodos();
          this.deletingId = null;
        },
        error: (err) => {
          this.deletingId = null;
          this.notify.showError('Could not delete task');
        },
      });
    });
  }

  deleteSelectedTodos(): void {
    const ids = this.selectedTodos.map((t) => t.id);
    if (ids.length === 0) return;

    this.notify.confirm(`Are you sure you want to delete ${ids.length} selected tasks?`, () => {
      this.loading = true;
      this.todoService.bulkDelete(ids).subscribe({
        next: () => {
          this.notify.showSuccess('Selected tasks cleared');
          this.selectedTodos = [];
          this.fetchTodos();
        },
        error: (err) => {
          this.loading = false;
          this.notify.showError('Could not delete selected tasks');
        },
      });
    });
  }
}
