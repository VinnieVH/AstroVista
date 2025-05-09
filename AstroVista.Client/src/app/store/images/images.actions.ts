import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {NasaItem} from '../../models/nasa-item.model';

export const ImagesPageActions = createActionGroup({
  source: 'Images Page',
  events: {
    'Load Latest Images': emptyProps(),
    'Search Images': props<{ query: string }>()
  }
})

export const ImagesAPIActions = createActionGroup({
  source: 'Images API',
  events: {
    'Load Latest Images': emptyProps(),
    'Latest Images Loaded Success': props<{ images: NasaItem[] }>(),
    'Latest Images Loaded Fail': props<{ message: string }>(),
    'Search Images': emptyProps(),
    'Search Images Success': props<{ images: NasaItem[] }>(),
    'Search Images Fail': props<{ message: string }>()
  }
})
