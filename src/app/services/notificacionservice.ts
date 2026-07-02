import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Notificacion } from '../models/notificacion';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private http = inject(HttpClient);

  private url = `${environment.baseUrl}/api/notificaciones`;

  constructor() { }

  buscarPorEstudiante(
    idEstudiante: number
  ): Observable<Notificacion[]> {

    return this.http.get<Notificacion[]>(
      `${this.url}/estudiante/${idEstudiante}`
    );

  }

  buscarPendientes(
    idEstudiante: number
  ): Observable<Notificacion[]> {

    return this.http.get<Notificacion[]>(
      `${this.url}/estudiante/${idEstudiante}/pendientes`
    );

  }

  marcarLeidas(
    idEstudiante: number
  ): Observable<string> {

    return this.http.put(
      `${this.url}/marcar-leidas/${idEstudiante}`,
      {},
      {
        responseType: 'text'
      }
    );

  }

}