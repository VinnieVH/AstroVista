import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [
    NgClass,
    ReactiveFormsModule
  ],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() itemsPerPage = 8;
  @Input() totalItems = 0;
  @Input() totalPages = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  Math = Math;
  itemsPerPageControl = new FormControl(this.itemsPerPage);

  ngOnInit() {
    this.itemsPerPageControl.valueChanges.subscribe(value => {
      if (value) {
        this.itemsPerPageChange.emit(+value);
      }
    });
  }

  ngOnChanges() {
    this.itemsPerPageControl.setValue(this.itemsPerPage, { emitEvent: false });
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  generatePageNumbers(): number[] {
    // Show maximum 5-page numbers
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}
