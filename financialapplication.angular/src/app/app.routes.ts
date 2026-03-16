// app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page-component/home-page-component';
import { CreateAccount } from './pages/create-account/create-account';
// import { authGuard } from './core/guard/auth.guard';
import { MsalGuard } from '@azure/msal-angular';
import { Account } from './pages/account/account';
import { CreateTransaction } from './pages/create-transaction/create-transaction';
import { TransactionDetails } from './pages/transaction-details/transaction-details';

export const routes: Routes = [
  { 
    path: '', 
    component: HomePageComponent 
  },
  { 
    path: 'home', 
    component: HomePageComponent, 
  },
  { 
    path: 'create-account', 
    component: CreateAccount,
    canActivate: [MsalGuard]
  },
  {
    path: 'account/:accountId',
    component: Account,
    canActivate: [MsalGuard]
  },
  {
    path: 'add-transaction/:accountId',
    component: CreateTransaction,
    canActivate: [MsalGuard]
  },
  {
    path: 'transaction/:transactionId',
    component: TransactionDetails,
    canActivate: [MsalGuard]
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];