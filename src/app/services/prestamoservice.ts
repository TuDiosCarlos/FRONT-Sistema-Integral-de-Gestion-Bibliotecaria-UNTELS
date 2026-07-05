import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Prestamo } from '../models/prestamo';

@Injectable({
  providedIn: 'root',
})
export class Prestamoservice {
  private url = `${environment.baseUrl}/api/prestamos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.url}/lista`);
  }

  buscarPorId(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.url}/${id}`);
  }

  // estado: solicitado | vigente | rechazado | devuelto | vencido
  listarPorEstado(estado: string): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.url}/estado/${estado}`);
  }

  buscarPorEstudiante(idEstudiante: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.url}/estudiante/${idEstudiante}`);
  }

  solicitar(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.url}/solicitar`, prestamo);
  }

  aprobar(idPrestamo: number): Observable<string> {
    return this.http.put<string>(`${this.url}/aprobar/${idPrestamo}`, {});
  }

  rechazar(idPrestamo: number, motivo: string): Observable<string> {
    const params = new HttpParams().set('motivo', motivo);
    return this.http.put<string>(`${this.url}/rechazar/${idPrestamo}`, {}, { params });
  }

  devolver(idPrestamo: number, estadoDevolucion: string, observacionesDev: string): Observable<string> {
    return this.http.put<string>(`${this.url}/devolver`, {
      idPrestamo,
      estadoDevolucion,
      observacionesDev,
    });
  }
}
