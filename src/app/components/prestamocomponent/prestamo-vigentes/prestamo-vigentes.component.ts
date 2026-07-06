import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { catchError, forkJoin, interval, of, startWith } from 'rxjs';
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
  columnasMostradas: string[] = ['idLibro', 'idEstudiante', 'fechaEntrega', 'estado', 'acciones'];
  cargando = false;
  procesandoDevolucion: number | null = null;

  private destroyRef = inject(DestroyRef);

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    interval(15000)
      .pipe(startWith(0), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cargarPrestamosVigentes());
  }

  cargarPrestamosVigentes(): void {
    this.cargando = true;
    // Se muestran vigentes y vencidos juntos: la devolución (HUF05.6) aplica
    // a ambos estados, y separarlos obligaría a ir a otra pestaña para
    // devolver un libro que ya venció.
    forkJoin({
      vigentes: this.prestamoService.listarPorEstado('vigente').pipe(catchError(() => of([]))),
      vencidos: this.prestamoService.listarPorEstado('vencido').pipe(catchError(() => of([]))),
    }).subscribe(({ vigentes, vencidos }) => {
      this.cargando = false;
      this.listaVigentes = [...vigentes, ...vencidos];
    });
  }

  registrarDevolucion(prestamo: Prestamo, estadoDevolucion: 'bueno' | 'dañado'): void {
    if (!prestamo.idPrestamo || this.procesandoDevolucion) return;

    const etiqueta = estadoDevolucion === 'bueno' ? 'buen estado' : 'estado dañado';
    if (!confirm(`¿Registrar la devolución de "${prestamo.tituloLibro || 'este libro'}" en ${etiqueta}?`)) {
      return;
    }

    const observaciones = prompt('Observaciones de la devolución (opcional):') || '';

    this.procesandoDevolucion = prestamo.idPrestamo;
    this.prestamoService.devolver(prestamo.idPrestamo, estadoDevolucion, observaciones).subscribe({
      next: () => {
        this.procesandoDevolucion = null;
        this.mostrarMensaje('Devolución registrada correctamente.');
        this.cargarPrestamosVigentes();
      },
      error: (err) => {
        this.procesandoDevolucion = null;
        const msg = typeof err?.error === 'string' ? err.error : 'Error al registrar la devolución.';
        this.mostrarMensaje(msg);
      }
    });
  }

  private mostrarMensaje(msg: string): void {
    this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
  }
}
