import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CreateTransactionDto } from "../../shared/models/transaction.model";

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private http = inject(HttpClient);

    private apiUrl = 'https://localhost:7287/api/transaction';

    createTransaction(transaction: CreateTransactionDto) {
        return this.http.post(`${this.apiUrl}/createTransaction`, transaction);
    }

}