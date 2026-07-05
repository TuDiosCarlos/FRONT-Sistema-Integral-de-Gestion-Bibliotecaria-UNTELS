import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Sancion } from '../models/sancion';

@Injectable({ providedIn: 'root' })
export class Sancionservice {
  private url = `${environment.baseUrl}/api/sanciones`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Sancion[]> {
    return this.http.get<Sancion[]>(`${this.url}/lista`);
  }

  buscarPorEstado(estado: string): Observable<Sancion[]> {
    return this.http.get<Sancion[]>(`${this.url}/estado/${estado}`);
  }

  buscarPorEstudiante(idEstudiante: number): Observable<Sancion[]> {
    return this.http.get<Sancion[]>(`${this.url}/estudiante/${idEstudiante}`);
  }

  cumplir(idSancion: number): Observable<string> {
    return this.http.put<string>(`${this.url}/cumplir/${idSancion}`, {});
  }
}
