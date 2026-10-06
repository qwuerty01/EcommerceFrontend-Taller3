import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Tienda } from './pages/tienda/tienda';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';

export const routes: Routes = [
  { path: '', component: Tienda, title: 'ShopEasy | Inicio' },
  { path: 'login', component: Login, title: 'ShopEasy | Iniciar sesión' },
  { path: 'registro', component: Registro, title: 'ShopEasy | Crear cuenta' },
  { path: 'admin', component: Home, title: 'ShopEasy | Administrar productos' },
  { path: '**', redirectTo: '' },
];
