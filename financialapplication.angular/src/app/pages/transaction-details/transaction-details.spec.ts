import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TransactionDetails } from './transaction-details';
import { TransactionService } from '../../core/services/transaction.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

describe('TransactionDetails', () => {
  let component: TransactionDetails;
  let fixture: ComponentFixture<TransactionDetails>;

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
  };
  const authService = {
    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionDetails, RouterTestingModule, MatDialogModule],
      providers: [
        { provide: TransactionService, useValue: transactionService },
        { provide: GlobalAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
