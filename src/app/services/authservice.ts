import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

export interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class Authservice {
  private readonly TOKEN_KEY   = 'authToken';
  private readonly ROL_KEY     = 'rol';
  private readonly NOMBRE_KEY  = 'nombre';
  private readonly USERNAME_KEY = 'username';

  private http       = inject(HttpClient);
  private router     = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser  = isPlatformBrowser(this.platformId);

  autenticado$ = new BehaviorSubject<boolean>(this.isAutenticado());

  login(username: string, password: string): Observable<void> {
    return this.http
      .post<{ token: string }>(`${environment.baseUrl}/login`, { username, password })
      .pipe(switchMap(resp => {
        this.guardarToken(resp.token);
        return this.cargarInfoUsuario(resp.token);
      }));
  }

  private cargarInfoUsuario(token: string): Observable<void> {
    const payload  = this.decodificarToken(token);
    const username = payload?.sub ?? '';

    return this.http
      .get<Usuario[]>(`${environment.baseUrl}/api/usuarios/lista`)
      .pipe(map(usuarios => {
        const usuario = usuarios.find(u => u.username === username);
        if (usuario) {
          this.guardarRol(usuario.rol);
          this.setItem(this.NOMBRE_KEY,  usuario.nombre);
          this.setItem(this.USERNAME_KEY, username);
        }
        this.autenticado$.next(true);
      }));
  }

  guardarToken(token: string): void  { this.setItem(this.TOKEN_KEY,  token); }
  guardarRol(rol: string): void      { this.setItem(this.ROL_KEY,    rol);   }

  obtenerToken():    string | null { return this.getItem(this.TOKEN_KEY);    }
  obtenerRol():      string | null { return this.getItem(this.ROL_KEY);      }
  obtenerNombre():   string | null { return this.getItem(this.NOMBRE_KEY);   }
  obtenerUsername(): string | null { return this.getItem(this.USERNAME_KEY); }

  isAutenticado(): boolean { return !!this.obtenerToken(); }

  tieneRol(rol: string): boolean              { return this.obtenerRol() === rol; }
  tieneAlgunRol(roles: string[]): boolean     { return roles.includes(this.obtenerRol() ?? ''); }

  decodificarToken(token: string): JwtPayload | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.ROL_KEY);
      localStorage.removeItem(this.NOMBRE_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
    }
    this.autenticado$.next(false);
    this.router.navigate(['/login']);
  }

  private setItem(key: string, value: string): void {
    if (this.isBrowser) localStorage.setItem(key, value);
  }

  private getItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }
}
