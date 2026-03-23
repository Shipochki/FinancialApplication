import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateTransactionDto, EditTransactionDto, GetTransactionDetailsDto, GetTransactionDto } from "../../shared/models/transaction.model";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private http = inject(HttpClient);

    private apiUrl = 'https://localhost:7287/api/transaction';

    createTransaction(transaction: CreateTransactionDto) {
        return this.http.post(`${this.apiUrl}/createTransaction`, transaction);
    }

    getTransactionDetails(transactionId: string): Observable<GetTransactionDetailsDto> {
        return this.http.get<GetTransactionDetailsDto>(`${this.apiUrl}/getTransactionDetails/${transactionId}`)
    }

    getAllTransactionsByAccountId(accountId: string, skip: number, pageSize: number): Observable<GetTransactionDto[]> {
        const url = `${this.apiUrl}/GetAllTransactionsByAccountId/${accountId}`;

        // Chain .set() to include both pagination parameters
        const params = new HttpParams()
            .set('skip', skip.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<GetTransactionDto[]>(url, { params });
    }

    editTransaction(transaction: EditTransactionDto) {
        return this.http.post(`${this.apiUrl}/UpdateTransaction`, transaction);
    }
}