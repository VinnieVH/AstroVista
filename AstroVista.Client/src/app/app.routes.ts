import {ResolveFn, Routes} from '@angular/router';
import { marker as _ } from '@colsen1991/ngx-translate-extract-marker';
import { PictureOfTheDayComponent } from './pages/picture-of-the-day/picture-of-the-day.component';
import { HistoryComponent } from './pages/history/history.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent},
  { path: 'history', component: HistoryComponent },
  { path: 'picture-of-the-day', component: PictureOfTheDayComponent }
];
