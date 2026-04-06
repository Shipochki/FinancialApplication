import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CurrencyType } from '../../shared/enums/currency-type';

@Component({
  selector: 'app-create-account',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
  standalone: true,
})
export class CreateAccount {
  accountForm: FormGroup;
  private router = inject(Router);

  private accountService = inject(AccountService);

  currencies = [
    { label: 'USD', value: CurrencyType.USD },
    { label: 'EUR', value: CurrencyType.EUR },
    { label: 'GBP', value: CurrencyType.GBP },
    { label: 'JPY', value: CurrencyType.JPY },
    { label: 'AUD', value: CurrencyType.AUD },
    { label: 'CAD', value: CurrencyType.CAD },
  ];

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.min(3), Validators.max(50), Validators.required]],
      balance: [0.0, [Validators.required]],
      description: ['', [Validators.max(200)]],
      currency: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      const data = this.accountForm.value;
      this.accountService.createAccount(data).subscribe({
        next: (response) => {
          console.log('Account created successfully', response);
          this.router.navigate(['/home']); // Redirect to accounts list after successful creation
        },
        error: (error) => {
          console.error('Error creating account', error);
        },
      });
    }
  }
}
