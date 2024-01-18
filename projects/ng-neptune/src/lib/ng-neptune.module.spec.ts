import { TestBed } from '@angular/core/testing';
import { NgNeptuneModule } from './ng-neptune.module';

describe('NgNeptuneModule', () => {
  let pipe: NgNeptuneModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [NgNeptuneModule] });
    pipe = TestBed.get(NgNeptuneModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
