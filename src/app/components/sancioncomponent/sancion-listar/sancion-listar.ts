import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Sancionservice } from '../../../services/sancionservice';
import { Sancion } from '../../../models/sancion';

@Component({
  selector: 'app-sancion-listar',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatChipsModule, MatSnackBarModule
  ],
  templateUrl: './sancion-listar.html',
  styleUrl: './sancion-listar.css',
})
export class SancionListar implements OnInit {

  sanciones: Sancion[] = [];
  columnas: string[] = ['idEstudiante', 'motivo', 'diasSuspension', 'multa', 'estado', 'fechaFin', 'acciones'];

  filtroEstado: string = 'TODAS';
  estados: string[] = ['TODAS', 'activa', 'cumplida'];

  constructor(
    private sancionService: Sancionservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarSanciones();
  }

  cargarSanciones(): void {
    this.sancionService.listar().subscribe({
      next: (data) => this.sanciones = data,
      error: () => this.snackBar.open('Error al listar sanciones', 'Cerrar', { duration: 3000 })
    });
  }

  filtrarPorEstado(): void {
    if (this.filtroEstado === 'TODAS') {
      this.cargarSanciones();
    } else {
      this.sancionService.buscarPorEstado(this.filtroEstado).subscribe({
        next: (data) => this.sanciones = data,
        error: () => this.snackBar.open('Error al filtrar sanciones', 'Cerrar', { duration: 3000 })
      });
    }
  }

  cumplir(sancion: Sancion): void {
    if (sancion.idSancion == null) return;
    if (!confirm('¿Marcar esta sanción como cumplida?')) return;

    this.sancionService.cumplir(sancion.idSancion).subscribe({
      next: () => {
        this.snackBar.open('Sanción marcada como cumplida', 'Cerrar', { duration: 3000 });
        this.filtrarPorEstado();
      },
      error: (err) => {
        const msg = err?.error || 'No se pudo actualizar la sanción';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
