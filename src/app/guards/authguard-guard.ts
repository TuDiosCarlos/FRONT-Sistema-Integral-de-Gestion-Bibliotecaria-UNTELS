import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../services/authservice';

export const authguardGuard: CanActivateFn = (route, state) => {
  const authService = inject(Authservice);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const rolesPermitidos = route.data?.['roles'] as string[] | undefined;

  if (rolesPermitidos && rolesPermitidos.length > 0) {
    const rolActual = authService.getRol();
    if (!rolActual || !rolesPermitidos.includes(rolActual)) {
      router.navigate(['/home']);
      return false;
    }
  }

  return true;
};
