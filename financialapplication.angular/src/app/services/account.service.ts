import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { GetAccountDto } from "../models/account.model";

export class AccountService {
    private http = inject(HttpClient);
  
  // Replace this with your actual .NET local/production URL
    private apiUrl = 'https://localhost:5111/api/account';

    public getAccounts(): Observable<GetAccountDto[]> {
        return this.http.get<GetAccountDto[]>(`${this.apiUrl}/getall`);
    }
}