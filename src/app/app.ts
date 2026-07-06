import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { Menucomponent } from './components/menucomponent/menucomponent';
import { Authservice } from './services/authservice';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Menucomponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  mostrarMenu = false;

  constructor(
    private router: Router,
    private authService: Authservice
  ) {
    this.actualizarMenu(this.router.url);

    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e) => {
      this.actualizarMenu((e as NavigationEnd).urlAfterRedirects);
    });
  }

  private actualizarMenu(url: string): void {
    const esRutaPublica = url === '/' || url.startsWith('/inicio') || url.startsWith('/login');
    this.mostrarMenu = this.authService.isLoggedIn() && !esRutaPublica;
  }
}
