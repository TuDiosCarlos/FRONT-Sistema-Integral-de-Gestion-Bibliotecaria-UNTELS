import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authguardGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);
  const token  = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  const rol    = typeof localStorage !== 'undefined' ? localStorage.getItem('rol')       : null;

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const rolesRequeridos: string[] = route.data?.['roles'] ?? [];
  if (rolesRequeridos.length > 0 && !rolesRequeridos.includes(rol ?? '')) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
