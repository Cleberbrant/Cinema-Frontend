import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FilmeService,
  CinemaService,
  SessaoService,
  AlimentoService,
} from '../../../services';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private filmeService = inject(FilmeService);
  private cinemaService = inject(CinemaService);
  private sessaoService = inject(SessaoService);
  private alimentoService = inject(AlimentoService);

  totalFilmes = signal(0);
  totalCinemas = signal(0);
  totalSessoes = signal(0);
  totalAlimentos = signal(0);
  loading = signal(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading.set(true);

    // Carregar dados em paralelo
    Promise.all([
      this.filmeService.getFilmes().toPromise(),
      this.cinemaService.getCinemas().toPromise(),
      this.sessaoService.getSessoes().toPromise(),
      this.alimentoService.getAlimentos().toPromise(),
    ])
      .then(([filmes, cinemas, sessoes, alimentos]) => {
        this.totalFilmes.set(filmes?.length || 0);
        this.totalCinemas.set(cinemas?.length || 0);
        this.totalSessoes.set(sessoes?.length || 0);
        this.totalAlimentos.set(alimentos?.length || 0);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Erro ao carregar dados do dashboard:', error);
        this.loading.set(false);
      });
  }
}
