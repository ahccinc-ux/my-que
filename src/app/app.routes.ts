import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'dashboard',
    canActivate: [() => import('./core/auth-guard').then(m => m.authGuard)],
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'branches',
    canActivate: [() => import('./core/auth-guard').then(m => m.authGuard)],
    loadComponent: () => import('./pages/branches/branches').then(m => m.Branches)
  },
  {
    path: 'departments',
    canActivate: [() => import('./core/auth-guard').then(m => m.authGuard)],
    loadComponent: () => import('./pages/departments/departments').then(m => m.Departments)
  },
  {
    path: 'queues',
    canActivate: [() => import('./core/auth-guard').then(m => m.authGuard)],
    loadComponent: () => import('./pages/queues/queues').then(m => m.Queues)
  },
  {
    path: 'employees',
    canActivate: [() => import('./core/auth-guard').then(m => m.authGuard)],
    loadComponent: () => import('./pages/employees/employees').then(m => m.Employees)
  },
  {
    path: 'home',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  { path: '**', redirectTo: 'login' }
];
