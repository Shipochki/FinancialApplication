import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CreateAccount } from './create-account';
import { AccountService } from '../../core/services/account.service';

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

describe('CreateAccount', () => {
  let component: CreateAccount;
  let fixture: ComponentFixture<CreateAccount>;
  let accountService: { createAccount: SpyFunction<(data: any) => any> };
  let router: { navigate: SpyFunction<(commands: any[]) => any> };

  beforeEach(async () => {
    accountService = {
      createAccount: createSpyFn(() => of({ id: 'abc123' })),
    };
    router = {
      navigate: createSpyFn(() => true),
    };

    await TestBed.configureTestingModule({
      imports: [CreateAccount, RouterTestingModule],
      providers: [
        { provide: AccountService, useValue: accountService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form and navigate home when valid', () => {
    component.accountForm.setValue({
      name: 'Test Account',
      balance: 100,
      description: 'Sample account',
      currency: 0,
    });

    component.onSubmit();

    expect(accountService.createAccount.calls).toEqual([
      [
        {
          name: 'Test Account',
          balance: 100,
          description: 'Sample account',
          currency: 0,
        },
      ],
    ]);
    expect(router.navigate.calls).toEqual([[['/home']]]);
  });

  it('should not submit the form when invalid', () => {
    component.accountForm.setValue({
      name: '',
      balance: null,
      description: 'Sample account',
      currency: 0,
    });

    component.onSubmit();

    expect(accountService.createAccount.calls.length).toBe(0);
    expect(router.navigate.calls.length).toBe(0);
  });
});
