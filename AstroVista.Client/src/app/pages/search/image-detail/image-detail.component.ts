import {Component, OnInit, signal} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {map} from 'rxjs';
import {selectImageById, selectImagesLoading} from '../../../store/images/images.selectors';

@Component({
  selector: 'app-image-detail',
  imports: [CommonModule, DatePipe],
  templateUrl: './image-detail.component.html'
})
export class ImageDetailComponent implements OnInit {
  nasaId?: string;
  image = this.store.selectSignal(selectImageById);
  loading = this.store.selectSignal(selectImagesLoading);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => {
        this.nasaId = params.get('id') || undefined;
        if (!this.nasaId) {
          this.router.navigate(['/search']).then();
          return;
        }
      }))
  }

  goBack(): void {
    this.router.navigate(['/search']).then();
  }
}
