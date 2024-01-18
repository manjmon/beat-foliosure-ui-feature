import { TestBed } from '@angular/core/testing';
import { PortfolioCompanyDraftModule } from './portfolio-company-draft.module';

describe('PortfolioCompanyDraftModule', () => {
  let pipe: PortfolioCompanyDraftModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PortfolioCompanyDraftModule]
    });
    pipe = TestBed.inject(PortfolioCompanyDraftModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
