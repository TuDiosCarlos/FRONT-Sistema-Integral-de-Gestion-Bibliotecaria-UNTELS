import { Routes } from '@angular/router';

import { authguardGuard } from './guards/authguard-guard';
import { roleGuard } from './guards/role-guard';
import { Logincomponent } from './components/logincomponent/logincomponent';

import { Estudiantecomponent } from './components/estudiantecomponent/estudiantecomponent';
import { EstudianteListar } from './components/estudiantecomponent/estudiante-listar/estudiante-listar';
import { EstudianteForm } from './components/estudiantecomponent/estudiante-form/estudiante-form';
import { EstudianteDetalle } from './components/estudiantecomponent/estudiante-detalle/estudiante-detalle';

import { Usuariocomponent } from './components/usuariocomponent/usuariocomponent';
import { UsuarioListar } from './components/usuariocomponent/usuario-listar/usuario-listar';
import { UsuarioForm } from './components/usuariocomponent/usuario-form/usuario-form';

import { Librocomponent } from './components/librocomponent/librocomponent';
import { LibroListar } from './components/librocomponent/libro-listar/libro-listar';
import { LibroForm } from './components/librocomponent/libro-form/libro-form';

import { Homecomponent } from './components/homecomponent/homecomponent';
import { Accesodenegadocomponent } from './components/accesodenegadocomponent/accesodenegadocomponent';
import { Catalogocomponent } from './components/catalogocomponent/catalogocomponent';
import { CatalogoListar } from './components/catalogocomponent/catalogo-listar/catalogo-listar';
import { Misprestamocomponent } from './components/misprestamocomponent/misprestamocomponent';
import { Configuracioncomponent } from './components/configuracioncomponent/configuracioncomponent';
import { Landingcomponent } from './components/landingcomponent/landingcomponent';

// TUS NUEVAS IMPORTACIONES (MÓDULO DE JAIR)
import { Prestamocomponent } from './components/prestamocomponent/prestamocomponent';
import { PrestamoBandejaComponent } from './components/prestamocomponent/prestamo-bandeja/prestamo-bandeja.component';
import { PrestamoVigentesComponent } from './components/prestamocomponent/prestamo-vigentes/prestamo-vigentes.component';
import { PrestamoHistorialComponent } from './components/prestamocomponent/prestamo-historial/prestamo-historial.component';

import { Sancioncomponent } from './components/sancioncomponent/sancioncomponent';
import { SancionListar } from './components/sancioncomponent/sancion-listar/sancion-listar';

import { Perfilcomponent } from './components/perfilcomponent/perfilcomponent';

const ADMIN = 'ADMIN';
const BIBLIOTECARIO = 'BIBLIOTECARIO';
const ESTUDIANTE = 'ESTUDIANTE';

export const routes: Routes = [
  { path: '', component: Landingcomponent },
  { path: 'inicio', component: Landingcomponent },

  { path: 'login', component: Logincomponent },

  { path: '403', component: Accesodenegadocomponent, canActivate: [authguardGuard] },

  { path: 'home', component: Homecomponent, canActivate: [authguardGuard] },

  { path: 'perfil', component: Perfilcomponent, canActivate: [authguardGuard] },

  {
    path: 'catalogo',
    component: Catalogocomponent,
    canActivate: [authguardGuard, roleGuard([ESTUDIANTE])],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: CatalogoListar },
    ]
  },

  {
    path: 'misprestamos',
    component: Misprestamocomponent,
    canActivate: [authguardGuard, roleGuard([ESTUDIANTE])],
  },
  {
    path: 'configuracion',
    component: Configuracioncomponent,
    canActivate: [authguardGuard, roleGuard([ADMIN])],
  },

  {
    path: 'estudiantes',
    component: Estudiantecomponent,
    canActivate: [authguardGuard, roleGuard([ADMIN, BIBLIOTECARIO])],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: EstudianteListar },
      { path: 'nuevo', component: EstudianteForm },
      { path: 'editar/:id', component: EstudianteForm },
      { path: 'detalle/:id', component: EstudianteDetalle },
    ]
  },

  {
    path: 'usuarios',
    component: Usuariocomponent,
    canActivate: [authguardGuard, roleGuard([ADMIN])],
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
    canActivate: [authguardGuard, roleGuard([BIBLIOTECARIO])],
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
    canActivate: [authguardGuard, roleGuard([BIBLIOTECARIO])],
    children: [
      { path: '', redirectTo: 'bandeja', pathMatch: 'full' },
      { path: 'bandeja', component: PrestamoBandejaComponent },
      { path: 'vigentes', component: PrestamoVigentesComponent },
      { path: 'historial', component: PrestamoHistorialComponent }
    ]
  },

  {
    path: 'sanciones',
    component: Sancioncomponent,
    canActivate: [authguardGuard, roleGuard([BIBLIOTECARIO])],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: SancionListar },
    ]
  }
];