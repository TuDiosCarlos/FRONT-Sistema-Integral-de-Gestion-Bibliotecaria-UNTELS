import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Prestamoservice } from '../../../services/prestamoservice';
import { Prestamo } from '../../../models/prestamo';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrestamoDevolverComponent } from '../prestamo-devolver/prestamo-devolver.component';

@Component({
  selector: 'app-prestamo-vigentes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './prestamo-vigentes.component.html',
  styleUrls: ['./prestamo-vigentes.component.css'],
})
export class PrestamoVigentesComponent implements OnInit {
  listaVigentes: Prestamo[] = [];
  columnasMostradas: string[] = ['idLibro', 'idEstudiante', 'fechaEntrega', 'diasRestantes', 'estado', 'acciones'];

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.cargarPrestamosVigentes();
  }

  cargarPrestamosVigentes(): void {
    forkJoin({
      vigentes: this.prestamoService.listarPorEstado('vigente'),
      vencidos: this.prestamoService.listarPorEstado('vencido'),
    }).subscribe({
      next: ({ vigentes, vencidos }) => {
        this.listaVigentes = [...vigentes, ...vencidos];
      },
      error: () => this.mostrarMensaje('Error al cargar préstamos vigentes.'),
    });
  }

  calcularDiasRestantes(fechaEntregaStr: string | undefined): number {
    if (!fechaEntregaStr) return 0;

    const fechaEntrega = new Date(fechaEntregaStr);
    const hoy = new Date();

    const diferenciaTiempo = fechaEntrega.getTime() - hoy.getTime();
    return Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
  }

  abrirDevolucion(idPrestamo: number | undefined): void {
    if (idPrestamo == null) return;

    const dialogRef = this.dialog.open(PrestamoDevolverComponent, {
      data: { idPrestamo },
    });

    dialogRef.afterClosed().subscribe((exito: boolean) => {
      if (exito) {
        this.cargarPrestamosVigentes();
      }
    });
  }

  private mostrarMensaje(msg: string): void {
    this.snackBar.open(msg, 'Ok', { duration: 3000 });
  }
}
