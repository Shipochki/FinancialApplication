import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EditTransaction } from './edit-transaction';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

describe('EditTransaction', () => {
  let component: EditTransaction;
  let fixture: ComponentFixture<EditTransaction>;

  const categoryService = {
    getAllCategories: () => of([]),
  };
  const transactionService = {
    getTransactionDetails: () =>
      of({
        id: '',
        type: 0,
        amount: 0,
        date: '',
        description: '',
        accountId: '',
        category: { id: '', name: '', description: '', icon: '' },
      }),
    editTransaction: () => of({}),
  };
  const authService = {
    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTransaction, RouterTestingModule],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        { provide: TransactionService, useValue: transactionService },
        { provide: GlobalAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditTransaction);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
