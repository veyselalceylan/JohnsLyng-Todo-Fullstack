import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoEmptymessageComponent } from './todo-emptymessage.component';

describe('TodoEmptymessageComponent', () => {
  let component: TodoEmptymessageComponent;
  let fixture: ComponentFixture<TodoEmptymessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoEmptymessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoEmptymessageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
