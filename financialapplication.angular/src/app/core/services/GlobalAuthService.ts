import { Injectable, signal } from "@angular/core";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from "@azure/msal-browser";
import { filter } from "rxjs";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root' // This ensures it's a singleton shared across the whole app
})
export class GlobalAuthService {
    public isLoggedIn = signal(false);

    constructor(
        private msalService: MsalService,
        private msalBroadcastService: MsalBroadcastService,
        private userService: UserService
    ) {
        console.log(
            "Active account:",
            this.msalService.instance.getActiveAccount()
        );

        console.log(
            "All accounts:",
            this.msalService.instance.getAllAccounts()
        );

        this.msalService.handleRedirectObservable().subscribe();

        this.updateLoginStatus();

        // 1. Set the initial state when the app loads
        this.msalBroadcastService.inProgress$
            .pipe(
                filter((status: InteractionStatus) => status === InteractionStatus.None)
            )
            .subscribe(() => {
                this.updateLoginStatus();
            });

        // 2. Listen to MSAL events to update the signal dynamically
        this.msalBroadcastService.msalSubject$
            .pipe(filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS))
            .subscribe((msg: EventMessage) => {

                const result = msg.payload as AuthenticationResult;

                this.msalService.instance.setActiveAccount(result.account);

                this.userService.syncUser().subscribe({
                    next: () => console.log('User data synced successfully'),
                    error: () => console.error('Failed to sync user data')
                });
            });
    }

    private updateLoginStatus(): void {
        const accounts = this.msalService.instance.getAllAccounts();

        // Optional but recommended: Set the active account if it's missing
        if (accounts.length > 0 && !this.msalService.instance.getActiveAccount()) {
            this.msalService.instance.setActiveAccount(accounts[0]);
        }

        this.isLoggedIn.set(accounts.length > 0);
    }

    public login() {
        // 1. Abandon the popup entirely.
        // 2. Use loginRedirect for a seamless, universally friendly flow.
        this.msalService.loginRedirect({
            scopes: ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user'] // Ensure this scope matches your .NET backend custom scope
        });
    }

    public register() {
        this.msalService.loginRedirect({
            // 'scopes' is required by the RedirectRequest interface
            // 'openid' and 'profile' are standard scopes for basic sign-in
            scopes: ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user'],
            prompt: 'login' // Forces the user to enter credentials
        });
    }

    public logout() {
        // Redirects to Microsoft to securely destroy the session, then returns to your app
        this.msalService.logoutRedirect({
            postLogoutRedirectUri: 'http://localhost:4200/'
        });
    }
}