import {Component, Input} from '@angular/core';
import {NasaItem} from '../../models/nasa-item.model';
import {ImageCardComponent} from '../image-card/image-card.component';

@Component({
  selector: 'app-image-grid',
  imports: [
    ImageCardComponent
  ],
  templateUrl: './image-grid.component.html'
})
export class ImageGridComponent {
  @Input() images: NasaItem[] = [];
  @Input() loading = false;
  @Input() searchQuery = '';
}
