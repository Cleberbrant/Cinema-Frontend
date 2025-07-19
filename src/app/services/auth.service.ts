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
        this.clearSession();
      }
    } catch (error) {
      console.error('Erro ao inicializar usuário:', error);
      this.clearSession();
    }
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http
      .post<any>(`${environment.authUrl}/login`, credentials)
      .pipe(
        tap((response: any) => {
          let user: User | null = null;
          let token: string | null = null;

          if (response) {
            // Extrair o token
            token = response.token || response.accessToken || response.jwt;

            if (token) {
              // Decodificar o JWT para extrair os dados do usuário
              try {
                const payload = this.decodeJWT(token);

                // Extrair dados do usuário do JWT
                user = {
                  id: payload.id || payload.sub || payload.userId,
                  nome: payload.nome || payload.name || payload.username,
                  email: payload.email,
                  cpf: payload.cpf,
                  dataNascimento: payload.dataNascimento || payload.birthDate,
                  role:
                    payload.role || payload.authorities?.[0] || payload.scope,
                  localidade: payload.localidade || {
                    id: 1,
                    endereco: '',
                    cep: '',
                    referencia: '',
                  },
                };
              } catch (error) {
                console.error('Error decoding JWT:', error);
                throw new Error('Invalid JWT token');
              }
            }

            // Tentar extrair o usuário dos campos da resposta (fallback)
            if (!user && response.user) {
              user = response.user;
            } else if (!user && response.usuario) {
              user = response.usuario;
            } else if (!user && response.data) {
              user = response.data;
            }
          }

          if (token && user) {
            // Armazenar o token e usuário
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.currentUser.set(user);
          } else {
            throw new Error('Invalid login response format');
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.authUrl}/register`, userData);
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/home']);
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
    return user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';
  }

  getCurrentUser(): User | null {
    // ← ADICIONAR ESTE MÉTODO COMPLETO
    return this.currentUser();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeJWT(token);
      const isExpired = payload.exp < Date.now() / 1000;
      return isExpired;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  private decodeJWT(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      throw new Error('Invalid JWT token format');
    }
  }
}
