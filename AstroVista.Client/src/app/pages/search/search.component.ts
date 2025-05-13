import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {
  selectCurrentPage,
  selectCurrentSearchQuery,
  selectImagesLoading, selectItemsPerPage, selectPaginatedImages,
  selectTotalItems, selectTotalPages
} from '../../store/images/images.selectors';
import {ImagesPageActions} from '../../store/images/images.actions';
import {ReactiveFormsModule} from '@angular/forms';
import {ImageGridComponent} from '../../components/image-grid/image-grid.component';
import {SearchBarComponent} from '../../components/search-bar/search-bar.component';
import {PaginationComponent} from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, ImageGridComponent, SearchBarComponent, PaginationComponent],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  loading = this.store.selectSignal(selectImagesLoading);
  currentSearchQuery = this.store.selectSignal(selectCurrentSearchQuery);
  currentPage = this.store.selectSignal(selectCurrentPage);
  itemsPerPage = this.store.selectSignal(selectItemsPerPage);
  totalPages = this.store.selectSignal(selectTotalPages);
  totalItems = this.store.selectSignal(selectTotalItems);
  images = this.store.selectSignal(selectPaginatedImages);

  constructor(private store: Store) {}

  handleSearch(query: string) {
    if (query && query.trim().length > 0) {
      this.store.dispatch(ImagesPageActions.searchImages({ query }));
    } else {
      this.store.dispatch(ImagesPageActions.loadLatestImages());
    }
  }

  handlePageChange(page: number) {
    this.store.dispatch(ImagesPageActions.changePage({ page }));
  }

  handleItemsPerPageChange(itemsPerPage: number) {
    this.store.dispatch(ImagesPageActions.setItemsPerPage({ itemsPerPage }));
  }
}
