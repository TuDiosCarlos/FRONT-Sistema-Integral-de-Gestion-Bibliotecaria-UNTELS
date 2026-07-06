import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Usuarioservice } from '../../../services/usuarioservice';
import { Usuario } from '../../../models/usuario';

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
    private usuarioService: Usuarioservice,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre:   ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required]],
      codigo:   ['', [Validators.required]],
      dni:      ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email:    ['', [Validators.required, Validators.email]],
      carrera:  [''],
      ciclo:    [1],
      password: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.estudianteId = +id;
      this.cargarEstudiante(this.estudianteId);
    }
  }

  cargarEstudiante(id: number): void {
    this.usuarioService.buscarPorId(id).subscribe({
      next: (usuario) => {
        this.form.patchValue({
          nombre:   usuario.nombre,
          username: usuario.username,
          codigo:   usuario.codigo,
          dni:      usuario.dni,
          email:    usuario.email,
          carrera:  usuario.carrera,
          ciclo:    usuario.ciclo,
        });
      },
      error: () => {
        this.snackBar.open('Estudiante no encontrado', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/estudiantes']);
      }
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;
    const usuario: Usuario = {
      username:  data.username,
      nombre:    data.nombre,
      codigo:    data.codigo,
      dni:       data.dni,
      email:     data.email,
      carrera:   data.carrera || '',
      ciclo:     data.ciclo || 1,
      password:  data.password || '123456',
      carnet:    '',
      telefono:  '',
      rol:       'ESTUDIANTE',
      estado:    'ACTIVO',
    };

    if (this.modoEdicion && this.estudianteId) {
      this.usuarioService.actualizar({ ...usuario, idUsuario: this.estudianteId }).subscribe({
        next: () => {
          this.snackBar.open('Estudiante actualizado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/estudiantes']);
        },
        error: (err: any) => {
          const msg = typeof err?.error === 'string' ? err.error : 'Error al actualizar el estudiante';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      });
    } else {
      this.usuarioService.registrar(usuario).subscribe({
        next: () => {
          this.snackBar.open('Estudiante registrado correctamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/estudiantes']);
        },
        error: (err: any) => {
          const msg = typeof err?.error === 'string' ? err.error : 'Error al guardar el estudiante';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      });
    }
  }
}
