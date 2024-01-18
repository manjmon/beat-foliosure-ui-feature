import { TestBed } from '@angular/core/testing';
import { FirmListModule } from './firm-list.module';

describe('FirmListModule', () => {
  let pipe: FirmListModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FirmListModule] });
    pipe = TestBed.inject(FirmListModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
