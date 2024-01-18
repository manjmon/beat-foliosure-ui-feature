import { PageConfigArrayFilterTrueOrFalse } from './pagetrackrecord.pipe';

describe('PageConfigArrayFilterTrueOrFalse', () => {
  let pipe: PageConfigArrayFilterTrueOrFalse;

  beforeEach(() => {
    pipe = new PageConfigArrayFilterTrueOrFalse();
  });

  
  it('should return false if the item is not found in the array, even if the item has nested properties', () => {
    const items = [
      { subPageID: 1, fieldID: 2, nestedProperty: { value: 3 } },
      { subPageID: 3, fieldID: 4, nestedProperty: { value: 5 } },
    ];
    const item = { subPageID: 5, fieldID: 6, nestedProperty: { value: 7 } };

    const expectedOutput = false;
    const actualOutput = pipe.transform(items, item);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should return false if the items array is empty, even if the item has nested properties', () => {
    const items = [];
    const item = { subPageID: 1, fieldID: 2, nestedProperty: { value: 3 } };

    const expectedOutput = false;
    const actualOutput = pipe.transform(items, item);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should return false if the item is not in the items array', () => {
    const items = [{ subPageID: 1, fieldID: 2 }, { subPageID: 3, fieldID: 4 }];
    const item = { subPageID: 5, fieldID: 6 };

    const expected = false;
    const actual = pipe.transform(items, item);

    expect(actual).toEqual(expected);
  });
  it('should return false if the items array is empty', () => {
    const items = [];
    const item = { subPageID: 1, fieldID: 2 };

    const expected = false;
    const actual = pipe.transform(items, item);

    expect(actual).toEqual(expected);
  });
});