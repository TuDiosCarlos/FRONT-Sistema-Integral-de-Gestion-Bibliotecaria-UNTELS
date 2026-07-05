import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Estudianteservice } from '../../../services/estudianteservice';
import { UsuarioDTO } from '../../../models/usuario';

@Component({
  selector: 'app-estudiante-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule,
    MatButtonModule, MatCardModule, MatSnackBarModule
  ],
  templateUrl: './estudiante-form.html',
  styleUrl: './estudiante-form.css'
})
export class EstudianteForm implements OnInit {

  form!: FormGroup;
  modoEdicion = false;
  estudianteId?: number;

  constructor(
    private fb: FormBuilder,
    private estudianteService: Estudianteservice,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username:  ['', [Validators.required, Validators.minLength(3)]],
      password:  [''],
      nombre:    ['', [Validators.required]],
      dni:       ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      codigo:    ['', [Validators.required]],
      carnet:    [''],
      email:     ['', [Validators.required, Validators.email]],
      telefono:  [''],
      carrera:   ['', [Validators.required]],
      ciclo:     [null],
      estado:    ['ACTIVO', [Validators.required]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.estudianteId = +id;
      this.cargarEstudiante(this.estudianteId);
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  cargarEstudiante(id: number): void {
    this.estudianteService.buscarPorId(id).subscribe({
      next: (e) => {
        this.form.patchValue({
          username: e.username,
          nombre:   e.nombre,
          dni:      e.dni,
          codigo:   e.codigo,
          carnet:   e.carnet,
          email:    e.email,
          telefono: e.telefono,
          carrera:  e.carrera,
          ciclo:    e.ciclo,
          estado:   e.estado,
        });
      },
      error: () => {
        this.snackBar.open('Estudiante no encontrado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/estudiantes/listar']);
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: UsuarioDTO = { ...this.form.value, rol: 'ESTUDIANTE' };

    if (this.modoEdicion && this.estudianteId) {
      dto.idUsuario = this.estudianteId;
      if (!dto.password) delete dto.password;

      this.estudianteService.actualizar(dto).subscribe({
        next: () => {
          this.snackBar.open('Estudiante actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/estudiantes/listar']);
        },
        error: (err) => {
          const msg = err?.error || 'Error al actualizar el estudiante';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      });
    } else {
      this.estudianteService.registrar(dto).subscribe({
        next: () => {
          this.snackBar.open('Estudiante registrado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/estudiantes/listar']);
        },
        error: (err) => {
          const msg = err?.error || 'Error al registrar el estudiante';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      });
    }
  }
}
