import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateBudgetDto, GetBudgetDto, UpdateBudgetDto } from '../../shared/models/budget.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7287/api/budget';

  createBudget(budget: CreateBudgetDto) {
    return this.http.post(`${this.apiUrl}/createBudget`, budget);
  }

  updateBudget(budget: UpdateBudgetDto) {
    return this.http.put(`${this.apiUrl}/updateBudget`, budget);
  }

  getAllBudgetsByAccountId(accountId: string): Observable<GetBudgetDto[]> {
    return this.http.get<GetBudgetDto[]>(`${this.apiUrl}/getAllBudgetsByAccountId/${accountId}`);
  }

  getBudgetById(budgetId: string): Observable<GetBudgetDto> {
    return this.http.get<GetBudgetDto>(`${this.apiUrl}/getBudgetById/${budgetId}`);
  }

  deleteBudget(budgetId: string) {
    return this.http.delete(`${this.apiUrl}/deleteBudget/${budgetId}`);
  }
}
