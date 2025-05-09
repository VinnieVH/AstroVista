import {Component, computed, signal} from '@angular/core';
import {Store} from '@ngrx/store';
import {selectImagesLoading, selectSortedImages} from '../../store/images/images.selectors';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-search',
  imports: [DatePipe],
  templateUrl: './search.component.html'
})
export class SearchComponent {
  limitValue = signal(12);
  sortedImages = this.store.selectSignal(selectSortedImages);
  loading = this.store.selectSignal(selectImagesLoading);
  images = computed(() => {
    return this.sortedImages().slice(0, this.limitValue());
  });

  constructor(private store: Store) {
  }
}
