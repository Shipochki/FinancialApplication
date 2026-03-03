import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { of } from 'rxjs';

const mockMsalService = {
  instance: { getAllAccounts: () => [] },
  loginRedirect: jasmine.createSpy('loginRedirect'),
  logoutRedirect: jasmine.createSpy('logoutRedirect')
};

const mockBroadcast = {
  inProgress$: of(InteractionStatus.None)
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: MsalService, useValue: mockMsalService },
        { provide: MsalBroadcastService, useValue: mockBroadcast }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially show Sign In when not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sign In');
  });
});