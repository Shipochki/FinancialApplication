import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Transactions } from './transactions';
import { TransactionService } from '../../core/services/transaction.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

describe('Transactions', () => {
  let component: Transactions;
  let fixture: ComponentFixture<Transactions>;

  const transactionService = {
    getAllTransactionsByAccountId: () => of({ items: [], count: 0 }),
  };
  const authService = {
    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transactions, RouterTestingModule],
      providers: [
        { provide: TransactionService, useValue: transactionService },
        { provide: GlobalAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Transactions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
