import { Routes } from '@angular/router';

import { authguardGuard } from './guards/authguard-guard';
import { Logincomponent } from './components/logincomponent/logincomponent';

import { Estudiantecomponent } from './components/estudiantecomponent/estudiantecomponent';
import { EstudianteListar } from './components/estudiantecomponent/estudiante-listar/estudiante-listar';
import { EstudianteForm } from './components/estudiantecomponent/estudiante-form/estudiante-form';

import { Usuariocomponent } from './components/usuariocomponent/usuariocomponent';
import { UsuarioListar } from './components/usuariocomponent/usuario-listar/usuario-listar';
import { UsuarioForm } from './components/usuariocomponent/usuario-form/usuario-form';

import { Librocomponent } from './components/librocomponent/librocomponent';
import { LibroListar } from './components/librocomponent/libro-listar/libro-listar';
import { LibroForm } from './components/librocomponent/libro-form/libro-form';

import { Homecomponent } from './components/homecomponent/homecomponent';
import { Catalogocomponent } from './components/catalogocomponent/catalogocomponent';
import { CatalogoListar } from './components/catalogocomponent/catalogo-listar/catalogo-listar';
import { Misprestamocomponent } from './components/misprestamocomponent/misprestamocomponent';
import { Configuracioncomponent } from './components/configuracioncomponent/configuracioncomponent';

// TUS NUEVAS IMPORTACIONES (MÓDULO DE JAIR)
import { Prestamocomponent } from './components/prestamocomponent/prestamocomponent';
import { PrestamoBandejaComponent } from './components/prestamocomponent/prestamo-bandeja/prestamo-bandeja.component';
import { PrestamoVigentesComponent } from './components/prestamocomponent/prestamo-vigentes/prestamo-vigentes.component';

import { Sancioncomponent } from './components/sancioncomponent/sancioncomponent';
import { SancionListar } from './components/sancioncomponent/sancion-listar/sancion-listar';

import { Notificacioncomponent } from './components/notificacioncomponent/notificacioncomponent';
import { NotificacionPanel } from './components/notificacioncomponent/notificacion-panel/notificacion-panel';

import { Perfilcomponent } from './components/perfilcomponent/perfilcomponent';

const ADMIN = 'ADMIN';
const BIBLIOTECARIO = 'BIBLIOTECARIO';
const ESTUDIANTE = 'ESTUDIANTE';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Logincomponent },

  { path: 'home', component: Homecomponent, canActivate: [authguardGuard] },
  { path: 'perfil', component: Perfilcomponent, canActivate: [authguardGuard] },

  {
    path: 'catalogo',
    component: Catalogocomponent,
    canActivate: [authguardGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: CatalogoListar },
    ]
  },

  {
    path: 'misprestamos',
    component: Misprestamocomponent,
    canActivate: [authguardGuard],
    data: { roles: [ESTUDIANTE] }
  },

  {
    path: 'configuracion',
    component: Configuracioncomponent,
    canActivate: [authguardGuard],
    data: { roles: [ADMIN, BIBLIOTECARIO] }
  },

  {
    path: 'estudiantes',
    component: Estudiantecomponent,
    canActivate: [authguardGuard],
    data: { roles: [ADMIN, BIBLIOTECARIO] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: EstudianteListar },
      { path: 'nuevo', component: EstudianteForm },
      { path: 'editar/:id', component: EstudianteForm },
    ]
  },

  {
    path: 'usuarios',
    component: Usuariocomponent,
    canActivate: [authguardGuard],
    data: { roles: [ADMIN] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: UsuarioListar },
      { path: 'nuevo', component: UsuarioForm },
      { path: 'editar/:id', component: UsuarioForm },
    ]
  },

  {
    path: 'libros',
    component: Librocomponent,
    canActivate: [authguardGuard],
    data: { roles: [ADMIN, BIBLIOTECARIO] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: LibroListar },
      { path: 'nuevo', component: LibroForm },
      { path: 'editar/:id', component: LibroForm },
    ]
  },

  // TU NUEVO BLOQUE DE RUTAS (MÓDULO DE JAIR)
  {
    path: 'prestamos',
    component: Prestamocomponent,
    canActivate: [authguardGuard],
    data: { roles: [ADMIN, BIBLIOTECARIO] },
    children: [
      { path: '', redirectTo: 'bandeja', pathMatch: 'full' },
      { path: 'bandeja', component: PrestamoBandejaComponent },
      { path: 'vigentes', component: PrestamoVigentesComponent }
    ]
  },

  {
    path: 'sanciones',
    component: Sancioncomponent,
    canActivate: [authguardGuard],
    data: { roles: [ADMIN, BIBLIOTECARIO] },
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: SancionListar },
    ]
  },

  {
    path: 'notificaciones',
    component: Notificacioncomponent,
    canActivate: [authguardGuard],
    children: [
      { path: '', redirectTo: 'panel', pathMatch: 'full' },
      { path: 'panel', component: NotificacionPanel },
    ]
  },
];
