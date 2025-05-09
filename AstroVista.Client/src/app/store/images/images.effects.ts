import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  of
} from 'rxjs';
import { ImagesAPIActions, ImagesPageActions } from './images.actions';
import { ImagesService } from '../../api/images.service';

@Injectable()
export class ImagesEffects {
  constructor(
    private imagesService: ImagesService,
    private actions$: Actions
  ) {
    console.log('ImagesEffects constructor called');
    console.log('actions$:', this.actions$);
    console.log('imagesService:', this.imagesService);
  }
  ngrxOnInitEffects() {
    return ImagesPageActions.loadLatestImages();
  }

  loadLatestImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImagesPageActions.loadLatestImages),
      exhaustMap(() =>
        this.imagesService.getLatest().pipe(
          map((images) =>
            ImagesAPIActions.latestImagesLoadedSuccess({ images })
          ),
          catchError((error) =>
            of(ImagesAPIActions.latestImagesLoadedFail({ message: error }))
          )
        )
      )
    )
  );
}
