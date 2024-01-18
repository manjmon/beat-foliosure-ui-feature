import { TestBed } from '@angular/core/testing';
import { FirmDetailsModule } from './firm-details.module';

describe('FirmDetailsModule', () => {
  let pipe: FirmDetailsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FirmDetailsModule] });
    pipe = TestBed.inject(FirmDetailsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
