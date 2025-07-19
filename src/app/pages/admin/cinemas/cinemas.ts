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
import { ToastrService } from 'ngx-toastr';

import { CinemaService } from '../../../services/cinema.service';
import { LocalidadeService } from '../../../services/localidade.service';
import { Cinema, Localidade } from '../../../models';

@Component({
  selector: 'app-admin-cinemas',
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
  ],
  templateUrl: './cinemas.html',
  styleUrl: './cinemas.scss',
})
export class AdminCinemas implements OnInit {
  cinemas = signal<Cinema[]>([]);
  localidades = signal<Localidade[]>([]);
  loading = signal(false);
  editingCinema = signal<Cinema | null>(null);
  showForm = signal(false);

  cinemaForm: FormGroup;
  displayedColumns: string[] = ['nome', 'localidade', 'actions'];

  constructor(
    private cinemaService: CinemaService,
    private localidadeService: LocalidadeService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.cinemaForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      localidadeId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.loading.set(true);
    try {
      await Promise.all([this.loadCinemas(), this.loadLocalidades()]);
    } finally {
      this.loading.set(false);
    }
  }

  async loadCinemas() {
    try {
      this.cinemaService.getCinemas().subscribe({
        next: (cinemas) => {
          this.cinemas.set(cinemas);
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar cinemas', 'Erro');
        },
      });
    } catch (error) {
      this.toastr.error('Erro ao carregar cinemas', 'Erro');
    }
  }

  async loadLocalidades() {
    try {
      this.localidadeService.getLocalidades().subscribe({
        next: (localidades) => {
          this.localidades.set(localidades);
        },
        error: (error) => {
          this.toastr.error('Erro ao carregar localidades', 'Erro');
        },
      });
    } catch (error) {
      this.toastr.error('Erro ao carregar localidades', 'Erro');
    }
  }

  openForm(cinema?: Cinema) {
    if (cinema) {
      this.editingCinema.set(cinema);
      this.cinemaForm.patchValue({
        nome: cinema.nome,
        localidadeId: cinema.localidade?.id || '',
      });
    } else {
      this.editingCinema.set(null);
      this.cinemaForm.reset();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingCinema.set(null);
    this.cinemaForm.reset();
  }

  async saveCinema() {
    if (this.cinemaForm.valid) {
      this.loading.set(true);
      try {
        const formValue = this.cinemaForm.value;
        console.log('Form value:', formValue);
        const selectedLocalidade = this.localidades().find(
          (l) => l.id === formValue.localidadeId
        );

        if (!selectedLocalidade) {
          this.toastr.error('Localidade não encontrada', 'Erro');
          this.loading.set(false);
          return;
        }

        const cinemaData = {
          nome: formValue.nome,
          localidade: selectedLocalidade,
        };

        console.log('Cinema data to send:', cinemaData);

        if (this.editingCinema()) {
          this.cinemaService
            .updateCinema(this.editingCinema()!.id!, cinemaData)
            .subscribe({
              next: (response) => {
                console.log('Cinema updated successfully:', response);
                this.loading.set(false);
                this.toastr.success(
                  'Cinema atualizado com sucesso!',
                  'Sucesso'
                );
                this.closeForm();
                this.loadCinemas();
              },
              error: (error) => {
                console.error('Erro ao atualizar cinema:', error);
                this.toastr.error('Erro ao atualizar cinema', 'Erro');
                this.loading.set(false);
              },
            });
        } else {
          this.cinemaService.createCinema(cinemaData).subscribe({
            next: (response) => {
              console.log('Cinema created successfully:', response);
              this.loading.set(false);
              this.toastr.success('Cinema criado com sucesso!', 'Sucesso');
              this.closeForm();
              this.loadCinemas();
            },
            error: (error) => {
              console.error('Erro ao criar cinema:', error);
              this.toastr.error('Erro ao criar cinema', 'Erro');
              this.loading.set(false);
            },
          });
        }
      } catch (error) {
        console.error('Erro ao salvar cinema:', error);
        this.toastr.error('Erro ao salvar cinema', 'Erro');
        this.loading.set(false);
      }
    }
  }

  async deleteCinema(cinema: Cinema) {
    if (confirm(`Deseja realmente excluir o cinema "${cinema.nome}"?`)) {
      this.loading.set(true);
      try {
        this.cinemaService.deleteCinema(cinema.id!).subscribe({
          next: () => {
            this.loading.set(false);
            this.toastr.success('Cinema excluído com sucesso!', 'Sucesso');
            this.loadCinemas();
          },
          error: (error) => {
            console.error('Erro ao excluir cinema:', error);
            this.toastr.error('Erro ao excluir cinema', 'Erro');
            this.loading.set(false);
          },
        });
      } catch (error) {
        console.error('Erro ao excluir cinema:', error);
        this.toastr.error('Erro ao excluir cinema', 'Erro');
        this.loading.set(false);
      }
    }
  }

  getLocalidadeNome(localidadeId: number): string {
    const localidade = this.localidades().find((l) => l.id === localidadeId);
    return localidade ? `${localidade.endereco} - ${localidade.cep}` : '';
  }

  getErrorMessage(field: string): string {
    const control = this.cinemaForm.get(field);
    if (control?.hasError('required')) {
      return `${field} é obrigatório`;
    }
    if (control?.hasError('minlength')) {
      return `${field} deve ter pelo menos ${
        control.getError('minlength').requiredLength
      } caracteres`;
    }
    if (control?.hasError('pattern')) {
      return 'Formato inválido. Use: (XX) XXXXX-XXXX';
    }
    return '';
  }
}
