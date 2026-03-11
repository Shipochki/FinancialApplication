import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetAccountDto } from '../../shared/models/account.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { LoadingIndicatorComponent } from '../../shared/components/loading-indicator/loading-indicator.component';
import { AccountService } from '../../core/services/account.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

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
  public authService = inject(GlobalAuthService)

  accounts = signal<GetAccountDto[]>([]);
  currentIndex = signal(0);
  isLoading = signal(true);
  router = inject(Router);

  private accountService = inject(AccountService);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
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
  
  onClickCard(accountId: string) {
    // Navigate to the account details page
    this.router.navigate([`/account/${accountId}`]);
  }
}