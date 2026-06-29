import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Libroservice } from '../../../services/libroservice';
import { Libro } from '../../../models/libro';

@Component({
  selector: 'app-libro-listar',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatChipsModule, MatTooltipModule, MatSnackBarModule
  ],
  templateUrl: './libro-listar.html',
  styleUrl: './libro-listar.css'
})
export class LibroListar implements OnInit {

  libros: Libro[] = [];
  columnas: string[] = ['titulo', 'autor', 'isbn', 'categoria', 'stock', 'acciones'];

  textoBusqueda: string = '';
  categoriaFiltro: string = 'TODAS';
  categorias: string[] = ['TODAS', 'TECNICO', 'REFERENCIA', 'FICCION'];

  constructor(
    private libroService: Libroservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.libroService.listar().subscribe({
      next: (data) => this.libros = data,
      error: (err) => console.error('Error al listar libros', err)
    });
  }

  buscar(): void {
    if (this.textoBusqueda.trim()) {
      this.libroService.buscarPorTitulo(this.textoBusqueda.trim()).subscribe({
        next: (data) => this.libros = data,
        error: (err) => console.error('Error al buscar', err)
      });
    } else {
      this.cargarLibros();
    }
  }

  filtrarCategoria(): void {
    if (this.categoriaFiltro === 'TODAS') {
      this.cargarLibros();
    } else {
      this.libroService.buscarPorCategoria(this.categoriaFiltro).subscribe({
        next: (data) => this.libros = data,
        error: (err) => console.error('Error al filtrar', err)
      });
    }
  }

  limpiarFiltros(): void {
    this.textoBusqueda = '';
    this.categoriaFiltro = 'TODAS';
    this.cargarLibros();
  }

  editar(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/libros/editar', id]);
    }
  }

  eliminar(id: number | undefined): void {
    if (id == null) return;
    if (!confirm('¿Está seguro de eliminar este libro?')) return;

    this.libroService.eliminar(id).subscribe({
      next: () => {
        this.snackBar.open('Libro eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarLibros();
      },
      error: (err) => console.error('Error al eliminar', err)
    });
  }

  getColorStock(libro: Libro): string {
    if (libro.stock === 0) return 'warn';
    if (libro.stock < libro.stockTotal * 0.3) return 'accent';
    return 'primary';
  }
}
