import { TestBed } from '@angular/core/testing';
import { CFHomeReportsModule } from './cf-home-reports.module';

describe('CFHomeReportsModule', () => {
  let pipe: CFHomeReportsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CFHomeReportsModule] });
    pipe = TestBed.inject(CFHomeReportsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
