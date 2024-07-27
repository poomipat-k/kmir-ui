import { Routes } from '@angular/router';
import { adminGuard } from './guard/admin.guard';
import { authGuard } from './guard/auth.guard';
import { canEditPlanGuard } from './guard/can-edit-plan.guard';
import { accessPlanDetailsGuard } from './guard/plan-details.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((mod) => mod.HomeComponent),
    title: 'หน้าหลัก',
    canActivate: [authGuard],
  },
  {
    path: 'plan/:planName',
    loadComponent: () =>
      import('./plan-details/plan-details.component').then(
        (mod) => mod.PlanDetailsComponent
      ),
    title: 'รายละเอียดแผน',
    canActivate: [authGuard, accessPlanDetailsGuard],
  },
  {
    path: 'plan/:planName/edit',
    loadComponent: () =>
      import('./plan-edit/plan-edit.component').then(
        (mod) => mod.PlanEditComponent
      ),
    title: 'แก้ไขรายละเอียดแผน',
    canActivate: [authGuard, canEditPlanGuard],
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then(
        (mod) => mod.AdminDashboardComponent
      ),
    title: 'admin dashboard',
    canActivate: [adminGuard],
  },
  {
    path: 'admin/dashboard/edit',
    loadComponent: () =>
      import('./admin-dashboard-edit/admin-dashboard-edit.component').then(
        (mod) => mod.AdminDashboardEditComponent
      ),
    title: 'admin dashboard edit',
    canActivate: [adminGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
