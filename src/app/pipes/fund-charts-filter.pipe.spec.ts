import { FundChartFilter } from "./fund-charts-filter.pipe";
import { TestBed } from '@angular/core/testing';

describe('FundChartFilterPipe', () => {
  let pipe: FundChartFilter;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [FundChartFilter] });
     pipe = new FundChartFilter();
  });
  
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return "Select Charts" if all of the args are null or undefined', () => {
    const args = null;

    const expectedOutput = 'Select Charts';
    const actualOutput = pipe.transform(args);

    expect(actualOutput).toEqual(expectedOutput);
  });

  
});
