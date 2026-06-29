import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-container">
      <mat-icon class="lock-icon">lock</mat-icon>
      <h1>403</h1>
      <h2>Acceso denegado</h2>
      <p>No tienes permisos para acceder a esta sección.</p>
      <button mat-raised-button color="primary" (click)="volver()">
        <mat-icon>arrow_back</mat-icon> Volver al inicio
      </button>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      padding: 40px 20px;
      gap: 8px;
    }
    .lock-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #e53935;
    }
    h1 { font-size: 4rem; margin: 0; color: #e53935; }
    h2 { margin: 0 0 8px 0; }
    p  { color: #666; margin-bottom: 24px; }
    button { display: flex; align-items: center; gap: 4px; }
  `],
})
export class UnauthorizedComponent {
  private router = inject(Router);
  volver(): void { this.router.navigate(['/home']); }
}
