import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { Todo } from '../../../models/todo.model';
import { ITodoService, PaginationParams, TodoResponse } from './todo-service.interface';
import { environment } from '../../../../environment/environment';
import { TodoStatsDto } from '../../../models/todo-stats.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService implements ITodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/todos`;

  /**
   * Why Observable instead of Promise/await? 
   * Angular's HttpClient is built on RxJS. Observables are more powerful for streams, 
   * allowing features like cancellation, retries, and easy mapping that 'await' doesn't handle natively.
   */
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
    // Handling text response for delete operations as some APIs don't return JSON here.
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  bulkDelete(ids: string[]): Observable<any> {
    // Using the 'body' property for DELETE requests to send a batch of IDs.
    return this.http.delete(`${this.apiUrl}/bulk-delete`, { body: ids });
  }

  getStats(start: Date, end: Date): Observable<TodoStatsDto> {
    const params = new HttpParams()
      .set('startDate', start.toISOString())
      .set('endDate', end.toISOString());

    return this.http.get<TodoStatsDto>(`${this.apiUrl}/stats`, { params }).pipe(
        tap(data => console.log('Stats received:', data)) 
    );
  }

  /**
   * Data Seeding: Using RxJS operators to handle a complex sequence.
   * First we fetch a local JSON, then we use 'switchMap' to trigger multiple POST requests.
   */
  seedFromLocalJson() {
    return this.http.get<Todo[]>('data.json').pipe(
      switchMap((tasks) => {
        // Mapping each task into a POST request.
        const requests = tasks.map((task) => {
          const payload = {
            title: task.title,
            description: task.description,
            isCompleted: task.isCompleted,
            priority: task.priority,
            deadline: task.deadline ? new Date(task.deadline).toISOString() : null,
            createdAt: new Date().toISOString()
          };
          return this.http.post<Todo>(this.apiUrl, payload);
        });
        
        // forkJoin: Executing all requests in parallel and waiting for all of them to complete.
        // This is much faster than 'awaiting' each request one by one.
        return forkJoin(requests);
      })
    );
  }
}