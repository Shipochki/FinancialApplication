import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HeaderComponent } from './core/layout/header-component/header.component';
import { FooterComponent } from './core/layout/footer-component/footer.component';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-shell">
      <app-header></app-header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  // Use the modern inject() function instead of a constructor
  private msalService = inject(MsalService);
  private platformId = inject(PLATFORM_ID); // Inject the platform ID

  ngOnInit(): void {
    // Required if you use loginRedirect() instead of popups.
    // This catches the user returning from the Microsoft login screen.
    if (isPlatformBrowser(this.platformId)) {
      this.msalService.instance
        .handleRedirectPromise()
        .then(() => {
          // Handled successfully. Your GlobalAuthService's inProgress$
          // listener will automatically pick this up and flip your signal!
        })
        .catch((error) => {
          console.error('Error processing MSAL redirect:', error);
        });
    }
  }
}
