# --- Etapa 1: build de la aplicación Angular (CSR) ---
# Angular 22 / @angular/cli 22 requieren Node ^22.22.3 || ^24.15.0 || >=26.0.0 (ver
# node_modules/@angular/cli/package.json -> "engines"). Usamos Node 22 LTS.
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Etapa 2: servir el build estático (CSR) con nginx ---
# angular.json no define "outputPath" explícito, por lo que el CLI usa el default
# dist/<nombre-del-proyecto> => dist/FrontBiblioteca, con subcarpeta "browser"
# (confirmado por dist/FrontBiblioteca/browser/favicon.ico ya presente en el repo
# y por el script serve:ssr:FrontBiblioteca que referencia dist/FrontBiblioteca/server).
# public/_redirects apunta a /index.csr.html, así que el despliegue objetivo es CSR,
# no el servidor SSR de Express: por eso servimos la carpeta "browser" con nginx.
FROM nginx:alpine

COPY --from=build /app/dist/FrontBiblioteca/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
