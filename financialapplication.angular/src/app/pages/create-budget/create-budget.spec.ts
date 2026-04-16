import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';

import { CreateBudget } from './create-budget';
import { BudgetService } from '../../core/services/budget.service';
import { CategoryService } from '../../core/services/category.service';
import { GetCategoryDto } from '../../shared/models/category.model';

type SpyFunction<T extends (...args: any[]) => any> = T & { calls: any[][] };

function createSpyFn<T extends (...args: any[]) => any>(impl: T): SpyFunction<T> {
  let spy: SpyFunction<T>;
  spy = ((...args: any[]) => {
    spy.calls.push(args);
    return impl(...args);
  }) as SpyFunction<T>;
  spy.calls = [];
  return spy;
}

describe('CreateBudget', () => {
  let component: CreateBudget;
  let fixture: ComponentFixture<CreateBudget>;
  let budgetService: { createBudget: SpyFunction<(payload: any) => any> };
  let categoryService: { getAllCategories: SpyFunction<() => any> };
  let router: { navigate: SpyFunction<(commands: any[]) => any> };
  let paramMapSubject: BehaviorSubject<any>;

  const accountId = 'account-123';
  const categories: GetCategoryDto[] = [
    {
      id: 'cat-1',
      name: 'Category 1',
      description: 'Test category',
      icon: 'icon-1',
      isGlobal: false,
    },
  ];

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject<any>({ get: () => accountId });

    budgetService = {
      createBudget: createSpyFn(() => of({})),
    };
    categoryService = {
      getAllCategories: createSpyFn(() => of(categories)),
    };
    router = {
      navigate: createSpyFn(() => true),
    };

    await TestBed.configureTestingModule({
      imports: [CreateBudget, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: paramMapSubject.asObservable() } },
        { provide: BudgetService, useValue: budgetService },
        { provide: CategoryService, useValue: categoryService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBudget);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and load categories when accountId param exists', () => {
    paramMapSubject.next({ get: () => accountId });
    fixture.detectChanges();

    expect(component.accountId).toBe(accountId);
    expect(component.budgetForm).toBeTruthy();
    expect(component.categories).toEqual(categories);
    expect(categoryService.getAllCategories.calls).toEqual([[]]);
  });

  it('should create a budget and navigate to budgets page when form is valid', () => {
    paramMapSubject.next({ get: () => accountId });
    fixture.detectChanges();

    component.budgetForm.setValue({
      name: 'Budget name',
      amount: 100,
      description: 'Budget desc',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      type: 1,
      categoryId: 'cat-1',
    });

    component.onSubmit();

    expect(budgetService.createBudget.calls.length).toBe(1);
    expect(budgetService.createBudget.calls[0][0]).toEqual({
      name: 'Budget name',
      amount: 100,
      description: 'Budget desc',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-12-31'),
      type: 1,
      categoryId: 'cat-1',
      accountId,
    });
    expect(router.navigate.calls).toEqual([[['/budgets', accountId]]]);
  });

  it('should not submit when the form is invalid', () => {
    paramMapSubject.next({ get: () => accountId });
    fixture.detectChanges();

    component.budgetForm.setValue({
      name: '',
      amount: 0,
      description: '',
      startDate: null,
      endDate: null,
      type: 0,
      categoryId: '',
    });

    component.onSubmit();

    expect(budgetService.createBudget.calls.length).toBe(0);
    expect(router.navigate.calls.length).toBe(0);
  });

  it('should cancel and navigate back to budgets page', () => {
    paramMapSubject.next({ get: () => accountId });
    fixture.detectChanges();

    component.onCancel();

    expect(router.navigate.calls).toEqual([[['/budgets', accountId]]]);
  });
});
