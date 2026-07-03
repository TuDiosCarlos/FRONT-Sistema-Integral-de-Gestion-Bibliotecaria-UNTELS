import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Copia fiel a la Regla de Oro #4
import { Prestamo } from '../models/prestamo';

@Injectable({
  providedIn: 'root',
})
export class Prestamoservice {
  // Regla de Oro #4: Siempre usar environment.baseUrl. NUNCA http://localhost:8080 directo [cite: 21, 124]
  private apiUrl = `${environment.baseUrl}/api/prestamos`;

  constructor(private http: HttpClient) {}

  // Listar préstamos filtrados por estado (PENDIENTE, ACTIVO, VENCIDO, etc.)
  listarPorEstado(estado: string): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${this.apiUrl}/estado/${estado}`);
  }

  // Crear o solicitar un nuevo préstamo
  solicitar(prestamo: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(`${this.apiUrl}/solicitar`, prestamo);
  }

  // Aprobar una solicitud pendiente (Cambia el estado a ACTIVO) [cite: 45, 85, 88]
  aprobar(idPrestamo: number): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${idPrestamo}/aprobar`, {});
  }

  // Rechazar una solicitud pendiente (Cambia el estado a RECHAZADO) [cite: 45, 85, 88]
  rechazar(idPrestamo: number, motivo: string): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${idPrestamo}/rechazar`, { motivo });
  }

  // Registrar devolución evaluando el estado físico del libro [cite: 45, 87, 88]
  devolver(
    idPrestamo: number,
    estadoDevolucion: string,
    observaciones: string,
  ): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${idPrestamo}/devolver`, {
      estadoDevolucion,
      observaciones,
    });
  }
}
