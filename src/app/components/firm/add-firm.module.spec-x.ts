import { TestBed } from '@angular/core/testing';
import { AddFirmModule } from './add-firm.module';

describe('AddFirmModule', () => {
  let pipe: AddFirmModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AddFirmModule] });
    pipe = TestBed.inject(AddFirmModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
