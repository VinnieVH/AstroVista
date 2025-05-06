import { Routes } from '@angular/router';
import { PictureOfTheDayComponent } from './pages/picture-of-the-day/picture-of-the-day.component';
import { HistoryComponent } from './pages/history/history.component';
import { HomeComponent } from './pages/home/home.component';
import {LandingComponent} from './pages/landing/landing.component';
import {LayoutComponent} from './pages/layout/layout.component';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: '', component: LayoutComponent, children: [
    { path: 'home', component: HomeComponent },
    { path: 'history', component: HistoryComponent },
    { path: 'picture-of-the-day', component: PictureOfTheDayComponent }
  ]},
];
