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

interface CurrencyOption {
  value: number;
  label: string;
}

@Component({
  selector: 'app-create-account',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatCardModule
  ],
  templateUrl: './create-account.html',
  styleUrl: './create-account.css',
  standalone: true
})

export class CreateAccount {
  accountForm: FormGroup;
  private router = inject(Router);

  private accountService = inject(AccountService);

  currencies: CurrencyOption[] = [
    { value: 0, label: 'USD' },
    { value: 1, label: 'EUR' },
    { value: 2, label: 'GBP' },
    { value: 3, label: 'JPY' },
    { value: 4, label: 'AUD' },
    { value: 5, label: 'CAD' }
  ];

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      name: ['', [Validators.min(3), Validators.max(50), Validators.required]],
      balance: [0.00, [Validators.required]],       
      description: ['', [Validators.max(200)]],
      currency: [0, [Validators.required, Validators.min(0), Validators.max(5)]] 
    });
  }

  onSubmit(){
    if (this.accountForm.valid) {
      const data = this.accountForm.value;
      this.accountService.createAccount(data).subscribe({
        next: (response) => {
          console.log('Account created successfully', response);
          this.router.navigate(['/accounts']); // Redirect to accounts list after successful creation
        },
        error: (error) => {
          console.error('Error creating account', error);
        }
      });
    }
  }
} 
