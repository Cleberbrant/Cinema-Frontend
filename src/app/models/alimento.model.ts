export enum TipoAlimento {
  COMBO = 'COMBO',
  BEBIDA = 'BEBIDA',
  DOCE = 'DOCE',
  SALGADO = 'SALGADO',
}

export interface Alimento {
  id?: number;
  nome: string;
  tipo: TipoAlimento;
  preco: number;
  descricao: string;
}
