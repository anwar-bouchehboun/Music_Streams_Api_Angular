import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('🔑 AuthInterceptor - URL:', req.url);

  if (token) {
    console.log('🔒 Token trouvé, ajout aux headers');
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq).pipe(
      tap({
        next: (event) => {
          console.log('✅ Requête réussie:', req.url);
          console.log('✅ Requête réussie:', event);
        },
        error: (error) => {
          console.error('❌ Erreur de requête:', error);
          console.log('🚫 Token invalide - Redirection vers login');
          localStorage.removeItem('token');
          router.navigate(['/login']);
        },
      })
    );
  }

  console.log('⚠️ Pas de token trouvé');
  return next(req);
};
