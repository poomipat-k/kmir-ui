import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { planDetailsGuard } from './guard/plan-details.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PlanDetailsComponent } from './plan-details/plan-details.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: '',
    component: HomeComponent,
    title: 'หน้าหลัก',
    canActivate: [authGuard],
  },
  {
    path: 'plan/:planName',
    component: PlanDetailsComponent,
    title: 'รายละเอียดแผน',
    canActivate: [authGuard, planDetailsGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
