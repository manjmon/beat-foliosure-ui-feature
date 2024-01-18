import { FundDynamicFilter } from "./fund-dynamicfilters.pipe";

describe('FundDynamicFilterPipe', () => {
  let pipe: FundDynamicFilter;

  beforeEach(() => {
    pipe = new FundDynamicFilter();
  });

  it('should return "Select filters" if all of the args are null or undefined', () => {
    const args = null;

    const expectedOutput = 'Select filters';
    const actualOutput = pipe.transform(args);

    expect(actualOutput).toEqual(expectedOutput);
  });
  it('should return "Select filters" if no arguments are provided', () => {
    const expected = 'Select filters';
    const actual = pipe.transform({}); 

    expect(actual).toEqual(expected);
  });

  it('should return the label of the first non-empty argument', () => {
    const expected = 'Attribution Type';
    const actual = pipe.transform({ attributionType: { label: 'Attribution Type' } });

    expect(actual).toEqual(expected);
  });

});
