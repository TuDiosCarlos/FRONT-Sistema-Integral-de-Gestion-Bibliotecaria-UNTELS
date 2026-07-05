import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { JwtResponse, LoginRequest } from '../models/auth';

const TOKEN_KEY = 'token';
const ROL_KEY = 'rol';
const NOMBRE_KEY = 'nombre';
const USERNAME_KEY = 'username';
const ID_KEY = 'idUsuario';

@Injectable({ providedIn: 'root' })
export class Authservice {
  private url = `${environment.baseUrl}`;
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(username: string, password: string): Observable<JwtResponse> {
    const body: LoginRequest = { username, password };
    return this.http.post<JwtResponse>(`${this.url}/login`, body).pipe(
      tap((resp) => this.guardarSesion(resp))
    );
  }

  logout(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROL_KEY);
    localStorage.removeItem(NOMBRE_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ID_KEY);
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }

  getRol(): string | null {
    return this.isBrowser ? localStorage.getItem(ROL_KEY) : null;
  }

  getNombre(): string | null {
    return this.isBrowser ? localStorage.getItem(NOMBRE_KEY) : null;
  }

  getUsername(): string | null {
    return this.isBrowser ? localStorage.getItem(USERNAME_KEY) : null;
  }

  getIdUsuario(): number | null {
    if (!this.isBrowser) return null;
    const valor = localStorage.getItem(ID_KEY);
    return valor ? Number(valor) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.estaExpirado(token);
  }

  private guardarSesion(resp: JwtResponse): void {
    if (!this.isBrowser) return;
    localStorage.setItem(TOKEN_KEY, resp.token);
    localStorage.setItem(ROL_KEY, resp.rol);
    localStorage.setItem(NOMBRE_KEY, resp.nombre);
    localStorage.setItem(USERNAME_KEY, resp.username);
    localStorage.setItem(ID_KEY, String(resp.idUsuario));
  }

  private estaExpirado(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return false;
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }
}
