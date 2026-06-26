import { HttpInterceptorFn } from '@angular/common/http';

export const authinterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
