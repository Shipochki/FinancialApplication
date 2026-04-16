import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject } from 'rxjs';

import { Budgets } from './budgets';
import { BudgetService } from '../../core/services/budget.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';
import { GetBudgetDto } from '../../shared/models/budget.model';

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

describe('Budgets', () => {
  let component: Budgets;
  let fixture: ComponentFixture<Budgets>;
  let budgetService: { getAllBudgetsByAccountId: SpyFunction<(id: string) => any> };
  let authService: { isLoggedIn: SpyFunction<() => boolean> };
  let router: { navigate: SpyFunction<(commands: any[]) => any> };
  let paramMapSubject: Subject<any>;

  const accountId = 'account-123';
  const budgets: GetBudgetDto[] = [
    {
      id: 1,
      name: 'Budget 1',
      amount: 100,
      description: 'Test budget',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      type: 0,
      categoryId: 'cat-1',
      category: {
        id: 'cat-1',
        name: 'Category 1',
        description: 'Category description',
        icon: 'category-icon',
        isGlobal: false,
      },
      accountId,
    },
  ];

  beforeEach(async () => {
    paramMapSubject = new Subject<any>();

    budgetService = {
      getAllBudgetsByAccountId: createSpyFn(() => of(budgets)),
    };
    authService = {
      isLoggedIn: createSpyFn(() => false),
    };
    router = {
      navigate: createSpyFn(() => true),
    };

    await TestBed.configureTestingModule({
      imports: [Budgets, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: paramMapSubject.asObservable() } },
        { provide: BudgetService, useValue: budgetService },
        { provide: GlobalAuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Budgets);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load budgets when the user is logged in', () => {
    authService.isLoggedIn = createSpyFn(() => true);
    budgetService.getAllBudgetsByAccountId = createSpyFn(() => of(budgets));

    fixture.detectChanges();
    paramMapSubject.next({ get: () => accountId });

    expect(budgetService.getAllBudgetsByAccountId.calls).toEqual([[accountId]]);
    expect(component.budgets()).toEqual(budgets);
    expect(component.accountId).toBe(accountId);
  });

  it('should not load budgets when the user is not logged in', () => {
    authService.isLoggedIn = createSpyFn(() => false);
    budgetService.getAllBudgetsByAccountId = createSpyFn(() => of(budgets));

    fixture.detectChanges();
    paramMapSubject.next({ get: () => accountId });

    expect(budgetService.getAllBudgetsByAccountId.calls.length).toBe(0);
    expect(component.budgets()).toEqual([]);
    expect(component.accountId).toBeNull();
  });

  it('should navigate to create budget when add budget is clicked', () => {
    component.accountId = accountId;

    component.onAddBudget();

    expect(router.navigate.calls).toEqual([[['/create-budget/account-123']]]);
  });
});
