import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  isDescending: boolean;
}

export interface TodoResponse {
  items: Todo[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

export interface ITodoService {
  getTodos(params: PaginationParams): Observable<TodoResponse>;
  createTodo(todo: Todo): Observable<Todo>;
  updateTodo(id: string, todo: Partial<Todo>): Observable<Todo>;
  deleteTodo(id: string): Observable<string>;
}
