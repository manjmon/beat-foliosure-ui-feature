import { TestBed } from '@angular/core/testing';
import { ArrayFilterPipe } from './array-filter.pipe';


describe('ArrayFilterPipe', () => {
  let pipe: ArrayFilterPipe;
  TestBed.configureTestingModule({ providers: [ArrayFilterPipe] });

  beforeEach(() => {
    pipe = new ArrayFilterPipe();

  });
  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return the original array if no items or callback are provided', () => {
    const items = [1, 2, 3];
    const callback = (list, item) => list.includes(item);
    const expected = items;

    let actual = pipe.transform(null, callback, items);
    actual = pipe.transform(items, null, items);

    expect(actual).toEqual(expected);
  });
});