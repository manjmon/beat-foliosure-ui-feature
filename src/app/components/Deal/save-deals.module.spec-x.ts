import { TestBed } from '@angular/core/testing';
import { SaveDealsModule } from './save-deals.module';

describe('SaveDealsModule', () => {
  let pipe: SaveDealsModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SaveDealsModule] });
    pipe = TestBed.inject(SaveDealsModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
