import { TestBed } from '@angular/core/testing';

import { HotelDetailGuard } from './hotel-detail.guard';

describe('HotelDetailGuard', () => {
  let guard: HotelDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HotelDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
