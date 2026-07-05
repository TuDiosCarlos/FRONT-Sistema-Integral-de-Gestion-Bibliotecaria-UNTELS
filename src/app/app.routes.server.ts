import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'estudiantes/editar/:id', renderMode: RenderMode.Client },
  { path: 'usuarios/editar/:id', renderMode: RenderMode.Client },
  { path: 'libros/editar/:id', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
