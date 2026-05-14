import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { TodoService } from '../../../core/services/todo/todo.service';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-chart',
  standalone: true, // Making sure it's standalone for modern Angular standards
  imports: [
    ChartModule,
    CommonModule,
    PanelModule,
    ButtonModule,
    DatePicker,
    DatePickerModule,
    FormsModule,
  ],
  templateUrl: './todo-chart.component.html',
  styleUrl: './todo-chart.component.css',
})
export class TodoChartComponent {
  private todoService = inject(TodoService);
  private cdr = inject(ChangeDetectorRef);
  // Using signals for dates to keep the UI reactive when a user picks a new range.
  startDate = signal<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  endDate = signal<Date>(new Date());

  data: any;
  options: any;

  ngOnInit() {
    this.initOptions();
    this.refreshChart();
    this.todoService.todoUpdated$.subscribe(() => {
      setTimeout(() => {
        this.refreshChart();
      });
    });
  }

  /**
   * Chart styling: Keeping it clean by hiding redundant legends.
   * Donut charts look much better with a focused cutout.
   */
  initOptions() {
    this.options = {
      cutout: '70%',
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // Clean look, handling labels manually or via tooltips
        },
      },
    };
  }

  /**
   * Data Refresh: Fetching stats from the service based on the selected signal dates.
   * We subscribe to the stream and map the stats directly to the chart's data structure.
   */
  refreshChart() {
    this.todoService.getStats(this.startDate(), this.endDate()).subscribe({
      next: (stats) => {
        this.data = {
          labels: ['Completed', 'Pending'],
          datasets: [
            {
              data: [stats.completedCount, stats.pendingCount],
              backgroundColor: ['#22C55E', '#F59E0B'], // Success and Warning colors
            },
          ],
        };
        this.cdr.detectChanges();
      },
    });
  }
}
