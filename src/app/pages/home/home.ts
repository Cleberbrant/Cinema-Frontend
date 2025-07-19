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
  filmes = signal<Filme[]>([]); // Mudei de filmesEmCartaz para filmes (lista geral)
  loading = signal(false);
  loadingFilmes = signal(false);

  ngOnInit(): void {
    this.loadCinemas();
    this.loadFilmes(); // Mudei para loadFilmes (geral)
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

  private loadFilmes(): void {
    // Novo método para lista geral
    this.loadingFilmes.set(true);
    console.log('Iniciando carregamento de filmes gerais'); // Log adicionado

    this.filmeService.getFilmes().subscribe({
      // Trocado para getFilmes() - lista todos
      next: (filmes) => {
        console.log('Filmes gerais recebidos do backend:', filmes); // Log para ver a resposta
        this.filmes.set(filmes);
        this.loadingFilmes.set(false);
      },
      error: (error) => {
        console.error('Erro na requisição de filmes gerais:', error); // Log detalhado
        this.loadingFilmes.set(false);
      },
      complete: () => console.log('Requisição de filmes gerais completa'), // Confirma fim
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
