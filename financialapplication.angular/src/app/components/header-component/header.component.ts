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
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private authService: MsalService,
    private broadcastService: MsalBroadcastService
  ) {}

  ngOnInit(): void {

    this.setLoginDisplay();
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
    // 1. Abandon the popup entirely.
    // 2. Use loginRedirect for a seamless, universally friendly flow.
    this.authService.loginRedirect({
      scopes: ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user'] // Ensure this scope matches your .NET backend custom scope
    });
  }

  register() {
    this.authService.loginRedirect({
      // 'scopes' is required by the RedirectRequest interface
      // 'openid' and 'profile' are standard scopes for basic sign-in
      scopes: ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user'], 
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