import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CinemaService, FilmeService } from '../../services';
import { Cinema, Filme, Duracao } from '../../models';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private cinemaService = inject(CinemaService);
  private filmeService = inject(FilmeService);
  private router = inject(Router);

  cinemas = signal<Cinema[]>([]);
  filmesEmCartaz = signal<Filme[]>([]);
  loading = signal(false);
  loadingFilmes = signal(false);

  ngOnInit(): void {
    this.loadCinemas();
    this.loadFilmesEmCartaz();
  }

  private loadCinemas(): void {
    this.loading.set(true);
    this.cinemaService.getCinemas().subscribe({
      next: (cinemas) => {
        this.cinemas.set(cinemas);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar cinemas:', error);
        this.loading.set(false);
      },
    });
  }

  private loadFilmesEmCartaz(): void {
    this.loadingFilmes.set(true);
    this.filmeService.getFilmesEmCartaz().subscribe({
      next: (filmes) => {
        this.filmesEmCartaz.set(filmes);
        this.loadingFilmes.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes:', error);
        this.loadingFilmes.set(false);
      },
    });
  }

  scrollToFilmes(): void {
    const element = document.getElementById('filmes');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  verDetalhesFilme(filmeId: number): void {
    this.router.navigate(['/filme', filmeId]);
  }

  formatDuracao(duracao: Duracao): string {
    const totalMinutos = duracao.hour * 60 + duracao.minute;
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos}min`;
  }
}
