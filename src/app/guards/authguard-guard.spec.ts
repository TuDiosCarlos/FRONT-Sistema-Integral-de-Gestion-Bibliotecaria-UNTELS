import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { authguardGuard } from './authguard-guard';
import { Authservice } from '../services/authservice';

describe('authguardGuard', () => {
  let routerNavigateSpy: ReturnType<typeof vi.fn>;

  function configurar(isLoggedIn: boolean) {
    routerNavigateSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: Authservice, useValue: { isLoggedIn: () => isLoggedIn } },
        { provide: Router, useValue: { navigate: routerNavigateSpy } },
      ],
    });
  }

  function ejecutarGuard() {
    return TestBed.runInInjectionContext(() =>
      authguardGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
  }

  it('permite el acceso cuando hay una sesión iniciada', () => {
    configurar(true);

    const resultado = ejecutarGuard();

    expect(resultado).toBe(true);
    expect(routerNavigateSpy).not.toHaveBeenCalled();
  });

  it('redirige a /login y bloquea el acceso cuando no hay sesión', () => {
    configurar(false);

    const resultado = ejecutarGuard();

    expect(resultado).toBe(false);
    expect(routerNavigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
