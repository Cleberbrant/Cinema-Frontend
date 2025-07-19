import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Alimento } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AlimentoService {
  private apiUrl = `${environment.apiUrl}/alimentos`;
  private apiUrlSingular = `${environment.apiUrl}/alimento`; // Para testar endpoint singular

  constructor(private http: HttpClient) {}

  getAlimentos(): Observable<Alimento[]> {
    return this.http.get<Alimento[]>(this.apiUrl);
  }

  getAlimentoById(id: number): Observable<Alimento> {
    return this.http.get<Alimento>(`${this.apiUrl}/${id}`);
  }

  createAlimento(alimento: Alimento): Observable<Alimento> {
    console.log('AlimentoService - createAlimento called with:', alimento);
    return this.http.post<Alimento>(this.apiUrl, alimento);
  }

  updateAlimento(id: number, alimento: Alimento): Observable<Alimento> {
    const url = `${this.apiUrlSingular}/${id}`;
    console.log('AlimentoService - updateAlimento called with:', {
      id,
      alimento,
    });
    console.log('AlimentoService - full URL (singular):', url);
    console.log('AlimentoService - apiUrl:', this.apiUrl);
    return this.http.put<Alimento>(url, alimento);
  }

  deleteAlimento(id: number): Observable<void> {
    console.log('AlimentoService - deleteAlimento called with id:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
