import { TestBed } from '@angular/core/testing';

import { LookupsApiService } from './lookups-api.service';

describe('LookupsApiService', () => {
  let service: LookupsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookupsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
