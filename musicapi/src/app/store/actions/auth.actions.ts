import { createAction, props } from '@ngrx/store';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ login: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: any }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);
export const sessionExpired = createAction('[Auth] Session Expired');

export const creatUser = createAction(
  '[Auth] Creat User',
  props<{ user: any }>()
);
export const creatUserSuccess = createAction(
  '[Auth] Creat User Success',
  props<{ user: any }>()
);
export const creatUserFailure = createAction(
  '[Auth] Creat User Failure',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[Auth] Update User',
  props<{ user: any }>()
);
export const updateUserSuccess = createAction(
  '[Auth] Update User Success',
  props<{ user: any }>()
);
export const updateUserFailure = createAction(
  '[Auth] Update User Failure',
  props<{ error: string }>()
);

export const deleteUser = createAction(
  '[Auth] Delete User',
  props<{ user: any }>()
);
export const deleteUserSuccess = createAction(
  '[Auth] Delete User Success',
  props<{ user: any }>()
);
export const deleteUserFailure = createAction(
  '[Auth] Delete User Failure',
  props<{ error: string }>()
);

export const getAllusers = createAction('[Auth] Get All Users');
export const getAllusersSuccess = createAction(
  '[Auth] Get All Users Success',
  props<{ users: any[] }>()
);
export const getAllusersFailure = createAction(
  '[Auth] Get All Users Failure',
  props<{ error: string }>()
);
