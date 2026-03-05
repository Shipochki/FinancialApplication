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