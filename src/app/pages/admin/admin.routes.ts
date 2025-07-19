import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../layouts/admin/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'filmes',
        loadComponent: () =>
          import('./filmes/filmes').then((m) => m.AdminFilmes),
      },
      {
        path: 'cinemas',
        loadComponent: () =>
          import('./cinemas/cinemas').then((m) => m.AdminCinemas),
      },
      {
        path: 'sessoes',
        loadComponent: () =>
          import('./sessoes/sessoes').then((m) => m.AdminSessoes),
      },
      {
        path: 'alimentos',
        loadComponent: () =>
          import('./alimentos/alimentos').then((m) => m.AdminAlimentos),
      },
    ],
  },
];
