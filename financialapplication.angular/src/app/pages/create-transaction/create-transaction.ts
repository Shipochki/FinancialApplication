import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateTransactionDto } from '../../shared/models/transaction.model';
import { GetCategoryDto } from '../../shared/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { TransactionService } from '../../core/services/transaction.service';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './create-transaction.html',
  styleUrls: ['./create-transaction.css']
})

export class CreateTransaction implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private transactionService = inject(TransactionService);
  private authService = inject(GlobalAuthService);

  transactionForm!: FormGroup;
  categories: GetCategoryDto[] = [];
  accountId = signal('');

  ngOnInit(): void {
    // 1. Get the accountId from the URL query parameters
    this.route.paramMap.pipe().subscribe(params => {
      return this.accountId.set(params.get('accountId') || '');
    });

    // 2. Initialize the form with constraints matching your API
    this.transactionForm = this.fb.group({
      type: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      date: [new Date(), Validators.required],
      categoryId: ['', Validators.required],
      description: ['', [Validators.maxLength(200)]]
    });

    // 3. Load categories
    this.loadCategories();
  }

  loadCategories(): void {
    if (this.authService.isLoggedIn()) {
      this.categoryService.getAllCategories().subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Failed to load categories', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.transactionForm.invalid || !this.accountId()) {
      return;
    }

    const formValues = this.transactionForm.value;

    // Format the date to a string format expected by your C# API (e.g., ISO format)
    const formattedDate = new Date(formValues.date).toISOString();

    const newTransaction: CreateTransactionDto = {
      type: formValues.type,
      amount: formValues.amount,
      date: formattedDate,
      categoryId: formValues.categoryId,
      description: formValues.description,
      accountId: this.accountId()
    };

    this.transactionService.createTransaction(newTransaction).subscribe({
      next: () => {
        // Navigate back to the account page or show a success message
        this.router.navigate([`/account/${this.accountId()}`]);
      },
      error: (err) => {
        console.error('Error creating transaction', err);
      }
    });
  }
}