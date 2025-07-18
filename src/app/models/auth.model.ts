import { Localidade } from './localidade.model';

export interface User {
  id?: number;
  nome: string;
  dataNascimento: string;
  cpf: string;
  email: string;
  password?: string;
  role: string;
  localidade: Localidade;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  nome: string;
  dataNascimento: string;
  cpf: string;
  email: string;
  password: string;
  role: string;
  localidade: {
    id?: number;
    endereco: string;
    cep: string;
    referencia: string;
  };
}
