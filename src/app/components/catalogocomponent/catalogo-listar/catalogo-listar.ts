import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Libroservice } from '../../../services/libroservice';
import { Libro } from '../../../models/libro';
import { PrestamoSolicitarComponent } from '../../prestamocomponent/prestamo-solicitar/prestamo-solicitar.component';

@Component({
  selector: 'app-catalogo-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
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

  constructor(
    private libroService: Libroservice,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.libroService.listar().subscribe({
      next: (data) => {
        this.libros = data || [];
        this.aplicarFiltros();
        this.mensaje = this.libros.length ? '' : 'No hay libros registrados en el catálogo.';
      },
      error: () => {
        this.libros = [];
        this.librosFiltrados = [];
        this.mensaje = 'No se pudo cargar el catálogo. Intente nuevamente.';
      }
    });
  }

  aplicarFiltros(): void {
    this.librosFiltrados = this.libros.filter(l => {
      const coincideTexto = !this.textoBusqueda.trim()
        || l.titulo.toLowerCase().includes(this.textoBusqueda.trim().toLowerCase());
      const coincideCategoria = this.categoriaSeleccionada === 'TODAS'
        || l.categoria === this.categoriaSeleccionada;
      return coincideTexto && coincideCategoria;
    });
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.categoriaSeleccionada = 'TODAS';
    this.aplicarFiltros();
  }

  solicitar(libro: Libro): void {
    if (libro.idLibro == null) return;

    this.dialog.open(PrestamoSolicitarComponent, {
      data: { idLibro: libro.idLibro, tituloLibro: libro.titulo },
    });
  }
}
