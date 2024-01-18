import { TestBed } from '@angular/core/testing';
import { SharedPageModule } from './shared-page.module';

describe('SharedPageModule', () => {
  let pipe: SharedPageModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SharedPageModule] });
    pipe = TestBed.inject(SharedPageModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
