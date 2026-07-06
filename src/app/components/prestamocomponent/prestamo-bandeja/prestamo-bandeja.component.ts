import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { interval, startWith } from 'rxjs';
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
  cargando = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    // Refresca automaticamente cada 15s para que las nuevas solicitudes de
    // los estudiantes aparezcan sin depender de que el bibliotecario recargue la pagina.
    interval(15000)
      .pipe(startWith(0), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cargarSolicitudesPendientes());
  }

  cargarSolicitudesPendientes(): void {
    this.cargando = true;
    this.prestamoService.listarPorEstado('solicitado').subscribe({
      next: (data) => {
        this.cargando = false;
        this.listaPendientes = data;
      },
      error: () => {
        this.cargando = false;
        this.mostrarMensaje('Error al obtener solicitudes pendientes.');
      },
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
