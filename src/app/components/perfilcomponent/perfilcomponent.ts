import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Authservice } from '../../services/authservice';
import { Usuarioservice } from '../../services/usuarioservice';
import { Usuario } from '../../models/usuario';

// Misma clave que usa Authservice para guardar el usuario logueado en
// localStorage. No se expone un setter público desde ese servicio (no se
// debe tocar la lógica de login), así que aquí solo se refresca el nombre
// mostrado en el sidebar tras editar el perfil.
const USUARIO_KEY = 'usuarioActual';

@Component({
  selector: 'app-perfilcomponent',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSnackBarModule,
  ],
  templateUrl: './perfilcomponent.html',
  styleUrl: './perfilcomponent.css',
})
export class Perfilcomponent implements OnInit {
  usuario: Usuario | null = null;

  formContacto!: FormGroup;
  formPassword!: FormGroup;
  guardandoContacto = false;
  cambiandoPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private usuarioService: Usuarioservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuarioActual();

    this.formContacto = this.fb.group({
      nombre: [this.usuario?.nombre || '', [Validators.required, Validators.minLength(2)]],
      email: [this.usuario?.email || '', [Validators.required, Validators.email]],
      telefono: [this.usuario?.telefono || ''],
    });

    this.formPassword = this.fb.group({
      passwordActual: ['', [Validators.required]],
      passwordNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
    });
  }

  guardarContacto(): void {
    if (this.formContacto.invalid) {
      this.formContacto.markAllAsTouched();
      return;
    }

    this.guardandoContacto = true;
    this.usuarioService.actualizarMiPerfil(this.formContacto.value).subscribe({
      next: () => {
        this.guardandoContacto = false;
        this.snackBar.open('Datos de contacto actualizados', 'Cerrar', { duration: 3000 });
        this.refrescarUsuarioLocal(this.formContacto.value);
      },
      error: (err) => {
        this.guardandoContacto = false;
        const msg = typeof err?.error === 'string' ? err.error : 'Error al actualizar los datos de contacto';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }

  cambiarPassword(): void {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }

    const { passwordActual, passwordNueva, confirmarPassword } = this.formPassword.value;

    if (passwordNueva !== confirmarPassword) {
      this.snackBar.open('La nueva contraseña y su confirmación no coinciden', 'Cerrar', { duration: 4000 });
      return;
    }

    this.cambiandoPassword = true;
    this.usuarioService.cambiarPassword(passwordActual, passwordNueva).subscribe({
      next: () => {
        this.cambiandoPassword = false;
        this.snackBar.open('Contraseña actualizada correctamente', 'Cerrar', { duration: 3000 });
        this.formPassword.reset();
      },
      error: (err) => {
        this.cambiandoPassword = false;
        const msg = typeof err?.error === 'string' ? err.error : 'Error al cambiar la contraseña';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }

  private refrescarUsuarioLocal(datos: { nombre: string; email: string; telefono: string }): void {
    if (!this.usuario || typeof window === 'undefined') return;

    this.usuario = { ...this.usuario, ...datos };
    localStorage.setItem(USUARIO_KEY, JSON.stringify(this.usuario));
  }
}
