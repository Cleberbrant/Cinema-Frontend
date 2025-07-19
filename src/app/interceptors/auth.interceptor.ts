import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Interceptor - URL:', req.url);
  console.log('Interceptor - Token disponível:', token ? 'Sim' : 'Não');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Interceptor - Adicionando Authorization header');
    return next(authReq);
  }

  console.log('Interceptor - Sem token, enviando requisição sem Authorization');
  return next(req);
};
