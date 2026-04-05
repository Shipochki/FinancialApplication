import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { switchMap } from 'rxjs';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';
import { GetAccountDetailsDto } from '../../shared/models/account.model';
import { TransactionCard } from '../../shared/components/transaction-card/transaction-card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account',
  imports: [
    SlicePipe,
    CurrencyPipe,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    TransactionCard,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  private route = inject(ActivatedRoute);
  private routeNavigator = inject(Router);
  private accountService = inject(AccountService);
  private authService = inject(GlobalAuthService);
  private dialog = inject(MatDialog);
  account = signal<GetAccountDetailsDto>(null!);
  accountId = signal('');

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            this.accountId.set(params.get('accountId') || '');
            return this.accountService.getAccountDetails(this.accountId(), 3);
          }),
        )
        .subscribe((account) => {
          this.account.set(account);
        });
    }
  }

  toAddTransaction() {
    this.routeNavigator.navigate([`/add-transaction/${this.accountId()}`]);
  }

  toTransactions() {
    this.routeNavigator.navigate([`/transactions/${this.accountId()}`]);
  }

  editAccount() {
    this.routeNavigator.navigate([`/edit-account/${this.accountId()}`]);
  }

  toBudgets() {
    this.routeNavigator.navigate([`/budgets/${this.accountId()}`]);
  }

  deleteAccount() {
    if (this.account()) {
      // 1. Open the dialog
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '400px',
        disableClose: true,
        // Pass the specific text for this scenario here:
        data: {
          title: 'Delete Account',
          message: 'Are you sure you want to permanently delete this account?',
          confirmText: 'Delete Account',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed && this.accountId()) {
          // 3. Trigger the delete service call
          this.accountService.deleteAccount(this.accountId()).subscribe({
            next: () => {
              console.log('Account deleted successfully');
              // Navigate back to the account list after deletion
              this.routeNavigator.navigate(['/accounts']);
            },
            error: (err) => {
              console.error('Error deleting account', err);
              // Optional: You could add a MatSnackBar here to show the user an error occurred
            },
          });
        }
      });
    }
  }
}
