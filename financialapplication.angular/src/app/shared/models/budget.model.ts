import { GetCategoryDto } from './category.model';

export interface GetBudgetDto {
  id: number;
  name: string;
  amount: number;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: number; // 0, 1, 2, etc.
  categoryId: string;
  category: GetCategoryDto;
  accountId: string;
}

export interface CreateBudgetDto {
  name: string;
  amount: number;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: number; // 0, 1, 2, etc.
  categoryId: string;
  accountId: string;
}

export interface UpdateBudgetDto {
  id: number;
  name: string;
  amount: number;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: number; // 0, 1, 2, etc.
  categoryId: string;
  accountId: string;
}
