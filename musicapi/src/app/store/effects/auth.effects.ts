import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import * as AuthActions from '../actions/auth.actions';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.login, action.password).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) => {
            return of(AuthActions.loginFailure({ error }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          const decodedToken = this.authService.getDecodedToken();
          const isAdmin = decodedToken?.role.includes('ADMIN');
          if (isAdmin) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => {
            return AuthActions.logoutSuccess();
          }),
          catchError((error) => {
            return of(AuthActions.logoutFailure({ error: error.message }));
          })
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
  creatUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.creatUser),
      mergeMap((user) =>
        this.authService.creatUser(user.user).pipe(
          tap((user) => console.log(user)),
          map((user) => AuthActions.creatUserSuccess({ user: user.user })),
          catchError((error) =>
            of(AuthActions.creatUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateUser),
      mergeMap((user) =>
        this.authService.updateUser(user.user).pipe(
          map((user) => AuthActions.updateUserSuccess({ user: user.user })),
          catchError((error) =>
            of(AuthActions.updateUserFailure({ error: error.message }))
          )
        )
      )
    )
  );
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.deleteUser),
      mergeMap((user) =>
        this.authService.deleteUser(user.user).pipe(
          map(() => AuthActions.deleteUserSuccess({ user: user.user })),
          catchError((error) =>
            of(AuthActions.deleteUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  getAllUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getAllusers),
      mergeMap(() =>
        this.authService.getAllusers().pipe(
          tap((response) => console.log('Effect: réponse API reçue', response)),
          map((response) =>
            AuthActions.getAllusersSuccess({ users: response })
          ),
          catchError((error) => {
            console.error('Effect: erreur', error);
            return of(AuthActions.getAllusersFailure({ error: error.message }));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
