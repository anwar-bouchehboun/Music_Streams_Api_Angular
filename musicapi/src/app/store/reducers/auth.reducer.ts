import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { initialAuthState } from '../state/auth.state';



export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error,
  })),

  on(AuthActions.logout, (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    error: null,
  })),

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  })),

  on(AuthActions.sessionExpired, (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    error: 'Session expirée',
  }))
);
