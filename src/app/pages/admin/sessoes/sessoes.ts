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
import {
  Sessao,
  Filme,
  Sala,
  CreateSessaoRequest,
  UpdateSessaoRequest,
} from '../../../models';

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
      filmeId: ['', [Validators.required, Validators.min(1)]],
      salaId: ['', [Validators.required, Validators.min(1)]],
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
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadSessoes() {
    try {
      this.sessaoService.getSessoes().subscribe({
        next: (sessoes) => {
          console.log('Sessões carregadas:', sessoes);
          this.sessoes.set(sessoes);
          this.loading.set(false); // Garantir que o loading seja desabilitado
        },
        error: (error) => {
          console.error('Erro ao carregar sessões:', error);
          if (error.status === 404) {
            console.log('Nenhuma sessão encontrada, definindo array vazio');
            this.sessoes.set([]);
          } else {
            this.toastr.error('Erro ao carregar sessões', 'Erro');
          }
          this.loading.set(false); // Garantir que o loading seja desabilitado mesmo em caso de erro
        },
      });
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      this.toastr.error('Erro ao carregar sessões', 'Erro');
      this.loading.set(false); // Garantir que o loading seja desabilitado
    }
  }

  async loadFilmes() {
    try {
      this.filmeService.getFilmes().subscribe({
        next: (filmes) => {
          console.log('Filmes carregados:', filmes);
          // Filtrar apenas filmes em cartaz
          const filmesEmCartaz = filmes.filter(
            (filme) => filme.emCartaz !== false
          );
          this.filmes.set(filmesEmCartaz);
        },
        error: (error) => {
          console.error('Erro ao carregar filmes:', error);
          this.toastr.error('Erro ao carregar filmes', 'Erro');
        },
      });
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      this.toastr.error('Erro ao carregar filmes', 'Erro');
    }
  }

  async loadSalas() {
    try {
      this.salaService.getSalas().subscribe({
        next: (salas) => {
          console.log('Salas carregadas:', salas);
          this.salas.set(salas);
        },
        error: (error) => {
          console.error('Erro ao carregar salas:', error);
          this.toastr.error('Erro ao carregar salas', 'Erro');
        },
      });
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      this.toastr.error('Erro ao carregar salas', 'Erro');
    }
  }

  openForm(sessao?: Sessao) {
    if (sessao) {
      console.log('Editando sessão:', sessao);
      this.editingSessao.set(sessao);

      // Converter a data para o formato datetime-local
      let dataFormatada = '';
      if (sessao.dataHoraSessao) {
        const data = new Date(sessao.dataHoraSessao);
        // Formato datetime-local: YYYY-MM-DDTHH:mm
        dataFormatada = data.toISOString().slice(0, 16);
      }

      this.sessaoForm.patchValue({
        filmeId: sessao.filmeId,
        salaId: sessao.salaId,
        dataHoraSessao: dataFormatada,
      });

      console.log('Form values after patch:', this.sessaoForm.value);
    } else {
      console.log('Criando nova sessão');
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
    console.log('=== INICIANDO SAVE SESSAO ===');
    console.log('Form valid:', this.sessaoForm.valid);
    console.log('Form value:', this.sessaoForm.value);

    if (this.sessaoForm.valid) {
      this.loading.set(true);
      try {
        const formValue = { ...this.sessaoForm.value };
        console.log('Form value before processing:', formValue);

        // Validar se os IDs são números válidos
        const filmeId = Number(formValue.filmeId);
        const salaId = Number(formValue.salaId);

        console.log('IDs processados:', { filmeId, salaId });

        if (!filmeId || filmeId <= 0) {
          console.error('Filme ID inválido:', filmeId);
          this.toastr.error('Filme inválido selecionado', 'Erro');
          this.loading.set(false);
          return;
        }

        if (!salaId || salaId <= 0) {
          console.error('Sala ID inválida:', salaId);
          this.toastr.error('Sala inválida selecionada', 'Erro');
          this.loading.set(false);
          return;
        }

        // Verificar se dataHoraSessao é uma string ou objeto Date
        let dataHoraSessao: string;
        if (formValue.dataHoraSessao instanceof Date) {
          dataHoraSessao = formValue.dataHoraSessao.toISOString();
        } else if (
          typeof formValue.dataHoraSessao === 'string' &&
          formValue.dataHoraSessao
        ) {
          // Para inputs datetime-local, o formato é YYYY-MM-DDTHH:mm
          // Converter para formato que o backend Java aceita
          const data = new Date(formValue.dataHoraSessao);
          if (isNaN(data.getTime())) {
            console.error('Data inválida:', formValue.dataHoraSessao);
            this.toastr.error('Data e hora inválidas', 'Erro');
            this.loading.set(false);
            return;
          }
          // Formato ISO sem milissegundos e com timezone UTC
          dataHoraSessao = data.toISOString().slice(0, 19);
        } else {
          console.error('Data não fornecida:', formValue.dataHoraSessao);
          this.toastr.error('Data e hora são obrigatórias', 'Erro');
          this.loading.set(false);
          return;
        }

        console.log('Data processada:', dataHoraSessao);

        // Verificar se a data não é no passado
        const agora = new Date();
        const dataSessao = new Date(dataHoraSessao);
        console.log('Comparação de datas:', {
          agora,
          dataSessao,
          isFuture: dataSessao > agora,
        });

        if (dataSessao <= agora) {
          this.toastr.error('A data da sessão deve ser no futuro', 'Erro');
          this.loading.set(false);
          return;
        }

        const sessaoData: CreateSessaoRequest = {
          filmeId: filmeId,
          salaId: salaId,
          dataHoraSessao: dataHoraSessao,
        };

        console.log('Dados finais da sessão:', sessaoData);

        if (this.editingSessao()) {
          console.log('=== EDITANDO SESSAO ===');
          const updateData: UpdateSessaoRequest = sessaoData;
          this.sessaoService
            .updateSessao(this.editingSessao()!.id!, updateData)
            .subscribe({
              next: (response) => {
                console.log('Update response:', response);
                this.loading.set(false); // Desabilitar loading primeiro
                this.toastr.success(
                  'Sessão atualizada com sucesso!',
                  'Sucesso'
                );
                this.closeForm();
                // Recarregar sessões sem mexer no loading global
                this.sessaoService.getSessoes().subscribe({
                  next: (sessoes) => this.sessoes.set(sessoes),
                  error: (error) =>
                    console.error('Erro ao recarregar sessões:', error),
                });
              },
              error: (error) => {
                console.error('Erro ao atualizar sessão:', error);
                this.toastr.error('Erro ao atualizar sessão', 'Erro');
                this.loading.set(false);
              },
            });
        } else {
          console.log('=== CRIANDO NOVA SESSAO ===');
          this.sessaoService.createSessao(sessaoData).subscribe({
            next: (response) => {
              console.log('Create response:', response);
              this.loading.set(false); // Desabilitar loading primeiro
              this.toastr.success('Sessão criada com sucesso!', 'Sucesso');
              this.closeForm();
              // Recarregar sessões sem mexer no loading global
              this.sessaoService.getSessoes().subscribe({
                next: (sessoes) => this.sessoes.set(sessoes),
                error: (error) =>
                  console.error('Erro ao recarregar sessões:', error),
              });
            },
            error: (error) => {
              console.error('=== ERRO AO CRIAR SESSAO ===');
              console.error('Error object:', error);
              console.error('Error details:', {
                status: error.status,
                statusText: error.statusText,
                message: error.message,
                error: error.error,
                url: error.url,
              });

              if (error.error && typeof error.error === 'object') {
                console.error('Backend error details:', error.error);
              }

              if (error.status === 500) {
                this.toastr.error(
                  'Erro interno do servidor. Verifique os dados e tente novamente.',
                  'Erro'
                );
              } else if (error.status === 400) {
                this.toastr.error(
                  'Dados inválidos. Verifique os campos.',
                  'Erro'
                );
              } else if (error.status === 409) {
                this.toastr.error(
                  'Conflito: Sessão já existe neste horário.',
                  'Erro'
                );
              } else {
                this.toastr.error('Erro ao criar sessão', 'Erro');
              }
              this.loading.set(false);
            },
          });
        }
      } catch (error) {
        console.error('Erro geral ao salvar sessão:', error);
        this.toastr.error('Erro ao salvar sessão', 'Erro');
        this.loading.set(false);
      }
    } else {
      console.log('=== FORM INVÁLIDO ===');
      console.log('Form errors:', this.sessaoForm.errors);
      Object.keys(this.sessaoForm.controls).forEach((key) => {
        const control = this.sessaoForm.get(key);
        if (control && control.invalid) {
          console.log(`${key} errors:`, control.errors);
        }
      });
      this.toastr.error('Preencha todos os campos obrigatórios', 'Erro');
    }
  }

  async deleteSessao(sessao: Sessao) {
    const filmeNome = this.getFilmeNome(sessao.filmeId);
    if (confirm(`Deseja realmente excluir a sessão do filme "${filmeNome}"?`)) {
      this.loading.set(true);
      try {
        this.sessaoService.deleteSessao(sessao.id!).subscribe({
          next: (response) => {
            console.log('Delete response:', response);
            this.loading.set(false); // Desabilitar loading primeiro
            this.toastr.success('Sessão excluída com sucesso!', 'Sucesso');
            // Recarregar sessões sem mexer no loading global
            this.sessaoService.getSessoes().subscribe({
              next: (sessoes) => this.sessoes.set(sessoes),
              error: (error) =>
                console.error('Erro ao recarregar sessões:', error),
            });
          },
          error: (error) => {
            console.error('Erro ao excluir sessão:', error);
            if (error.status === 404) {
              this.toastr.error('Sessão não encontrada', 'Erro');
            } else if (error.status === 403) {
              this.toastr.error('Acesso negado', 'Erro');
            } else if (error.status === 401) {
              this.toastr.error('Não autorizado', 'Erro');
            } else {
              this.toastr.error('Erro ao excluir sessão', 'Erro');
            }
            this.loading.set(false);
          },
        });
      } catch (error) {
        console.error('Erro ao excluir sessão:', error);
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

  getCurrentDateTime(): string {
    const agora = new Date();
    // Adicionar 1 hora para dar uma margem
    agora.setHours(agora.getHours() + 1);
    // Formato YYYY-MM-DDTHH:mm para datetime-local
    return agora.toISOString().slice(0, 16);
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
