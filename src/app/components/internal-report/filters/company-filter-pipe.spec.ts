import { TestBed } from '@angular/core/testing';
import { InternalReportCompanyFilter } from './company-filter-pipe';

describe('InternalReportCompanyFilter', () => {
  let pipe: InternalReportCompanyFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InternalReportCompanyFilter]
    });
    pipe = TestBed.get(InternalReportCompanyFilter);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms items when filter is null', () => {
    const items: any[] = [{ portfolioCompanyID: '1' }, { portfolioCompanyID: '2' }];
    const filter = null;
    expect(pipe.transform(items, filter)).toEqual(items);
  });

  it('transforms items when items is null', () => {
    const items = null;
    const filter = [{ portfolioCompanyID: '1' }, { portfolioCompanyID: '2' }];
    expect(pipe.transform(items, filter)).toEqual(items);
  });

  it('transforms items when filter is empty', () => {
    const items: any[] = [{ portfolioCompanyID: '1' }, { portfolioCompanyID: '2' }];
    const filter: any[] = [];
    expect(pipe.transform(items, filter).length).toEqual(0);
  });

  it('transforms items based on filter', () => {
    const items: any[] = [{ portfolioCompanyID: '1' }, { portfolioCompanyID: '2' }, { portfolioCompanyID: '3' }];
    const filter: any[] = [{ portfolioCompanyID: '1' }, { portfolioCompanyID: '3' }];
    expect(pipe.transform(items, filter).length).toEqual(0);
  });

  it('sets editable property to true if no item is selected', () => {
    const items: any[] = [{ portfolioCompanyID: '1', editable: false }, { portfolioCompanyID: '2', editable: false }];
    const filter: any[] = [{ portfolioCompanyID: '3' }];
    expect(pipe.transform(items, filter).length).toEqual(0);
  });
});