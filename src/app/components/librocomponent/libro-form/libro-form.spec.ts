import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { LibroForm } from './libro-form';
import { Libroservice } from '../../../services/libroservice';
import { Libro } from '../../../models/libro';

describe('LibroForm', () => {
  let libroServiceSpy: {
    buscarPorId: ReturnType<typeof vi.fn>;
    registrar: ReturnType<typeof vi.fn>;
    actualizar: ReturnType<typeof vi.fn>;
    registrarPorIsbn: ReturnType<typeof vi.fn>;
  };
  let routerNavigateSpy: ReturnType<typeof vi.fn>;

  function crearComponente(
    paramMap: Record<string, string> = {},
    libroEncontrado: Partial<Libro> = {}
  ): ComponentFixture<LibroForm> {
    libroServiceSpy = {
      buscarPorId: vi.fn().mockReturnValue(of(libroEncontrado as Libro)),
      registrar: vi.fn().mockReturnValue(of({} as Libro)),
      actualizar: vi.fn().mockReturnValue(of('ok')),
      registrarPorIsbn: vi.fn().mockReturnValue(of({} as Libro)),
    };
    routerNavigateSpy = vi.fn();

    TestBed.configureTestingModule({
      imports: [LibroForm],
      providers: [
        { provide: Libroservice, useValue: libroServiceSpy },
        { provide: Router, useValue: { navigate: routerNavigateSpy } },
        { provide: MatSnackBar, useValue: { open: vi.fn() } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap(paramMap)) } },
      ],
    });

    const fixture = TestBed.createComponent(LibroForm);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    const fixture = crearComponente();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('el formulario es inválido si falta un campo requerido (título vacío)', () => {
    const { componentInstance: component } = crearComponente();

    component.form.patchValue({
      isbn: '978-3-16-148410-0',
      titulo: '',
      autor: 'Robert C. Martin',
      categoria: 'TECNICO',
      stock: 1,
      stockTotal: 1,
    });

    expect(component.form.valid).toBe(false);
    expect(component.form.get('titulo')?.hasError('required')).toBe(true);
  });

  it('el formulario es inválido si falta el autor', () => {
    const { componentInstance: component } = crearComponente();

    component.form.patchValue({
      isbn: '978-3-16-148410-0',
      titulo: 'Clean Code',
      autor: '',
      categoria: 'TECNICO',
      stock: 1,
      stockTotal: 1,
    });

    expect(component.form.valid).toBe(false);
    expect(component.form.get('autor')?.hasError('required')).toBe(true);
  });

  it('el formulario es válido cuando todos los campos requeridos están completos', () => {
    const { componentInstance: component } = crearComponente();

    component.form.patchValue({
      isbn: '978-3-16-148410-0',
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
      categoria: 'TECNICO',
      stock: 1,
      stockTotal: 1,
    });

    expect(component.form.valid).toBe(true);
  });

  it('guardar() no llama al servicio y marca los campos como tocados si el formulario es inválido', () => {
    const { componentInstance: component } = crearComponente();

    component.form.patchValue({ titulo: '' });
    component.guardar();

    expect(libroServiceSpy.registrar).not.toHaveBeenCalled();
    expect(component.form.get('titulo')?.touched).toBe(true);
  });

  it('guardar() registra el libro y navega al listado cuando el formulario es válido', () => {
    const { componentInstance: component } = crearComponente();

    component.form.patchValue({
      isbn: '978-3-16-148410-0',
      titulo: 'Clean Code',
      autor: 'Robert C. Martin',
      categoria: 'TECNICO',
      stock: 1,
      stockTotal: 1,
    });
    component.guardar();

    expect(libroServiceSpy.registrar).toHaveBeenCalledTimes(1);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/libros/listar']);
  });

  it('en modo edición carga el libro correspondiente al id de la ruta', () => {
    const fixture = crearComponente({ id: '5' }, { titulo: 'Existente', autor: 'Autor X' } as Libro);
    const component = fixture.componentInstance;

    expect(component.esEdicion).toBe(true);
    expect(component.idLibro).toBe(5);
    expect(libroServiceSpy.buscarPorId).toHaveBeenCalledWith(5);
    expect(component.form.get('titulo')?.value).toBe('Existente');
  });

  it('guardar() en modo edición llama a actualizar() en vez de registrar()', () => {
    const fixture = crearComponente({ id: '5' }, { titulo: 'Existente', autor: 'Autor X' } as Libro);
    const component = fixture.componentInstance;

    component.form.patchValue({
      isbn: '978-3-16-148410-0',
      titulo: 'Existente editado',
      autor: 'Autor X',
      categoria: 'TECNICO',
      stock: 1,
      stockTotal: 1,
    });
    component.guardar();

    expect(libroServiceSpy.actualizar).toHaveBeenCalledTimes(1);
    expect(libroServiceSpy.registrar).not.toHaveBeenCalled();
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/libros/listar']);
  });
});
