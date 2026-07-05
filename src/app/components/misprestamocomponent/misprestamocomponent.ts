import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Prestamoservice } from '../../services/prestamoservice';
import { Sancionservice } from '../../services/sancionservice';
import { Authservice } from '../../services/authservice';
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
  prestamos: Prestamo[] = [];
  prestamosFiltrados: Prestamo[] = [];
  sanciones: Sancion[] = [];
  mensaje = 'Cargando tus préstamos...';
  estadoFiltro = 'Todos';
  estados = ['Todos', 'solicitado', 'vigente', 'vencido', 'devuelto', 'rechazado'];

  constructor(
    private prestamoService: Prestamoservice,
    private sancionService: Sancionservice,
    private authService: Authservice,
  ) {}

  ngOnInit(): void {
    this.cargarPrestamos();
    this.cargarSanciones();
  }

  cargarPrestamos(): void {
    const idUsuario = this.authService.getIdUsuario();
    if (idUsuario == null) return;

    this.prestamoService.buscarPorEstudiante(idUsuario).subscribe({
      next: (data) => {
        this.prestamos = data;
        this.filtrar();
      },
      error: () => this.mensaje = 'No se pudieron cargar tus préstamos.'
    });
  }

  cargarSanciones(): void {
    const idUsuario = this.authService.getIdUsuario();
    if (idUsuario == null) return;

    this.sancionService.buscarPorEstudiante(idUsuario).subscribe({
      next: (data) => this.sanciones = data,
      error: () => { /* silencioso: la vista de sanciones es secundaria aquí */ }
    });
  }

  filtrar(): void {
    this.prestamosFiltrados = this.prestamos.filter(p =>
      this.estadoFiltro === 'Todos' || p.estado === this.estadoFiltro
    );
    this.mensaje = this.prestamosFiltrados.length === 0 ? 'No tienes préstamos con ese estado.' : '';
  }

  actualizar(): void {
    this.cargarPrestamos();
    this.cargarSanciones();
  }

  contarPorEstado(estado: string): number {
    return this.prestamos.filter(p => p.estado === estado).length;
  }

  diasRestantes(fechaEntrega: string | undefined): number {
    if (!fechaEntrega) return 0;
    const diferencia = new Date(fechaEntrega).getTime() - new Date().getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  sancionActiva(): Sancion | undefined {
    return this.sanciones.find(s => s.estado === 'activa');
  }
}
