import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-menucomponent',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent implements OnInit {
  private authService = inject(Authservice);

  nombre   = '';
  rol      = '';
  iniciales = '';

  ngOnInit(): void {
    this.nombre    = this.authService.obtenerNombre()   ?? 'Usuario';
    this.rol       = this.authService.obtenerRol()      ?? '';
    this.iniciales = this.calcularIniciales(this.nombre);
  }

  private calcularIniciales(nombre: string): string {
    return nombre
      .split(' ')
      .slice(0, 2)
      .map(n => n[0] ?? '')
      .join('')
      .toUpperCase();
  }

  get esAdmin():        boolean { return this.rol === 'ADMIN'; }
  get esBibliotecario(): boolean { return this.rol === 'BIBLIOTECARIO'; }
  get esEstudiante():   boolean { return this.rol === 'ESTUDIANTE'; }

  logout(): void {
    this.authService.logout();
  }
}
