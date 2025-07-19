export interface Sessao {
  id?: number;
  dataHoraSessao: string;
  salaId: number;
  filmeId: number;
}

export interface CreateSessaoRequest {
  dataHoraSessao: string;
  salaId: number;
  filmeId: number;
}

export interface UpdateSessaoRequest {
  dataHoraSessao: string;
  salaId: number;
  filmeId: number;
}
