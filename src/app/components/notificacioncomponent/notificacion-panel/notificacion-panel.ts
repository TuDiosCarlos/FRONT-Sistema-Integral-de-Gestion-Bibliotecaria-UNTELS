import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { catchError, interval, of, startWith } from 'rxjs';

import { Authservice } from '../../../services/authservice';
import { Notificacionservice } from '../../../services/notificacionservice';

interface Notificacion {
  idNotificacion: number;
  idEstudiante: number;
  tipo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

@Component({
  selector: 'app-notificacion-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './notificacion-panel.html',
  styleUrl: './notificacion-panel.css',
})
export class NotificacionPanel implements OnInit {
  notificaciones: Notificacion[] = [];
  panelAbierto = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private authService: Authservice,
    private notificacionService: Notificacionservice,
  ) {}

  get noLeidas(): number {
    return this.notificaciones.filter((n) => !n.leida).length;
  }

  ngOnInit(): void {
    // Sondea cada 20s para que el contador de no-leidas se mantenga al dia
    // sin depender de que el usuario abra el panel manualmente.
    interval(20000)
      .pipe(startWith(0), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cargarNotificaciones());
  }

  private idUsuarioActual(): number | undefined {
    return this.authService.getUsuarioActual()?.idUsuario;
  }

  cargarNotificaciones(): void {
    const idUsuario = this.idUsuarioActual();
    if (!idUsuario) return;

    this.notificacionService.buscarPorEstudiante(idUsuario)
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.notificaciones = (data || []).sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
      });
  }

  togglePanel(): void {
    this.panelAbierto = !this.panelAbierto;
    if (this.panelAbierto) {
      this.cargarNotificaciones();
    }
  }

  marcarTodasLeidas(): void {
    const idUsuario = this.idUsuarioActual();
    if (!idUsuario || this.noLeidas === 0) return;

    this.notificacionService.marcarLeidas(idUsuario).subscribe(() => {
      this.notificaciones = this.notificaciones.map((n) => ({ ...n, leida: true }));
    });
  }

  iconoPorTipo(tipo: string): string {
    switch (tipo) {
      case 'confirmacion': return 'check_circle';
      case 'rechazo': return 'cancel';
      case 'recordatorio': return 'schedule';
      case 'vencido': return 'warning';
      case 'sancion': return 'gavel';
      case 'nueva_solicitud': return 'inbox';
      default: return 'notifications';
    }
  }

  @HostListener('document:click', ['$event'])
  cerrarSiClickAfuera(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notificacion-panel-wrapper')) {
      this.panelAbierto = false;
    }
  }
}
