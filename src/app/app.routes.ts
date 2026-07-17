import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'deals' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'deals',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/deals/deal-list/deal-list.component').then(
        (m) => m.DealListComponent
      ),
  },
  {
    path: 'deals/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/deals/deal-form/deal-form.component').then(
        (m) => m.DealFormComponent
      ),
  },
  {
    path: 'deals/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/deals/deal-form/deal-form.component').then(
        (m) => m.DealFormComponent
      ),
  },
  { path: '**', redirectTo: 'deals' },
];
