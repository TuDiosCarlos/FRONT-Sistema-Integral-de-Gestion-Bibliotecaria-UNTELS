import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Estudianteservice } from '../../../services/estudianteservice';
import { Student } from '../../../models/student';
import { CdkTableModule } from "@angular/cdk/table";
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-estudiante-listar',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatPaginatorModule, MatChipsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatTooltipModule,
    CdkTableModule, RouterLink
],
  templateUrl: './estudiante-listar.html',
  styleUrl: './estudiante-listar.css'
})
export class EstudianteListar implements OnInit {

  estudiantes: Student[] = [];
  columnas: string[] = ['codigo', 'nombres', 'apellidos', 'dni', 'email', 'carrera', 'estado', 'acciones'];

  totalElementos = 0;
  pageSize = 10;
  pageIndex = 0;

  filtroEstado: string = 'TODOS'; // TODOS | true | false

  constructor(
    private estudianteService: Estudianteservice,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarEstudiantes();
  }

  cargarEstudiantes(): void {
    this.estudianteService.listar(this.pageIndex, this.pageSize).subscribe({
      next: (resp) => {
        this.estudiantes = resp.content;
        this.totalElementos = resp.totalElements;
      },
      error: (err) => console.error('Error al listar estudiantes', err)
    });
  }

  aplicarFiltroEstado(): void {
    if (this.filtroEstado === 'TODOS') {
      this.cargarEstudiantes();
      return;
    }
    const estadoBool = this.filtroEstado === 'true';
    this.estudianteService.filtrarPorEstado(estadoBool).subscribe({
      next: (data) => {
        this.estudiantes = data;
        this.totalElementos = data.length;
      },
      error: (err) => console.error('Error al filtrar por estado', err)
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarEstudiantes();
  }

  editarEstudiante(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/app/estudiantes/editar', id]);
    }
  }

  toggleEstado(estudiante: Student): void {
    if (estudiante.id == null) return;
    this.estudianteService.toggleEstado(estudiante.id).subscribe({
      next: (actualizado) => {
        estudiante.estado = actualizado.estado;
      },
      error: (err) => console.error('Error al cambiar estado', err)
    });
  }
}
