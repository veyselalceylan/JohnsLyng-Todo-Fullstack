import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { ITodoService, PaginationParams, TodoResponse } from './todo-service.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService implements ITodoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:5000/api/todos';

  getTodos(params: PaginationParams): Observable<TodoResponse> {
    let httpParams = new HttpParams()
      .set('pageNumber', params.pageNumber.toString())
      .set('pageSize', params.pageSize.toString());

    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }
    if (params.isDescending !== undefined) {
      httpParams = httpParams.set('isDescending', params.isDescending.toString());
    }
    return this.http.get<TodoResponse>(this.apiUrl, { params: httpParams });
  }
getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  createTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo);
  }

  updateTodo(id: string, todo: Partial<Todo>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
