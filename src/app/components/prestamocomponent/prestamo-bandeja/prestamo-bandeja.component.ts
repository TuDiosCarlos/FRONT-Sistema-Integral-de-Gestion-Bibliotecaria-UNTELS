import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prestamoservice } from '../../../services/prestamoservice';
import { Prestamo } from '../../../models/prestamo';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-prestamo-bandeja',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './prestamo-bandeja.component.html',
  styleUrls: ['./prestamo-bandeja.component.css'],
})
export class PrestamoBandejaComponent implements OnInit {
  listaPendientes: Prestamo[] = [];
  columnasMostradas: string[] = ['idLibro', 'idEstudiante', 'fecha', 'acciones'];

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.cargarSolicitudesPendientes();
  }

  cargarSolicitudesPendientes(): void {
    this.prestamoService.listarPorEstado('solicitado').subscribe({
      next: (data) => (this.listaPendientes = data),
      error: () => this.mostrarMensaje('Error al obtener solicitudes pendientes.'),
    });
  }

  aprobarSolicitud(id: number): void {
    this.prestamoService.aprobar(id).subscribe({
      next: () => {
        this.mostrarMensaje('Préstamo aprobado correctamente.');
        this.cargarSolicitudesPendientes();
      },
      error: () => this.mostrarMensaje('No se pudo aprobar el préstamo.'),
    });
  }

  rechazarSolicitud(id: number): void {
    const motivo = prompt('Por favor, especifique el motivo del rechazo:');
    if (!motivo) return;

    this.prestamoService.rechazar(id, motivo).subscribe({
      next: () => {
        this.mostrarMensaje('Préstamo rechazado correctamente.');
        this.cargarSolicitudesPendientes();
      },
      error: () => this.mostrarMensaje('No se pudo rechazar el préstamo.'),
    });
  }

  private mostrarMensaje(msg: string): void {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
  }
}
