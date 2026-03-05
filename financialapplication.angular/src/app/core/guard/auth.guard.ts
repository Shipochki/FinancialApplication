import { CanActivateFn } from "@angular/router";
import { GlobalAuthService } from "../services/GlobalAuthService"; // Adjust path if needed
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export const authGuard: CanActivateFn = () => {
    const platformId = inject(PLATFORM_ID);

    // 1. SSR Bypass
    if (!isPlatformBrowser(platformId)) {
        return true; 
    }

    const authService = inject(GlobalAuthService);

    // 2. Synchronous check - no observables needed!
    console.log('Checking auth guard: User logged in?', authService.isLoggedIn());
    
    if (authService.isLoggedIn()) {
        return true; 
    }
      
    console.warn('Navigation blocked: User is not logged in.');
    authService.login();
    return false;
};