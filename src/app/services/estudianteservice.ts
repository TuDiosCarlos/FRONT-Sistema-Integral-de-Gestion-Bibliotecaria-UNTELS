import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Student, StudentDTO } from '../models/student';
import { Page } from '../models/page';


@Injectable({ providedIn: 'root' })
export class Estudianteservice {
  private url = `${environment.baseUrl}/students`;

  constructor(private http: HttpClient) {}

  registrar(dto: StudentDTO): Observable<Student> {
    return this.http.post<Student>(this.url, dto);
  }

  listar(page: number = 0, size: number = 10): Observable<Page<Student>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<Page<Student>>(this.url, { params });
  }

  actualizar(id: number, dto: StudentDTO): Observable<Student> {
    return this.http.put<Student>(`${this.url}/${id}`, dto);
  }

  toggleEstado(id: number): Observable<Student> {
    return this.http.patch<Student>(`${this.url}/${id}/toggle`, {});
  }

  buscarPorDni(dni: string): Observable<Student> {
    return this.http.get<Student>(`${this.url}/dni/${dni}`);
  }

  buscarPorCodigo(codigo: string): Observable<Student> {
    return this.http.get<Student>(`${this.url}/codigo/${codigo}`);
  }

  filtrarPorCarrera(carreraId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}/carrera/${carreraId}`);
  }

  filtrarPorEstado(estado: boolean): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}/estado/${estado}`);
  }
}