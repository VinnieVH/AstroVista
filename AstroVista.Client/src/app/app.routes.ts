import { Routes } from '@angular/router';
import { PictureOfTheDayComponent } from './pages/picture-of-the-day/picture-of-the-day.component';
import { HistoryComponent } from './pages/history/history.component';
import { HomeComponent } from './pages/home/home.component';
import {LandingComponent} from './pages/landing/landing.component';
import {LayoutComponent} from './pages/layout/layout.component';
import {ImagesService} from './api/images.service';
import {provideState} from '@ngrx/store';
import {provideEffects} from '@ngrx/effects';
import {ImagesEffects} from './store/images/images.effects';
import {imagesFeature} from './store/images/images.reducer';
import {NotFoundComponent} from './pages/not-found/not-found.component';

export const routes: Routes = [
  { path: '',
    component: LandingComponent,
    pathMatch: 'full'
  },
  { path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'history', component: HistoryComponent },
      { path: 'picture-of-the-day', component: PictureOfTheDayComponent },
      { path: 'search',
        loadChildren: () =>
          import('./pages/search/search.routes').then(m => m.routes),
        providers: [
          ImagesService,
          provideState(imagesFeature),
          provideEffects([ImagesEffects])
        ]
      }
    ]},
  {
    path: '**',
    component: NotFoundComponent
  }
];
