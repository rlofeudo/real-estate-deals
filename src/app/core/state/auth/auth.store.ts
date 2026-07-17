import { Injectable, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap, tap, throwError, timer } from 'rxjs';
import { AuthCredentials } from '../../models/user.model';
import { AuthState, initialAuthState } from '../auth.state';
import { Action, Reducer } from '../lib/action';
import { ofType } from '../lib/of-type';
import { SignalStore } from '../lib/signal-store';
import * as AuthActions from './auth.actions';
import { authReducer } from './auth.reducer';
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUsername,
} from './auth.selectors';

const MOCK_USERNAME = 'admin';
const MOCK_PASSWORD = 'termsheet';
const AUTH_STORAGE_KEY = 'real-estate-deals-auth';

@Injectable({ providedIn: 'root' })
export class AuthStore extends SignalStore<AuthState> {
  protected override readonly reducer: Reducer<AuthState> = authReducer;

  readonly username: Signal<string | null> = selectUsername(this.state);
  readonly isAuthenticated: Signal<boolean> = selectIsAuthenticated(this.state);
  readonly loading: Signal<boolean> = selectAuthLoading(this.state);
  readonly error: Signal<string | null> = selectAuthError(this.state);

  constructor(private readonly router: Router) {
    super();
    this.registerEffects();
  }

  protected getInitialState(): AuthState {
    return {
      ...initialAuthState,
      username: this.readStoredUser(),
    };
  }

  login(credentials: AuthCredentials): void {
    this.dispatch(AuthActions.loginRequested(credentials));
  }

  logout(): void {
    this.dispatch(AuthActions.logout());
  }

  clearError(): void {
    this.dispatch(AuthActions.clearAuthError());
  }

  private registerEffects(): void {
    this.onAction((actions$) =>
      actions$.pipe(
        ofType<Action & { payload: AuthCredentials }>(AuthActions.loginRequested),
        switchMap(({ payload }) => {
          const valid =
            payload.username === MOCK_USERNAME &&
            payload.password === MOCK_PASSWORD;

          return timer(300).pipe(
            switchMap(() => {
              if (!valid) {
                return throwError(
                  () => new Error('Invalid username or password')
                );
              }
              return of(payload.username);
            }),
            map((username) => AuthActions.loginSuccess(username)),
            catchError((err: Error) => of(AuthActions.loginFailure(err.message)))
          );
        }),
        tap((action) => this.dispatch(action))
      )
    );

    this.onAction((actions$) =>
      actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          localStorage.setItem(AUTH_STORAGE_KEY, action.payload as string);
          void this.router.navigate(['/deals']);
        })
      )
    );

    this.onAction((actions$) =>
      actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          void this.router.navigate(['/login']);
        })
      )
    );
  }

  private readStoredUser(): string | null {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
