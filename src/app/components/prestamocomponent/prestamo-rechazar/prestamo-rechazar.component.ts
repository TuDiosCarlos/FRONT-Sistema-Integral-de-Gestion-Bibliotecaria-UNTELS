import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-prestamo-rechazar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './prestamo-rechazar.component.html',
  styleUrls: ['./prestamo-rechazar.component.css'],
})
export class PrestamoRechazarComponent {
  motivo: string = '';

  constructor(
    public dialogRef: MatDialogRef<PrestamoRechazarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { idPrestamo: number },
  ) {}

  confirmar(): void {
    if (!this.motivo.trim()) return;
    this.dialogRef.close(this.motivo.trim());
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }
}
