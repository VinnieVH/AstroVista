import { TestBed } from '@angular/core/testing';

import { TextureLoaderService } from './texture-loader.service';

describe('TextureLoaderService', () => {
  let service: TextureLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextureLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
