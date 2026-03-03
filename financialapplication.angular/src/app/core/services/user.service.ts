import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';

interface CreateUserRequest {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // adjust this value or move it to an environment file as needed
  private readonly apiBaseUrl = 'https://localhost:7287/api';

  constructor(
    private readonly http: HttpClient,
    private readonly msalService: MsalService
  ) {}

  /**
   * Returns the Azure AD external identifier for the currently signed-in account.
   * The homeAccountId (or localAccountId) is a stable string that can be used
   * as an "externalId" when creating a user in your own database.
   */
  private getExternalId(): string | null {
    const account = this.msalService.instance.getActiveAccount();
    return account ? account.homeAccountId ?? account.localAccountId : null;
  }

  /**
   * Call the backend API to create a user. The payload contains the Azure AD
   * external id plus the provided first/last name and email address.
   */
  createUser(firstName: string, lastName: string, email: string): Observable<any> {
    const externalId = this.getExternalId();
    if (!externalId) {
      throw new Error('No active MSAL account found');
    }

    const body: CreateUserRequest = {
      externalId,
      firstName,
      lastName,
      email
    };

    return this.http.post(`${this.apiBaseUrl}/users`, body);
  }
}
