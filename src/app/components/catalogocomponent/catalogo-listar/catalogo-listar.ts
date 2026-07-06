import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';

import { Libroservice } from '../../../services/libroservice';
import { Prestamoservice } from '../../../services/prestamoservice';
import { Sancionservice } from '../../../services/sancionservice';
import { Authservice } from '../../../services/authservice';
import { Libro } from '../../../models/libro';
import { Prestamo } from '../../../models/prestamo';

@Component({
  selector: 'app-catalogo-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './catalogo-listar.html',
  styleUrls: ['./catalogo-listar.css'],
})
export class CatalogoListar implements OnInit {
  libros: Libro[] = [];
  librosFiltrados: Libro[] = [];
  mensaje = 'Cargando catálogo...';
  textoBusqueda = '';
  categoriaSeleccionada = 'TODAS';
  categorias = ['TODAS', 'Programación', 'Administración', 'Ciencia'];
  ordenarPor: 'titulo' | 'autor' | 'categoria' = 'titulo';
  cargando = false;

  // HUF08.6 / HUF09.4: bloquear solicitud y acceso a recursos si el
  // estudiante está sancionado o inactivo.
  puedeSolicitar = true;
  motivoBloqueo = '';

  // HUF08.4: formulario real de solicitud (motivo, curso, observaciones)
  modalAbierto = false;
  libroSeleccionado: Libro | null = null;
  formSolicitud = { motivo: '', curso: '', observaciones: '' };
  enviandoSolicitud = false;

  constructor(
    private libroService: Libroservice,
    private prestamoService: Prestamoservice,
    private sancionService: Sancionservice,
    private authService: Authservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
    this.verificarEstadoEstudiante();
  }

  private verificarEstadoEstudiante(): void {
    const usuario = this.authService.getUsuarioActual();

    if (!usuario) return;

    if (usuario.estado !== 'ACTIVO') {
      this.puedeSolicitar = false;
      this.motivoBloqueo = 'Tu cuenta está inactiva. No puedes solicitar préstamos ni acceder a recursos virtuales.';
      return;
    }

    if (!usuario.idUsuario) return;

    this.sancionService.buscarPorEstudiante(usuario.idUsuario)
      .pipe(catchError(() => of([])))
      .subscribe((sanciones) => {
        const tieneSancionActiva = sanciones.some(s => s.estado === 'activa');
        if (tieneSancionActiva) {
          this.puedeSolicitar = false;
          this.motivoBloqueo = 'Tienes una sanción activa. No puedes solicitar préstamos ni acceder a recursos virtuales hasta que se resuelva.';
        }
      });
  }

  cargarLibros(): void {
    this.cargando = true;
    this.libroService.listar()
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.cargando = false;
        this.libros = data || [];
        this.filtrar();
        this.mensaje = this.libros.length ? '' : 'No hay libros disponibles en el catálogo.';
      });
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.categoriaSeleccionada = 'TODAS';
    this.filtrar();
  }

  filtrar(): void {
    const filtrados = this.libros.filter(libro => {
      const tituloOk = !this.textoBusqueda ||
        libro.titulo.toLowerCase().includes(this.textoBusqueda.toLowerCase());
      const categoriaOk = this.categoriaSeleccionada === 'TODAS' ||
        libro.categoria === this.categoriaSeleccionada;
      return tituloOk && categoriaOk;
    });

    this.librosFiltrados = filtrados.sort((a, b) =>
      (a[this.ordenarPor] || '').toString().localeCompare((b[this.ordenarPor] || '').toString())
    );
  }

  abrirFormularioSolicitud(libro: Libro): void {
    if (!this.puedeSolicitar) {
      this.snackBar.open(this.motivoBloqueo, 'Cerrar', { duration: 4000 });
      return;
    }
    this.libroSeleccionado = libro;
    this.formSolicitud = { motivo: '', curso: '', observaciones: '' };
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.libroSeleccionado = null;
  }

  confirmarSolicitud(): void {
    const idEstudiante = this.authService.getUsuarioActual()?.idUsuario;
    const libro = this.libroSeleccionado;

    if (!idEstudiante || !libro?.idLibro) {
      this.snackBar.open('No se pudo identificar tu usuario o el libro', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.formSolicitud.motivo.trim()) {
      this.snackBar.open('Indica el motivo de la solicitud', 'Cerrar', { duration: 3000 });
      return;
    }

    const prestamo: Prestamo = {
      idLibro: libro.idLibro,
      idEstudiante: idEstudiante,
      motivo: this.formSolicitud.motivo.trim(),
      curso: this.formSolicitud.curso.trim() || undefined,
      observaciones: this.formSolicitud.observaciones.trim() || undefined,
    };

    this.enviandoSolicitud = true;
    this.prestamoService.solicitar(prestamo).subscribe({
      next: () => {
        this.enviandoSolicitud = false;
        this.snackBar.open('Préstamo solicitado correctamente', 'Cerrar', { duration: 3000 });
        this.cerrarModal();
      },
      error: (err) => {
        this.enviandoSolicitud = false;
        const msg = typeof err?.error === 'string' ? err.error : 'Error al solicitar el préstamo';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }

  obtenerTipoLibro(libro: Libro): string {
    // "recurso" guarda el enlace/URL al material digital (PDF, repositorio, etc).
    // Si el bibliotecario cargo un enlace, el libro es Virtual; si esta vacio, es Fisico.
    return libro.recurso && libro.recurso.trim().length > 0 ? 'Virtual' : 'Físico';
  }

  textoDisponibilidad(libro: Libro): string {
    return libro.stock > 0 ? `Disponible: ${libro.stock} ejemplar${libro.stock === 1 ? '' : 'es'}` : 'Disponible: 0';
  }
}
