export interface Pagamento {
  numeroDoCartao: string;
  nomeImpresso: string;
  dataDeValidade: string;
  codigoDeSeguranca: string;
  valorTotal: number;
  filmeId: number;
  alimentosIds: number[];
}
