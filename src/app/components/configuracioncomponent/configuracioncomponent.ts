import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Configuracionservice } from '../../services/configuracionservice';
import { Configuracion } from '../../models/configuracion';

@Component({
  selector: 'app-configuracioncomponent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './configuracioncomponent.html',
  styleUrls: ['./configuracioncomponent.css'],
})
export class Configuracioncomponent implements OnInit {

  form: FormGroup;
  idConfiguracionBiblioteca?: number;

  constructor(
    private fb: FormBuilder,
    private configuracionService: Configuracionservice,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      diasMaxPrestamo: [null, [Validators.required, Validators.min(1)]],
      limitePrestamos: [null, [Validators.required, Validators.min(1)]],
      multaPorDia: [null, [Validators.required, Validators.min(0)]],
      schedulerActivo: [false],
      notifEmail: [false],
      alertaStock: [false],
      modoMant: [false],
    });
  }

  ngOnInit(): void {
    this.cargarConfiguracion();
  }

  cargarConfiguracion(): void {
    this.configuracionService.getConfiguracion().subscribe({
      next: (config) => {
        this.idConfiguracionBiblioteca = config.idConfiguracionBiblioteca;
        this.form.patchValue(config);
      },
      error: () => this.snackBar.open('No se pudo cargar la configuración', 'Cerrar', { duration: 3000 })
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const config: Configuracion = {
      idConfiguracionBiblioteca: this.idConfiguracionBiblioteca,
      ...this.form.value,
    };

    this.configuracionService.updateConfiguracion(config).subscribe({
      next: () => this.snackBar.open('Configuración actualizada correctamente', 'Cerrar', { duration: 3000 }),
      error: (err) => {
        const msg = err?.error || 'No se pudo actualizar la configuración';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
