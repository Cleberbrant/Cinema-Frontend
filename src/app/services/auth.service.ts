import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router'; // ← ADICIONAR APENAS ESTA LINHA
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signal para o usuário atual
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    // ← ADICIONAR , private router: Router
    // Verificar se há usuário salvo no localStorage
    this.initializeUserFromStorage();
  }

  private initializeUserFromStorage(): void {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');

      if (storedUser && token && !this.isTokenExpired(token)) {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
        this.currentUser.set(user);
      } else {
        // Limpar dados inválidos
        this.logout();
      }
    } catch (error) {
      console.error('Erro ao inicializar usuário:', error);
      this.logout();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.authUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          // Armazenar o token e usuário
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.currentUser.set(response.user);
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.authUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.router.navigate(['/home']); // ← ADICIONAR APENAS ESTA LINHA
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'; // ← ADICIONAR || user?.role === 'ROLE_ADMIN'
  }

  getCurrentUser(): User | null {
    // ← ADICIONAR ESTE MÉTODO COMPLETO
    return this.currentUser();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }
}
