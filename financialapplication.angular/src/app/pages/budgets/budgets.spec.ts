import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Budgets } from './budgets';
import { BudgetService } from '../../core/services/budget.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

describe('Budgets', () => {
  let component: Budgets;
  let fixture: ComponentFixture<Budgets>;

  const budgetService = {
    getAllBudgetsByAccountId: () => of([]),
  };
  const authService = {
    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Budgets, RouterTestingModule],
      providers: [
        { provide: BudgetService, useValue: budgetService },
        { provide: GlobalAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Budgets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
