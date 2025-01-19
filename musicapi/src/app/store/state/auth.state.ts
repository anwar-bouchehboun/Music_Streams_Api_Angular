export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false
}; 
