import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  console.log('🔑 AuthInterceptor - URL:', req.url);

  if (token) {
    console.log('🔒 Token trouvé, ajout aux headers');
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq).pipe(
      tap({
        next: (event) => console.log('✅ Requête réussie:', req.url),
        error: (error) => console.error('❌ Erreur de requête:', error),
      })
    );
  }

  console.log('⚠️ Pas de token trouvé');
  return next(req);
};
