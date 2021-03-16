import { TestBed } from '@angular/core/testing';

import { NgAdvancedSearchService } from './ng-advanced-search.service';

describe('NgAdvancedSearchService', () => {
  let service: NgAdvancedSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgAdvancedSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
