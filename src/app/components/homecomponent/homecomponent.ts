import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';

import { Authservice } from '../../services/authservice';
import { Libroservice } from '../../services/libroservice';
import { Usuarioservice } from '../../services/usuarioservice';
import { Prestamoservice } from '../../services/prestamoservice';
import { Sancionservice } from '../../services/sancionservice';

interface TarjetaDashboard {
  etiqueta: string;
  valor: number;
  descripcion: string;
  clase: string;
}

@Component({
  selector: 'app-homecomponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homecomponent.html',
  styleUrls: ['./homecomponent.css'],
})
export class Homecomponent implements OnInit {
  nombreUsuario = '';
  rolUsuario = '';
  cargando = false;
  tarjetas: TarjetaDashboard[] = [];

  constructor(
    private authService: Authservice,
    private libroService: Libroservice,
    private usuarioService: Usuarioservice,
    private prestamoService: Prestamoservice,
    private sancionService: Sancionservice
  ) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    this.nombreUsuario = usuario?.nombre || usuario?.username || '';
    this.rolUsuario = usuario?.rol ?? '';
    this.actualizar();
  }

  actualizar(): void {
    this.cargando = true;
    const idEstudiante = this.authService.getUsuarioActual()?.idUsuario;

    if (this.rolUsuario === 'ESTUDIANTE') {
      this.cargarDashboardEstudiante(idEstudiante);
    } else if (this.rolUsuario === 'BIBLIOTECARIO') {
      this.cargarDashboardStaff(false);
    } else {
      // ADMINISTRADOR u otros: panel completo
      this.cargarDashboardStaff(true);
    }
  }

  private cargarDashboardStaff(esAdministrador: boolean): void {
    forkJoin({
      libros: this.libroService.listar().pipe(catchError(() => of([]))),
      vigentes: this.prestamoService.listarPorEstado('vigente').pipe(catchError(() => of([]))),
      vencidos: this.prestamoService.listarPorEstado('vencido').pipe(catchError(() => of([]))),
      estudiantes: this.usuarioService.buscarPorRol('ESTUDIANTE').pipe(catchError(() => of([]))),
      sancionesActivas: this.sancionService.listarPorEstado('activa').pipe(catchError(() => of([]))),
      usuarios: esAdministrador ? this.usuarioService.listar().pipe(catchError(() => of([]))) : of(null),
    }).subscribe((r) => {
      this.cargando = false;
      const stockTotal = r.libros.reduce((acc, l) => acc + (l.stock ?? 0), 0);

      this.tarjetas = [
        { etiqueta: 'Libros disponibles', valor: stockTotal, descripcion: `${r.libros.length} títulos en catálogo`, clase: 'card-primary' },
        { etiqueta: 'Préstamos vigentes', valor: r.vigentes.length, descripcion: 'Préstamos actualmente prestados', clase: 'card-secondary' },
        { etiqueta: 'Préstamos vencidos', valor: r.vencidos.length, descripcion: 'Con fecha de entrega superada', clase: 'card-warning' },
        { etiqueta: 'Estudiantes registrados', valor: r.estudiantes.length, descripcion: 'Con cuenta activa en el sistema', clase: 'card-success' },
      ];

      if (esAdministrador && r.usuarios) {
        this.tarjetas.push({
          etiqueta: 'Usuarios del sistema',
          valor: r.usuarios.length,
          descripcion: 'Administradores, bibliotecarios y estudiantes',
          clase: 'card-alert',
        });
      } else {
        this.tarjetas.push({
          etiqueta: 'Sanciones activas',
          valor: r.sancionesActivas.length,
          descripcion: 'Estudiantes actualmente suspendidos',
          clase: 'card-alert',
        });
      }
    });
  }

  private cargarDashboardEstudiante(idEstudiante: number | undefined): void {
    forkJoin({
      libros: this.libroService.listar().pipe(catchError(() => of([]))),
      misPrestamos: idEstudiante
        ? this.prestamoService.buscarPorEstudiante(idEstudiante).pipe(catchError(() => of([])))
        : of([]),
    }).subscribe((r) => {
      this.cargando = false;
      const vigentes = r.misPrestamos.filter((p) => p.estado === 'vigente');
      const vencidos = r.misPrestamos.filter((p) => p.estado === 'vencido');

      this.tarjetas = [
        { etiqueta: 'Libros en catálogo', valor: r.libros.length, descripcion: 'Disponibles para solicitar', clase: 'card-primary' },
        { etiqueta: 'Mis préstamos vigentes', valor: vigentes.length, descripcion: 'Libros que tienes en préstamo', clase: 'card-secondary' },
        { etiqueta: 'Mis préstamos vencidos', valor: vencidos.length, descripcion: 'Pendientes de devolución', clase: 'card-warning' },
      ];
    });
  }
}
