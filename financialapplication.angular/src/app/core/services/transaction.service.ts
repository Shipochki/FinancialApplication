import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { CreateTransactionDto } from "../../shared/models/transaction.model";

export class TransactionService {
    private http = inject(HttpClient);

    private apiUrl = 'https://localhost:7287/api/transaction';

    createTransaction(transaction: CreateTransactionDto) {
        return this.http.post(`${this.apiUrl}/createTransaction`, transaction);
    }

}