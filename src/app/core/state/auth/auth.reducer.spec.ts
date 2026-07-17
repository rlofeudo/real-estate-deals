import { authReducer } from './auth.reducer';
import * as AuthActions from './auth.actions';
import { initialAuthState } from '../auth.state';

describe('authReducer', () => {
  it('sets loading on loginRequested', () => {
    const state = authReducer(
      initialAuthState,
      AuthActions.loginRequested({ username: 'admin', password: 'termsheet' })
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores username on loginSuccess', () => {
    const state = authReducer(
      { ...initialAuthState, loading: true },
      AuthActions.loginSuccess('admin')
    );
    expect(state.username).toBe('admin');
    expect(state.loading).toBe(false);
  });

  it('stores error on loginFailure', () => {
    const state = authReducer(
      { ...initialAuthState, loading: true },
      AuthActions.loginFailure('Invalid username or password')
    );
    expect(state.error).toBe('Invalid username or password');
    expect(state.loading).toBe(false);
  });

  it('resets state on logout', () => {
    const state = authReducer(
      { username: 'admin', loading: false, error: null },
      AuthActions.logout()
    );
    expect(state).toEqual(initialAuthState);
  });

  it('clears error', () => {
    const state = authReducer(
      { ...initialAuthState, error: 'boom' },
      AuthActions.clearAuthError()
    );
    expect(state.error).toBeNull();
  });

  it('returns the same state for unknown actions', () => {
    const current = { ...initialAuthState };
    expect(authReducer(current, { type: '[Unknown]', payload: undefined })).toBe(
      current
    );
  });

  it('uses the default initial state when state is omitted', () => {
    const state = authReducer(undefined, AuthActions.clearAuthError());
    expect(state).toEqual(initialAuthState);
  });
});
