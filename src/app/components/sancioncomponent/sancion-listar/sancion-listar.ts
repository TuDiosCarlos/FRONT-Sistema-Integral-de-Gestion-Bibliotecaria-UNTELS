import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Sancionservice } from '../../../services/sancionservice';
import { Sancion } from '../../../models/sancion';

@Component({
  selector: 'app-sancion-listar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './sancion-listar.html',
  styleUrl: './sancion-listar.css',
})
export class SancionListar implements OnInit {
  sanciones: Sancion[] = [];
  estadoFiltro = 'activa';
  estados = ['activa', 'cumplida'];

  constructor(
    private sancionService: Sancionservice,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.sancionService.listarPorEstado(this.estadoFiltro).subscribe({
      next: (data) => (this.sanciones = data),
      error: () => this.snackBar.open('Error al obtener las sanciones.', 'Cerrar', { duration: 3000 }),
    });
  }

  marcarCumplida(idSancion: number | undefined): void {
    if (!idSancion) return;
    if (!confirm('¿Marcar esta sancion como cumplida?')) return;

    this.sancionService.cumplir(idSancion).subscribe({
      next: () => {
        this.snackBar.open('Sancion marcada como cumplida', 'Cerrar', { duration: 3000 });
        this.cargar();
      },
      error: () => this.snackBar.open('No se pudo actualizar la sancion.', 'Cerrar', { duration: 3000 }),
    });
  }
}
