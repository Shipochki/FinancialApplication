// shared/models/pagination.model.ts
export interface PaginatedResponse<T> {
  items: T[];
  count: number;
}
