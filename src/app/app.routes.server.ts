import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas con parámetros dinámicos → solo cliente
  { path: 'usuarios/editar/:id',   renderMode: RenderMode.Client },
  { path: 'estudiantes/editar/:id', renderMode: RenderMode.Client },
  { path: 'libros/editar/:id',     renderMode: RenderMode.Client },
  // Todas las demás → prerender
  { path: '**',                    renderMode: RenderMode.Prerender },
];
