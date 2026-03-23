import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EditTransactionDto, GetTransactionDetailsDto } from '../../shared/models/transaction.model';
import { GetCategoryDto } from '../../shared/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './edit-transaction.html',
  styleUrls: ['./edit-transaction.css']
})
export class EditTransaction implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);
  private authService = inject(GlobalAuthService);

  transactionForm!: FormGroup;
  categories: GetCategoryDto[] = [];

  transactionId = signal('');
  accountId = signal('');
  isLoading = signal(true);

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // 1. Initialize the form
      this.transactionForm = this.fb.group({
        type: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
        amount: [null, [Validators.required, Validators.min(0.01)]],
        date: [new Date(), Validators.required],
        categoryId: ['', Validators.required],
        description: ['', [Validators.maxLength(200)]]
      });

      // 2. Load categories
      this.loadCategories();

      // 3. Get the transactionId from URL and fetch details
      this.route.paramMap.subscribe(params => {
        const id = params.get('transactionId');
        if (id) {
          this.transactionId.set(id);
          this.loadTransactionDetails(id);
        } else {
          this.isLoading.set(false);
        }
      });
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Failed to load categories', err)
    });

  }

  loadTransactionDetails(id: string): void {
    this.transactionService.getTransactionDetails(id).subscribe({
      next: (details: GetTransactionDetailsDto) => {
        // Store the accountId so we can attach it to the Edit DTO later
        this.accountId.set(details.accountId);

        // Patch the form with the fetched data
        this.transactionForm.patchValue({
          type: details.type,
          amount: details.amount,
          date: new Date(details.date), // Convert ISO string back to Date object for the picker
          categoryId: details.category?.id, // Extract the ID from the nested category object
          description: details.description
        });

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load transaction details', err);
        this.isLoading.set(false);
      }
    });
  }

  getSelectedCategoryName(): string {
    const selectedId = this.transactionForm.get('categoryId')?.value;
    const category = this.categories.find(c => c.id === selectedId);
    return category ? category.name : 'Select a category';
  }

  onSubmit(): void {
    if (this.transactionForm.invalid || !this.transactionId() || !this.accountId()) {
      return;
    }

    const formValues = this.transactionForm.value;
    const formattedDate = new Date(formValues.date).toISOString();

    const updatedTransaction: EditTransactionDto = {
      id: this.transactionId(),
      type: formValues.type,
      amount: formValues.amount,
      date: formattedDate,
      description: formValues.description,
      categoryId: formValues.categoryId,
      accountId: this.accountId()
    };

    this.transactionService.editTransaction(updatedTransaction).subscribe({
      next: () => {
        // Navigate back to the account page upon success
        this.router.navigate([`/account/${this.accountId()}`]);
      },
      error: (err) => {
        console.error('Error updating transaction', err);
      }
    });
  }
}