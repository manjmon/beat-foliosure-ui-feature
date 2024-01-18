import { TestBed } from '@angular/core/testing';
import { PageConfigArrayFilterTrueOrFalse } from './pagetrackrecord.pipe';

describe('PageConfigArrayFilterTrueOrFalse', () => {
  let pipe: PageConfigArrayFilterTrueOrFalse;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageConfigArrayFilterTrueOrFalse]
    });
    pipe = TestBed.inject(PageConfigArrayFilterTrueOrFalse);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
});
