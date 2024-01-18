import { TestBed } from '@angular/core/testing';
import { RepositoryListModule } from './repository-list.module';

describe('RepositoryListModule', () => {
  let pipe: RepositoryListModule;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RepositoryListModule] });
    pipe = TestBed.inject(RepositoryListModule);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
