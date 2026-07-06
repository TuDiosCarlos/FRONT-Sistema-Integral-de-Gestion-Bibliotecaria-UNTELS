import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Authservice } from '../../services/authservice';

@Component({
  selector: 'app-accesodenegadocomponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accesodenegadocomponent.html',
  styleUrls: ['./accesodenegadocomponent.css'],
})
export class Accesodenegadocomponent {
  rolUsuario = '';

  constructor(
    private authService: Authservice,
    private router: Router
  ) {
    this.rolUsuario = this.authService.getRol() ?? '';
  }

  volverAlInicio(): void {
    this.router.navigate(['/home']);
  }
}
