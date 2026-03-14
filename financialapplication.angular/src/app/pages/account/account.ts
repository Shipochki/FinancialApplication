import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { switchMap } from 'rxjs';
import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { GlobalAuthService } from '../../core/services/GlobalAuthService';
import { GetAccountDetailsDto } from '../../shared/models/account.model';

@Component({
  selector: 'app-account',
  imports: [
    SlicePipe,
    DatePipe,
    CurrencyPipe,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule
  ],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit {
  private route = inject(ActivatedRoute);
  private routeNavigator = inject(Router);
  private accountService = inject(AccountService);
  private authService = inject(GlobalAuthService);
  account = signal<GetAccountDetailsDto>(null!);
  accountId = signal('');

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.route.paramMap.pipe(
        switchMap(params => {
          this.accountId.set(params.get('accountId') || '');
          return this.accountService.getAccountDetails(this.accountId(), 3);
        })
      ).subscribe(account => {
        this.account.set(account);
      });
    }
  }

  toAddTransaction(){
    console.log(this.accountId())
    this.routeNavigator.navigate([`/add-transaction/${this.accountId()}`])
  }
}
