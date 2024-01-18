import { MatchObjectPipe } from './matchObject.pipe';

describe('MatchObjectPipe', () => {
  let pipe: MatchObjectPipe;

  beforeEach(() => {
    pipe = new MatchObjectPipe();
  });

 
  it('should return the value of the matched object if the filterProperty is provided and the object is found', () => {
    const value = [
      { id: 1, name: 'John Doe', username: 'johndoe' },
      { id: 2, name: 'Jane Doe', username: 'janedoe' },
    ];
    const args = 'johndoe';
    const returnProperty = 'name';
    const filterProperty = 'username';

    const expectedOutput = 'John Doe';
    const actualOutput = pipe.transform(value, args, returnProperty, filterProperty);

    expect(actualOutput).toEqual(expectedOutput);
  });


});