import { TestBed } from '@angular/core/testing';
import { AttributionReportsModule } from './attribution-reports.module';

describe('AttributionReportsModule', () => {
  let pipe: AttributionReportsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AttributionReportsModule] });
    pipe = TestBed.inject(AttributionReportsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
