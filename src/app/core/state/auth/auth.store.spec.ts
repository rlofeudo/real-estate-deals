import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  afterEach(() => {
    localStorage.clear();
  });

  function setupStore(): AuthStore {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'deals', children: [] },
          { path: 'login', children: [] },
        ]),
      ],
    });
    return TestBed.inject(AuthStore);
  }

  it('logs in the mock user through actions and effects', fakeAsync(() => {
    localStorage.clear();
    const store = setupStore();

    store.login({ username: 'admin', password: 'termsheet' });
    expect(store.loading()).toBe(true);

    tick(300);

    expect(store.isAuthenticated()).toBe(true);
    expect(store.username()).toBe('admin');
    expect(store.loading()).toBe(false);
    expect(localStorage.getItem('real-estate-deals-auth')).toBe('admin');
  }));

  it('handles invalid credentials through loginFailure', fakeAsync(() => {
    localStorage.clear();
    const store = setupStore();

    store.login({ username: 'admin', password: 'wrong' });
    tick(300);

    expect(store.isAuthenticated()).toBe(false);
    expect(store.error()).toBe('Invalid username or password');
  }));

  it('clears auth error', fakeAsync(() => {
    localStorage.clear();
    const store = setupStore();

    store.login({ username: 'admin', password: 'wrong' });
    tick(300);
    store.clearError();
    expect(store.error()).toBeNull();
  }));

  it('logs out and clears storage', fakeAsync(() => {
    localStorage.clear();
    const store = setupStore();

    store.login({ username: 'admin', password: 'termsheet' });
    tick(300);
    store.logout();

    expect(store.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('real-estate-deals-auth')).toBeNull();
  }));

  it('hydrates username from localStorage', () => {
    localStorage.setItem('real-estate-deals-auth', 'admin');
    const store = setupStore();
    expect(store.username()).toBe('admin');
    expect(store.isAuthenticated()).toBe(true);
  });

  it('returns null when localStorage read throws', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    const store = setupStore();
    expect(store.username()).toBeNull();
    jest.restoreAllMocks();
  });
});
