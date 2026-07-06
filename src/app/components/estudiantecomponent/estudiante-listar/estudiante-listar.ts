import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-estudiante-listar',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatTooltipModule, MatSnackBarModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
  ],
  templateUrl: './estudiante-listar.html',
  styleUrl: './estudiante-listar.css'
})
export class EstudianteListar implements OnInit {
  estudiantes: Usuario[] = [];
  estudiantesFiltrados: Usuario[] = [];
  columnas: string[] = ['codigo', 'nombre', 'dni', 'email', 'carrera', 'estado', 'acciones'];

  // HUF03.6 / HUF03.7: búsqueda y filtros en cliente sobre el padrón completo.
  textoBusqueda = '';
  filtroCarrera = 'TODAS';
  filtroCiclo = 'TODOS';
  filtroEstado = 'TODOS';
  carreras: string[] = ['TODAS'];
  ciclos: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  constructor(
    private usuarioService: Usuarioservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.usuarioService.buscarPorRol('ESTUDIANTE').subscribe({
      // Se listan activos e inactivos: si solo se mostraran los activos,
      // un estudiante dado de baja desaparecería de la lista sin forma
      // de reactivarlo desde la UI.
      next: (data) => {
        this.estudiantes = data;
        this.carreras = ['TODAS', ...Array.from(new Set(data.map(e => e.carrera).filter(c => !!c)))];
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al listar estudiantes', err)
    });
  }

  aplicarFiltros(): void {
    const texto = this.textoBusqueda.trim().toLowerCase();

    this.estudiantesFiltrados = this.estudiantes.filter(e => {
      const textoOk = !texto ||
        e.nombre?.toLowerCase().includes(texto) ||
        e.codigo?.toLowerCase().includes(texto) ||
        e.carnet?.toLowerCase().includes(texto) ||
        e.dni?.toLowerCase().includes(texto);

      const carreraOk = this.filtroCarrera === 'TODAS' || e.carrera === this.filtroCarrera;
      const cicloOk = this.filtroCiclo === 'TODOS' || String(e.ciclo) === this.filtroCiclo;
      const estadoOk = this.filtroEstado === 'TODOS' || e.estado === this.filtroEstado;

      return textoOk && carreraOk && cicloOk && estadoOk;
    });
  }

  editarEstudiante(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/estudiantes/editar', id]);
    }
  }

  toggleEstado(estudiante: Usuario): void {
    if (estudiante.idUsuario == null) return;

    const nuevoEstado = estudiante.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
    const actualizado: Usuario = { ...estudiante, estado: nuevoEstado };
    delete actualizado.password;

    this.usuarioService.actualizar(actualizado).subscribe({
      next: () => {
        estudiante.estado = nuevoEstado;
        this.snackBar.open(
          nuevoEstado === 'ACTIVO' ? 'Estudiante activado' : 'Estudiante dado de baja',
          'Cerrar',
          { duration: 3000 }
        );
      },
      error: () => this.snackBar.open('Error al cambiar el estado', 'Cerrar', { duration: 3000 })
    });
  }
}
