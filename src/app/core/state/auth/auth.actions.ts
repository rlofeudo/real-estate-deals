import { createAction, createPayloadAction } from '../lib/action';
import { AuthCredentials } from '../../models/user.model';

export const loginRequested = createPayloadAction<AuthCredentials>(
  '[Auth] Login Requested'
);
export const loginSuccess = createPayloadAction<string>('[Auth] Login Success');
export const loginFailure = createPayloadAction<string>('[Auth] Login Failure');
export const logout = createAction('[Auth] Logout');
export const clearAuthError = createAction('[Auth] Clear Error');
