import { TestBed } from '@angular/core/testing';
import { InternalReportModuleFilter } from './module-filter-pipe';

describe('InternalReportModuleFilter', () => {
  let pipe: InternalReportModuleFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InternalReportModuleFilter] });
    pipe = TestBed.inject(InternalReportModuleFilter);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms X to Y', () => {
    const value: any = 'X';
    const args: string[] = [];
    expect(pipe.transform(value, args)).toEqual("X");
  });
});
