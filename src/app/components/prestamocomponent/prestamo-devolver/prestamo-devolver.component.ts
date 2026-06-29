import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Obligatorio para formularios interactivos
import { Prestamoservice } from '../../../services/prestamoservice';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-prestamo-devolver',
  standalone: true, // Regla de Oro #3: Siempre standalone
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './prestamo-devolver.component.html',
  styleUrls: ['./prestamo-devolver.component.css']
})
export class PrestamoDevolverComponent implements OnInit {
  // Variables enlazadas al DTO del backend mediante camelCase
  estadoDevolucion: string = 'BUENO'; // Mapeo exacto DTO Java
  observaciones: string = '';

  constructor(
    private prestamoService: Prestamoservice,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PrestamoDevolverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idPrestamo: number } // Recibe el ID desde la lista
  ) {}

  ngOnInit(): void {}

  procesarDevolucion(): void {
    if (!this.data.idPrestamo) return;

    this.prestamoService.devolver(this.data.idPrestamo, this.estadoDevolucion, this.observaciones).subscribe({
      next: () => {
        this.snackBar.open('Devolución registrada con éxito.', 'Ok', { duration: 3000 });
        this.dialogRef.close(true); // Cierra el modal y avisa que hubo éxito
      },
      error: () => {
        this.snackBar.open('Error al procesar la devolución física.', 'Ok', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}