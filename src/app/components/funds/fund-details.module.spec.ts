import { TestBed } from '@angular/core/testing';
import { FundDetailsModule } from './fund-details.module';

describe('FundDetailsModule', () => {
  let pipe: FundDetailsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FundDetailsModule] });
    pipe = TestBed.inject(FundDetailsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
