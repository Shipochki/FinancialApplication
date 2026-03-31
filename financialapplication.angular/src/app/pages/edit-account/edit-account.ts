import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyType } from '../../shared/enums/currency-type';
import { UpdateAccountDto } from '../../shared/models/account.model';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-account',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './edit-account.html',
  styleUrl: './edit-account.css',
  standalone: true,
})
export class EditAccount implements OnInit {
  accountForm: FormGroup;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private authService = inject(GlobalAuthService);
  private accountId = signal('');

  currencies = [
    { label: 'USD', value: CurrencyType.USD },
    { label: 'EUR', value: CurrencyType.EUR },
    { label: 'GBP', value: CurrencyType.GBP },
    { label: 'JPY', value: CurrencyType.JPY },
    { label: 'AUD', value: CurrencyType.AUD },
    { label: 'CAD', value: CurrencyType.CAD },
  ];

  constructor() {
    this.accountForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      balance: [0.0, [Validators.required]],
      description: ['', [Validators.maxLength(200)]],
      currency: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      // Retrieves the ID from the URL (e.g., /accounts/edit/:id)
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            this.accountId.set(params.get('accountId') || '');
            return this.accountService.getAccountDetails(this.accountId(), 3);
          }),
        )
        .subscribe((account) => {
          this.accountForm.patchValue(account);
        });
    }
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const data: UpdateAccountDto = this.accountForm.value;
      data.id = this.accountId();
      console.log('Submitting updated account data:', data);
      this.accountService.updateAccount(data).subscribe({
        next: (response) => {
          console.log('Account updated successfully', response);
          this.router.navigate(['/accounts']);
        },
        error: (error) => {
          console.error('Error updating account', error);
        },
      });
    }
  }
}
