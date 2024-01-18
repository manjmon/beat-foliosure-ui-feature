import { TestBed } from '@angular/core/testing';
import { DealListModule } from './deal-list.module';

describe('DealListModule', () => {
  let pipe: DealListModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DealListModule] });
    pipe = TestBed.inject(DealListModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
