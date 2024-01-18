import { TestBed } from '@angular/core/testing';
import { InternalReportModuleFilter } from './module-filter-pipe';

describe('InternalReportModuleFilter', () => {
  let pipe: InternalReportModuleFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InternalReportModuleFilter] });
    pipe = TestBed.inject(InternalReportModuleFilter);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the same items when filter is null', () => {
    const items: any[] = [{ moduleId: '1' }, { moduleId: '2' }, { moduleId: '3' }];
    const filter = null;
    expect(pipe.transform(items, filter)).toEqual(items);
  });

  it('should return the same items when items is null', () => {
    const items = null;
    const filter = '1,2,3';
    expect(pipe.transform(items, filter)).toEqual(items);
  });

  it('should return the filtered items based on moduleId', () => {
    const items: any[] = [{ moduleId: '1' }, { moduleId: '2' }, { moduleId: '3' }];
    const filter = '1,3';
    const expectedItems: any[] = [{ moduleId: '1' }, { moduleId: '3' }];
    expect(pipe.transform(items, filter)).toEqual(expectedItems);
  });
});