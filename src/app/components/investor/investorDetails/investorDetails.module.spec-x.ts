import { TestBed } from '@angular/core/testing';
import { InvestorDetailsModule } from './investorDetails.module';

describe('InvestorDetailsModule', () => {
  let pipe: InvestorDetailsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InvestorDetailsModule] });
    pipe = TestBed.inject(InvestorDetailsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
