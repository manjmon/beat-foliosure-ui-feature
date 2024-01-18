import { TestBed } from '@angular/core/testing';
import { ValuationReportsModule } from './valuation-reports.module';

describe('ValuationReportsModule', () => {
  let pipe: ValuationReportsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ValuationReportsModule] });
    pipe = TestBed.inject(ValuationReportsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
