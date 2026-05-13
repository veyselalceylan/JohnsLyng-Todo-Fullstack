import { Component } from '@angular/core';
import { TodoListComponent } from "./todo-list/todo-list.component";
import { TodoChartComponent } from './todo-chart/todo-chart.component';

@Component({
  selector: 'app-todo-main',
  imports: [TodoListComponent, TodoChartComponent,],
  templateUrl: './todo-main.component.html',
  styleUrl: './todo-main.component.css',
})
export class TodoMainComponent {}
