import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    if (this.authService.getToken() && !this.authService.isTokenExpired()) {
      return true;
    }

    return this.router.navigate(['/login']).then(() => false);
  }
}
