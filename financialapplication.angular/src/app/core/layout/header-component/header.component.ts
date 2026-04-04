import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GlobalAuthService } from '../../services/GlobalAuthService';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public authService = inject(GlobalAuthService);
  router = inject(Router);
  public username = signal('');

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.extractUsername();
    }
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToCategories() {
    this.router.navigate(['/categories']);
  }

  private extractUsername() {
    // 1. Get the email from your Azure AD token/account object.
    // The property name depends on how you configured MSAL, but it's typically
    // 'username', 'preferred_username', or 'upn' on the active account claim.
    const userEmail = this.authService.getUserEmail();

    // 2. Split the string at the '@' symbol and take the first part
    if (userEmail) {
      this.username.set(userEmail.split('@')[0]);
    }
  }
}
