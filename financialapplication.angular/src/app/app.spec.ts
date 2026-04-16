import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { App } from './app';
import { GlobalAuthService } from './core/services/GlobalAuthService';
import { MsalService } from '@azure/msal-angular';

describe('App', () => {
  const mockAuthService = {
    isLoggedIn: () => false,
  };
  const mockMsalService = {
    instance: {
      handleRedirectPromise: () => Promise.resolve(),
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, RouterTestingModule],
      providers: [
        { provide: GlobalAuthService, useValue: mockAuthService },
        { provide: MsalService, useValue: mockMsalService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the app shell', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('app-footer')).toBeTruthy();
  });
});
