import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';

import { Authservice } from '../../services/authservice';
import { Libroservice } from '../../services/libroservice';
import { Usuarioservice } from '../../services/usuarioservice';
import { Prestamoservice } from '../../services/prestamoservice';
import { Sancionservice } from '../../services/sancionservice';
import { ConfiguracionService } from '../../services/configuracionservice';

interface TarjetaDashboard {
  etiqueta: string;
  valor: number | string;
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
    private sancionService: Sancionservice,
    private configuracionService: ConfiguracionService
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
      this.cargarDashboardBibliotecario();
    } else {
      // ADMIN u otros: panel de administracion (usuarios y configuracion)
      this.cargarDashboardAdmin();
    }
  }

  private cargarDashboardBibliotecario(): void {
    forkJoin({
      libros: this.libroService.listar().pipe(catchError(() => of([]))),
      vigentes: this.prestamoService.listarPorEstado('vigente').pipe(catchError(() => of([]))),
      vencidos: this.prestamoService.listarPorEstado('vencido').pipe(catchError(() => of([]))),
      solicitados: this.prestamoService.listarPorEstado('solicitado').pipe(catchError(() => of([]))),
      sancionesActivas: this.sancionService.listarPorEstado('activa').pipe(catchError(() => of([]))),
    }).subscribe((r) => {
      this.cargando = false;
      const stockTotal = r.libros.reduce((acc, l) => acc + (l.stock ?? 0), 0);

      this.tarjetas = [
        { etiqueta: 'Libros disponibles', valor: stockTotal, descripcion: `${r.libros.length} títulos en catálogo`, clase: 'card-primary' },
        { etiqueta: 'Solicitudes pendientes', valor: r.solicitados.length, descripcion: 'Esperando tu confirmación', clase: 'card-secondary' },
        { etiqueta: 'Préstamos vigentes', valor: r.vigentes.length, descripcion: 'Préstamos actualmente entregados', clase: 'card-secondary' },
        { etiqueta: 'Préstamos vencidos', valor: r.vencidos.length, descripcion: 'Con fecha de entrega superada', clase: 'card-warning' },
        { etiqueta: 'Sanciones activas', valor: r.sancionesActivas.length, descripcion: 'Estudiantes actualmente suspendidos', clase: 'card-alert' },
      ];
    });
  }

  private cargarDashboardAdmin(): void {
    forkJoin({
      usuarios: this.usuarioService.listar().pipe(catchError(() => of([]))),
      sancionesActivas: this.sancionService.listarPorEstado('activa').pipe(catchError(() => of([]))),
      configuracion: this.configuracionService.obtener().pipe(catchError(() => of(null))),
    }).subscribe((r) => {
      this.cargando = false;

      const administradores = r.usuarios.filter((u) => u.rol === 'ADMIN').length;
      const bibliotecarios = r.usuarios.filter((u) => u.rol === 'BIBLIOTECARIO').length;
      const estudiantes = r.usuarios.filter((u) => u.rol === 'ESTUDIANTE').length;
      const activos = r.usuarios.filter((u) => u.estado === 'ACTIVO').length;
      const inactivos = r.usuarios.length - activos;
      const enMantenimiento = r.configuracion?.modoMant ?? false;

      this.tarjetas = [
        { etiqueta: 'Usuarios totales', valor: r.usuarios.length, descripcion: `${activos} activos · ${inactivos} inactivos`, clase: 'card-primary' },
        { etiqueta: 'Bibliotecarios', valor: bibliotecarios, descripcion: 'Gestionan libros y préstamos', clase: 'card-secondary' },
        { etiqueta: 'Estudiantes', valor: estudiantes, descripcion: 'Registrados en el sistema', clase: 'card-success' },
        { etiqueta: 'Administradores', valor: administradores, descripcion: 'Con acceso total al sistema', clase: 'card-success' },
        { etiqueta: 'Sanciones activas', valor: r.sancionesActivas.length, descripcion: 'Estudiantes actualmente suspendidos', clase: 'card-warning' },
        {
          etiqueta: 'Modo mantenimiento',
          valor: enMantenimiento ? 'Activado' : 'Desactivado',
          descripcion: enMantenimiento ? 'El sistema no admite login de estudiantes' : 'El sistema funciona con normalidad',
          clase: enMantenimiento ? 'card-alert' : 'card-secondary',
        },
      ];
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
