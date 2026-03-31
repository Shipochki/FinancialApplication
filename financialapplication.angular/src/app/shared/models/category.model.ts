export interface GetCategoryDto {
  id: string;
  name: string;
  description: string;
  icon: string;
  isGlobal: boolean;
}

export interface CreateCategoryDto {
  name: string;
  description: string;
  icon: string;
}

export interface UpdateCategoryDto {
  id: string;
  name: string;
  description: string;
  icon: string;
}
