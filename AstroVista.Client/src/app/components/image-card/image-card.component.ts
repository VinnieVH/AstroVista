import {Component, Input} from '@angular/core';
import {NasaItem} from '../../models/nasa-item.model';
import {DatePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-image-card',
  imports: [
    DatePipe,
    RouterLink
  ],
  templateUrl: './image-card.component.html'
})
export class ImageCardComponent {
  @Input({ required: true }) image!: NasaItem;
}
