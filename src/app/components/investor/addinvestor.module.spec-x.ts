import { TestBed } from '@angular/core/testing';
import { AddinvestorModule } from './addinvestor.module';

describe('AddinvestorModule', () => {
  let pipe: AddinvestorModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AddinvestorModule] });
    pipe = TestBed.inject(AddinvestorModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
