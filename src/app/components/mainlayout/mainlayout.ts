import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-mainlayout',
  standalone: true,
  imports: [RouterOutlet, Menucomponent],
  template: `
    <app-menucomponent></app-menucomponent>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-content {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }
  `],
})
export class MainLayoutComponent {}
