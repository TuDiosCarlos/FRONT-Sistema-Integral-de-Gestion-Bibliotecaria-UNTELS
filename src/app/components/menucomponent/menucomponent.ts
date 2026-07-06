import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Authservice } from '../../services/authservice';

interface ItemMenu {
  ruta: string;
  etiqueta: string;
  icono: string;
  roles: string[];
}

const ITEMS_MENU: ItemMenu[] = [
  { ruta: '/home', etiqueta: 'Inicio', icono: 'home', roles: ['ADMIN', 'BIBLIOTECARIO', 'ESTUDIANTE'] },
  { ruta: '/catalogo', etiqueta: 'Catálogo', icono: 'auto_stories', roles: ['ESTUDIANTE'] },
  { ruta: '/libros', etiqueta: 'Libros', icono: 'menu_book', roles: ['BIBLIOTECARIO'] },
  { ruta: '/prestamos', etiqueta: 'Préstamos', icono: 'swap_horiz', roles: ['BIBLIOTECARIO'] },
  { ruta: '/sanciones', etiqueta: 'Sanciones', icono: 'gavel', roles: ['BIBLIOTECARIO'] },
  { ruta: '/misprestamos', etiqueta: 'Mis préstamos', icono: 'assignment', roles: ['ESTUDIANTE'] },
  { ruta: '/estudiantes', etiqueta: 'Estudiantes', icono: 'school', roles: ['ADMIN', 'BIBLIOTECARIO'] },
  { ruta: '/usuarios', etiqueta: 'Usuarios', icono: 'manage_accounts', roles: ['ADMIN'] },
  { ruta: '/configuracion', etiqueta: 'Configuración', icono: 'settings', roles: ['ADMIN'] },
  { ruta: '/perfil', etiqueta: 'Mi perfil', icono: 'person', roles: ['ADMIN', 'BIBLIOTECARIO', 'ESTUDIANTE'] },
];

@Component({
  selector: 'app-menucomponent',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule, MatTooltipModule],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent implements OnInit {
  itemsVisibles: ItemMenu[] = [];
  nombreUsuario = '';
  rolUsuario = '';

  constructor(private authService: Authservice) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();
    this.rolUsuario = usuario?.rol ?? '';
    this.nombreUsuario = usuario?.nombre || usuario?.username || '';
    this.itemsVisibles = ITEMS_MENU.filter((item) => item.roles.includes(this.rolUsuario));
  }

  cerrarSesion(): void {
    this.authService.logout();
  }
}
