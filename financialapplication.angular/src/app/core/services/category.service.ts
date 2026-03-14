import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GetCategoryDto } from "../../shared/models/category.model";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private http = inject(HttpClient);

    private apiUrl = 'https://localhost:7287/api/category';

    getAllCategories(): Observable<GetCategoryDto[]>{
        return this.http.get<GetCategoryDto[]>(`${this.apiUrl}/getAllCategories`);
    }
}