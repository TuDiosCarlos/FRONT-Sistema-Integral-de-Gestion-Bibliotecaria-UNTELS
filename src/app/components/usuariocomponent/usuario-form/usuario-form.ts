import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Usuarioservice } from '../../../services/usuarioservice';
import { UsuarioDTO } from '../../../models/usuario';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatCardModule, MatSnackBarModule
  ],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css'
})
export class UsuarioForm implements OnInit {

  form!: FormGroup;
  modoEdicion = false;
  usuarioId?: number;

  roles = ['ADMIN', 'BIBLIOTECARIO', 'ESTUDIANTE'];
  estados = ['ACTIVO', 'INACTIVO'];

  constructor(
    private fb: FormBuilder,
    private usuarioService: Usuarioservice,
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
      rol:       ['', [Validators.required]],
      carrera:   [''],
      ciclo:     [null],
      estado:    ['ACTIVO', [Validators.required]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.usuarioId = +id;
      this.cargarUsuario(this.usuarioId);
      // En edición la contraseña es opcional
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    } else {
      // En creación la contraseña es obligatoria
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  cargarUsuario(id: number): void {
    this.usuarioService.buscarPorId(id).subscribe({
      next: (u) => {
        this.form.patchValue({
          username: u.username,
          nombre:   u.nombre,
          dni:      u.dni,
          codigo:   u.codigo,
          carnet:   u.carnet,
          email:    u.email,
          telefono: u.telefono,
          rol:      u.rol,
          carrera:  u.carrera,
          ciclo:    u.ciclo,
          estado:   u.estado,
          // password vacío en edición
        });
      },
      error: () => this.snackBar.open('No se encontró el usuario', 'Cerrar', { duration: 3000 })
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: UsuarioDTO = { ...this.form.value };

    if (this.modoEdicion && this.usuarioId) {
      dto.idUsuario = this.usuarioId;
      // Si no escribió contraseña en edición, no la mandamos
      if (!dto.password) delete dto.password;

      this.usuarioService.actualizar(dto).subscribe({
        next: () => {
          this.snackBar.open('Usuario actualizado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/usuarios/listar']);
        },
        error: (err) => {
          const msg = err?.error || 'Error al actualizar el usuario';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      });
    } else {
      this.usuarioService.registrar(dto).subscribe({
        next: () => {
          this.snackBar.open('Usuario registrado', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/usuarios/listar']);
        },
        error: (err) => {
          const msg = err?.error || 'Error al registrar el usuario';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
        }
      });
    }
  }
}
