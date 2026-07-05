import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Notificacion } from '../models/notificacion';

@Injectable({ providedIn: 'root' })
export class Notificacionservice {
  private url = `${environment.baseUrl}/api/notificaciones`;

  constructor(private http: HttpClient) {}

  buscarPorEstudiante(idEstudiante: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/estudiante/${idEstudiante}`);
  }

  buscarPendientes(idEstudiante: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.url}/estudiante/${idEstudiante}/pendientes`);
  }

  marcarLeidas(idEstudiante: number): Observable<string> {
    return this.http.put<string>(`${this.url}/marcar-leidas/${idEstudiante}`, {});
  }
}
