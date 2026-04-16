import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';

import { Account } from './account';
import { AccountService } from '../../core/services/account.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';
import { GetAccountDetailsDto } from '../../shared/models/account.model';

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

describe('Account', () => {
  let component: Account;
  let fixture: ComponentFixture<Account>;
  let accountService: {
    getAccountDetails: SpyFunction<(id: string, pageSize: number) => any>;
    deleteAccount: SpyFunction<(id: string) => any>;
  };
  let authService: { isLoggedIn: SpyFunction<() => boolean> };
  let router: { navigate: SpyFunction<(commands: any[]) => any> };
  let dialog: { open: SpyFunction<(component: any, config: any) => any> };
  let paramMapSubject: Subject<any>;
  const accountId = 'abc123';
  const accountDetails: GetAccountDetailsDto = {
    id: accountId,
    name: 'Test Account',
    balance: 500,
    description: 'Sample account',
    currency: 0,
    ownerId: 'owner-1',
    transactionDtos: [],
  };

  beforeEach(async () => {
    paramMapSubject = new Subject<any>();

    accountService = {
      getAccountDetails: createSpyFn((id: string, pageSize: number) => of(accountDetails)),
      deleteAccount: createSpyFn(() => of(void 0)),
    };
    authService = {
      isLoggedIn: createSpyFn(() => false),
    };
    router = {
      navigate: createSpyFn(() => true),
    };
    dialog = {
      open: createSpyFn(() => ({ afterClosed: () => of(false) })),
    };

    await TestBed.configureTestingModule({
      imports: [Account],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: paramMapSubject.asObservable() } },
        { provide: AccountService, useValue: accountService },
        { provide: GlobalAuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Account);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load account details when the user is logged in', () => {
    authService.isLoggedIn = createSpyFn(() => true);
    accountService.getAccountDetails = createSpyFn(() => of(accountDetails));

    fixture.detectChanges();
    paramMapSubject.next({ get: () => accountId });

    expect(accountService.getAccountDetails.calls).toEqual([[accountId, 3]]);
    expect(component.account()).toEqual(accountDetails);
    expect(component.accountId()).toBe(accountId);
  });

  it('should not load account details when the user is not logged in', () => {
    authService.isLoggedIn = createSpyFn(() => false);

    fixture.detectChanges();
    paramMapSubject.next({ get: () => accountId });

    expect(accountService.getAccountDetails.calls.length).toBe(0);
    expect(component.account()).toBeNull();
  });

  it('should navigate to add transaction, transactions, edit, and budgets routes', () => {
    component.accountId.set(accountId);

    component.toAddTransaction();
    component.toTransactions();
    component.editAccount();
    component.toBudgets();

    expect(router.navigate.calls).toEqual([
      [[`/add-transaction/${accountId}`]],
      [[`/transactions/${accountId}`]],
      [[`/edit-account/${accountId}`]],
      [[`/budgets/${accountId}`]],
    ]);
  });

  it('should delete the account when confirmation is received', () => {
    component.account.set(accountDetails);
    component.accountId.set(accountId);
    const dialogRef = { afterClosed: () => of(true) };
    dialog.open = createSpyFn(() => dialogRef);
    accountService.deleteAccount = createSpyFn(() => of(void 0));

    component.deleteAccount();

    expect(dialog.open.calls.length).toBe(1);
    expect(accountService.deleteAccount.calls).toEqual([[accountId]]);
    expect(router.navigate.calls).toEqual([[['/home']]]);
  });

  it('should not delete the account when confirmation is cancelled', () => {
    component.account.set(accountDetails);
    component.accountId.set(accountId);
    const dialogRef = { afterClosed: () => of(false) };
    dialog.open = createSpyFn(() => dialogRef);

    component.deleteAccount();

    expect(accountService.deleteAccount.calls.length).toBe(0);
    expect(router.navigate.calls.find((call) => call[0] === '/home')).toBeUndefined();
  });
});
