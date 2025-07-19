import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sessao, CreateSessaoRequest, UpdateSessaoRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SessaoService {
  private apiUrl = `${environment.apiUrl}/sessoes`;

  constructor(private http: HttpClient) {
    console.log('SessaoService initialized with apiUrl:', this.apiUrl);
  }

  getSessoes(): Observable<Sessao[]> {
    console.log('Getting sessoes from:', this.apiUrl);
    return this.http.get<Sessao[]>(this.apiUrl);
  }

  getSessaoById(id: number): Observable<Sessao> {
    console.log('Getting sessao by id:', id);
    return this.http.get<Sessao>(`${this.apiUrl}/${id}`);
  }

  getSessoesByFilme(filmeId: number): Observable<Sessao[]> {
    console.log('Getting sessoes by filme:', filmeId);
    return this.http.get<Sessao[]>(`${this.apiUrl}/filme/${filmeId}`);
  }

  createSessao(sessao: CreateSessaoRequest): Observable<Sessao> {
    console.log('Creating sessao with data:', sessao);

    // Verificar se a data está no formato correto
    const dataFormatada = new Date(sessao.dataHoraSessao);

    // Usar formato sem milissegundos para compatibilidade com Java
    const payload = {
      filmeId: Number(sessao.filmeId),
      salaId: Number(sessao.salaId),
      dataHoraSessao: dataFormatada.toISOString().slice(0, 19),
    };

    console.log('Final payload:', payload);
    return this.http.post<Sessao>(this.apiUrl, payload);
  }

  updateSessao(id: number, sessao: UpdateSessaoRequest): Observable<Sessao> {
    console.log('Updating sessao:', id, sessao);
    return this.http.put<Sessao>(`${this.apiUrl}/${id}`, sessao);
  }

  deleteSessao(id: number): Observable<void> {
    console.log('Deleting sessao:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
