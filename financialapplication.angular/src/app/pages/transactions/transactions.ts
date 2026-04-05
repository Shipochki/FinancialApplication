import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TransactionService } from '../../core/services/transaction.service';
import { GetTransactionDto } from '../../shared/models/transaction.model';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';
import { PaginatedResponse } from '../../shared/models/shared.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatPaginatorModule, // <-- Added Paginator Module
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class Transactions implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private transactionService = inject(TransactionService);
  private authService = inject(GlobalAuthService);

  accountId = signal('');
  transactions: GetTransactionDto[] = [];

  // Pagination State
  isLoading = signal(false);
  pageIndex: number = 0;
  pageSize: number = 10;
  totalTransactions = signal(0); // <-- Needs to be updated with the real total count from your backend

  ngOnInit(): void {
    this.route.paramMap.pipe().subscribe((params) => {
      this.accountId.set(params.get('accountId') || '');

      if (this.authService.isLoggedIn() && this.accountId()) {
        this.resetAndLoad();
      }
    });
  }

  resetAndLoad(): void {
    this.pageIndex = 0;
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading.set(true);

    const skip = this.pageIndex * this.pageSize;

    this.transactionService
      .getAllTransactionsByAccountId(this.accountId(), skip, this.pageSize)
      .subscribe({
        next: (response: PaginatedResponse<GetTransactionDto>) => {
          // Replace the array instead of appending
          this.transactions = response.items;

          this.totalTransactions.set(response.count); // Update total count for pagination

          // NOTE: If your API updates to return a total count, assign it here:
          // this.totalTransactions.set(response.totalCount);

          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching transactions:', err);
          this.isLoading.set(false);
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }

  onClickTransaction(transactionId: string): void {
    this.router.navigate([`/transaction/${transactionId}`]);
  }
}
