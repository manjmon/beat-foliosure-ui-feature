import { TestBed } from '@angular/core/testing';
import { AddFundModule } from './add-funds.module';

describe('AddFundModule', () => {
  let pipe: AddFundModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AddFundModule] });
    pipe = TestBed.inject(AddFundModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
