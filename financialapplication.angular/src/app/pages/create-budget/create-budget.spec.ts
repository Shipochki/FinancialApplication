import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CreateBudget } from './create-budget';
import { BudgetService } from '../../core/services/budget.service';
import { CategoryService } from '../../core/services/category.service';

describe('CreateBudget', () => {
  let component: CreateBudget;
  let fixture: ComponentFixture<CreateBudget>;

  const budgetService = {
    createBudget: () => of({}),
  };
  const categoryService = {
    getAllCategories: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBudget, RouterTestingModule],
      providers: [
        { provide: BudgetService, useValue: budgetService },
        { provide: CategoryService, useValue: categoryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBudget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
