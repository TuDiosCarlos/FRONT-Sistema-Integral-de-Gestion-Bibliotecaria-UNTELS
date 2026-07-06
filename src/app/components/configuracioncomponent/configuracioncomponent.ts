import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ConfiguracionService } from '../../services/configuracionservice';

@Component({
  selector: 'app-configuracioncomponent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './configuracioncomponent.html',
  styleUrls: ['./configuracioncomponent.css'],
})
export class Configuracioncomponent implements OnInit {
  form: FormGroup;
  cargando = false;
  guardando = false;

  constructor(
    private fb: FormBuilder,
    private configuracionService: ConfiguracionService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      diasMaxPrestamo: [15, [Validators.required, Validators.min(1)]],
      limitePrestamos: [3, [Validators.required, Validators.min(1)]],
      multaPorDia: [1, [Validators.required, Validators.min(0)]],
      schedulerActivo: [true],
      notifEmail: [true],
      alertaStock: [true],
      modoMant: [false],
    });
  }

  ngOnInit(): void {
    this.cargando = true;
    this.configuracionService.obtener().subscribe({
      next: (config) => {
        this.cargando = false;
        this.form.patchValue(config);
      },
      error: () => {
        this.cargando = false;
        this.snackBar.open('No se pudo cargar la configuración desde el backend', 'Cerrar', { duration: 4000 });
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.configuracionService.actualizar(this.form.value).subscribe({
      next: () => {
        this.guardando = false;
        this.snackBar.open('Configuración actualizada correctamente', 'Cerrar', { duration: 3000 });
      },
      error: () => {
        this.guardando = false;
        this.snackBar.open('Error al guardar la configuración', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
