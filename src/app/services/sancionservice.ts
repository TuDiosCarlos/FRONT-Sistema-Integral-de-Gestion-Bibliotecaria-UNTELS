import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Sancion } from '../models/sancion';

@Injectable({
  providedIn: 'root'
})
export class SancionService {

  private http = inject(HttpClient);

  private url = `${environment.baseUrl}/api/sanciones`;

  constructor() { }

  listar(): Observable<Sancion[]> {
    return this.http.get<Sancion[]>(
      `${this.url}/lista`
    );
  }

  buscarPorEstado(estado: string): Observable<Sancion[]> {
    return this.http.get<Sancion[]>(
      `${this.url}/estado/${estado}`
    );
  }

  buscarPorEstudiante(idEstudiante: number): Observable<Sancion[]> {
    return this.http.get<Sancion[]>(
      `${this.url}/estudiante/${idEstudiante}`
    );
  }

  cumplirSancion(idSancion: number): Observable<string> {
    return this.http.put(
      `${this.url}/cumplir/${idSancion}`,
      {},
      {
        responseType: 'text'
      }
    );
  }

}