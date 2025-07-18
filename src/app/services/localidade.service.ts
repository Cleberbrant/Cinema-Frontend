import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Localidade } from '../models';

@Injectable({
  providedIn: 'root',
})
export class LocalidadeService {
  private apiUrl = `${environment.apiUrl}/localidades`;

  constructor(private http: HttpClient) {}

  getLocalidades(): Observable<Localidade[]> {
    return this.http.get<Localidade[]>(this.apiUrl);
  }

  getLocalidadeById(id: number): Observable<Localidade> {
    return this.http.get<Localidade>(`${this.apiUrl}/${id}`);
  }

  createLocalidade(localidade: Localidade): Observable<Localidade> {
    return this.http.post<Localidade>(this.apiUrl, localidade);
  }

  updateLocalidade(id: number, localidade: Localidade): Observable<Localidade> {
    return this.http.put<Localidade>(`${this.apiUrl}/${id}`, localidade);
  }

  deleteLocalidade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
