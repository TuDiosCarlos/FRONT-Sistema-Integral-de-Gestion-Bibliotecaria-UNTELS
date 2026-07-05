import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Usuarioservice } from '../../services/usuarioservice';
import { Authservice } from '../../services/authservice';
import { Usuario, UsuarioDTO } from '../../models/usuario';

@Component({
  selector: 'app-perfilcomponent',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule
  ],
  templateUrl: './perfilcomponent.html',
  styleUrl: './perfilcomponent.css',
})
export class Perfilcomponent implements OnInit {

  form: FormGroup;
  datosSoloLectura?: Usuario;

  constructor(
    private fb: FormBuilder,
    private usuarioService: Usuarioservice,
    private authService: Authservice,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      passwordNueva: ['', [Validators.minLength(6)]],
      passwordConfirmar: ['', [Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    const id = this.authService.getIdUsuario();
    if (id == null) return;

    this.usuarioService.buscarPorId(id).subscribe({
      next: (u) => {
        this.datosSoloLectura = u;
        this.form.patchValue({ nombre: u.nombre, email: u.email, telefono: u.telefono });
      },
      error: () => this.snackBar.open('No se pudo cargar tu perfil', 'Cerrar', { duration: 3000 })
    });
  }

  guardar(): void {
    if (this.form.invalid || !this.datosSoloLectura) {
      this.form.markAllAsTouched();
      return;
    }

    const nueva = this.form.value.passwordNueva;
    const confirmar = this.form.value.passwordConfirmar;

    if (nueva && nueva !== confirmar) {
      this.snackBar.open('La nueva contraseña y su confirmación no coinciden', 'Cerrar', { duration: 3000 });
      return;
    }

    const dto: UsuarioDTO = {
      ...this.datosSoloLectura,
      nombre: this.form.value.nombre,
      email: this.form.value.email,
      telefono: this.form.value.telefono,
    };

    if (nueva) {
      dto.password = nueva;
    } else {
      delete dto.password;
    }

    this.usuarioService.actualizar(dto).subscribe({
      next: () => {
        this.snackBar.open('Perfil actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.form.patchValue({ passwordNueva: '', passwordConfirmar: '' });
      },
      error: (err) => {
        const msg = err?.error || 'No se pudo actualizar el perfil';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
