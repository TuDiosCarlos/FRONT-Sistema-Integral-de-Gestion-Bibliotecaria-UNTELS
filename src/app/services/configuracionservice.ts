import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Configuracion } from '../models/configuracion';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private url = `${environment.baseUrl}/api/configuracion`;

  constructor(private http: HttpClient) {}

  obtener(): Observable<Configuracion> {
    return this.http.get<Configuracion>(this.url);
  }

  actualizar(config: Configuracion): Observable<string> {
    return this.http.put<string>(`${this.url}/actualiza`, config, { responseType: 'text' as 'json' });
  }
}
