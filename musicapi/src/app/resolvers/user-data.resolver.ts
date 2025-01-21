import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export interface UserData {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataResolver implements Resolve<UserData> {
  constructor(private authService: AuthService) {}

  resolve(): Observable<UserData> {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      return of({
        username: decodedToken.sub,
        role: decodedToken.role,
      });
    }
    return of({ username: '', role: '' });
  }
}
