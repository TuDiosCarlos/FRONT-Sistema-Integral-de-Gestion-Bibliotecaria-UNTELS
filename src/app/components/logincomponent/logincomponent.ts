import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-logincomponent',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
  ],
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class Logincomponent implements OnInit {
  private fb          = inject(FormBuilder);
  private router      = inject(Router);
  private authService = inject(Authservice);

  form!: FormGroup;
  mostrarPassword = false;
  cargando        = false;
  errorMsg        = '';

  ngOnInit(): void {
    if (this.authService.isAutenticado()) {
      this.router.navigate(['/home']);
      return;
    }
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorMsg = '';
    const { username, password } = this.form.value;

    this.authService.login(username, password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 401 || err.status === 0) {
          this.errorMsg = 'Usuario o contraseña incorrectos.';
        } else {
          this.errorMsg = 'Error al conectar con el servidor. Intenta nuevamente.';
        }
      },
    });
  }
}
