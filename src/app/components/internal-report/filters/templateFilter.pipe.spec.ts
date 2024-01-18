/* tslint:disable:no-unused-variable */
import { TemplateFilter } from './templateFilter.pipe';

describe('Pipe: TemplateFilter', () => {
  let pipe: TemplateFilter;

  beforeEach(() => {
    pipe = new TemplateFilter();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the items as it is when filter is null', () => {
    const items = [1, 2, 3];
    const filter = null;
    const result = pipe.transform(items, filter);
    expect(result).toEqual(items);
  });

  it('should return the items as it is when items is null', () => {
    const items = null;
    const filter = { name: 'Quarterly Template' };
    const result = pipe.transform(items, filter);
    expect(result).toEqual(items);
  });

  it('should filter out items with calculationType not equal to FY, LTM, YTD, MTD when filter name is Quarterly Template', () => {
    const items = [
      { calculationType: 'FY' },
      { calculationType: 'LTM' },
      { calculationType: 'YTD' },
      { calculationType: 'MTD' },
      { calculationType: 'Other' }
    ];
    const filter = { name: 'Quarterly Template' };
    const result = pipe.transform(items, filter);
    expect(result).toEqual([
      { calculationType: 'Other' }
    ]);
  });

  it('should filter out items with calculationType not equal to %QoQ, %MoM, %YoY, #Variance when filter name is Monthly Template', () => {
    const items = [
      { calculationType: '%QoQ' },
      { calculationType: '%MoM' },
      { calculationType: '%YoY' },
      { calculationType: '#Variance' },
      { calculationType: 'Other' }
    ];
    const filter = { name: 'Monthly Template' };
    const result = pipe.transform(items, filter);
    expect(result).toEqual([
      { calculationType: 'Other' }
    ]);
  });

  it('should return the items as it is when filter name is neither Quarterly Template nor Monthly Template', () => {
    const items = [1, 2, 3];
    const filter = { name: 'Other Template' };
    const result = pipe.transform(items, filter);
    expect(result).toEqual(items);
  });
});