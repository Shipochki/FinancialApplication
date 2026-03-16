import { GetCategoryDto } from "./category.model";

export interface GetTransactionDto {
    id: string;
    type: number;
    amount: number;
    date: string; // ISO format
    description?: string;
    categoryId: string;
    accountId: string;
}

export interface CreateTransactionDto {
    type: number;
    amount: number;
    date: string; // ISO format
    description?: string;
    categoryId: string;
    accountId: string;
}

export interface GetTransactionDetailsDto{
    id: string;
    type: number;
    amount: number;
    date: string; // ISO format
    description?: string;
    accountId: string;
    category: GetCategoryDto
}