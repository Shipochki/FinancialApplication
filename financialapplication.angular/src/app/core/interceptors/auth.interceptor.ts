import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { from, switchMap, catchError } from 'rxjs';

export const customAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(MsalService);

  // 1. Check if the request is going to your .NET API
  if (req.url.startsWith('https://localhost:7287')) {
    console.log('Interceptor caught the request to:', req.url);

    // 2. Grab the token silently
    return from(authService.instance.acquireTokenSilent({
      scopes: ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user'],
      account: authService.instance.getAllAccounts()[0]
    })).pipe(
      switchMap((result) => {
        console.log('Interceptor successfully attached the token!');
        
        // 3. Clone the request and FORCE the Authorization header on it
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${result.accessToken}`
          }
        });
        
        // 4. Send it to the backend
        return next(authReq);
      }),
      catchError((error) => {
        console.error('Interceptor failed to grab token silently:', error);
        return next(req); // Fall back to sending without token so we see the 401
      })
    );
  }

  // If the request isn't for our API, ignore it and pass it through
  return next(req);
};