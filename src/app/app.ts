import { Component, signal } from '@angular/core';
import { RouterOutlet, Routes } from '@angular/router';
import { SancionListar } from './components/sancioncomponent/sancion-listar/sancion-listar';
import { NotificacionPanel } from './components/notificacioncomponent/notificacion-panel/notificacion-panel';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('FrontBiblioteca');
}


export const routes: Routes = [

  {
    path: 'sanciones',
    component: SancionListar
  },

  {
    path: 'notificaciones',
    component: NotificacionPanel
  }

];