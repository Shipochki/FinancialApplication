import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetAccountDto } from "../../shared/models/account.model";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private http = inject(HttpClient);
  
  // Replace this with your actual .NET local/production URL
    private apiUrl = 'https://localhost:7287/api/account';

    getAccounts(): Observable<GetAccountDto[]> {
        return this.http.get<GetAccountDto[]>(`${this.apiUrl}/getall`);
    }
}