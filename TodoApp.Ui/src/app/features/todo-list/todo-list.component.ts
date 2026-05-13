import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../core/services/todo/todo.service';

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
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  private todoService = inject(TodoService);

  todos: Todo[] = [];
  newTodoTitle: string = '';
  loading: boolean = false;

  ngOnInit() {
    this.fetchTodos();
  }
fetchTodos() {
  this.loading = true;
  const params = { 
    pageNumber: 1, 
    pageSize: 50,
    isDescending: true,
    sortBy: 'createdAt'
  }; 

  this.todoService.getTodos(params).subscribe({
    next: (res: any) => { 
      this.todos = res.data || res; 
      this.loading = false;
    },
    error: () => (this.loading = false),
  });
}

  toggleComplete(todo: Todo) {
    if (todo.id === undefined) return; 
    const updatedStatus = !todo.isCompleted;
    this.todoService.updateTodo(todo.id.toString(), { isCompleted: updatedStatus }).subscribe({
      next: () => {
        todo.isCompleted = updatedStatus; 
      }
    });
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id.toString()).subscribe({
      next: () => this.fetchTodos()
    });
  }
}