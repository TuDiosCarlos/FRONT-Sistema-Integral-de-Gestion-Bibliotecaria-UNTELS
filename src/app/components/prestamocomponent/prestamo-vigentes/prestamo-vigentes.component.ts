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
  standalone: true, // Regla de Oro #3: Siempre standalone
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
  columnasMostradas: string[] = ['idLibro', 'idEstudiante', 'fechaAprobacion', 'diasRestantes', 'estado'];

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarPrestamosVigentes();
  }

  cargarPrestamosVigentes(): void {
    // Listar préstamos con estado ACTIVO o VENCIDO
    this.prestamoService.listarPorEstado('ACTIVO').subscribe({
      next: (data) => {
        this.listaVigentes = data;
      },
      error: () => this.mostrarMensaje('Error al cargar préstamos vigentes.')
    });
  }

  // Lógica dinámica para calcular los días restantes o de retraso
  calcularDiasRestantes(fechaAprobacionStr: string | undefined, diasSolicitados: number): number {
    if (!fechaAprobacionStr) return 0;
    
    const fechaAprobacion = new Date(fechaAprobacionStr);
    const fechaVencimiento = new Date(fechaAprobacion.getTime() + (diasSolicitados * 24 * 60 * 60 * 1000));
    const hoy = new Date();
    
    const diferenciaTiempo = fechaVencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));
  }

  private mostrarMensaje(msg: string): void {
    this.snackBar.open(msg, 'Ok', { duration: 3000 });
  }
}