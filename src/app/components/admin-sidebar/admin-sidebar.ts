import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss',
})
export class AdminSidebar {
  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
    { icon: 'movie', label: 'Filmes', route: '/admin/filmes' },
    { icon: 'location_city', label: 'Cinemas', route: '/admin/cinemas' },
    { icon: 'event', label: 'Sessões', route: '/admin/sessoes' },
    { icon: 'restaurant', label: 'Alimentos', route: '/admin/alimentos' },
  ];
}
