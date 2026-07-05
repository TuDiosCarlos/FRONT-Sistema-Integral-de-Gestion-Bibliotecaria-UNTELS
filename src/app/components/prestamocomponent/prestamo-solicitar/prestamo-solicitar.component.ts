import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Prestamoservice } from '../../../services/prestamoservice';
import { Authservice } from '../../../services/authservice';
import { Prestamo } from '../../../models/prestamo';

@Component({
  selector: 'app-prestamo-solicitar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './prestamo-solicitar.component.html',
  styleUrls: ['./prestamo-solicitar.component.css'],
})
export class PrestamoSolicitarComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private prestamoService: Prestamoservice,
    private authService: Authservice,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PrestamoSolicitarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idLibro: number; tituloLibro: string },
  ) {
    this.form = this.fb.group({
      fechaEntrega: ['', [Validators.required]],
      motivo: ['', [Validators.required]],
      curso: [''],
      observaciones: [''],
    });
  }

  confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const idEstudiante = this.authService.getIdUsuario();
    if (idEstudiante == null) return;

    const valores = this.form.value;
    const prestamo: Prestamo = {
      idLibro: this.data.idLibro,
      idEstudiante,
      fechaEntrega: new Date(valores.fechaEntrega).toISOString(),
      motivo: valores.motivo,
      curso: valores.curso,
      observaciones: valores.observaciones,
    };

    this.prestamoService.solicitar(prestamo).subscribe({
      next: () => {
        this.snackBar.open('Solicitud de préstamo enviada correctamente', 'Ok', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        const msg = err?.error || 'No se pudo enviar la solicitud';
        this.snackBar.open(msg, 'Ok', { duration: 4000 });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
