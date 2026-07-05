import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Prestamoservice } from '../../../services/prestamoservice';
import { Prestamo } from '../../../models/prestamo';
// Componentes de Angular Material (Sección 8.3)
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrestamoRechazarComponent } from '../prestamo-rechazar/prestamo-rechazar.component';

@Component({
  selector: 'app-prestamo-bandeja', // Cumple regla 'app-' + nombre carpeta
  standalone: true, // Regla de Oro #3: Siempre standalone
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule],
  templateUrl: './prestamo-bandeja.component.html',
  styleUrls: ['./prestamo-bandeja.component.css'],
})
export class PrestamoBandejaComponent implements OnInit {
  listaPendientes: Prestamo[] = [];
  columnasMostradas: string[] = ['idLibro', 'idEstudiante', 'motivo', 'acciones'];

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
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
        this.mostrarMensaje('El préstamo ha sido APROBADO.');
        this.cargarSolicitudesPendientes();
      },
      error: () => this.mostrarMensaje('No se pudo aprobar el préstamo.'),
    });
  }

  rechazarSolicitud(id: number): void {
    const dialogRef = this.dialog.open(PrestamoRechazarComponent, {
      data: { idPrestamo: id },
    });

    dialogRef.afterClosed().subscribe((motivo: string | null) => {
      if (!motivo) return;

      this.prestamoService.rechazar(id, motivo).subscribe({
        next: () => {
          this.mostrarMensaje('El préstamo ha sido RECHAZADO.');
          this.cargarSolicitudesPendientes();
        },
        error: () => this.mostrarMensaje('No se pudo rechazar el préstamo.'),
      });
    });
  }

  private mostrarMensaje(msg: string): void {
    this.snackBar.open(msg, 'Ok', { duration: 3000 });
  }
}
