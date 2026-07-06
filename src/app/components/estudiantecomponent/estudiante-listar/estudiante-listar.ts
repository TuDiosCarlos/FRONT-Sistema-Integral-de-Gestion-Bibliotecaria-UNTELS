import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-estudiante-listar',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatTooltipModule,
  ],
  templateUrl: './estudiante-listar.html',
  styleUrl: './estudiante-listar.css'
})
export class EstudianteListar implements OnInit {
  estudiantes: Usuario[] = [];
  columnas: string[] = ['codigo', 'nombre', 'dni', 'email', 'carrera', 'estado', 'acciones'];

  constructor(
    private usuarioService: Usuarioservice,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.usuarioService.buscarPorRol('ESTUDIANTE').subscribe({
      next: (data) => {
        this.estudiantes = data.filter(u => u.estado === 'ACTIVO');
      },
      error: (err) => console.error('Error al listar estudiantes', err)
    });
  }

  editarEstudiante(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/estudiantes/editar', id]);
    }
  }

  toggleEstado(estudiante: Usuario): void {
    const nuevoEstado = estudiante.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    estudiante.estado = nuevoEstado;
  }
}
