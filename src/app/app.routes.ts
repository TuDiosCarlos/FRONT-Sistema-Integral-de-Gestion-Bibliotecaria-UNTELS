import { Routes } from '@angular/router';

import { Estudiantecomponent } from './components/estudiantecomponent/estudiantecomponent';
import { EstudianteListar } from './components/estudiantecomponent/estudiante-listar/estudiante-listar';
import { EstudianteForm } from './components/estudiantecomponent/estudiante-form/estudiante-form';

import { Usuariocomponent } from './components/usuariocomponent/usuariocomponent';
import { UsuarioListar } from './components/usuariocomponent/usuario-listar/usuario-listar';
import { UsuarioForm } from './components/usuariocomponent/usuario-form/usuario-form';

import { Librocomponent } from './components/librocomponent/librocomponent';
import { LibroListar } from './components/librocomponent/libro-listar/libro-listar';
import { LibroForm } from './components/librocomponent/libro-form/libro-form';

export const routes: Routes = [

  {
    path: 'estudiantes',
    component: Estudiantecomponent,
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
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: LibroListar },
      { path: 'nuevo', component: LibroForm },
      { path: 'editar/:id', component: LibroForm },
    ]
  },

];