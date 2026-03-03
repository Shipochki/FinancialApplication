import { Injectable, signal } from "@angular/core";
import { MsalBroadcastService, MsalService } from "@azure/msal-angular";
import { EventMessage, EventType } from "@azure/msal-browser";
import { filter } from "rxjs";

@Injectable({
    providedIn: 'root' // This ensures it's a singleton shared across the whole app
})
export class GlobalAuthService {
    public isLoggedIn = signal(false);

    constructor(
        private msalService: MsalService,
        private msalBroadcastService: MsalBroadcastService
    ) {
        // 1. Set the initial state when the app loads
        this.updateLoginStatus();

        // 2. Listen to MSAL events to update the signal dynamically
        this.msalBroadcastService.msalSubject$
            .pipe(
                filter((msg: EventMessage) =>
                    msg.eventType === EventType.LOGIN_SUCCESS ||
                    msg.eventType === EventType.LOGOUT_SUCCESS
                )
            )
            .subscribe(() => {
                this.updateLoginStatus();
            });
    }

    private updateLoginStatus(): void {
        const accounts = this.msalService.instance.getAllAccounts();
        // Update the signal based on whether any accounts are active
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