import { FundReportTrueOrFalse } from "./enum-fund.pipe";
import { FundEnum } from 'src/app/common/constants';

describe('FundReportTrueOrFalsePipe', () => {
  let pipe: FundReportTrueOrFalse;

  beforeEach(() => {
    pipe = new FundReportTrueOrFalse();
  });

  it('should return true for values that should be displayed', () => {
    const expected = true;

    const actual = pipe.transform(FundEnum.StrategyDescription);
    
    expect(actual).toEqual(expected);
  });

  it('should return false for values that should not be displayed', () => {
    const expected = false;

    const actual = pipe.transform(FundEnum.AttributionReportTable);

    expect(actual).toEqual(expected);
  });

  it('should return false for undefined or null values', () => {
    const expected = false;

    const actual = pipe.transform(undefined);

    expect(actual).toEqual(expected);
  });
});
