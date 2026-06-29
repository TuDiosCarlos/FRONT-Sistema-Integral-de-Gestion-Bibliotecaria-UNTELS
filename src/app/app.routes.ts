import { Routes } from '@angular/router';
import { authguardGuard } from './guards/authguard';

import { Logincomponent }        from './components/logincomponent/logincomponent';
import { MainLayoutComponent }   from './components/mainlayout/mainlayout';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized';

import { Homecomponent }          from './components/homecomponent/homecomponent';
import { Estudiantecomponent }    from './components/estudiantecomponent/estudiantecomponent';
import { EstudianteListar }       from './components/estudiantecomponent/estudiante-listar/estudiante-listar';
import { EstudianteForm }         from './components/estudiantecomponent/estudiante-form/estudiante-form';
import { Usuariocomponent }       from './components/usuariocomponent/usuariocomponent';
import { UsuarioListar }          from './components/usuariocomponent/usuario-listar/usuario-listar';
import { UsuarioForm }            from './components/usuariocomponent/usuario-form/usuario-form';
import { Librocomponent }         from './components/librocomponent/librocomponent';
import { LibroListar }            from './components/librocomponent/libro-listar/libro-listar';
import { LibroForm }              from './components/librocomponent/libro-form/libro-form';
import { Catalogocomponent }      from './components/catalogocomponent/catalogocomponent';
import { Prestamocomponent }      from './components/prestamocomponent/prestamocomponent';
import { Sancioncomponent }       from './components/sancioncomponent/sancioncomponent';
import { Notificacioncomponent }  from './components/notificacioncomponent/notificacioncomponent';
import { Misprestamocomponent }   from './components/misprestamocomponent/misprestamocomponent';
import { Configuracioncomponent } from './components/configuracioncomponent/configuracioncomponent';

export const routes: Routes = [
  { path: 'login',        component: Logincomponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authguardGuard],
    children: [
      { path: 'home', component: Homecomponent },

      // ─── ADMIN ───────────────────────────────────────────────────
      {
        path: 'usuarios',
        component: Usuariocomponent,
        canActivate: [authguardGuard],
        data: { roles: ['ADMIN'] },
        children: [
          { path: '',           redirectTo: 'listar', pathMatch: 'full' },
          { path: 'listar',     component: UsuarioListar },
          { path: 'nuevo',      component: UsuarioForm },
          { path: 'editar/:id', component: UsuarioForm },
        ],
      },
      {
        path: 'estudiantes',
        component: Estudiantecomponent,
        canActivate: [authguardGuard],
        data: { roles: ['ADMIN'] },
        children: [
          { path: '',           redirectTo: 'listar', pathMatch: 'full' },
          { path: 'listar',     component: EstudianteListar },
          { path: 'nuevo',      component: EstudianteForm },
          { path: 'editar/:id', component: EstudianteForm },
        ],
      },
      {
        path: 'configuracion',
        component: Configuracioncomponent,
        canActivate: [authguardGuard],
        data: { roles: ['ADMIN'] },
      },

      // ─── ADMIN + BIBLIOTECARIO ────────────────────────────────────
      {
        path: 'libros',
        component: Librocomponent,
        canActivate: [authguardGuard],
        data: { roles: ['ADMIN', 'BIBLIOTECARIO'] },
        children: [
          { path: '',           redirectTo: 'listar', pathMatch: 'full' },
          { path: 'listar',     component: LibroListar },
          { path: 'nuevo',      component: LibroForm },
          { path: 'editar/:id', component: LibroForm },
        ],
      },

      // ─── BIBLIOTECARIO ────────────────────────────────────────────
      {
        path: 'prestamos',
        component: Prestamocomponent,
        canActivate: [authguardGuard],
        data: { roles: ['BIBLIOTECARIO'] },
      },
      {
        path: 'sanciones',
        component: Sancioncomponent,
        canActivate: [authguardGuard],
        data: { roles: ['BIBLIOTECARIO'] },
      },
      {
        path: 'notificaciones',
        component: Notificacioncomponent,
        canActivate: [authguardGuard],
        data: { roles: ['BIBLIOTECARIO'] },
      },

      // ─── ESTUDIANTE ───────────────────────────────────────────────
      {
        path: 'catalogo',
        component: Catalogocomponent,
        canActivate: [authguardGuard],
        data: { roles: ['ESTUDIANTE', 'BIBLIOTECARIO'] },
      },
      {
        path: 'misprestamos',
        component: Misprestamocomponent,
        canActivate: [authguardGuard],
        data: { roles: ['ESTUDIANTE'] },
      },

      { path: '',   redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
