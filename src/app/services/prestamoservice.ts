import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Prestamo } from '../models/prestamo';

@Injectable({
  providedIn: 'root',
})
export class Prestamoservice {
  private apiUrl = `${environment.baseUrl}/api/prestamos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/lista`);
  }

  listarPorEstado(estado: string): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/estado/${estado}`);
  }

  buscarPorEstudiante(idEstudiante: number): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/estudiante/${idEstudiante}`);
  }

  solicitar(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.apiUrl}/solicitar`, prestamo);
  }

  aprobar(idPrestamo: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/aprobar/${idPrestamo}`, {});
  }

  rechazar(idPrestamo: number, motivo: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/rechazar/${idPrestamo}`, { motivo });
  }

  devolver(
    idPrestamo: number,
    estadoDevolucion: string,
    observacionesDev: string,
  ): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/devolver`, {
      idPrestamo,
      estadoDevolucion,
      observacionesDev,
    });
  }
}
