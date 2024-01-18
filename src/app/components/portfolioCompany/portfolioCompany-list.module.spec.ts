import { TestBed } from '@angular/core/testing';
import { PortfolioCompanyListModule } from './portfolioCompany-list.module';

describe('PortfolioCompanyListModule', () => {
  let pipe: PortfolioCompanyListModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [PortfolioCompanyListModule] });
    pipe = TestBed.inject(PortfolioCompanyListModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
