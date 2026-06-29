import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Libro, LibroApiExterna } from '../models/libro';

@Injectable({ providedIn: 'root' })
export class Libroservice {
  private url = `${environment.baseUrl}/api/libros`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.url}/lista`);
  }

  buscarPorId(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.url}/${id}`);
  }

  buscarPorTitulo(titulo: string): Observable<Libro[]> {
    const params = new HttpParams().set('titulo', titulo);
    return this.http.get<Libro[]>(`${this.url}/buscar`, { params });
  }

  buscarPorCategoria(categoria: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.url}/categoria/${categoria}`);
  }

  registrar(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(`${this.url}/nuevo`, libro);
  }

  registrarPorIsbn(isbn: string): Observable<Libro> {
    const params = new HttpParams().set('isbn', isbn);
    return this.http.post<Libro>(`${this.url}/registrar-por-isbn`, null, { params });
  }

  actualizar(libro: Libro): Observable<string> {
    return this.http.put<string>(`${this.url}/actualiza`, libro);
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete<string>(`${this.url}/${id}`);
  }
}