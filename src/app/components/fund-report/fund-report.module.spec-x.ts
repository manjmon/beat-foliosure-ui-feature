import { TestBed } from '@angular/core/testing';
import { FundreportModule } from './fund-report.module';

describe('FundreportModule', () => {
  let pipe: FundreportModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FundreportModule] });
    pipe = TestBed.inject(FundreportModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
