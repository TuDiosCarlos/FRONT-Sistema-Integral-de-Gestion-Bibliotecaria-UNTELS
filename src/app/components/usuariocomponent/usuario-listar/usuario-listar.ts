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

import { Usuarioservice } from '../../../services/usuarioservice';
import { Usuario } from '../../../models/usuario';

@Component({
  selector: 'app-usuario-listar',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatTooltipModule, MatSnackBarModule
  ],
  templateUrl: './usuario-listar.html',
  styleUrl: './usuario-listar.css'
})
export class UsuarioListar implements OnInit {

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  columnas: string[] = ['username', 'nombre', 'dni', 'email', 'rol', 'estado', 'acciones'];

  filtroRol: string = 'TODOS';
  filtroEstado: string = 'TODOS';

  constructor(
    private usuarioService: Usuarioservice,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al listar usuarios', err)
    });
  }

  aplicarFiltros(): void {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const rolOk = this.filtroRol === 'TODOS' || u.rol === this.filtroRol;
      const estadoOk = this.filtroEstado === 'TODOS' || u.estado === this.filtroEstado;
      return rolOk && estadoOk;
    });
  }

  editar(id: number | undefined): void {
    if (id != null) {
      this.router.navigate(['/usuarios/editar', id]);
    }
  }

  eliminar(id: number | undefined): void {
    if (id == null) return;
    if (!confirm('¿Eliminar este usuario?')) return;

    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.snackBar.open('Usuario eliminado', 'Cerrar', { duration: 3000 });
        this.cargarUsuarios();
      },
      error: () => this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 })
    });
  }
}
