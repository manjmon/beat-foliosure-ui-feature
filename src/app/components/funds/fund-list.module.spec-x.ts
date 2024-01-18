import { TestBed } from '@angular/core/testing';
import { FundListModule } from './fund-list.module';

describe('FundListModule', () => {
  let pipe: FundListModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FundListModule] });
    pipe = TestBed.inject(FundListModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
