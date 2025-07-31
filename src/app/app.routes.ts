import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  //   { path: 'faq', component: FaqPage },
  //   { path: 'support', component: SupportPage },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // default redirect
  { path: '**', redirectTo: 'home' }, // fallback
];
