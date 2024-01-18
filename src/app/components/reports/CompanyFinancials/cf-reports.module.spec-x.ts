import { TestBed } from '@angular/core/testing';
import { CompanyFinancialReportsModule } from './cf-reports.module';

describe('CompanyFinancialReportsModule', () => {
  let pipe: CompanyFinancialReportsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyFinancialReportsModule]
    });
    pipe = TestBed.inject(CompanyFinancialReportsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
