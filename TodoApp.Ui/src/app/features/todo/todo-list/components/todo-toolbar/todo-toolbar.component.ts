import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../../../../../models/todo.model';

import { TodoService } from '../../../../../core/services/todo/todo.service';
import { NotificationService } from '../../../../../core/services/utils/utils.service';

@Component({
  selector: 'app-todo-toolbar',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, TooltipModule],
  templateUrl: './todo-toolbar.component.html',
})
export class TodoToolbarComponent {
  @Input() selectedCount: number = 0;
  @Input() loading: boolean = false;

  @Output() deleteSelected = new EventEmitter<void>();
  @Output() newTask = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();
  
  private http = inject(HttpClient);
  private todoService = inject(TodoService);
  private notify = inject(NotificationService);

  /**
   * Demo Data Import: A handy way to populate the app with initial tasks.
   * We use a confirmation dialog to prevent accidental bulk operations.
   */
  seedData() {
    this.notify.confirm(
      'Are you sure you want to import demo data from JSON?',
      () => {
        // Step 1: Fetch the local JSON file
        this.http.get<Todo[]>('data.json').subscribe({
          next: (res) => {
            // Step 2: Trigger the service to send these to the server in a batch
            this.todoService.seedFromLocalJson().subscribe({
              next: (results) => {
                this.notify.showSuccess(`${results.length} tasks imported successfully!`);
                this.refresh.emit(); // Reload the list to show new data
              },
              error: () => this.notify.showError('An error occurred during bulk import.')
            });
          },
          error: () => this.notify.showError('Could not find the data.json file.')
        });
      },
      () => {
        this.notify.showInfo('Import operation cancelled');
      }
    );
  }
}