import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-menucomponent',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent {

  constructor(
    private authService: Authservice,
    private router: Router
  ) {}

  get autenticado(): boolean {
    return this.authService.isAuthenticated();
  }

  get rol(): string | null {
    return this.authService.getRol();
  }

  get nombre(): string | null {
    return this.authService.getNombre();
  }

  get esAdmin(): boolean {
    return this.rol === 'ADMIN';
  }

  get esBibliotecario(): boolean {
    return this.rol === 'BIBLIOTECARIO';
  }

  get esEstudiante(): boolean {
    return this.rol === 'ESTUDIANTE';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
