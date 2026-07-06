import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from '../services/authservice';

export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => {
  return () => {
    const authService = inject(Authservice);
    const router = inject(Router);

    if (rolesPermitidos.includes(authService.getRol() ?? '')) {
      return true;
    }

    router.navigate(['/403']);
    return false;
  };
};
