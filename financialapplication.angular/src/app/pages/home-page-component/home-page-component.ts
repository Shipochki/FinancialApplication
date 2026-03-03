import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAccountDto } from '../../shared/models/account.model';
import { MsalService } from '@azure/msal-angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { LoadingIndicatorComponent } from '../../shared/components/loading-indicator/loading-indicator.component';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-home-page-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
    LoadingIndicatorComponent,
  ],
  templateUrl: './home-page-component.html',
  styleUrls: ['./home-page-component.css'],
})
export class HomePageComponent implements OnInit {
  accounts = signal<GetAccountDto[]>([]);
  currentIndex = signal(0);
  isLoading = signal(true);
  loggedIn = signal(false); // track authentication state

  private accountService = inject(AccountService);
  private authService = inject(MsalService);

  ngOnInit() {

    const currentAccounts = this.authService.instance.getAllAccounts();
    this.loggedIn.set(currentAccounts.length > 0);

    if (currentAccounts.length > 0) {
      this.accountService.getAccounts().subscribe({
        next: (data) => {
          this.accounts.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      // not logged in, nothing to load
      this.isLoading.set(false);
    }

  }

  nextAccount() {
    this.currentIndex.update(i => Math.min(i + 1, this.accounts().length - 1));
  }

  prevAccount() {
    this.currentIndex.update(i => Math.max(i - 1, 0));
  }

  getCurrencyCode(code: number): string {
    const currencyMap: Record<number, string> = {
      0: 'USD',
      1: 'EUR',
      2: 'BGN',
    };
    return currencyMap[code] ?? 'USD';
  }
}