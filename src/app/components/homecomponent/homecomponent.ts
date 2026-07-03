import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-homecomponent',
  standalone: true,
  standalone: true,
  imports: [CommonModuleMatCardModule, MatIconModule],
  templateUrl: './homecomponent.html',
  styleUrls: ['./homecomponent.css'],
})
export class Homecomponent implements OnInit {
  private authService = inject(Authservice);

  nombre = '';
  rol    = '';

  ngOnInit(): void {
    this.nombre = this.authService.obtenerNombre() ?? 'Usuario';
    this.rol    = this.authService.obtenerRol()    ?? '';
  }
}
