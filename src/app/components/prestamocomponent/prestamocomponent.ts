import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-prestamocomponent',
  standalone: true,
  imports: [RouterOutlet], // Permite que Angular renderice las rutas hijas dentro
  template: `<router-outlet></router-outlet>` // Vista contenedora
})
export class Prestamocomponent {}