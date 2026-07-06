import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Usuarioservice } from './usuarioservice';
import { environment } from '../../environments/environment';
import { UsuarioDTO } from '../models/usuario';

describe('Usuarioservice', () => {
  let service: Usuarioservice;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseUrl}/api/usuarios`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(Usuarioservice);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('se crea correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('listar() hace un GET a /api/usuarios/lista', () => {
    service.listar().subscribe();

    const req = httpMock.expectOne(`${baseUrl}/lista`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('buscarPorRol() hace un GET a /api/usuarios/rol/{rol}', () => {
    service.buscarPorRol('ESTUDIANTE').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/rol/ESTUDIANTE`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('registrar() hace un POST a /api/usuarios/nuevo con el DTO en el body', () => {
    const dto: UsuarioDTO = {
      username: 'jdoe',
      codigo: 'C001',
      carnet: 'CA001',
      dni: '12345678',
      nombre: 'John Doe',
      email: 'jdoe@untels.edu.pe',
      telefono: '999999999',
      rol: 'ESTUDIANTE',
      carrera: 'Ingeniería de Sistemas',
      ciclo: 1,
      estado: 'ACTIVO',
    };

    service.registrar(dto).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/nuevo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({});
  });

  it('eliminar() hace un DELETE a /api/usuarios/{id}', () => {
    service.eliminar(9).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/9`);
    expect(req.request.method).toBe('DELETE');
    req.flush('ok');
  });

  it('cambiarPassword() hace un PUT a /api/usuarios/cambiar-password con el body correcto', () => {
    service.cambiarPassword('vieja123', 'nueva456').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/cambiar-password`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ passwordActual: 'vieja123', passwordNueva: 'nueva456' });
    req.flush('ok');
  });

  it('actualizarMiPerfil() hace un PUT a /api/usuarios/mi-perfil con los datos correctos', () => {
    const datos = { nombre: 'John Doe', email: 'jdoe@untels.edu.pe', telefono: '999999999' };
    service.actualizarMiPerfil(datos).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/mi-perfil`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(datos);
    req.flush('ok');
  });
});
