import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page-component/home-page-component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: '**', redirectTo: '' }
];

// Safely check if we are in a browser environment to prevent SSR crashes
const isBrowser = typeof window !== 'undefined';
const isIframe = isBrowser ? window !== window.parent && !window.opener : false;

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // If we are on the server or in an iframe, disable initial navigation.
    // Otherwise, enable blocking so MSAL can read the URL hash!
    initialNavigation: (!isBrowser || isIframe) ? 'disabled' : 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }