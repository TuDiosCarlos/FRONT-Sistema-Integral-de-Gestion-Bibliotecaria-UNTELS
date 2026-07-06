import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prestamoservice } from '../../../services/prestamoservice';
import { Prestamo } from '../../../models/prestamo';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-prestamo-vigentes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './prestamo-vigentes.component.html',
  styleUrls: ['./prestamo-vigentes.component.css']
})
export class PrestamoVigentesComponent implements OnInit {
  listaVigentes: Prestamo[] = [];
  columnasMostradas: string[] = ['idLibro', 'idEstudiante', 'fechaEntrega', 'estado'];

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarPrestamosVigentes();
  }

  cargarPrestamosVigentes(): void {
    this.prestamoService.listarPorEstado('vigente').subscribe({
      next: (data) => {
        this.listaVigentes = data;
      },
      error: () => this.mostrarMensaje('Error al cargar préstamos vigentes.')
    });
  }

  private mostrarMensaje(msg: string): void {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
  }
}