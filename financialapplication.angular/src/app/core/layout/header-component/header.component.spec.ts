import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { GlobalAuthService } from '../../services/GlobalAuthService';
import { Router } from '@angular/router';
import { of } from 'rxjs';

type PlainSpy = ((...args: any[]) => any) & { calls: any[][] };

function createSpy(impl: (...args: any[]) => any = () => undefined): PlainSpy {
  const spy = ((...args: any[]) => {
    spy.calls.push(args);
    return impl(...args);
  }) as PlainSpy;
  spy.calls = [];
  return spy;
}

const mockGlobalAuthService = {
  isLoggedIn: createSpy(() => false),
  login: createSpy(),
  register: createSpy(),
  logout: createSpy(),
  getUserEmail: createSpy(() => null),
};

const mockRouter = {
  navigate: createSpy(() => true),
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: GlobalAuthService, useValue: mockGlobalAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially show Sign In when not logged in', () => {
    mockGlobalAuthService.isLoggedIn = createSpy(() => false);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Sign In');
  });
});
