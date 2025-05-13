import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {catchError, map, tap, throwError} from 'rxjs';
import {NasaImageResponse, SearchImagesResponse} from '../models/nasa-item.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private imagesAPIUrl =`${environment.apiBaseUrl}api/nasa/image`;

  constructor(private http: HttpClient) {}

  getLatest() {
    return this.http
      .get<NasaImageResponse>(this.imagesAPIUrl + '/latest')
      .pipe(
        map(response => response.latestImages.items),
        catchError(this.handleError)
      );
  }

  searchImages(query: string) {
    const params = new HttpParams().set('query', query);
    return this.http
      .get<SearchImagesResponse>(this.imagesAPIUrl + '/search', { params })
      .pipe(
        map(response => response.items || []),
        catchError(this.handleError)
      );
  }

  private handleError({ status, message }: HttpErrorResponse) {
    return throwError(
      () => `${status}: ${message}`
    );
  }
}
