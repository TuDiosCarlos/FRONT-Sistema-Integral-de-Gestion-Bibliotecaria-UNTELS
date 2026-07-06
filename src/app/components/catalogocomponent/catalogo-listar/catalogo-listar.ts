import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, of } from 'rxjs';

import { Libroservice } from '../../../services/libroservice';
import { Prestamoservice } from '../../../services/prestamoservice';
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

  constructor(
    private libroService: Libroservice,
    private prestamoService: Prestamoservice,
    private authService: Authservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
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

  solicitarPrestamo(libro: Libro): void {
    const idEstudiante = this.authService.getUsuarioActual()?.idUsuario;

    if (!idEstudiante) {
      this.snackBar.open('No se pudo identificar tu usuario', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!libro.idLibro) {
      this.snackBar.open('Error con la información del libro', 'Cerrar', { duration: 3000 });
      return;
    }

    const prestamo: Prestamo = {
      idLibro: libro.idLibro,
      idEstudiante: idEstudiante,
      motivo: 'Préstamo académico',
    };

    this.prestamoService.solicitar(prestamo).subscribe({
      next: () => {
        this.snackBar.open('Préstamo solicitado correctamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Error al solicitar el préstamo', 'Cerrar', { duration: 3000 });
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
