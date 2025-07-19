import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilmeService, SessaoService } from '../../services';
import { Filme, Sessao, Duracao } from '../../models';

@Component({
  selector: 'app-filme-detalhes',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './filme-detalhes.html',
  styleUrl: './filme-detalhes.scss',
})
export class FilmeDetalhes implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private filmeService = inject(FilmeService);
  private sessaoService = inject(SessaoService);

  filme = signal<Filme | null>(null);
  sessoes = signal<Sessao[]>([]);
  loading = signal(false);
  loadingSessoes = signal(false);

  ngOnInit(): void {
    const filmeId = this.route.snapshot.paramMap.get('id');
    if (filmeId) {
      this.loadFilme(Number(filmeId));
      this.loadSessoes(Number(filmeId));
    }
  }

  private loadFilme(id: number): void {
    this.loading.set(true);
    this.filmeService.getFilmeById(id).subscribe({
      next: (filme) => {
        this.filme.set(filme);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar filme:', error);
        this.loading.set(false);
      },
    });
  }

  private loadSessoes(filmeId: number): void {
    this.loadingSessoes.set(true);
    this.sessaoService.getSessoesByFilme(filmeId).subscribe({
      next: (sessoes) => {
        this.sessoes.set(sessoes);
        this.loadingSessoes.set(false);
      },
      error: (error) => {
        console.error('Erro ao carregar sessões:', error);
        this.loadingSessoes.set(false);
      },
    });
  }

  selecionarSessao(sessao: Sessao): void {
    // Navegar para página de pagamento com os dados da sessão
    this.router.navigate(['/pagamento'], {
      queryParams: {
        sessaoId: sessao.id,
        filmeId: sessao.filmeId,
      },
    });
  }

  formatDuracao(duracao: Duracao): string {
    if (!duracao) return '';
    const hour = duracao.hour ?? 0;
    const minute = duracao.minute ?? 0;
    const totalMinutos = hour * 60 + minute;
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;

    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos}min`;
  }

  formatarData(dataHora: string): string {
    const data = new Date(dataHora);
    return data.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  formatarHora(dataHora: string): string {
    const data = new Date(dataHora);
    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  voltarHome(): void {
    this.router.navigate(['/home']);
  }
}
