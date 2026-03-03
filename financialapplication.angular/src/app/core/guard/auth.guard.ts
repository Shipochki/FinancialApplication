import { CanActivateFn, Router } from "@angular/router";
import { GlobalAuthService } from "../services/GlobalAuthService";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = () => {
    const authService = inject(GlobalAuthService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true; // User is authenticated, allow access
    }

    return router.parseUrl('/'); // Not authenticated, redirect to home page
}