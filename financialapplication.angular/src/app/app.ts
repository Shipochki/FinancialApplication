import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { HeaderComponent } from './core/layout/header-component/header.component';
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
    private authService: MsalService,
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
}