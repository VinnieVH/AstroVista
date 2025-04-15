import { Routes } from '@angular/router';
import { PictureOfTheDayComponent } from './pages/picture-of-the-day/picture-of-the-day.component';
import { HistoryComponent } from './pages/history/history.component';
export const routes: Routes = [
  { path: 'history', component: HistoryComponent },
  { path: 'picture-of-the-day', component: PictureOfTheDayComponent }
];
