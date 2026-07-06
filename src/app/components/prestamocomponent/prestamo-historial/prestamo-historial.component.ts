import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Prestamoservice } from '../../../services/prestamoservice';
import { Prestamo } from '../../../models/prestamo';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-prestamo-historial',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, MatSnackBarModule],
  templateUrl: './prestamo-historial.component.html',
  styleUrls: ['./prestamo-historial.component.css'],
})
export class PrestamoHistorialComponent implements OnInit {
  todosLosPrestamos: Prestamo[] = [];
  listaFiltrada: Prestamo[] = [];
  columnasMostradas: string[] = ['idLibro', 'idEstudiante', 'fecha', 'fechaEntrega', 'estado'];
  estadoFiltro = 'todos';
  estados = ['todos', 'solicitado', 'vigente', 'vencido', 'devuelto', 'rechazado'];

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.prestamoService.listar().subscribe({
      next: (data) => {
        this.todosLosPrestamos = data;
        this.filtrar();
      },
      error: () => this.snackBar.open('Error al obtener el historial de prestamos.', 'Cerrar', { duration: 3000 }),
    });
  }

  filtrar(): void {
    this.listaFiltrada = this.todosLosPrestamos.filter(
      (p) => this.estadoFiltro === 'todos' || p.estado?.toLowerCase() === this.estadoFiltro
    );
  }
}
