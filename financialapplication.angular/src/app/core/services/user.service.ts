import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  // Replace this with your actual .NET local/production URL
  private apiUrl = 'https://localhost:7287/api/user';

  syncUser(): Observable<any> {
    return this.http.post(`${this.apiUrl}/syncUser`, null);
  }
}
