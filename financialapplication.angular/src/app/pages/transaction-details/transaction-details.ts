import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { GetTransactionDetailsDto } from '../../shared/models/transaction.model';
import { TransactionService } from '../../core/services/transaction.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
// Adjust the import path based on your folder structure

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './transaction-details.html',
  styleUrls: ['./transaction-details.css']
})
export class TransactionDetails implements OnInit {
  authService = inject(GlobalAuthService);
  transaction: GetTransactionDetailsDto | null = null;
  isLoading = signal(true);
  transactionId = signal('');

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private transactionService = inject(TransactionService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.fetchTransactionDetails();
  }

  fetchTransactionDetails(): void {

    if (this.authService.isLoggedIn()) {
      this.route.paramMap.pipe().subscribe(params => {
        return this.transactionId.set(params.get('transactionId') || '');
      });

      if (this.transactionId()) {
        this.transactionService.getTransactionDetails(this.transactionId()).subscribe({
          next: (data: GetTransactionDetailsDto) => {
            this.transaction = data;
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Failed to load transaction details', err);
            this.isLoading.set(false);
          }
        });
      } else {
        console.error('No transactionId found in the URL');
        this.isLoading.set(false);
      }
    }
  }

  onEdit(): void {
    if (this.transaction) {
      console.log(`Maps to edit form for: ${this.transaction.id}`);
      this.router.navigate(['/edit-transaction', this.transaction.id]);
    }
  }

  onDelete(): void {
    if (this.transaction) {
      // 1. Open the dialog
      const dialogRef = this.dialog.open(ConfirmDialog, {
        width: '400px',
        disableClose: true 
      });

      // 2. Handle the result when closed
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed && this.transactionId()) {
          
          // 3. Trigger the delete service call
          this.transactionService.deleteTransaction(this.transactionId()).subscribe({
            next: () => {
              console.log('Transaction deleted successfully');
              // Navigate back to the transaction list after deletion
              this.router.navigate(['/transactions']); // Adjust this route to your actual list route
            },
            error: (err) => {
              console.error('Error deleting transaction', err);
              // Optional: You could add a MatSnackBar here to show the user an error occurred
            }
          });
        }
      });
    }
  }
}