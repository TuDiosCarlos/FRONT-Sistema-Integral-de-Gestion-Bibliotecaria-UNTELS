import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { Logincomponent } from './logincomponent';
import { Authservice } from '../../services/authservice';
import { Usuario } from '../../models/usuario';

describe('Logincomponent', () => {
  let component: Logincomponent;
  let fixture: ComponentFixture<Logincomponent>;
  let authServiceSpy: { login: ReturnType<typeof vi.fn> };
  let routerNavigateSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    authServiceSpy = { login: vi.fn() };
    routerNavigateSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Logincomponent],
      providers: [
        { provide: Authservice, useValue: authServiceSpy },
        { provide: Router, useValue: { navigate: routerNavigateSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Logincomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra "Usuario o contraseña incorrectos." cuando el backend responde 401', () => {
    authServiceSpy.login.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }))
    );

    component.form.setValue({ username: 'jdoe', password: 'incorrecta' });
    component.ingresar();

    expect(component.errorMensaje).toBe('Usuario o contraseña incorrectos.');
    expect(component.cargando).toBe(false);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('muestra el mensaje de servidor caído cuando la petición falla con status 0', () => {
    authServiceSpy.login.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));

    component.form.setValue({ username: 'jdoe', password: 'secret123' });
    component.ingresar();

    expect(component.errorMensaje).toBe(
      'No se pudo conectar con el servidor. Verifica que el backend esté disponible.'
    );
  });

  it('no muestra mensaje de error y navega a /home cuando el login es exitoso', () => {
    const usuario = { username: 'jdoe' } as Usuario;
    authServiceSpy.login.mockReturnValue(of(usuario));

    component.form.setValue({ username: 'jdoe', password: 'secret123' });
    component.ingresar();

    expect(component.errorMensaje).toBe('');
    expect(component.cargando).toBe(false);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('no invoca al servicio de autenticación si el formulario es inválido', () => {
    component.form.setValue({ username: '', password: '' });

    component.ingresar();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(component.username?.touched).toBe(true);
    expect(component.password?.touched).toBe(true);
  });
});
