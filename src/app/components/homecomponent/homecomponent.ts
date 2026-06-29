import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-homecomponent',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
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
