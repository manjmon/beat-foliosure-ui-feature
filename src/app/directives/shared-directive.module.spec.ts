import { TestBed } from '@angular/core/testing';
import { SharedDirectiveModule } from './shared-directive.module';

describe('SharedDirectiveModule', () => {
  let pipe: SharedDirectiveModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SharedDirectiveModule] });
    pipe = TestBed.get(SharedDirectiveModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
