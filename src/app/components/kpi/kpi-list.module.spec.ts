import { TestBed } from '@angular/core/testing';
import { KpiListModule } from './kpi-list.module';

describe('KpiListModule', () => {
  let pipe: KpiListModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [KpiListModule] });
    pipe = TestBed.inject(KpiListModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
