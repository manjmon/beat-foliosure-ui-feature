import { PageSettingsDeletePipe } from './page-settings-delete-filter.pipe';

describe('PageSettingsDeletePipe', () => {
  let pipe: PageSettingsDeletePipe;

  beforeEach(() => {
    pipe = new PageSettingsDeletePipe();
  });

  it('should return the original array if the `items` array or `filter` object is null or undefined', () => {
    const items = null;
    const filter = null;

    const expectedOutput = items;
    const actualOutput = pipe.transform(items, filter);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('should return the filtered array if the `items` array and `filter` object are valid', () => {
    const items = [
      { id: 1, isDeleted: false },
      { id: 2, isDeleted: true },
      { id: 3, isDeleted: false },
    ];
    const filter = { isDeleted: true };

    const expectedOutput = [items[1]];
    const actualOutput = pipe.transform(items, filter);

    expect(actualOutput).toEqual(expectedOutput);
  });
});
