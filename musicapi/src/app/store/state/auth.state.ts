export interface AuthState {
  user: any | null;
  users: any[];
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  users: [],
  isAuthenticated: false,
  error: null,
  loading: false
};
