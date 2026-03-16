import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateTransactionDto, GetTransactionDetailsDto } from "../../shared/models/transaction.model";
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

    getTransactionDetails(transactionId: string): Observable<GetTransactionDetailsDto>{
        return this.http.get<GetTransactionDetailsDto>(`${this.apiUrl}/getTransactionDetails/${transactionId}`)
    }
}