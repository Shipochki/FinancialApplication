// import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
// import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
// import { Subject } from 'rxjs';
// import { filter, takeUntil } from 'rxjs/operators';

// @Component({
//     selector: 'app-login-button',
//     standalone: true,
//     imports: [CommonModule],
//     template: `
//     <div class="auth-container">
//         @if(!isLoggedIn){<button (click)="login()" class="btn-friendly login-btn">
//                 Sign In
//             </button>
            
//         } @else {
//             <button (click)="logout()" class="btn-friendly logout-btn">
//                 Sign Out
//             </button>
//         }
//     </div>
//   `,
//     styles: [`
//     .auth-container {
//       display: inline-block;
//       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//     }
    
//     .btn-friendly {
//       padding: 12px 24px;
//       border-radius: 30px; /* Highly rounded corners for a welcoming feel */
//       font-size: 16px;
//       font-weight: 600;
//       cursor: pointer;
//       border: none;
//       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//       transition: all 0.3s ease;
//     }

//     .login-btn {
//       background-color: #2563eb; /* Accessible, trust-building blue */
//       color: #ffffff;
//     }

//     .login-btn:hover {
//       background-color: #1d4ed8;
//       transform: translateY(-2px);
//       box-shadow: 0 6px 12px rgba(37, 99, 235, 0.2);
//     }

//     .logout-btn {
//       background-color: #f3f4f6;
//       color: #374151;
//       border: 1px solid #d1d5db;
//     }

//     .logout-btn:hover {
//       background-color: #e5e7eb;
//       transform: translateY(-2px);
//     }
//   `]
// })
// export class LoginButtonComponent implements OnInit, OnDestroy {
//     isLoggedIn = false;
//     private readonly _destroying$ = new Subject<void>();

//     constructor(
//         @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
//         private authService: MsalService,
//         private broadcastService: MsalBroadcastService
//     ) { }

//     ngOnInit(): void {
//         // Listen for MSAL status changes to update the UI
//         this.broadcastService.inProgress$
//             .pipe(
//                 filter((status: InteractionStatus) => status === InteractionStatus.None),
//                 takeUntil(this._destroying$)
//             )
//             .subscribe(() => {
//                 this.checkAndSetActiveAccount();
//             });
//     }

//     checkAndSetActiveAccount() {
//         // Check if any accounts are currently signed in
//         let activeAccount = this.authService.instance.getActiveAccount();

//         if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
//             let accounts = this.authService.instance.getAllAccounts();
//             this.authService.instance.setActiveAccount(accounts[0]);
//         }

//         this.isLoggedIn = !!this.authService.instance.getActiveAccount();
//     }

//     login() {
//         if (this.msalGuardConfig.authRequest) {
//             this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
//         } else {
//             this.authService.loginRedirect();
//         }
//     }

//     logout() {
//         this.authService.logoutRedirect({
//             postLogoutRedirectUri: window.location.origin
//         });
//     }

//     ngOnDestroy(): void {
//         this._destroying$.next(undefined);
//         this._destroying$.complete();
//     }
// }