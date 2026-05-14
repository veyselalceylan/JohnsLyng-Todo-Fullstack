import { Observable } from 'rxjs';
import { Todo } from '../../../models/todo.model';

// Standardizing how we request data to keep things consistent across components.
export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  isDescending: boolean;
}

// A clear contract for the server response so we always know exactly what's coming back.
export interface TodoResponse {
  items: Todo[];
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
}

/**
 * ITodoService: Think of this as the 'Bridge' between our components and the actual data source.
 * By using an interface, we make the code flexible—we can swap the real API with mock data 
 * for testing without breaking the UI.
 */
export interface ITodoService {
  getTodos(params: PaginationParams): Observable<TodoResponse>;
  createTodo(todo: Todo): Observable<Todo>;
  updateTodo(id: string, todo: Partial<Todo>): Observable<Todo>;
  deleteTodo(id: string): Observable<string>;
  bulkDelete(ids: string[]): Observable<void>;
}