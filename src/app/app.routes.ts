import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

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
];
