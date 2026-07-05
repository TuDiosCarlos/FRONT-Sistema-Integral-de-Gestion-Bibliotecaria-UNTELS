import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Usuario, UsuarioDTO } from '../models/usuario';

const ROL_ESTUDIANTE = 'ESTUDIANTE';

@Injectable({ providedIn: 'root' })
export class Estudianteservice {
  private url = `${environment.baseUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/rol/${ROL_ESTUDIANTE}`);
  }

  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  buscar(texto: string): Observable<Usuario[]> {
    const params = new HttpParams().set('q', texto);
    return this.http.get<Usuario[]>(`${this.url}/buscar`, { params });
  }

  registrar(dto: UsuarioDTO): Observable<Usuario> {
    dto.rol = ROL_ESTUDIANTE;
    return this.http.post<Usuario>(`${this.url}/nuevo`, dto);
  }

  actualizar(dto: UsuarioDTO): Observable<string> {
    dto.rol = ROL_ESTUDIANTE;
    return this.http.put<string>(`${this.url}/actualiza`, dto, { responseType: 'text' as 'json' });
  }

  cambiarEstado(id: number): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.url}/${id}/estado`, {});
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`, { responseType: 'text' as 'json' });
  }
}
