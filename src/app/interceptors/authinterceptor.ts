import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authinterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token  = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
  const router = inject(Router);

  const authReq = token
    ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      if (err.status === 401) {
        ['authToken', 'rol', 'nombre', 'username'].forEach(k => localStorage.removeItem(k));
        router.navigate(['/login']);
      } else if (err.status === 403) {
        router.navigate(['/unauthorized']);
      }
      return throwError(() => err);
    })
  );
};
