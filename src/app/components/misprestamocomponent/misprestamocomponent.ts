import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

import { Authservice } from '../../services/authservice';
import { Prestamoservice } from '../../services/prestamoservice';
import { Sancionservice } from '../../services/sancionservice';
import { Prestamo } from '../../models/prestamo';
import { Sancion } from '../../models/sancion';

@Component({
  selector: 'app-misprestamocomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './misprestamocomponent.html',
  styleUrls: ['./misprestamocomponent.css'],
})
export class Misprestamocomponent implements OnInit {
  prestamosTodos: Prestamo[] = [];
  prestamos: Prestamo[] = [];
  mensaje = 'Cargando tus préstamos...';
  estadoFiltro = 'todos';
  estados = ['todos', 'solicitado', 'vigente', 'vencido', 'devuelto', 'rechazado'];
  cargando = false;
  contadores = { solicitado: 0, vigente: 0, vencido: 0, devuelto: 0, rechazado: 0 };

  // HUF10.3 / HUF10.4: sanción activa propia + historial de sanciones cumplidas
  sancionActiva: Sancion | null = null;
  historialSanciones: Sancion[] = [];

  constructor(
    private authService: Authservice,
    private prestamoService: Prestamoservice,
    private sancionService: Sancionservice
  ) {}

  ngOnInit(): void {
    this.cargarPrestamos();
    this.cargarSanciones();
  }

  cargarSanciones(): void {
    const idEstudiante = this.authService.getUsuarioActual()?.idUsuario;
    if (!idEstudiante) return;

    this.sancionService.buscarPorEstudiante(idEstudiante)
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.sancionActiva = data.find(s => s.estado === 'activa') || null;
        this.historialSanciones = data
          .filter(s => s.estado !== 'activa')
          .sort((a, b) => (b.fechaCreacion || '').localeCompare(a.fechaCreacion || ''));
      });
  }

  diasRestantesSancion(sancion: Sancion): number | null {
    if (!sancion.fechaFin) return null;
    const limite = new Date(sancion.fechaFin).setHours(0, 0, 0, 0);
    const hoy = new Date().setHours(0, 0, 0, 0);
    return Math.max(0, Math.round((limite - hoy) / 86400000));
  }

  cargarPrestamos(): void {
    this.cargando = true;
    const idEstudiante = this.authService.getUsuarioActual()?.idUsuario;

    if (!idEstudiante) {
      this.mensaje = 'No se pudo obtener tu ID de estudiante.';
      this.cargando = false;
      return;
    }

    this.prestamoService.buscarPorEstudiante(idEstudiante)
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.cargando = false;
        this.prestamosTodos = data;
        this.actualizarContadores();

        if (this.prestamosTodos.length === 0) {
          this.mensaje = 'No tienes préstamos registrados.';
          this.prestamos = [];
        } else {
          this.filtrar();
        }
      });
  }

  actualizarContadores(): void {
    this.contadores = {
      solicitado: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'solicitado').length,
      vigente: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'vigente').length,
      vencido: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'vencido').length,
      devuelto: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'devuelto').length,
      rechazado: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'rechazado').length,
    };
  }

  filtrar(): void {
    const filtrados = this.prestamosTodos.filter(prestamo =>
      this.estadoFiltro === 'todos' || prestamo.estado?.toLowerCase() === this.estadoFiltro.toLowerCase()
    );

    if (filtrados.length === 0) {
      this.mensaje = `No hay préstamos con estado ${this.estadoFiltro}.`;
      this.prestamos = [];
    } else {
      this.mensaje = ``;
      this.prestamos = filtrados;
    }
  }

  actualizar(): void {
    this.cargarPrestamos();
  }

  // HUF08.5: contador de días restantes (positivo) o vencidos (negativo)
  // respecto a la fecha límite de entrega. Solo tiene sentido para
  // préstamos vigentes/vencidos; el resto no tiene una fecha límite activa.
  diasRestantes(prestamo: Prestamo): number | null {
    const estado = prestamo.estado?.toLowerCase();
    if (estado !== 'vigente' && estado !== 'vencido') return null;
    if (!prestamo.fechaEntrega) return null;

    const limite = new Date(prestamo.fechaEntrega).setHours(0, 0, 0, 0);
    const hoy = new Date().setHours(0, 0, 0, 0);
    return Math.round((limite - hoy) / 86400000);
  }

  textoDias(prestamo: Prestamo): string {
    const dias = this.diasRestantes(prestamo);
    if (dias === null) return '—';
    return dias >= 0 ? `${dias} día(s) restante(s)` : `${-dias} día(s) vencido(s)`;
  }
}

