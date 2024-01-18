import { TestBed } from '@angular/core/testing';
import { HoldingReportsModule } from './holding-reports.module';

describe('HoldingReportsModule', () => {
  let pipe: HoldingReportsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [HoldingReportsModule] });
    pipe = TestBed.inject(HoldingReportsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
