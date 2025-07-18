import { Localidade } from './localidade.model';

export interface Cinema {
  id?: number;
  nome: string;
  localidade: Localidade;
}
