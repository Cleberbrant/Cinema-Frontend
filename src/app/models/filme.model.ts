export interface Duracao {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export enum Genero {
  ACAO = 'ACAO',
  AVENTURA = 'AVENTURA',
  COMEDIA = 'COMEDIA',
  DRAMA = 'DRAMA',
  TERROR = 'TERROR',
  FICCAO_CIENTIFICA = 'FICCAO_CIENTIFICA',
  ROMANCE = 'ROMANCE',
  ANIMACAO = 'ANIMACAO',
  DOCUMENTARIO = 'DOCUMENTARIO',
  SUSPENSE = 'SUSPENSE',
}

export interface Filme {
  id?: number;
  titulo: string;
  duracao: Duracao;
  sinopse: string;
  genero: Genero;
  diretor: string;
  valorIngresso: number;
  emCartaz: boolean;
  posterUrl?: string;
}
