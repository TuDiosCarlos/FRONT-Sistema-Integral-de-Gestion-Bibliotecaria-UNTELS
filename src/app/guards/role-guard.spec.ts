import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { roleGuard } from './role-guard';
import { Authservice } from '../services/authservice';

describe('roleGuard', () => {
  let routerNavigateSpy: ReturnType<typeof vi.fn>;

  function configurar(rol: string | null) {
    routerNavigateSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: Authservice, useValue: { getRol: () => rol } },
        { provide: Router, useValue: { navigate: routerNavigateSpy } },
      ],
    });
  }

  function ejecutarGuard(rolesPermitidos: string[]) {
    const guard = roleGuard(rolesPermitidos);
    return TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  it('permite el acceso cuando el rol del usuario está permitido', () => {
    configurar('ADMIN');

    const resultado = ejecutarGuard(['ADMIN', 'BIBLIOTECARIO']);

    expect(resultado).toBe(true);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('bloquea y redirige a /403 cuando el rol no coincide con los permitidos', () => {
    configurar('ESTUDIANTE');

    const resultado = ejecutarGuard(['ADMIN']);

    expect(resultado).toBe(false);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/403']);
  });

  it('bloquea y redirige a /403 cuando no hay rol (sin sesión)', () => {
    configurar(null);

    const resultado = ejecutarGuard(['ADMIN']);

    expect(resultado).toBe(false);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/403']);
  });
});
