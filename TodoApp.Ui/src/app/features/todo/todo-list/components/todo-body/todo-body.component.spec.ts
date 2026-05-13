import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoBodyComponent } from './todo-body.component';

describe('TodoBodyComponent', () => {
  let component: TodoBodyComponent;
  let fixture: ComponentFixture<TodoBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoBodyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoBodyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
