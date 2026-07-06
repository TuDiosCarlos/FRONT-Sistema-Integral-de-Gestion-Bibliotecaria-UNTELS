import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';

import { Authservice } from './authservice';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';

describe('Authservice', () => {
  let service: Authservice;
  let httpMock: HttpTestingController;
  let router: Router;

  const usuarioEsperado: Usuario = {
    idUsuario: 1,
    username: 'jdoe',
    codigo: 'C001',
    carnet: 'CA001',
    dni: '12345678',
    nombre: 'John Doe',
    email: 'jdoe@untels.edu.pe',
    telefono: '999999999',
    rol: 'ESTUDIANTE',
    carrera: 'Ingeniería de Sistemas',
    ciclo: 5,
    estado: 'ACTIVO',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });

    service = TestBed.inject(Authservice);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('se crea correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('login exitoso guarda el token y el usuario actual en localStorage', () => {
    let usuarioRecibido: Usuario | undefined;
    service.login('jdoe', 'secret123').subscribe((u) => (usuarioRecibido = u));

    const loginReq = httpMock.expectOne(`${environment.baseUrl}/login`);
    expect(loginReq.request.method).toBe('POST');
    expect(loginReq.request.body).toEqual({ username: 'jdoe', password: 'secret123' });
    loginReq.flush({ token: 'token-abc-123' });

    const listaReq = httpMock.expectOne(`${environment.baseUrl}/api/usuarios/lista`);
    expect(listaReq.request.method).toBe('GET');
    listaReq.flush([usuarioEsperado]);

    expect(localStorage.getItem('token')).toBe('token-abc-123');
    expect(JSON.parse(localStorage.getItem('usuarioActual')!)).toEqual(usuarioEsperado);
    expect(usuarioRecibido).toEqual(usuarioEsperado);
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getRol()).toBe('ESTUDIANTE');
  });

  it('login con credenciales inválidas no guarda token y propaga el error 401', () => {
    let errorRecibido: HttpErrorResponse | undefined;
    let nextLlamado = false;

    service.login('jdoe', 'incorrecta').subscribe({
      next: () => (nextLlamado = true),
      error: (err: HttpErrorResponse) => (errorRecibido = err),
    });

    const loginReq = httpMock.expectOne(`${environment.baseUrl}/login`);
    loginReq.flush({ message: 'Credenciales inválidas' }, { status: 401, statusText: 'Unauthorized' });

    expect(nextLlamado).toBe(false);
    expect(errorRecibido?.status).toBe(401);
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('login propaga error de conexión (status 0) cuando el backend está caído', () => {
    let errorRecibido: HttpErrorResponse | undefined;

    service.login('jdoe', 'secret123').subscribe({
      next: () => {},
      error: (err: HttpErrorResponse) => (errorRecibido = err),
    });

    const loginReq = httpMock.expectOne(`${environment.baseUrl}/login`);
    loginReq.error(new ProgressEvent('error'), { status: 0, statusText: 'Unknown Error' });

    expect(errorRecibido?.status).toBe(0);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('logout limpia localStorage y navega a /login', () => {
    localStorage.setItem('token', 'token-abc-123');
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioEsperado));
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('usuarioActual')).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('isLoggedIn() refleja si existe un token guardado', () => {
    expect(service.isLoggedIn()).toBe(false);
    localStorage.setItem('token', 'xyz');
    expect(service.isLoggedIn()).toBe(true);
  });
});
