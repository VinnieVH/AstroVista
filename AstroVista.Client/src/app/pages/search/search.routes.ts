import { Routes } from '@angular/router';
import {SearchComponent} from './search.component';
import {ImageDetailComponent} from './image-detail/image-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'image/:id',
    component: ImageDetailComponent
  }
];
