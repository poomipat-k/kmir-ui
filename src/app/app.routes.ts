import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'หน้าหลัก',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
];
