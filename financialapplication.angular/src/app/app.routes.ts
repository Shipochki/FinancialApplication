import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page-component/home-page-component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomePageComponent },
    // { path: 'create-account', component: CreateAccountComponent },
    { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
