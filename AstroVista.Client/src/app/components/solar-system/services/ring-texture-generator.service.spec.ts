import { TestBed } from '@angular/core/testing';

import { RingTextureGeneratorService } from './ring-texture-generator.service';

describe('RingTextureGeneratorService', () => {
  let service: RingTextureGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RingTextureGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
