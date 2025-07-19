import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Filme } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FilmeService {
  private apiUrl = `${environment.apiUrl}/filmes`;

  constructor(private http: HttpClient) {}

  getFilmes(): Observable<Filme[]> {
    return this.http.get<Filme[]>(this.apiUrl);
  }

  getFilmeById(id: number): Observable<Filme> {
    return this.http.get<Filme>(`${this.apiUrl}/${id}`);
  }

  getFilmesEmCartaz(status: boolean = true): Observable<Filme[]> {
    const url = `${this.apiUrl}/em-cartaz/${status}`;
    console.log('Chamando endpoint de filmes em cartaz:', url); // Log adicionado
    return this.http.get<Filme[]>(url);
  }

  createFilme(filme: Filme): Observable<Filme> {
    return this.http.post<Filme>(this.apiUrl, filme);
  }

  updateFilme(id: number, filme: Filme): Observable<Filme> {
    return this.http.put<Filme>(`${this.apiUrl}/${id}`, filme);
  }

  deleteFilme(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
