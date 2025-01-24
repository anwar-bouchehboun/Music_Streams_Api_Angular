import { updateAlbum } from './../store/actions/album.action';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private apiUrlUsers = environment.apiUrl;
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {
    // Vérifier l'expiration au démarrage
    this.checkTokenExpiration();
  }

  private checkTokenExpiration() {
    const token = this.getDecodedToken();
    if (token) {
      const expiresAt = token.exp * 1000;
      const now = new Date().getTime();

      if (now >= expiresAt) {
        console.log('🔒 Token expiré, nettoyage automatique');
        this.clearSession();
        this.router.navigate(['/login']);
      } else {
        // Configurer le timer pour l'expiration
        this.autoLogout(expiresAt - now);
      }
    }
  }

  login(login: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { login, password })
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.setSession(response);
          }
          return response;
        }),
        catchError((error) => {
          return throwError(() => ({
            status: error.status,
            message: error.error.message,
          }));
        })
      );
  }

  creatUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, user);
  }
  getAllusers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlUsers}/admin/users`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrlUsers}/admin/users/${user.id}`,
      user
    );
  }

  deleteUser(user: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlUsers}/admin/users/${user.id}`);
  }

  private setSession(authResult: any) {
    const token = authResult.token;
    const decodedToken = jwtDecode<any>(token);
    const expiresAt = decodedToken.exp * 1000;

    // Sauvegarder les données avec l'expiration
    localStorage.setItem('token', token);
    localStorage.setItem('username', decodedToken.sub);
    localStorage.setItem('role', decodedToken.role);
    localStorage.setItem('expiresAt', expiresAt.toString());

    // Configurer le timer d'expiration
    this.autoLogout(expiresAt - new Date().getTime());
  }

  private autoLogout(expirationDuration: number) {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = setTimeout(() => {
      console.log('🔒 Token expiré, déconnexion automatique');
      this.clearSession();
      this.router.navigate(['/login']);
    }, Math.max(0, expirationDuration)); // Éviter les durées négatives
  }

  clearSession() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }

    // Nettoyer toutes les données liées à la session
    const keysToRemove = ['token', 'username', 'role', 'expiresAt'];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');

    // Nettoyer la session immédiatement
    this.clearSession();
    if (!token) {
      return of({ success: true });
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map(() => ({ success: true })),
      catchError((error) => {
        if (error.status === 400) {
          return of({ success: true });
        }
        return throwError(() => error);
      })
    );
  }

  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem('expiresAt');
    if (!expiresAt) return true;

    return parseInt(expiresAt, 10) < new Date().getTime();
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode<any>(token);
    }
    return null;
  }

  getUserName(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  redirectBasedOnRole() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      const isAdmin = decodedToken.role.includes('ADMIN');
      if (isAdmin) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }
}
