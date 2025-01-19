import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.authService.getToken() && !this.authService.isTokenExpired()) {
      const decodedToken = this.authService.getDecodedToken();
      if (decodedToken.role.includes('ADMIN')) {
        return this.router.navigate(['/dashboard']).then(() => false);
      } else {
        return this.router.navigate(['/home']).then(() => false);
      }
    }
    return true;
  }
}
