import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of } from 'rxjs';

import { Usuarioservice } from '../../../services/usuarioservice';
import { Prestamoservice } from '../../../services/prestamoservice';
import { Usuario } from '../../../models/usuario';
import { Prestamo } from '../../../models/prestamo';

// HUF03.8: detalle completo de un estudiante con su historial de préstamos.
@Component({
  selector: 'app-estudiante-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatChipsModule, MatButtonModule, MatIconModule],
  templateUrl: './estudiante-detalle.html',
  styleUrl: './estudiante-detalle.css'
})
export class EstudianteDetalle implements OnInit {
  estudiante: Usuario | null = null;
  prestamos: Prestamo[] = [];
  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: Usuarioservice,
    private prestamoService: Prestamoservice
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.cargando = true;
    this.usuarioService.buscarPorId(id).subscribe({
      next: (data) => { this.estudiante = data; },
      error: () => { this.estudiante = null; }
    });

    this.prestamoService.buscarPorEstudiante(id)
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.cargando = false;
        this.prestamos = data.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
      });
  }
}
