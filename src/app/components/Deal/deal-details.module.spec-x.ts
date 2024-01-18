import { TestBed } from '@angular/core/testing';
import { DealDetailsModule } from './deal-details.module';

describe('DealDetailsModule', () => {
  let pipe: DealDetailsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DealDetailsModule] });
    pipe = TestBed.inject(DealDetailsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
