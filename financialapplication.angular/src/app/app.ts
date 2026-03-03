import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService, MsalBroadcastService, MSAL_INSTANCE } from '@azure/msal-angular';
import { AuthenticationResult, IPublicClientApplication } from '@azure/msal-browser';
import { HeaderComponent } from './components/header.component';
import { HomePageComponent } from './pages/home-page-component/home-page-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, HomePageComponent],
  template: `
    <app-header></app-header>
    
    <main style="padding: 20px;">
      <app-home-page-component></app-home-page-component>
    </main>
  `
})
export class App implements OnInit {
  
  constructor(
    @Inject(MSAL_INSTANCE) private msalInstance: IPublicClientApplication,
    @Inject(MsalService) private authService: MsalService,
  ) {}

  async ngOnInit() {

    await this.authService.instance.initialize();

    this.authService.handleRedirectObservable().subscribe({
      next: (result: AuthenticationResult | null) => {
        if (result && result.account) {
          // MSAL just finished processing the redirect
          this.authService.instance.setActiveAccount(result.account);
        } else {
          // If already logged in from a previous session
          const currentAccounts = this.authService.instance.getAllAccounts();
          if (currentAccounts.length > 0) {
            this.authService.instance.setActiveAccount(currentAccounts[0]);
          }
        }
      },
      error: (error) => console.error(error)
    });
  }
        // After initialization, check if we have an active account


    // MSAL v3 requires explicit initialization
  //   await this.msalInstance.initialize();
    
  //   // Process the redirect after coming back from Azure AD
  //   this.authService.handleRedirectObservable().subscribe({
  //     next: (result) => {
  //       if (result && result.account) {
  //         this.authService.instance.setActiveAccount(result.account);
  //       }
  //     },
  //     error: (error) => console.error(error)
  //   });
  // }

  // login() {
  //   this.authService.loginRedirect();
  // }
}