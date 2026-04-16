import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { HomePageComponent } from './home-page-component';
import { AccountService } from '../../core/services/account.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  const accountService = {
    getAccounts: () => of([]),
  };
  const authService = {
    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePageComponent, RouterTestingModule],
      providers: [
        { provide: AccountService, useValue: accountService },
        { provide: GlobalAuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
