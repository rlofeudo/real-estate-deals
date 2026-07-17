import { Signal, computed } from '@angular/core';
import { AuthState } from '../auth.state';

export function selectUsername(state: Signal<AuthState>): Signal<string | null> {
  return computed(() => state().username);
}

export function selectIsAuthenticated(state: Signal<AuthState>): Signal<boolean> {
  return computed(() => state().username !== null);
}

export function selectAuthLoading(state: Signal<AuthState>): Signal<boolean> {
  return computed(() => state().loading);
}

export function selectAuthError(state: Signal<AuthState>): Signal<string | null> {
  return computed(() => state().error);
}
