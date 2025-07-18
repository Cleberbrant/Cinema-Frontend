import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models';

@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
  templateUrl: './registro.html',
  styleUrl: './registro.scss',
})
export class Registro {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registroForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  hidePassword = signal(true);

  constructor() {
    this.registroForm = this.fb.group({
      nome: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      localidade: this.fb.group({
        endereco: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        referencia: [''],
      }),
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const registerData: RegisterRequest = {
        ...this.registroForm.value,
        role: 'ROLE_USER', // Mudança aqui: USER -> ROLE_USER
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loading.set(false);
          this.successMessage.set(
            'Conta criada com sucesso! Redirecionando para o login...'
          );
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(
            error.error?.message || 'Erro ao criar conta. Tente novamente.'
          );
          console.error('Erro no registro:', error);
        },
      });
    }
  }

  buscarCep(): void {
    const cep = this.registroForm.get('localidade.cep')?.value;
    if (cep && cep.length === 9) {
      // Aqui você pode implementar a busca do CEP usando uma API como ViaCEP
      // Por exemplo: https://viacep.com.br/ws/${cep}/json/
      console.log('Buscar CEP:', cep);
    }
  }
}
