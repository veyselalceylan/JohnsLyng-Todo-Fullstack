import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../../../models/todo.model';
import { ITodoService, PaginationParams, TodoResponse } from './todo-service.interface';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService implements ITodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/todos`;

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

  updateTodo(id: string, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
  bulkDelete(ids: string[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bulk-delete`, { body: ids });
  }

  
}
