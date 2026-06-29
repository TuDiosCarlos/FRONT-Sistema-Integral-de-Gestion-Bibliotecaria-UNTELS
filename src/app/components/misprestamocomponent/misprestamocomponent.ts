import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PrestamoMock {
  libro: string;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: string;
  dias: number;
  sancion?: string;
}

@Component({
  selector: 'app-misprestamocomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './misprestamocomponent.html',
  styleUrls: ['./misprestamocomponent.css'],
})
export class Misprestamocomponent {
  prestamos: PrestamoMock[] = [];
  mensaje = 'Los datos de tus préstamos se cargarán desde el backend.';
  estadoFiltro = 'Todos';
  estados = ['Todos', 'Activos', 'Vencidos', 'Devueltos', 'Rechazados'];

  filtrar(): void {
    if (this.prestamos.length === 0) {
      this.mensaje = `Filtrando por estado: ${this.estadoFiltro}. El backend completará los datos más adelante.`;
      return;
    }

    const filtrados = this.prestamos.filter(prestamo =>
      this.estadoFiltro === 'Todos' || prestamo.estado === this.estadoFiltro
    );

    if (filtrados.length === 0) {
      this.mensaje = `No hay préstamos con estado ${this.estadoFiltro}.`;
    } else {
      this.mensaje = `Mostrando ${filtrados.length} préstamo(s) con estado ${this.estadoFiltro}.`;
    }

    this.prestamos = filtrados;
  }

  actualizar(): void {
    this.mensaje = 'Actualizando datos...';
    setTimeout(() => {
      this.mensaje = 'Los datos se cargarán desde el backend.';
    }, 700);
  }
}

