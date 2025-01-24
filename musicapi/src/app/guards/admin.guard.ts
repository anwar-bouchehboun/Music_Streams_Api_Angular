import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Promise<boolean> | Observable<boolean> {
    const decodedToken = this.authService.getDecodedToken();

    if (decodedToken && decodedToken.role.includes('ADMIN')) {
      return true;
    }
   
    return this.router.navigate(['/login']).then(() => false);
  }
}
