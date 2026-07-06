export const environment = {
  production: false,
  // Rutas relativas: pasan por el proxy de ng serve (proxy.conf.json) hacia
  // http://localhost:8080, evitando problemas de CORS en el navegador.
  baseUrl: ''
};