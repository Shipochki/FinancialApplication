import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { GetAccountDto } from '../../models/account.model';

@Component({
  selector: 'app-home-page-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page-component.html',
  styleUrls: ['./home-page-component.css'],
})
export class HomePageComponent implements OnInit {
  accounts: GetAccountDto[] = [];
  currentIndex: number = 0;
  isLoading: boolean = true;

  constructor(private accountService: AccountService) {}

  ngOnInit(){
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  nextAccount() {
    if (this.currentIndex < this.accounts.length - 1) {
      this.currentIndex++;
    }
  }

  prevAccount() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  getCurrencyCode(code: number): string {
    const currencyMap: { [key: number]: string } = {
      0: 'USD',
      1: 'EUR',
      2: 'BGN'
    };
    return currencyMap[code] || 'USD';
  }
}