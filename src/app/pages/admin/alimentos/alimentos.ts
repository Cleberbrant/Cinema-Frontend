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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';

import { AlimentoService } from '../../../services/alimento.service';
import { Alimento, TipoAlimento } from '../../../models';

@Component({
  selector: 'app-admin-alimentos',
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
    MatCheckboxModule,
  ],
  templateUrl: './alimentos.html',
  styleUrl: './alimentos.scss',
})
export class AdminAlimentos implements OnInit {
  alimentos = signal<Alimento[]>([]);
  loading = signal(false);
  editingAlimento = signal<Alimento | null>(null);
  showForm = signal(false);

  alimentoForm: FormGroup;
  displayedColumns: string[] = ['nome', 'tipo', 'preco', 'actions'];

  tiposAlimento = Object.values(TipoAlimento);

  constructor(
    private alimentoService: AlimentoService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.alimentoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      preco: ['', [Validators.required, Validators.min(0.01)]],
      tipo: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadAlimentos();
  }

  async loadAlimentos() {
    this.loading.set(true);
    try {
      this.alimentoService.getAlimentos().subscribe({
        next: (alimentos) => {
          console.log('Alimentos loaded:', alimentos);
          this.alimentos.set(alimentos);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Erro ao carregar alimentos:', error);
          this.toastr.error('Erro ao carregar alimentos', 'Erro');
          this.loading.set(false);
        },
      });
    } catch (error) {
      console.error('Erro ao carregar alimentos:', error);
      this.toastr.error('Erro ao carregar alimentos', 'Erro');
      this.loading.set(false);
    }
  }

  openForm(alimento?: Alimento) {
    if (alimento) {
      this.editingAlimento.set(alimento);
      this.alimentoForm.patchValue({
        nome: alimento.nome,
        descricao: alimento.descricao,
        preco: alimento.preco,
        tipo: alimento.tipo,
      });
    } else {
      this.editingAlimento.set(null);
      this.alimentoForm.reset();
    }
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingAlimento.set(null);
    this.alimentoForm.reset();
  }

  async saveAlimento() {
    if (this.alimentoForm.valid) {
      this.loading.set(true);
      try {
        const formValue = { ...this.alimentoForm.value };
        console.log('Form value:', formValue);

        if (this.editingAlimento()) {
          console.log(
            'Updating alimento:',
            this.editingAlimento()!.id!,
            formValue
          );
          this.alimentoService
            .updateAlimento(this.editingAlimento()!.id!, formValue)
            .subscribe({
              next: (response) => {
                console.log('Alimento updated successfully:', response);
                this.loading.set(false);
                this.toastr.success(
                  'Alimento atualizado com sucesso!',
                  'Sucesso'
                );
                this.closeForm();
                this.loadAlimentos();
              },
              error: (error) => {
                console.error('Erro ao atualizar alimento:', error);
                this.toastr.error('Erro ao atualizar alimento', 'Erro');
                this.loading.set(false);
              },
            });
        } else {
          console.log('Creating alimento:', formValue);
          this.alimentoService.createAlimento(formValue).subscribe({
            next: (response) => {
              console.log('Alimento created successfully:', response);
              this.loading.set(false);
              this.toastr.success('Alimento criado com sucesso!', 'Sucesso');
              this.closeForm();
              this.loadAlimentos();
            },
            error: (error) => {
              console.error('Erro ao criar alimento:', error);
              this.toastr.error('Erro ao criar alimento', 'Erro');
              this.loading.set(false);
            },
          });
        }
      } catch (error) {
        console.error('Erro ao salvar alimento:', error);
        this.toastr.error('Erro ao salvar alimento', 'Erro');
        this.loading.set(false);
      }
    }
  }

  async deleteAlimento(alimento: Alimento) {
    if (confirm(`Deseja realmente excluir o alimento "${alimento.nome}"?`)) {
      this.loading.set(true);
      try {
        console.log('Deleting alimento:', alimento.id);
        this.alimentoService.deleteAlimento(alimento.id!).subscribe({
          next: () => {
            console.log('Alimento deleted successfully');
            this.loading.set(false);
            this.toastr.success('Alimento excluído com sucesso!', 'Sucesso');
            this.loadAlimentos();
          },
          error: (error) => {
            console.error('Erro ao excluir alimento:', error);
            this.toastr.error('Erro ao excluir alimento', 'Erro');
            this.loading.set(false);
          },
        });
      } catch (error) {
        console.error('Erro ao excluir alimento:', error);
        this.toastr.error('Erro ao excluir alimento', 'Erro');
        this.loading.set(false);
      }
    }
  }

  getErrorMessage(field: string): string {
    const control = this.alimentoForm.get(field);
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
    return '';
  }
}
