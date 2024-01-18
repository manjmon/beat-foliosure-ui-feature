import { TestBed } from '@angular/core/testing';
import { FxratesModule } from './fxrates.module';

describe('FxratesModule', () => {
  let pipe: FxratesModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FxratesModule] });
    pipe = TestBed.inject(FxratesModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
