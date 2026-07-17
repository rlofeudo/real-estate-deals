export interface AuthState {
  username: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  username: null,
  loading: false,
  error: null,
};
