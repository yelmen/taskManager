import { TestBed } from '@angular/core/testing';

import { LoaderAndInfoService } from './loader-and-info.service';

describe('LoaderAndInfoService', () => {
  let service: LoaderAndInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoaderAndInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
