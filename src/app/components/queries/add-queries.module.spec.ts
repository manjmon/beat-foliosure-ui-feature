import { TestBed } from '@angular/core/testing';
import { AddDynamicQueriesModule } from './add-queries.module';

describe('AddDynamicQueriesModule', () => {
  let pipe: AddDynamicQueriesModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AddDynamicQueriesModule] });
    pipe = TestBed.inject(AddDynamicQueriesModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
