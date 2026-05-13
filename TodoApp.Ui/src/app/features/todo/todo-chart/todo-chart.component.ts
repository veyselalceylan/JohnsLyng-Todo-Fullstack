import { Component, inject, signal } from '@angular/core';
import { TodoService } from '../../../core/services/todo/todo.service';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-todo-chart',
  imports: [ChartModule, CommonModule, PanelModule, ButtonModule,DatePicker, DatePickerModule, FormsModule],
  templateUrl: './todo-chart.component.html',
  styleUrl: './todo-chart.component.css',
})
export class TodoChartComponent {
  private todoService = inject(TodoService);
  startDate = signal<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  endDate = signal<Date>(new Date());
  data: any;
  options: any;

  ngOnInit() {
    this.refreshChart();
    this.initOptions();
  }
  initOptions() {
    this.options = { cutout: '70%', maintainAspectRatio: false };
  }
  refreshChart() {
    this.todoService.getStats(this.startDate(), this.endDate()).subscribe({
      next: (stats) => {
        this.data = {
          labels: ['Completed', 'Pending'],
          datasets: [
            {
              data: [stats.completedCount, stats.pendingCount],
              backgroundColor: ['#22C55E', '#F59E0B'],
            },
          ],
        };
      },
    });
  }
}
