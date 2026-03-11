// app.routes.ts
import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page-component/home-page-component';
import { CreateAccount } from './pages/create-account/create-account';
// import { authGuard } from './core/guard/auth.guard';
import { MsalGuard } from '@azure/msal-angular';
import { Account } from './pages/account/account';

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
    path: '**', 
    redirectTo: '' 
  }
];