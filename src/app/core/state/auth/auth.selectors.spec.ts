import { signal } from '@angular/core';
import { initialAuthState } from '../auth.state';
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUsername,
} from './auth.selectors';

describe('auth selectors', () => {
  it('projects auth fields', () => {
    const state = signal({
      ...initialAuthState,
      username: 'admin',
      loading: true,
      error: 'x',
    });

    expect(selectUsername(state)()).toBe('admin');
    expect(selectIsAuthenticated(state)()).toBe(true);
    expect(selectAuthLoading(state)()).toBe(true);
    expect(selectAuthError(state)()).toBe('x');
  });
});
