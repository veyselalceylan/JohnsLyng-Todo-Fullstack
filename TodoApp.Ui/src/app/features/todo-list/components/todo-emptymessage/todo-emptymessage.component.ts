import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: '[app-todo-emptymessage]',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './todo-emptymessage.component.html'
})
export class TodoEmptymessageComponent {
  @Input() hasError = false;
  @Input() loading = false;
  @Output() retry = new EventEmitter<void>();
}