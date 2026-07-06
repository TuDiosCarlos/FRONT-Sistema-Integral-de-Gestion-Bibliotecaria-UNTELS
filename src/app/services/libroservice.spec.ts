import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Libroservice } from './libroservice';
import { environment } from '../../environments/environment';
import { Libro } from '../models/libro';

describe('Libroservice', () => {
  let service: Libroservice;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.baseUrl}/api/libros`;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(Libroservice);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('se crea correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('listar() hace un GET a /api/libros/lista', () => {
    const librosEsperados: Libro[] = [
      { titulo: 'Clean Code', autor: 'Robert C. Martin', isbn: '111', categoria: 'TECNICO', stock: 3, stockTotal: 3 },
    ];

    let recibido: Libro[] | undefined;
    service.listar().subscribe((l) => (recibido = l));

    const req = httpMock.expectOne(`${baseUrl}/lista`);
    expect(req.request.method).toBe('GET');
    req.flush(librosEsperados);

    expect(recibido).toEqual(librosEsperados);
  });

  it('buscarPorId() hace un GET a /api/libros/{id}', () => {
    service.buscarPorId(7).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/7`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('buscarPorTitulo() hace un GET a /api/libros/buscar con el parámetro titulo', () => {
    service.buscarPorTitulo('Clean Code').subscribe();

    const req = httpMock.expectOne((r) => r.url === `${baseUrl}/buscar` && r.params.get('titulo') === 'Clean Code');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('registrar() hace un POST a /api/libros/nuevo con el libro en el body', () => {
    const libro: Libro = { titulo: 'Nuevo', autor: 'X', isbn: '999', categoria: 'FICCION', stock: 2, stockTotal: 2 };
    service.registrar(libro).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/nuevo`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(libro);
    req.flush({});
  });

  it('actualizar() hace un PUT a /api/libros/actualiza', () => {
    const libro: Libro = { idLibro: 1, titulo: 'Editado', autor: 'X', isbn: '999', categoria: 'FICCION', stock: 2, stockTotal: 2 };
    service.actualizar(libro).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/actualiza`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(libro);
    req.flush('ok');
  });

  it('eliminar() hace un DELETE a /api/libros/{id}', () => {
    service.eliminar(3).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush('ok');
  });
});
