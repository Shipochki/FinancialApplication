import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
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

export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '58d6649d-1da9-4e54-ae09-7baaab4295c0',
      authority: 'https://login.microsoftonline.com/b33db19b-a796-4c7d-9549-b574317ff389',
      redirectUri: 'http://localhost:4200'
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  // Attach the token only to API requests matching this URL
  protectedResourceMap.set('https://localhost:5111/api/', ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user']);

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

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
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
    MsalBroadcastService
  ]
};