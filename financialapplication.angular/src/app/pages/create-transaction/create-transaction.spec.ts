import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CreateTransaction } from './create-transaction';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

describe('CreateTransaction', () => {
  let component: CreateTransaction;
  let fixture: ComponentFixture<CreateTransaction>;

  const categoryService = {
    getAllCategories: () => of([]),
  };
  const transactionService = {
    createTransaction: () => of({}),
  };
  const authService = {
    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTransaction, RouterTestingModule],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: TransactionService, useValue: transactionService },
        { provide: GlobalAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTransaction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
