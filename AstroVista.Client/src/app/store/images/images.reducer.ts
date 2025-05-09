import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {NasaItem} from '../../models/nasa-item.model';
import {createFeature, createReducer, on} from '@ngrx/store';
import {ImagesAPIActions, ImagesPageActions} from './images.actions';

export interface ImagesState extends EntityState<NasaItem> {
  loading: boolean;
  errorMessage: string;
}

export const adapter: EntityAdapter<NasaItem> = createEntityAdapter<NasaItem>({
  selectId: (item: NasaItem) => item.data[0].nasaId
});

const initialState: ImagesState = adapter.getInitialState({
  loading: false,
  errorMessage: '',
});

export const imagesFeature = createFeature({
  name: 'images',
  reducer: createReducer(
    initialState,
    on(ImagesPageActions.loadLatestImages, (state) => ({
      ...state,
      loading: true,
      errorMessage: ''
    })),
    on(ImagesAPIActions.latestImagesLoadedSuccess, (state, { images }) => ({
      ...adapter.addMany(images, state),
      loading: false,
      errorMessage: ''
    })),
    on(ImagesAPIActions.latestImagesLoadedFail, (state, { message }) => ({
      ...state,
      loading: false,
      errorMessage: message
    }))
  )
});


export const { selectAll, selectEntities } = adapter.getSelectors();

export const selectImages = selectAll;
export const selectImagesEntities = selectEntities;
