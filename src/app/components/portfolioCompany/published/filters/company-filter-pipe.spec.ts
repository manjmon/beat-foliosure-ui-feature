import { TestBed } from '@angular/core/testing';
import { CompanyFilterPipe } from './company-filter-pipe';

describe('CompanyFilterPipe', () => {
  let pipe: CompanyFilterPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CompanyFilterPipe] });
    pipe = TestBed.get(CompanyFilterPipe);
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('returns all items when filter is empty', () => {
    const items: any[] = [
      { companyName: 'Apple' },
      { companyName: 'Microsoft' },
      { companyName: 'Google' }
    ];
    const filter = { companyName: '' };
    expect(pipe.transform(items, filter)).toEqual(items);
  });

  it('returns filtered items when filter is not empty', () => {
    const items: any[] = [
      { companyName: 'Apple' },
      { companyName: 'Microsoft' },
      { companyName: 'Google' }
    ];
    const filter = { companyName: 'apple' };
    const expectedItems = [{ companyName: 'Apple' }];
    expect(pipe.transform(items, filter)).toEqual(expectedItems);
  });

  it('returns empty array when no items match the filter', () => {
    const items: any[] = [
      { companyName: 'Apple' },
      { companyName: 'Microsoft' },
      { companyName: 'Google' }
    ];
    const filter = { companyName: 'Amazon' };
    expect(pipe.transform(items, filter)).toEqual([]);
  });
});
