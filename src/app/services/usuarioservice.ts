import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Usuario, UsuarioDTO } from '../models/usuario';

@Injectable({ providedIn: 'root' })
export class Usuarioservice {
  private url = `${environment.baseUrl}/api/usuarios`;

  constructor(private http: HttpClient) {}

  // GET /api/usuarios/lista
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/lista`);
  }

  // GET /api/usuarios/{id}
  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }

  // GET /api/usuarios/rol/{rol}
  buscarPorRol(rol: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.url}/rol/${rol}`);
  }

  // POST /api/usuarios/nuevo
  registrar(dto: UsuarioDTO): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.url}/nuevo`, dto);
  }

  // PUT /api/usuarios/actualiza
  actualizar(dto: UsuarioDTO): Observable<string> {
    return this.http.put<string>(`${this.url}/actualiza`, dto, { responseType: 'text' as 'json' });
  }

  // DELETE /api/usuarios/{id}
  eliminar(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`, { responseType: 'text' as 'json' });
  }
}
