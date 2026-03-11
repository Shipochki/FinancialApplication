import { GetTransactionDto } from "./transaction.model";

export interface GetAccountDto {
  id: string;
  name: string;
  balance: number;
  description?: string;
  currency: number; // 0, 1, 2, etc.
  ownerId: string;
}

export interface CreateAccountDto {
  name: string;
  balance: number;
  description?: string;
  currency: number; // 0, 1, 2, etc.
}

export interface GetAccountDetailsDto {
  id: string;
  name: string;
  balance: number;
  description?: string;
  currency: number; // 0, 1, 2, etc.
  ownerId: string;
  transactionDtos: GetTransactionDto[];
}