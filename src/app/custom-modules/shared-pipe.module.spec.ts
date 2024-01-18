import { TestBed } from '@angular/core/testing';
import { SharedPipeModule } from './shared-pipe.module';

describe('SharedPipeModule', () => {
  let pipe: SharedPipeModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SharedPipeModule] });
    pipe = TestBed.inject(SharedPipeModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
