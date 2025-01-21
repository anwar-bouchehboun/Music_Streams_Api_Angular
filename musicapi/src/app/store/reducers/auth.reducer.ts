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
  })),

  on(AuthActions.creatUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.creatUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(AuthActions.creatUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error,
  })),
  on(AuthActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),

  on(AuthActions.updateUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error,
  })),

  on(AuthActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.deleteUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    error: null,
  })),
  on(AuthActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    user: null,
    loading: false,
    error,
  })),
  on(AuthActions.getAllusers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.getAllusersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    error: null,
  })),
  on(AuthActions.getAllusersFailure, (state, { error }) => ({
    ...state,
    users: null,
    loading: false,
    error,
  })),
);
