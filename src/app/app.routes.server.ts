import { RenderMode, ServerRoute } from '@angular/ssr';

// RenderMode.Server (no Prerender): las rutas dependen de sesión/rol en tiempo real
// (cookies de autenticación), así que cada petición debe renderizarse en el servidor
// contra la request real. Prerender genera el HTML una sola vez en build/arranque, sin
// acceso a esas cookies, por lo que los guards siempre verían "sin sesión".
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
