import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoToolbarComponent } from './todo-toolbar.component';

describe('TodoToolbarComponent', () => {
  let component: TodoToolbarComponent;
  let fixture: ComponentFixture<TodoToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoToolbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoToolbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
