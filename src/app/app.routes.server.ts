import { RenderMode, ServerRoute } from '@angular/ssr';

// RenderMode.Client (no Server ni Prerender): el build es estático (Cloudflare Pages,
// sin servidor Node corriendo), así que no hay quien renderice en el servidor por
// petición. Las rutas dependen de sesión/rol en tiempo real (token en el navegador),
// por lo que se renderizan enteramente en el cliente, donde sí existe esa sesión.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
