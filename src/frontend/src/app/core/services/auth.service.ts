import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'ecom_token';
  private readonly usernameKey = 'ecom_username';
  private readonly roleKey = 'ecom_role';

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, request).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.usernameKey, response.username);
        localStorage.setItem(this.roleKey, response.role);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.roleKey);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  isAdmin$(): Observable<boolean> {
    return this.isAuthenticated$.pipe(map(() => this.getRole() === 'Admin'));
  }

  hasToken(): boolean {
    return !!this.getToken();
  }
}
