import { Action } from '../lib/action';
import { AuthState, initialAuthState } from '../auth.state';
import * as AuthActions from './auth.actions';

export function authReducer(
  state: AuthState = initialAuthState,
  action: Action
): AuthState {
  switch (action.type) {
    case AuthActions.loginRequested.type:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AuthActions.loginSuccess.type:
      return {
        ...state,
        username: action.payload as string,
        loading: false,
        error: null,
      };
    case AuthActions.loginFailure.type:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };
    case AuthActions.logout.type:
      return {
        ...initialAuthState,
      };
    case AuthActions.clearAuthError.type:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
