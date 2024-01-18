import { TestBed } from '@angular/core/testing';
import { InvestorListModule } from './investorlist.module';

describe('InvestorListModule', () => {
  let pipe: InvestorListModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InvestorListModule] });
    pipe = TestBed.inject(InvestorListModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
