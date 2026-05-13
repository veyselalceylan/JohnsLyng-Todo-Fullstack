import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-todo-toolbar',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, TooltipModule],
  templateUrl: './todo-toolbar.component.html'
})
export class TodoToolbarComponent {
  @Input() selectedCount: number = 0;
  @Input() loading: boolean = false;

  @Output() deleteSelected = new EventEmitter<void>();
  @Output() newTask = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
}