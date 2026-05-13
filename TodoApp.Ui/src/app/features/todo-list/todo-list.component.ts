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
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../core/services/todo/todo.service';
import { PaginationParams } from '../../core/services/todo/todo-service.interface';
import { TodoToolbarComponent } from './components/todo-toolbar/todo-toolbar.component';
import { TodoHeaderComponent } from './components/todo-header/todo-header.component';
import { TodoBodyComponent } from './components/todo-body/todo-body.component';
import { TodoLoadingComponent } from './components/todo-loading/todo-loading.component';
import { TodoEmptymessageComponent } from './components/todo-emptymessage/todo-emptymessage.component';
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
    TodoToolbarComponent,
    TodoHeaderComponent,
    TodoBodyComponent,
    TodoLoadingComponent,
    TodoEmptymessageComponent
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);
  private cdr = inject(ChangeDetectorRef);

  todos: Todo[] = [];
  loading: boolean = false;
  hasError: boolean = false;
  totalRecords: number = 0;
  rows: number = 10;
  deletingId: string | null = null; // Modelde id string olduğu için string yaptık
  selectedTodos: Todo[] = [];
  currentParams: PaginationParams = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    isDescending: true,
  };

  ngOnInit(): void {}

  handleNewTask(){
    
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
    this.loading = true;
    this.hasError = false;
    this.cdr.detectChanges();

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
          console.error('API Error:', err);
        },
      });
  }

  getPrioritySeverity(priority: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warn';
      case 'low': return 'info';
      default: return 'secondary';
    }
  }

  toggleComplete(todo: Todo): void {
    if (!todo.id) return;
    const updatedStatus = !todo.isCompleted;
    this.todoService.updateTodo(todo.id, { isCompleted: updatedStatus }).subscribe({
      next: () => {
        todo.isCompleted = updatedStatus;
      },
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
        console.error('Delete error:', err);
        this.deletingId = null;
      },
    });
  }
  deleteSelectedTodos(): void {
  const ids = this.selectedTodos.map(t => t.id);
  
  if (ids.length === 0) return;

  this.loading = true; // Tabloyu loading moduna al
  this.todoService.bulkDelete(ids).subscribe({
    next: () => {
      this.selectedTodos = []; // Seçimi temizle
      this.fetchTodos(); // Listeyi yenile
    },
    error: (err) => {
      this.loading = false;
      console.error('Toplu silme hatası:', err);
    }
  });
}
}