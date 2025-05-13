import {Component, EventEmitter, Input, Output} from '@angular/core';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './search-bar.component.html'
})
export class SearchBarComponent {
  @Input() loading = false;
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(query => query !== null && query.length > 2)
    ).subscribe(query => {
      this.search.emit(query!);
    });
  }

  onSearchClick() {
    const query = this.searchControl.value;
    if (query && query.trim().length > 0) {
      this.search.emit(query);
    } else {
      this.search.emit(''); // Empty search to load latest
    }
  }
}
