import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateAccountDto,
  GetAccountDetailsDto,
  GetAccountDto,
  UpdateAccountDto,
} from '../../shared/models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);

  // Replace this with your actual .NET local/production URL
  private apiUrl = 'https://localhost:7287/api/account';

  getAccounts(): Observable<GetAccountDto[]> {
    return this.http.get<GetAccountDto[]>(`${this.apiUrl}/getall`);
  }

  createAccount(account: CreateAccountDto): Observable<CreateAccountDto> {
    return this.http.post<CreateAccountDto>(`${this.apiUrl}/createAccount`, account);
  }

  getAccountDetails(
    accountId: string,
    transactionLimit?: number,
  ): Observable<GetAccountDetailsDto> {
    const url = `${this.apiUrl}/getAccountDetails/${accountId}`;
    const params = new HttpParams().set('transactionLimit', transactionLimit?.toString() || '');
    return this.http.get<GetAccountDetailsDto>(url, { params });
  }

  updateAccount(account: UpdateAccountDto) {
    return this.http.post(`${this.apiUrl}/UpdateAccount`, account);
  }

  deleteAccount(accountId: string) {
    return this.http.delete(`${this.apiUrl}/deleteAccount/${accountId}`);
  }
}
