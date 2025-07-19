import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cinema } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  private apiUrl = `${environment.apiUrl}/cinemas`;

  constructor(private http: HttpClient) {}

  getCinemas(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(this.apiUrl);
  }

  getCinemaById(id: number): Observable<Cinema> {
    return this.http.get<Cinema>(`${this.apiUrl}/${id}`);
  }

  createCinema(cinema: any): Observable<Cinema> {
    return this.http.post<Cinema>(this.apiUrl, cinema);
  }

  updateCinema(id: number, cinema: any): Observable<Cinema> {
    return this.http.put<Cinema>(`${this.apiUrl}/${id}`, cinema);
  }

  deleteCinema(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
