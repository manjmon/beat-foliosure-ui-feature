import { TestBed } from '@angular/core/testing';
import { ConsolidatedReportModule } from './consolidated-report.module';

describe('ConsolidatedReportModule', () => {
  let pipe: ConsolidatedReportModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ConsolidatedReportModule] });
    pipe = TestBed.inject(ConsolidatedReportModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
