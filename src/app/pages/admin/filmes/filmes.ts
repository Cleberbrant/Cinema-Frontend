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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { ToastrService } from 'ngx-toastr';

import { FilmeService } from '../../../services/filme.service';
import { Filme, Genero } from '../../../models';

@Component({
  selector: 'app-admin-filmes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatToolbarModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatMenuModule,
  ],
  templateUrl: './filmes.html',
  styleUrl: './filmes.scss',
})
export class AdminFilmes implements OnInit {
  filmes = signal<Filme[]>([]);
  loading = signal(false);
  editingFilme = signal<Filme | null>(null);
  showForm = signal(false);

  filmeForm: FormGroup;
  displayedColumns: string[] = [
    'posterUrl',
    'titulo',
    'genero',
    'duracao',
    'valorIngresso',
    'emCartaz',
    'actions',
  ];

  generos = Object.values(Genero);

  constructor(
    private filmeService: FilmeService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.filmeForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(2)]],
      sinopse: ['', [Validators.required, Validators.minLength(10)]],
      genero: ['', Validators.required],
      duracao: this.fb.group({
        hour: [0, [Validators.required, Validators.min(0)]],
        minute: [
          0,
          [Validators.required, Validators.min(0), Validators.max(59)],
        ],
        second: [0],
        nano: [0],
      }),
      diretor: ['', Validators.required],
      valorIngresso: ['', [Validators.required, Validators.min(0)]],
      emCartaz: [false],
      posterUrl: [''],
    });
  }

  ngOnInit() {
    this.loadFilmes();
  }

  async loadFilmes() {
    this.loading.set(true);
    try {
      this.filmeService.getFilmes().subscribe({
        next: (filmes) => {
          this.filmes.set(filmes);
          this.loading.set(false);
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar filmes', 'Erro');
          this.loading.set(false);
        },
      });
    } catch (error) {
      this.toastr.error('Erro ao carregar filmes', 'Erro');
      this.loading.set(false);
    }
  }

  openForm(filme?: Filme) {
    if (filme) {
      this.editingFilme.set(filme);
      this.filmeForm.patchValue({
        titulo: filme.titulo,
        sinopse: filme.sinopse,
        genero: filme.genero,
        duracao: filme.duracao,
        diretor: filme.diretor,
        valorIngresso: filme.valorIngresso,
        emCartaz: filme.emCartaz,
        posterUrl: filme.posterUrl,
      });
    } else {
      this.editingFilme.set(null);
      this.filmeForm.reset();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingFilme.set(null);
    this.filmeForm.reset();
  }

  async saveFilme() {
    if (this.filmeForm.valid) {
      this.loading.set(true);
      try {
        const formValue = { ...this.filmeForm.value };

        if (this.editingFilme()) {
          this.filmeService
            .updateFilme(this.editingFilme()!.id!, formValue)
            .subscribe({
              next: () => {
                this.toastr.success('Filme atualizado com sucesso!', 'Sucesso');
                this.closeForm();
                this.loadFilmes();
              },
              error: () => {
                this.toastr.error('Erro ao atualizar filme', 'Erro');
                this.loading.set(false);
              },
            });
        } else {
          this.filmeService.createFilme(formValue).subscribe({
            next: () => {
              this.toastr.success('Filme criado com sucesso!', 'Sucesso');
              this.closeForm();
              this.loadFilmes();
            },
            error: () => {
              this.toastr.error('Erro ao criar filme', 'Erro');
              this.loading.set(false);
            },
          });
        }
      } catch (error) {
        this.toastr.error('Erro ao salvar filme', 'Erro');
        this.loading.set(false);
      }
    }
  }

  async deleteFilme(filme: Filme) {
    if (confirm(`Deseja realmente excluir o filme "${filme.titulo}"?`)) {
      this.loading.set(true);
      try {
        this.filmeService.deleteFilme(filme.id!).subscribe({
          next: () => {
            this.toastr.success('Filme excluído com sucesso!', 'Sucesso');
            this.loadFilmes();
          },
          error: () => {
            this.toastr.error('Erro ao excluir filme', 'Erro');
            this.loading.set(false);
          },
        });
      } catch (error) {
        this.toastr.error('Erro ao excluir filme', 'Erro');
        this.loading.set(false);
      }
    }
  }

  formatDuration(duracao: any): string {
    if (!duracao) return '';
    return `${duracao.hour}h${duracao.minute.toString().padStart(2, '0')}min`;
  }

  getErrorMessage(field: string): string {
    const control = this.filmeForm.get(field);
    if (control?.hasError('required')) {
      return `${field} é obrigatório`;
    }
    if (control?.hasError('minlength')) {
      return `${field} deve ter pelo menos ${
        control.getError('minlength').requiredLength
      } caracteres`;
    }
    if (control?.hasError('min')) {
      return `${field} deve ser maior que ${control.getError('min').min}`;
    }
    if (control?.hasError('max')) {
      return `${field} deve ser menor que ${control.getError('max').max}`;
    }
    return '';
  }
}
