import { PortfolioCustomListPipe } from '../pipes/portfolioCustomList.pipe';

describe('PortfolioCustomListPipe', () => {
  let pipe: PortfolioCustomListPipe;

  beforeEach(() => {
    pipe = new PortfolioCustomListPipe();
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  
  it('should return an empty array if the input array is empty', () => {
    const items = [];
    const item = { fieldID: 2 };
    const filteredItems = pipe.transform(items, item);

    expect(filteredItems).toEqual([]);
  });
});