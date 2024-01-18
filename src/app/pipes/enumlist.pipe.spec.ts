import { TestBed } from '@angular/core/testing';
import { EnumKeyValueListPipe } from './enumlist.pipe';

describe('EnumKeyValueListPipe', () => {
  let pipe: EnumKeyValueListPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [EnumKeyValueListPipe] });
    pipe = new EnumKeyValueListPipe();
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should return an empty array if the value is null or undefined', () => {
    const value = null;

    const expectedOutput = [];
    const actualOutput = pipe.transform(value, []);

    expect(actualOutput).toEqual(expectedOutput);
  });
});