import { Injectable, REQUEST, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Usuario } from '../models/usuario';

interface JwtResponse {
  token: string;
}

const TOKEN_KEY = 'token';
const USUARIO_KEY = 'usuarioActual';
// Cookies livianas (solo token + rol) para que los guards de ruta funcionen también
// durante el SSR: en Node no existe localStorage, así que sin esto cualquier navegación
// directa por URL (o F5) a una ruta protegida se ve como "sin sesión" y manda al login,
// aunque el usuario sí esté logueado en el navegador.
const ROL_COOKIE = 'rol';

// El SSR de Angular ejecuta este servicio en Node, donde localStorage no existe.
const isBrowser = (): boolean => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

@Injectable({ providedIn: 'root' })
export class Authservice {
  private url = environment.baseUrl;
  // Solo tiene valor durante el renderizado SSR; en el navegador es null.
  private request = inject(REQUEST, { optional: true });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private setCookie(name: string, value: string): void {
    if (!isBrowser()) return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
  }

  private deleteCookie(name: string): void {
    if (!isBrowser()) return;
    document.cookie = `${name}=; path=/; Max-Age=0`;
  }

  private getCookieFromRequest(name: string): string | null {
    const cookieHeader = this.request?.headers.get('cookie');
    if (!cookieHeader) return null;
    const match = cookieHeader.split('; ').find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.substring(name.length + 1)) : null;
  }

  // Importante: el rol se debe guardar ANTES de que el componente de login navegue,
  // si no, el menú/home se renderizan sin saber el rol (por eso antes se veía igual para todos).
  login(username: string, password: string): Observable<Usuario | undefined> {
    return this.http.post<JwtResponse>(`${this.url}/login`, { username, password }).pipe(
      tap((res) => {
        if (isBrowser()) {
          localStorage.setItem(TOKEN_KEY, res.token);
          this.setCookie(TOKEN_KEY, res.token);
        }
      }),
      switchMap(() =>
        this.http.get<Usuario[]>(`${this.url}/api/usuarios/lista`).pipe(catchError(() => of([] as Usuario[])))
      ),
      map((usuarios) => usuarios.find((u) => u.username === username)),
      tap((usuario) => {
        if (usuario && isBrowser()) {
          localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
          this.setCookie(ROL_COOKIE, usuario.rol);
        }
      })
    );
  }

  logout(): void {
    if (isBrowser()) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USUARIO_KEY);
      this.deleteCookie(TOKEN_KEY);
      this.deleteCookie(ROL_COOKIE);
    }
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (isBrowser()) return localStorage.getItem(TOKEN_KEY);
    return this.getCookieFromRequest(TOKEN_KEY);
  }

  getUsuarioActual(): Usuario | null {
    if (!isBrowser()) return null;
    const raw = localStorage.getItem(USUARIO_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getRol(): string | null {
    if (isBrowser()) return this.getUsuarioActual()?.rol ?? null;
    return this.getCookieFromRequest(ROL_COOKIE);
  }
}
