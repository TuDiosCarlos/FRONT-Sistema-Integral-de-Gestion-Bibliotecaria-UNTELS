import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Notificacion } from '../../../models/notificacion';
import { NotificacionService } from '../../../services/notificacionservice';

@Component({
  selector: 'app-notificacion-panel',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './notificacion-panel.html',
  styleUrl: './notificacion-panel.css'
})
export class NotificacionPanel implements OnInit {

  private notificacionService = inject(NotificacionService);

  listaNotificaciones: Notificacion[] = [];

  cargando: boolean = false;

  /*
    Temporal:
    posteriormente el id se obtendrá del usuario autenticado
  */
  idEstudiante: number = 1;

  constructor() { }

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {

    this.cargando = true;

    this.notificacionService
      .buscarPorEstudiante(this.idEstudiante)
      .subscribe({
        next: (data) => {

          this.listaNotificaciones = data;

          this.cargando = false;

        },
        error: (error) => {

          console.error(error);

          this.cargando = false;

        }
      });

  }

  marcarLeidas(): void {

    const confirmar = confirm(
      '¿Desea marcar todas las notificaciones como leídas?'
    );

    if (!confirmar) return;

    this.notificacionService
      .marcarLeidas(this.idEstudiante)
      .subscribe({
        next: (mensaje) => {

          alert(mensaje);

          this.listar();

        },
        error: (error) => {

          console.error(error);

          alert('No se pudieron actualizar las notificaciones');

        }
      });

  }

}