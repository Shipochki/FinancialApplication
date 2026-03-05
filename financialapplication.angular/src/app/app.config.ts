import { ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { provideRouter, withDisabledInitialNavigation, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withFetch, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import {
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { isPlatformBrowser } from '@angular/common';
import { GlobalAuthService } from './core/services/GlobalAuthService';
import { customAuthInterceptor } from './core/interceptors/auth.interceptor';

export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '58d6649d-1da9-4e54-ae09-7baaab4295c0',
      authority: 'https://login.microsoftonline.com/b33db19b-a796-4c7d-9549-b574317ff389',
      redirectUri: 'http://localhost:4200',
    },
    cache: {
      cacheLocation: 'localStorage'
    },
    system: {
      allowPlatformBroker: false
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // Attach the token only to API requests matching this URL
  protectedResourceMap.set('https://localhost:7287/', ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user']);
  console.log('Protected Resource Map:', protectedResourceMap);
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user']
    }
  };
}

export function initializeMsalFactory(msalService: MsalService) {
  return () => msalService.instance.initialize();
}

const isBrowser = typeof window !== 'undefined';
const isIframe = isBrowser ? window !== window.parent && !window.opener : false;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      isIframe ? withDisabledInitialNavigation() : withEnabledBlockingInitialNavigation()
    ),
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      const msalService = inject(MsalService);

      // ONLY run MSAL initialization if we are rendering in the browser!
      if (isPlatformBrowser(platformId)) {
        return msalService.instance.initialize();
      }

      // If rendering on the server (SSR), instantly resolve so the server doesn't crash
      return Promise.resolve();
    }),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([customAuthInterceptor])), // Add your custom interceptor here),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: 'INIT_AUTH',
      useFactory: () => {
        inject(GlobalAuthService);
        return true;
      }
    }
  ]
};

