import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

import { Authservice } from '../../services/authservice';
import { Prestamoservice } from '../../services/prestamoservice';
import { Prestamo } from '../../models/prestamo';

@Component({
  selector: 'app-misprestamocomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './misprestamocomponent.html',
  styleUrls: ['./misprestamocomponent.css'],
})
export class Misprestamocomponent implements OnInit {
  prestamosTodos: Prestamo[] = [];
  prestamos: Prestamo[] = [];
  mensaje = 'Cargando tus préstamos...';
  estadoFiltro = 'todos';
  estados = ['todos', 'solicitado', 'vigente', 'vencido', 'devuelto', 'rechazado'];
  cargando = false;
  contadores = { solicitado: 0, vigente: 0, vencido: 0, devuelto: 0, rechazado: 0 };

  constructor(
    private authService: Authservice,
    private prestamoService: Prestamoservice
  ) {}

  ngOnInit(): void {
    this.cargarPrestamos();
  }

  cargarPrestamos(): void {
    this.cargando = true;
    const idEstudiante = this.authService.getUsuarioActual()?.idUsuario;

    if (!idEstudiante) {
      this.mensaje = 'No se pudo obtener tu ID de estudiante.';
      this.cargando = false;
      return;
    }

    this.prestamoService.buscarPorEstudiante(idEstudiante)
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.cargando = false;
        this.prestamosTodos = data;
        this.actualizarContadores();

        if (this.prestamosTodos.length === 0) {
          this.mensaje = 'No tienes préstamos registrados.';
          this.prestamos = [];
        } else {
          this.filtrar();
        }
      });
  }

  actualizarContadores(): void {
    this.contadores = {
      solicitado: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'solicitado').length,
      vigente: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'vigente').length,
      vencido: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'vencido').length,
      devuelto: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'devuelto').length,
      rechazado: this.prestamosTodos.filter(p => p.estado?.toLowerCase() === 'rechazado').length,
    };
  }

  filtrar(): void {
    const filtrados = this.prestamosTodos.filter(prestamo =>
      this.estadoFiltro === 'todos' || prestamo.estado?.toLowerCase() === this.estadoFiltro.toLowerCase()
    );

    if (filtrados.length === 0) {
      this.mensaje = `No hay préstamos con estado ${this.estadoFiltro}.`;
      this.prestamos = [];
    } else {
      this.mensaje = ``;
      this.prestamos = filtrados;
    }
  }

  actualizar(): void {
    this.cargarPrestamos();
  }
}

