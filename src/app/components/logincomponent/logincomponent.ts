import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-logincomponent',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCardModule,
  ],
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class Logincomponent {
  form: FormGroup;
  cargando = false;
  errorMensaje = '';
  ocultarPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: Authservice,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  ingresar(): void {
    this.errorMensaje = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando = false;

        if (err.status === 0) {
          this.errorMensaje = 'No se pudo conectar con el servidor. Verifica que el backend esté disponible.';
        } else if (err.status === 401 || err.status === 403 || err.status === 500) {
          this.errorMensaje = 'Usuario o contraseña incorrectos.';
        } else {
          this.errorMensaje = 'Ocurrió un error al iniciar sesión. Intenta nuevamente.';
        }
      },
    });
  }
}
