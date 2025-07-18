import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sessao } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SessaoService {
  private apiUrl = `${environment.apiUrl}/sessoes`;

  constructor(private http: HttpClient) {}

  getSessoes(): Observable<Sessao[]> {
    return this.http.get<Sessao[]>(this.apiUrl);
  }

  getSessaoById(id: number): Observable<Sessao> {
    return this.http.get<Sessao>(`${this.apiUrl}/${id}`);
  }

  getSessoesByFilme(filmeId: number): Observable<Sessao[]> {
    return this.http.get<Sessao[]>(`${this.apiUrl}/filme/${filmeId}`);
  }

  createSessao(sessao: Sessao): Observable<Sessao> {
    return this.http.post<Sessao>(this.apiUrl, sessao);
  }

  updateSessao(id: number, sessao: Sessao): Observable<Sessao> {
    return this.http.put<Sessao>(`${this.apiUrl}/${id}`, sessao);
  }

  deleteSessao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
