import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';

import { SessaoService } from '../../../services/sessao.service';
import { FilmeService } from '../../../services/filme.service';
import { SalaService } from '../../../services/sala.service';
import { Sessao, Filme, Sala } from '../../../models';

@Component({
  selector: 'app-admin-sessoes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './sessoes.html',
  styleUrl: './sessoes.scss',
})
export class AdminSessoes implements OnInit {
  sessoes = signal<Sessao[]>([]);
  filmes = signal<Filme[]>([]);
  salas = signal<Sala[]>([]);
  loading = signal(false);
  editingSessao = signal<Sessao | null>(null);
  showForm = signal(false);

  sessaoForm: FormGroup;
  displayedColumns: string[] = ['filme', 'sala', 'dataHoraSessao', 'actions'];

  constructor(
    private sessaoService: SessaoService,
    private filmeService: FilmeService,
    private salaService: SalaService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.sessaoForm = this.fb.group({
      filmeId: ['', Validators.required],
      salaId: ['', Validators.required],
      dataHoraSessao: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    try {
      await Promise.all([
        this.loadSessoes(),
        this.loadFilmes(),
        this.loadSalas(),
      ]);
    } finally {
      this.loading.set(false);
    }
  }

  async loadSessoes() {
    try {
      this.sessaoService.getSessoes().subscribe({
        next: (sessoes) => {
          this.sessoes.set(sessoes);
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar sessões', 'Erro');
        },
      });
    } catch (error) {
      this.toastr.error('Erro ao carregar sessões', 'Erro');
    }
  }

  async loadFilmes() {
    try {
      this.filmeService.getFilmes().subscribe({
        next: (filmes) => {
          this.filmes.set(filmes);
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar filmes', 'Erro');
        },
      });
    } catch (error) {
      this.toastr.error('Erro ao carregar filmes', 'Erro');
    }
  }

  async loadSalas() {
    try {
      this.salaService.getSalas().subscribe({
        next: (salas) => {
          this.salas.set(salas);
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar salas', 'Erro');
        },
      });
    } catch (error) {
      this.toastr.error('Erro ao carregar salas', 'Erro');
    }
  }

  openForm(sessao?: Sessao) {
    if (sessao) {
      this.editingSessao.set(sessao);
      this.sessaoForm.patchValue({
        filmeId: sessao.filmeId,
        salaId: sessao.salaId,
        dataHoraSessao: new Date(sessao.dataHoraSessao),
      });
    } else {
      this.editingSessao.set(null);
      this.sessaoForm.reset();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingSessao.set(null);
    this.sessaoForm.reset();
  }

  async saveSessao() {
    if (this.sessaoForm.valid) {
      this.loading.set(true);
      try {
        const formValue = { ...this.sessaoForm.value };
        formValue.dataHoraSessao = formValue.dataHoraSessao.toISOString();

        if (this.editingSessao()) {
          this.sessaoService
            .updateSessao(this.editingSessao()!.id!, formValue)
            .subscribe({
              next: () => {
                this.toastr.success(
                  'Sessão atualizada com sucesso!',
                  'Sucesso'
                );
                this.closeForm();
                this.loadSessoes();
              },
              error: () => {
                this.toastr.error('Erro ao atualizar sessão', 'Erro');
                this.loading.set(false);
              },
            });
        } else {
          this.sessaoService.createSessao(formValue).subscribe({
            next: () => {
              this.toastr.success('Sessão criada com sucesso!', 'Sucesso');
              this.closeForm();
              this.loadSessoes();
            },
            error: () => {
              this.toastr.error('Erro ao criar sessão', 'Erro');
              this.loading.set(false);
            },
          });
        }
      } catch (error) {
        this.toastr.error('Erro ao salvar sessão', 'Erro');
        this.loading.set(false);
      }
    }
  }

  async deleteSessao(sessao: Sessao) {
    const filmeNome = this.getFilmeNome(sessao.filmeId);
    if (confirm(`Deseja realmente excluir a sessão do filme "${filmeNome}"?`)) {
      this.loading.set(true);
      try {
        this.sessaoService.deleteSessao(sessao.id!).subscribe({
          next: () => {
            this.toastr.success('Sessão excluída com sucesso!', 'Sucesso');
            this.loadSessoes();
          },
          error: () => {
            this.toastr.error('Erro ao excluir sessão', 'Erro');
            this.loading.set(false);
          },
        });
      } catch (error) {
        this.toastr.error('Erro ao excluir sessão', 'Erro');
        this.loading.set(false);
      }
    }
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('pt-BR');
  }

  getFilmeNome(filmeId: number): string {
    const filme = this.filmes().find((f) => f.id === filmeId);
    return filme ? filme.titulo : '';
  }

  getSalaNome(salaId: number): string {
    const sala = this.salas().find((s) => s.id === salaId);
    return sala ? `Sala ${sala.numeroDaSala}` : '';
  }

  getErrorMessage(field: string): string {
    const control = this.sessaoForm.get(field);
    if (control?.hasError('required')) {
      return `${field} é obrigatório`;
    }
    if (control?.hasError('min')) {
      return `${field} deve ser maior que ${control.getError('min').min}`;
    }
    return '';
  }
}
