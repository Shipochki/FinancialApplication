import { HttpClient } from "@angular/common/http";
import { Inject, inject, Injectable } from "@angular/core";
import { from, Observable, switchMap, tap } from "rxjs";
import { GetAccountDto } from "../models/account.model";
import { MsalService } from "@azure/msal-angular";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private http = inject(HttpClient);
    private authService = inject(MsalService);
  
  // Replace this with your actual .NET local/production URL
    private apiUrl = 'https://localhost:7287/api/account';

    getAccounts(): Observable<GetAccountDto[]> {
        return this.http.get<GetAccountDto[]>(`${this.apiUrl}/getall`);
    }

    // getAccounts(): Observable<GetAccountDto[]> {
    //     // 1. Manually check if MSAL can even find a token for this scope
    //     return from(this.authService.instance.acquireTokenSilent({
    //         scopes: ['api://ae84d976-7f16-4602-ac6c-03763dffdc41/access_as_user']
    //     })).pipe(
    //         tap(result => console.log("Manual Token Check Success:", !!result.accessToken)),
    //         // 2. If it found a token, proceed with the actual HTTP call
    //         switchMap(() => this.http.get<GetAccountDto[]>(`${this.apiUrl}/getall`))
    //     );
    // }
}