import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Notificacionservice } from '../../../services/notificacionservice';
import { Notificacion } from '../../../models/notificacion';
import { Authservice } from '../../../services/authservice';

@Component({
  selector: 'app-notificacion-panel',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatBadgeModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './notificacion-panel.html',
  styleUrl: './notificacion-panel.css',
})
export class NotificacionPanel implements OnInit {

  notificaciones: Notificacion[] = [];
  pendientes: number = 0;

  constructor(
    private notificacionService: Notificacionservice,
    private authService: Authservice,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarNotificaciones();
  }

  cargarNotificaciones(): void {
    const idUsuario = this.authService.getIdUsuario();
    if (idUsuario == null) return;

    this.notificacionService.buscarPorEstudiante(idUsuario).subscribe({
      next: (data) => {
        this.notificaciones = data;
        this.pendientes = data.filter(n => !n.leida).length;
      },
      error: () => this.snackBar.open('Error al cargar notificaciones', 'Cerrar', { duration: 3000 })
    });
  }

  marcarTodasLeidas(): void {
    const idUsuario = this.authService.getIdUsuario();
    if (idUsuario == null) return;

    this.notificacionService.marcarLeidas(idUsuario).subscribe({
      next: () => this.cargarNotificaciones(),
      error: () => this.snackBar.open('Error al marcar notificaciones', 'Cerrar', { duration: 3000 })
    });
  }
}
