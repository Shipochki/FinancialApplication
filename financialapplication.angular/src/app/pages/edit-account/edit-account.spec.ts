import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { EditAccount } from './edit-account';
import { AccountService } from '../../core/services/account.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

describe('EditAccount', () => {
  let component: EditAccount;
  let fixture: ComponentFixture<EditAccount>;

  const accountService = {
    getAccountDetails: () =>
      of({
        id: '',
        name: '',
        balance: 0,
        description: '',
        currency: 0,
        ownerId: '',
        transactionDtos: [],
      }),
    updateAccount: () => of({}),
  };
  const authService = {
    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccount, RouterTestingModule],
      providers: [
        { provide: AccountService, useValue: accountService },
        { provide: GlobalAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
