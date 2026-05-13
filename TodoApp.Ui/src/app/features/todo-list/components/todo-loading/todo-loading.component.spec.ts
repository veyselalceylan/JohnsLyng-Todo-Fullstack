import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoLoadingComponent } from './todo-loading.component';

describe('TodoLoadingComponent', () => {
  let component: TodoLoadingComponent;
  let fixture: ComponentFixture<TodoLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoLoadingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
