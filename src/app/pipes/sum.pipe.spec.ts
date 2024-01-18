import { SumPipe } from './sum.pipe';

describe('SumPipe', () => {
  let pipe: SumPipe;

  beforeEach(() => {
    pipe = new SumPipe();
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the sum of the input values', () => {
    expect(pipe.transform([1, 2, 3])).toBe(6);
    expect(pipe.transform([-1, 2, -3])).toBe(-2);
  });
  it('should return the sum of the values in the array', () => {
    const values = [1, 2, 3, 4, 5];
    const expectedOutput = 15;

    const actualOutput = pipe.transform(values);

    expect(actualOutput).toEqual(expectedOutput);
  });
});

