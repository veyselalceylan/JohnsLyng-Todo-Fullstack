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
import { DialogModule } from 'primeng/dialog'; // Eksik olan buydu
import { Todo } from '../../../models/todo.model';
import { TodoService } from '../../../core/services/todo/todo.service';
import { PaginationParams } from '../../../core/services/todo/todo-service.interface';

// Components
import { TodoToolbarComponent } from './components/todo-toolbar/todo-toolbar.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoBodyComponent } from './components/todo-body/todo-body.component';
import { TodoLoadingComponent } from './components/todo-loading/todo-loading.component';
import { TodoEmptymessageComponent } from './components/todo-emptymessage/todo-emptymessage.component';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog.component'; // Dialog yolunu kontrol et

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

  displayDialog: boolean = false;
  isEditMode: boolean = false;
  selectedTodo: any = {};

  todos: Todo[] = [];
  loading: boolean = false;
  hasError: boolean = false;
  totalRecords: number = 0;
  rows: number = 10;
  deletingId: string | null = null;
  selectedTodos: Todo[] = [];
  currentParams: PaginationParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    isDescending: true,
  };

  ngOnInit(): void {}

  openDialog(todo?: Todo) {
    this.isEditMode = !!todo;
    this.selectedTodo = todo ? { ...todo } : { title: '', priority: 'Medium', isCompleted: false };
    this.displayDialog = true;
  }

  handleSave(todoData: Todo) {
    if (this.isEditMode) {
      this.updateExistingTodo(todoData.id, todoData);
    } else {
      this.createNewTodo(todoData);
    }
    this.displayDialog = false;
  }

  private createNewTodo(newTodo: Todo) {
    this.loading = true;
    this.todoService.createTodo(newTodo).subscribe({
      next: () => {
        this.fetchTodos();
      },
      error: (err) => {
        console.error('Create error:', err);
        this.loading = false;
      },
    });
  }

  private updateExistingTodo(id: string, updatedTodo: Todo) {
    this.loading = true;
    this.todoService.updateTodo(id, updatedTodo).subscribe({
      next: () => {
        this.fetchTodos();
      },
      error: (err) => {
        console.error('Update error:', err);
        this.loading = false;
      },
    });
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
          console.log(res);
          this.todos = res.items || [];
          this.totalRecords = res.totalCount;
        },
        error: (err) => {
          this.hasError = true;
          this.todos = [];
          this.totalRecords = 0;
          console.error('API Error:', err);
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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Hata oluştu:', err),
    });
  }

  deleteTodo(id: string): void {
    this.deletingId = id;
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.fetchTodos();
        this.deletingId = null;
      },
      error: (err) => {
        this.deletingId = null;
      },
    });
  }

  deleteSelectedTodos(): void {
    const ids = this.selectedTodos.map((t) => t.id);
    if (ids.length === 0) return;

    this.loading = true;
    this.todoService.bulkDelete(ids).subscribe({
      next: () => {
        this.selectedTodos = [];
        this.fetchTodos();
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }
}
