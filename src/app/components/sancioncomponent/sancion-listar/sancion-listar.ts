import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Sancion } from '../../../models/sancion';
import { SancionService } from '../../../services/sancionservice';

@Component({
  selector: 'app-sancion-listar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sancion-listar.html',
  styleUrl: './sancion-listar.css'
})
export class SancionListar implements OnInit {

  private sancionService = inject(SancionService);

  listaSanciones: Sancion[] = [];
  estadoFiltro: string = '';

  cargando: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.listar();
  }

  listar(): void {

    this.cargando = true;

    this.sancionService.listar().subscribe({
      next: (data) => {
        this.listaSanciones = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.cargando = false;
      }
    });

  }

  filtrarPorEstado(): void {

    if (this.estadoFiltro === '') {
      this.listar();
      return;
    }

    this.cargando = true;

    this.sancionService.buscarPorEstado(this.estadoFiltro)
      .subscribe({
        next: (data) => {
          this.listaSanciones = data;
          this.cargando = false;
        },
        error: (error) => {
          console.error(error);
          this.cargando = false;
        }
      });

  }

  cumplir(idSancion: number): void {

    const confirmar = confirm(
      '¿Desea marcar la sanción como cumplida?'
    );

    if (!confirmar) return;

    this.sancionService.cumplirSancion(idSancion)
      .subscribe({
        next: (mensaje) => {

          alert(mensaje);

          this.listar();

        },
        error: (error) => {

          console.error(error);

          alert('No se pudo actualizar la sanción');

        }
      });

  }

}