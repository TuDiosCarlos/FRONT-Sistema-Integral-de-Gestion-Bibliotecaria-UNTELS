// Solo el POST real de autenticación va al backend; un GET a /login
// (carga de la página de Angular) debe servirse localmente.
const PROXY_CONFIG = {
  '/login': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
    bypass: function (req) {
      if (req.method !== 'POST') {
        return req.url;
      }
    },
  },
  '/api': {
    target: 'http://localhost:8080',
    secure: false,
    changeOrigin: true,
  },
};

module.exports = PROXY_CONFIG;
