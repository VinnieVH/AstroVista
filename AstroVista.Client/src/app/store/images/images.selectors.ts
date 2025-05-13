import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromImages from './images.reducer';
import {NasaItem} from '../../models/nasa-item.model';
import {getRouterSelectors} from '@ngrx/router-store';

export const selectImagesState =
  createFeatureSelector<fromImages.ImagesState>('images');


export const selectAllImages = createSelector(
  selectImagesState,
  fromImages.selectImages
);

export const selectSortedImages = createSelector(
  selectAllImages,
  (images: NasaItem[]) => [...images].sort((a, b) => {
    const dateA = new Date(a.data[0].dateCreated || a.data[0].dateCreated || '');
    const dateB = new Date(b.data[0].dateCreated || b.data[0].dateCreated || '');
    return dateB.getTime() - dateA.getTime();
  })
);

export const selectSortedImagesLimit = (limit: number) => createSelector(
  selectSortedImages,
  (images) => images.slice(0, limit)
);

export const selectImagesEntities = createSelector(
  selectImagesState,
  fromImages.selectImagesEntities
);

export const selectImagesLoading = createSelector(
  selectImagesState,
  (imagesState) => imagesState.loading
);

export const selectImagesErrorMessage = createSelector(
  selectImagesState,
  (imagesState) => imagesState.errorMessage
);

export const selectCurrentSearchQuery = createSelector(
  selectImagesState,
  (state) => state.currentSearchQuery
);

export const { selectRouteParams } = getRouterSelectors();

export const selectImageById = createSelector(
  selectImagesEntities,
  selectRouteParams,
  (imagesEntities, { id }) => imagesEntities[id]
);

export const selectPagination = createSelector(
  selectImagesState,
  (state) => state.pagination
);

export const selectCurrentPage = createSelector(
  selectPagination,
  (pagination) => pagination.currentPage
);

export const selectItemsPerPage = createSelector(
  selectPagination,
  (pagination) => pagination.itemsPerPage
);

export const selectTotalItems = createSelector(
  selectPagination,
  (pagination) => pagination.totalItems
);

export const selectTotalPages = createSelector(
  selectTotalItems,
  selectItemsPerPage,
  (totalItems, itemsPerPage) => Math.ceil(totalItems / itemsPerPage)
);

export const selectPaginatedImages = createSelector(
  selectSortedImages,
  selectCurrentPage,
  selectItemsPerPage,
  (images, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return images.slice(startIndex, startIndex + itemsPerPage);
  }
);

