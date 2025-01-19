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
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(login: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { login, password })
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.setSession(response);
          }
          return response;
        })
      );
  }

  private setSession(authResult: any) {
    localStorage.setItem('token', authResult.token);
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      localStorage.setItem('username', decodedToken.sub);
      localStorage.setItem('role', decodedToken.role);

      // Configurer le timer d'expiration
      const expiresAt = decodedToken.exp * 1000; // Conversion en millisecondes
      this.autoLogout(expiresAt - new Date().getTime());
    }
  }

  private autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      console.log('🔒 Token expiré, déconnexion');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.clearSession();
      this.router.navigate(['/login']);
    }, expirationDuration);
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
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
    const token = this.getDecodedToken();
    if (!token) return true;
    return token.exp * 1000 < new Date().getTime();
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
}
