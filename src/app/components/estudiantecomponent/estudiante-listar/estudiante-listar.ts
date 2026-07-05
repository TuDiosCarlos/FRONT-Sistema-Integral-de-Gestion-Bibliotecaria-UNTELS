import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Estudianteservice } from '../../../services/estudianteservice';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-estudiante-listar',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatTooltipModule, MatSnackBarModule
  ],
  templateUrl: './estudiante-listar.html',
  styleUrl: './estudiante-listar.css'
})
export class EstudianteListar implements OnInit {

  estudiantes: Usuario[] = [];
  estudiantesFiltrados: Usuario[] = [];
  columnas: string[] = ['codigo', 'nombre', 'dni', 'email', 'carrera', 'ciclo', 'estado', 'acciones'];

  textoBusqueda: string = '';
  filtroEstado: string = 'TODOS';

  constructor(
    private estudianteService: Estudianteservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.estudianteService.listar().subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.aplicarFiltroEstado();
      },
      error: () => this.snackBar.open('Error al listar estudiantes', 'Cerrar', { duration: 3000 })
    });
  }

  buscar(): void {
    if (!this.textoBusqueda.trim()) {
      this.cargarEstudiantes();
      return;
    }

    this.estudianteService.buscar(this.textoBusqueda.trim()).subscribe({
      next: (data) => {
        this.estudiantes = data.filter(u => u.rol === 'ESTUDIANTE');
        this.aplicarFiltroEstado();
      },
      error: () => this.snackBar.open('Error al buscar estudiantes', 'Cerrar', { duration: 3000 })
    });
  }

  aplicarFiltroEstado(): void {
    this.estudiantesFiltrados = this.estudiantes.filter(e =>
      this.filtroEstado === 'TODOS' || e.estado === this.filtroEstado
    );
  }

  editarEstudiante(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/estudiantes/editar', id]);
    }
  }

  toggleEstado(estudiante: Usuario): void {
    if (estudiante.idUsuario == null) return;

    this.estudianteService.cambiarEstado(estudiante.idUsuario).subscribe({
      next: (actualizado) => {
        estudiante.estado = actualizado.estado;
        this.aplicarFiltroEstado();
      },
      error: () => this.snackBar.open('Error al cambiar estado', 'Cerrar', { duration: 3000 })
    });
  }

  eliminar(id: number | undefined): void {
    if (id == null) return;
    if (!confirm('¿Dar de baja a este estudiante del padrón?')) return;

    this.estudianteService.eliminar(id).subscribe({
      next: () => {
        this.snackBar.open('Estudiante eliminado correctamente', 'Cerrar', { duration: 3000 });
        this.cargarEstudiantes();
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }
}
