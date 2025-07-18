import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro').then((m) => m.Registro),
  },
  {
    path: 'filme/:id',
    loadComponent: () =>
      import('./pages/filme-detalhes/filme-detalhes').then(
        (m) => m.FilmeDetalhes
      ),
  },
  {
    path: 'pagamento',
    loadComponent: () =>
      import('./pages/pagamento/pagamento').then((m) => m.Pagamento),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/admin.routes').then((m) => m.adminRoutes),
    canActivate: [adminGuard],
  },
  { path: '**', redirectTo: '/home' },
];
