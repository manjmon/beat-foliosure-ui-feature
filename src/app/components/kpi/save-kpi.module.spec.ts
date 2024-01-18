import { TestBed } from '@angular/core/testing';
import { SaveKPIModule } from './save-kpi.module';

describe('SaveKPIModule', () => {
  let pipe: SaveKPIModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SaveKPIModule] });
    pipe = TestBed.inject(SaveKPIModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
