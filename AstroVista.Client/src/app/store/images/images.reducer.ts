import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {NasaItem} from '../../models/nasa-item.model';
import {createFeature, createReducer, on} from '@ngrx/store';
import {ImagesAPIActions, ImagesPageActions} from './images.actions';

export interface ImagesState extends EntityState<NasaItem> {
  loading: boolean;
  errorMessage: string;
  currentSearchQuery: string;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  }
}

export const adapter: EntityAdapter<NasaItem> = createEntityAdapter<NasaItem>({
  selectId: (item: NasaItem) => item.data[0].nasaId
});

const initialState: ImagesState = adapter.getInitialState({
  loading: false,
  errorMessage: '',
  currentSearchQuery: '',
  pagination: {
    currentPage: 1,
    itemsPerPage: 8,
    totalItems: 0
  }
});

export const imagesFeature = createFeature({
  name: 'images',
  reducer: createReducer(
    initialState,
    on(ImagesPageActions.loadLatestImages, (state) => ({
      ...state,
      loading: true,
      errorMessage: '',
      currentSearchQuery: ''
    })),
    on(ImagesAPIActions.latestImagesLoadedSuccess, (state, { images }) => ({
      ...adapter.setAll(images, state),
      loading: false,
      errorMessage: '',
      currentSearchQuery: '',
      pagination: {
        ...state.pagination,
        totalItems: images.length
      }
    })),
    on(ImagesAPIActions.latestImagesLoadedFail, (state, { message }) => ({
      ...state,
      loading: false,
      errorMessage: message
    })),
    on(ImagesPageActions.searchImages, (state) => ({
      ...state,
      loading: true,
      errorMessage: ''
    })),
    on(ImagesAPIActions.searchImagesSuccess, (state, { images, query }) => ({
      ...adapter.setAll(images, state),
      loading: false,
      errorMessage: '',
      currentSearchQuery: query,
      pagination: {
        ...state.pagination,
        totalItems: images.length
      }
    })),
    on(ImagesAPIActions.searchImagesFail, (state, { message }) => ({
      ...state,
      loading: false,
      errorMessage: message
    })),
    on(ImagesPageActions.changePage, (state, { page }) => ({
      ...state,
      pagination: {
        ...state.pagination,
        currentPage: page
      }
    })),
    on(ImagesPageActions.setItemsPerPage, (state, { itemsPerPage }) => ({
      ...state,
      pagination: {
        ...state.pagination,
        itemsPerPage,
        currentPage: 1 // Reset to first page when changing items per page
      }
    })),
  )
});


export const { selectAll, selectEntities } = adapter.getSelectors();

export const selectImages = selectAll;
export const selectImagesEntities = selectEntities;
