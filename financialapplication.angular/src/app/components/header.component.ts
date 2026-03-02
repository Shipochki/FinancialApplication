import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="app-header">
      <div class="logo-container">
        <mat-icon class="logo-icon">account_balance_wallet</mat-icon>
        <span class="app-title">Financial Application</span>
      </div>

      <span class="spacer"></span>

      @if(!isLoggedIn){
      <ng-container>
        <button mat-button (click)="login()">
          <mat-icon>login</mat-icon>
          Sign In
        </button>
        <button mat-flat-button color="accent" class="register-btn" (click)="register()">
          <mat-icon>person_add</mat-icon>
          Register
        </button>
      </ng-container>
        } @else {
      <ng-container>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sign Out
        </button>
      </ng-container>
      }
    </mat-toolbar>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      padding: 0 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-icon {
      font-size: 28px;
      height: 28px;
      width: 28px;
    }

    .app-title {
      font-size: 1.25rem;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .register-btn {
      margin-left: 8px;
      border-radius: 20px; /* Gives the button a modern, pill-shaped look */
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private authService: MsalService,
    private broadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {
    // Automatically update the UI when the user finishes logging in or out
    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });
  }

  setLoginDisplay() {
    this.isLoggedIn = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    // Redirects to standard Microsoft login page
    this.authService.loginRedirect();
    window.location.reload(); // Force reload to update the UI after login
  }

  register() {
    this.authService.loginRedirect({
      // 'scopes' is required by the RedirectRequest interface
      // 'openid' and 'profile' are standard scopes for basic sign-in
      scopes: ['access_as_user'], 
      prompt: 'login' // Forces the user to enter credentials
    });
  }

  logout() {
    // Redirects to Microsoft to securely destroy the session, then returns to your app
    this.authService.logoutRedirect({
      postLogoutRedirectUri: window.location.origin
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}