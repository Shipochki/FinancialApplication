import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { TransactionService } from '../../core/services/transaction.service';
import { GetTransactionDto } from '../../shared/models/transaction.model';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class Transactions implements OnInit {
  private route = inject(ActivatedRoute);
  private transactionService = inject(TransactionService);
  private authService = inject(GlobalAuthService);

  accountId = signal('');
  transactions: GetTransactionDto[] = [];

  // Pagination State
  isLoading = signal(false);
  hasMore: boolean = true;
  pageIndex: number = 0;
  readonly pageSize: number = 11;

  ngOnInit(): void {
    this.route.paramMap.pipe().subscribe(params => {
      return this.accountId.set(params.get('accountId') || '');
    });

    if (this.authService.isLoggedIn()) {
      if (this.accountId()) {
        this.resetAndLoad();
      }
    }
  }

  resetAndLoad(): void {
    this.transactions = [];
    this.pageIndex = 0;
    this.hasMore = true;
    this.loadTransactions();
  }

  loadTransactions(): void {
    if (this.isLoading() || !this.hasMore) return;

    this.isLoading.set(true);

    // Assuming your service takes (accountId, skip, take) or similar pagination parameters.
    const skip = this.pageIndex * this.pageSize;

    this.transactionService.getAllTransactionsByAccountId(this.accountId(), skip, this.pageSize)
      .subscribe({
        next: (newTransactions) => {
          this.transactions = [...this.transactions, ...newTransactions];

          // If we received fewer items than requested, we've hit the end of the list
          if (newTransactions.length < this.pageSize) {
            this.hasMore = false;
          }

          this.pageIndex++;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
          this.isLoading.set(false);
        }
      });
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const threshold = 50; // pixels from bottom to trigger load

    const position = target.scrollHeight - target.scrollTop;

    if (position <= target.clientHeight + threshold) {
      this.loadTransactions();
    }
  }
}