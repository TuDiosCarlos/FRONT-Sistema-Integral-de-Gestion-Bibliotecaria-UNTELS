import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Libroservice } from '../../../services/libroservice';
import { Libro } from '../../../models/libro';

@Component({
  selector: 'app-catalogo-listar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo-listar.html',
  styleUrls: ['./catalogo-listar.css'],
})
export class CatalogoListar implements OnInit {
  libros: Libro[] = [];
  mensaje = 'Cargando catálogo...';
  textoBusqueda = '';
  categoriaSeleccionada = 'TODAS';
  categorias = ['TODAS', 'Programación', 'Administración', 'Ciencia'];

  constructor(private libroService: Libroservice) {}

  ngOnInit(): void {
    this.libroService.listar().subscribe({
      next: (data) => {
        this.libros = data || [];
        this.mensaje = this.libros.length ? '' : 'La lista se cargará desde el backend.';
      },
      error: () => {
        this.libros = [];
        this.mensaje = 'No hay datos disponibles. El backend completará esta vista más adelante.';
      }
    });
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.categoriaSeleccionada = 'TODAS';
  }
}
