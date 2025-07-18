import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from '../../components/admin-sidebar/admin-sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSidebar],
  template: `
    <app-admin-sidebar></app-admin-sidebar>
    <router-outlet></router-outlet>
  `,
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {}
