import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page-component/home-page-component';
import { CreateAccount } from './pages/create-account/create-account';
import { MsalGuard } from '@azure/msal-angular';
import { Account } from './pages/account/account';
import { CreateTransaction } from './pages/create-transaction/create-transaction';
import { TransactionDetails } from './pages/transaction-details/transaction-details';
import { Transactions } from './pages/transactions/transactions';
import { EditTransaction } from './pages/edit-transaction/edit-transaction';
import { EditAccount } from './pages/edit-account/edit-account';
import { Categories } from './pages/categories/categories';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'create-account',
    component: CreateAccount,
    canActivate: [MsalGuard],
  },
  {
    path: 'edit-transaction/:transactionId',
    component: EditTransaction,
    canActivate: [MsalGuard],
  },
  {
    path: 'account/:accountId',
    component: Account,
    canActivate: [MsalGuard],
  },
  {
    path: 'edit-account/:accountId',
    component: EditAccount,
    canActivate: [MsalGuard],
  },
  {
    path: 'add-transaction/:accountId',
    component: CreateTransaction,
    canActivate: [MsalGuard],
  },
  {
    path: 'transaction/:transactionId',
    component: TransactionDetails,
    canActivate: [MsalGuard],
  },
  {
    path: 'transactions/:accountId',
    component: Transactions,
    canActivate: [MsalGuard],
  },
  {
    path: 'categories',
    component: Categories,
    canActivate: [MsalGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
