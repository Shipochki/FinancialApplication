import { Component, Inject, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { GetAccountDto } from '../../models/account.model';
import { MsalService } from '@azure/msal-angular';

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

  constructor(
    private accountService: AccountService,
    @Inject(MsalService) private authService: MsalService,
  ) { }

  ngOnInit() {

    const currentAccounts = this.authService.instance.getAllAccounts();
    console.log("Current Accounts:", currentAccounts);
    if (currentAccounts.length > 0) {
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