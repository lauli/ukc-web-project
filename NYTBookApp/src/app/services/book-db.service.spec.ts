import { TestBed } from '@angular/core/testing';

import { BookDbService } from './book-db.service';

describe('BookDbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookDbService = TestBed.get(BookDbService);
    expect(service).toBeTruthy();
  });
});
