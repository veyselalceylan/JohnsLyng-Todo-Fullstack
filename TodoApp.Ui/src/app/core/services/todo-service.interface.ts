import { Observable } from "rxjs";
import { Todo } from "../../models/todo.model";

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
    addTodo(todo: Todo): Observable<Todo>;
    updateTodo(todo: Todo): Observable<Todo>;
    deleteTodo(id: number): Observable<void>;
}