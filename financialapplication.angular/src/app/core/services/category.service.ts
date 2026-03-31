import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateCategoryDto,
  GetCategoryDto,
  UpdateCategoryDto,
} from '../../shared/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7287/api/category';

  getAllCategories(): Observable<GetCategoryDto[]> {
    return this.http.get<GetCategoryDto[]>(`${this.apiUrl}/getAllCategories`);
  }

  createCategory(category: CreateCategoryDto): Observable<CreateCategoryDto> {
    return this.http.post<CreateCategoryDto>(`${this.apiUrl}/createCategory`, category);
  }

  updateCategory(category: UpdateCategoryDto) {
    return this.http.put<UpdateCategoryDto>(`${this.apiUrl}/updateCategory`, category);
  }

  deleteCategory(categoryId: string) {
    return this.http.delete(`${this.apiUrl}/deleteCategory/${categoryId}`);
  }
}
