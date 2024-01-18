import { TestBed } from '@angular/core/testing';
import { InternalReportCompanyFilter } from './company-filter-pipe';

describe('InternalReportCompanyFilter', () => {
  let pipe: InternalReportCompanyFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternalReportCompanyFilter]
    });
    pipe = TestBed.inject(InternalReportCompanyFilter);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms X to Y', () => {
    const value: any = 'X';
    const args: string[] = [];
    expect(pipe.transform(value, args)).toEqual('Y');
  });
});
