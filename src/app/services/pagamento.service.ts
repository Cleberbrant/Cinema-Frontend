import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pagamento } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PagamentoService {
  private apiUrl = `${environment.apiUrl}/pagamentos`;

  constructor(private http: HttpClient) {}

  processarPagamento(pagamento: Pagamento): Observable<any> {
    return this.http.post(`${this.apiUrl}/processar`, pagamento);
  }
}
