import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {catchError, map, throwError} from 'rxjs';
import {NasaImageResponse} from '../models/nasa-item.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private imagesAPIUrl =`${environment.apiBaseUrl}api/nasa/image`;

  constructor(private http: HttpClient) {}

  getLatest() {
    console.log(this.imagesAPIUrl, '/api/nasa/image/latest');
    return this.http
      .get<NasaImageResponse>(this.imagesAPIUrl + '/latest')
      .pipe(
        map(response => response.latestImages.items),
        catchError(this.handleError)
      );
  }

  private handleError({ status, message }: HttpErrorResponse) {
    return throwError(
      () => `${status}: ${message}`
    );
  }
}
