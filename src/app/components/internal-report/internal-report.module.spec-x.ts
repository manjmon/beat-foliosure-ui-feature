import { TestBed } from '@angular/core/testing';
import { InternalReportModule } from './internal-report.module';

describe('InternalReportModule', () => {
  let pipe: InternalReportModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InternalReportModule] });
    pipe = TestBed.inject(InternalReportModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
