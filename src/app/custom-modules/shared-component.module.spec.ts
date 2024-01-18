import { TestBed } from '@angular/core/testing';
import { SharedComponentModule } from './shared-component.module';

describe('SharedComponentModule', () => {
  let pipe: SharedComponentModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SharedComponentModule] });
    pipe = TestBed.inject(SharedComponentModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
