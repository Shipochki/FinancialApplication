import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_INSTANCE } from '@azure/msal-angular';
import { IPublicClientApplication } from '@azure/msal-browser';
import { HeaderComponent } from './components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    
    <main style="padding: 20px;">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App implements OnInit {
  
  constructor(
    @Inject(MSAL_INSTANCE) private msalInstance: IPublicClientApplication,
    @Inject(MsalService) private authService: MsalService
  ) {}

  async ngOnInit() {
    // MSAL v3 requires explicit initialization
    await this.msalInstance.initialize();
    
    // Process the redirect after coming back from Azure AD
    this.authService.handleRedirectObservable().subscribe({
      next: (result) => {
        if (result && result.account) {
          this.authService.instance.setActiveAccount(result.account);
        }
      },
      error: (error) => console.error(error)
    });
  }

  login() {
    this.authService.loginRedirect();
  }
}