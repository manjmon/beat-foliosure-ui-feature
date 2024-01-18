import {
  isUndefined,
  isNull,
  isNumber,
  isNumberFinite,
  isPositive,
  isInteger,
  isNil,
  isString,
  isObject,
  isArray,
  isFunction,
  toDecimal,
  upperFirst,
  createRound,
  leftPad,
  rightPad,
  toString,
  pad,
  flatten,
  getProperty,
  sum,
  shuffle,
  deepIndexOf,
  deepEqual,
  isDeepObject,
  wrapDeep,
  unwrapDeep,
  DeepWrapper,
  count,
  empty,
  every,
  takeUntil,
  takeWhile,
  isEmpty,
  groupBy,
  maxValue,
  minValue,
  dynamicSort,
  getQuarter,
  getListQuarters,
} from './utils';

describe('isUndefined', () => {
  it('should return true for undefined values', () => {
    expect(isUndefined(undefined)).toBe(true);
  });

  it('should return false for non-undefined values', () => {
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined({})).toBe(false);
    expect(isUndefined([])).toBe(false);
    expect(isUndefined(function() {})).toBe(false);
  });
});

describe('isNull', () => {
  it('should return true for null values', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false for non-null values', () => {
    expect(isNull(undefined)).toBe(false);
    expect(isNull(0)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull({})).toBe(false);
    expect(isNull([])).toBe(false);
    expect(isNull(function() {})).toBe(false);
  });
});

describe('isNumber', () => {
  it('should return true for number values', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(123.45)).toBe(true);
    expect(isNumber(-123.45)).toBe(true);
  });

  it('should return false for non-number values', () => {
    expect(isNumber(undefined)).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber('')).toBe(false);
    expect(isNumber({})).toBe(false);
    expect(isNumber([])).toBe(false);
    expect(isNumber(function() {})).toBe(false);
  });
});

describe('isNumberFinite', () => {
  it('should return true for finite number values', () => {
    expect(isNumberFinite(0)).toBe(true);
    expect(isNumberFinite(123.45)).toBe(true);
    expect(isNumberFinite(-123.45)).toBe(true);
  });

  it('should return false for non-finite number values', () => {
    expect(isNumberFinite(Infinity)).toBe(false);
    expect(isNumberFinite(-Infinity)).toBe(false);
    expect(isNumberFinite(NaN)).toBe(false);
  });
});

describe('isPositive', () => {
  it('should return true for positive number values', () => {
    expect(isPositive(0)).toBe(true);
    expect(isPositive(123.45)).toBe(true);
  });

  it('should return false for negative number values', () => {
    expect(isPositive(-123.45)).toBe(false);
  });
});

describe('isInteger', () => {
  it('should return true for integer number values', () => {
    expect(isInteger(0)).toBe(true);
    expect(isInteger(123)).toBe(true);
    expect(isInteger(-123)).toBe(true);
  });

  it('should return false for non-integer number values', () => {
    expect(isInteger(123.45)).toBe(false);
    expect(isInteger(-123.45)).toBe(false);
    expect(isInteger(Infinity)).toBe(false);
    expect(isInteger(-Infinity)).toBe(false);
    expect(isInteger(NaN)).toBe(false);
    expect(isInteger(123.45)).toBe(false);
    expect(isInteger(-123.45)).toBe(false);
    expect(isInteger(Infinity)).toBe(false);
    expect(isInteger(-Infinity)).toBe(false);
    expect(isInteger(NaN)).toBe(false);
  });
});
describe('isNil()', () => {
  it('should return true if the value is null or undefined', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
  });

  it('should return false if the value is not null or undefined', () => {
    expect(isNil(0)).toBe(false);
    expect(isNil("")).toBe(false);
    expect(isNil({})).toBe(false);
    expect(isNil([])).toBe(false);
    expect(isNil(function() {})).toBe(false);
  });
});
describe('isString()', () => {
  it('should return true if the value is a string', () => {
    expect(isString("")).toBe(true);
    expect(isString("hello")).toBe(true);
  });

  it('should return false if the value is not a string', () => {
    expect(isString(0)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
    expect(isString(function() {})).toBe(false);
  });
});

describe('isObject()', () => {
  it('should return true if the value is an object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
  });

  it('should return false if the value is not an object', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject("")).toBe(false);
    expect(isObject(function() {})).toBe(false);
  });
});

describe('isArray()', () => {
  it('should return true if the value is an array', () => {
    expect(isArray([])).toBe(true);
  });

  it('should return false if the value is not an array', () => {
    expect(isArray(null)).toBe(false);
    expect(isArray(0)).toBe(false);
    expect(isArray("")).toBe(false);
    expect(isArray({})).toBe(false);
    expect(isArray(function() {})).toBe(false);
  });
});

describe('isFunction()', () => {
  it('should return true if the value is a function', () => {
    expect(isFunction(function() {})).toBe(true);
  });

  it('should return false if the value is not a function', () => {
    expect(isFunction(null)).toBe(false);
    expect(isFunction(0)).toBe(false);
    expect(isFunction("")).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});

describe('toDecimal()', () => {
  it('should round the value to the specified number of decimal places', () => {
    expect(toDecimal(1.23456789, 2)).toBe(1.23);
    expect(toDecimal(1.23456789, 4)).toBe(1.2346);
    expect(toDecimal(1.23456789, 6)).toBe(1.234568);
  });
});

describe('upperFirst()', () => {
  it('should capitalize the first letter of the string', () => {
    expect(upperFirst("hello")).toBe("Hello");
    expect(upperFirst("world")).toBe("World");
  });

  it('should return the original string if it is empty', () => {
    expect(upperFirst("")).toBe("");
  });
});
describe('createRound()', () => {
  it('should round the value to the specified number of decimal places', () => {
    expect(createRound('round')(1.23456789, 2)).toBe(1.23);
    expect(createRound('round')(1.23456789, 4)).toBe(1.2346);
    expect(createRound('round')(1.23456789, 6)).toBe(1.234568);
  });

  it('should throw an error if the value is not a number', () => {
    expect(() => createRound('round')('string')).toThrowError('Rounding method needs a number');
  });

  
});

describe('leftPad()', () => {
  
it('should return the original string if the length is not greater than the string length', () => {
    expect(leftPad('hello', 5)).toBe('hello');
  });
});

describe('rightPad()', () => {
 
  it('should return the original string if the length is not greater than the string length', () => {
    expect(rightPad('hello', 5)).toBe('hello');
  });
});

describe('toString()', () => {
  it('should convert the value to a string', () => {
    expect(toString(123)).toBe('123');
    expect(toString('hello')).toBe('hello');
    expect(toString(null)).toBe('null');
    expect(toString(undefined)).toBe('undefined');
  });
});

describe('pad()', () => {
 
  it('should return the original string if the length is not greater than the string length', () => {
    expect(pad('hello', 5)).toBe('hello');
  });
});

describe('flatten()', () => {
  it('should flatten the array to a single level', () => {
    expect(flatten([1, 2, [3, 4], 5])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return the original array if it is empty', () => {
    expect(flatten([])).toEqual([]);
  });
});

describe('getProperty()', () => {
  it('should get the value of the property from the object', () => {
    expect(getProperty({ name: 'John Doe' }, 'name')).toBe('John Doe');
    expect(getProperty({ address: { street: 'Main Street' } }, 'address.street')).toBe('Main Street');
  });

  it('should return undefined if the property does not exist', () => {
    expect(getProperty({ name: 'John Doe' }, 'age')).toBeUndefined();
  });

  it('should return undefined if the object is null or undefined', () => {
    expect(getProperty(null, 'name')).toBeUndefined();
    expect(getProperty(undefined, 'name')).toBeUndefined();
  });
});

describe('sum()', () => {
  it('should sum the values in the array', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15);
  });

  it('should return the initial value if the array is empty', () => {
    expect(sum([], 10)).toBe(10);
  });
});

describe('shuffle()', () => {
  it('should shuffle the array in random order', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffledArray = shuffle(array);

    expect(shuffledArray.length).toBe(array.length);
    expect(shuffledArray).not.toEqual(array);
  });
});

describe('deepIndexOf()', () => {
  it('should return the index of the value in the array, or -1 if the value is not found', () => {
    const array = [{ name: 'John Doe' }, { name: 'Jane Doe' }];
    const value = { name: 'John Doe' };

    expect(deepIndexOf(array, value)).toBe(0);
    expect(deepIndexOf(array, { name: 'Peter Parker' })).toBe(-1);
  });
});

describe('deepEqual()', () => {
  it('should return true if the two values are deeply equal, and false otherwise', () => {
    const object1 = { name: 'John Doe', age: 30 };
    const object2 = { name: 'John Doe', age: 30 };

    expect(deepEqual(object1, object2)).toBe(true);

    object2.age = 31;

    expect(deepEqual(object1, object2)).toBe(false);
  });
});


describe('wrapDeep()', () => {
  it('should wrap the value in a DeepWrapper object', () => {
    const object = { name: 'John Doe' };
    const deepObject = wrapDeep(object);

    expect(deepObject instanceof DeepWrapper).toBe(true);
    expect(deepObject.data).toBe(object);
  });
});

describe('unwrapDeep()', () => {
  it('should unwrap the value from a DeepWrapper object', () => {
    const object = { name: 'John Doe' };
    const deepObject = wrapDeep(object);
    const unwrappedObject = unwrapDeep(deepObject);

    expect(unwrappedObject).toBe(object);
  });
});

describe('count()', () => {
  it('should count the number of elements in the array or object', () => {
    const array = [1, 2, 3, 4, 5];
    const object = { name: 'John Doe', age: 30 };

    expect(count(array)).toBe(5);
    expect(count(object)).toBe(2);
  });

  it('should return 0 if the array or object is empty', () => {
    expect(count([])).toBe(0);
    expect(count({})).toBe(0);
  });

});
describe('empty()', () => {
  it('should return true if the input is an empty array, and false otherwise', () => {
    expect(empty([])).toBe(true);
    expect(empty([1, 2, 3])).toBe(false);
  });

  it('should return the input if it is not an array or object', () => {
    expect(empty('')).toBe('');
    expect(empty(1)).toBe(1);
    expect(empty(true)).toBe(true);
    expect(empty(null)).toBe(null);
    expect(empty(undefined)).toBe(undefined);
  });
});

describe('every()', () => {
  it('should return true if all the elements in the array satisfy the predicate, and false otherwise', () => {
    const array = [1, 2, 3, 4, 5];

    expect(every(array, element => element > 0)).toBe(true);
    expect(every(array, element => element % 2 === 0)).toBe(false);
  });


});

describe('takeUntil()', () => {
  it('should return a new array containing the elements of the input array up to, but not including, the first element that satisfies the predicate', () => {
    const array = [1, 2, 3, 4, 5];

    expect(takeUntil(array, element => element > 3)).toEqual([1, 2, 3]);
  });
});

describe('takeWhile()', () => {
  it('should return a new array containing the elements of the input array that satisfy the predicate', () => {
    const array = [1, 2, 3, 4, 5];

    expect(takeWhile(array, element => element < 4)).toEqual([1, 2, 3]);
  });

  it('should return an empty array if the predicate is never satisfied', () => {
    const array = [1, 2, 3, 4, 5];

    expect(takeWhile(array, element => element > 10)).toEqual([]);
  });

  
});

describe('isEmpty()', () => {
  it('should return false for objects with prototype properties', () => {
    const obj = Object.create(null);
    obj.name = 'John Doe';

    expect(isEmpty(obj)).toBe(false);
  });
});


describe('maxValue()', () => {
  it('should return the maximum value in the array', () => {
    const array = [1, 2, 3, 4, 5];

    expect(maxValue(array)).toBe(5);
  });

  it('should return undefined if the array is empty', () => {
    expect(maxValue([])).toBeUndefined();
  });
});

describe('minValue()', () => {
  it('should return the minimum value in the array', () => {
    const array = [1, 2, 3, 4, 5];

    expect(minValue(array)).toBe(1);
  });

  it('should return undefined if the array is empty', () => {
    expect(minValue([])).toBeUndefined();
  });
});

describe('dynamicSort()', () => {
  it('should sort the array by the specified property in ascending or descending order', () => {
    const array = [{ name: 'John Doe', age: 30 }, { name: 'Jane Doe', age: 30 }];

    const sortedArray = array.sort(dynamicSort('name'));

    expect(sortedArray).toEqual([
      { name: 'Jane Doe', age: 30 },
      { name: 'John Doe', age: 30 },
    ]);

    const sortedArrayDescending = array.sort(dynamicSort('-name'));

    expect(sortedArrayDescending).toEqual([
      { name: 'John Doe', age: 30 },
      { name: 'Jane Doe', age: 30 },
    ]);
  });

  it('should return the original array if the property does not exist on the elements of the array', () => {
    const array = [{ name: 'John Doe' }];

    const sortedArray = array.sort(dynamicSort('age'));

    expect(sortedArray).toEqual(array);
  });
});

describe('getQuarter()', () => {
  it('should return the quarter of the year for the given date', () => {
    const date = new Date('2023-09-19');

    expect(getQuarter(date)).toBe('Q3 2023');
  });
});

describe('getListQuarters()', () => {
  it('should return a list of quarters between the two given dates', () => {
    const startDate = new Date('2023-03-19');
    const endDate = new Date('2023-09-19');

    const quarters = getListQuarters(startDate, endDate);

    expect(quarters).toEqual(['Q1 2023', 'Q2 2023', 'Q3 2023']);
  });

 
});

describe('groupBy()', () => {
  it('should group the input array by the prop value', () => {
    const input = [
      { name: 'John Doe', age: 30 },
      { name: 'Jane Doe', age: 25 },
      { name: 'Peter Parker', age: 20 },
    ];
    const prop = 'name';

    const expectedOutput = [
      { key: 'John Doe', value: [{ name: 'John Doe', age: 30 }] },
      { key: 'Jane Doe', value: [{ name: 'Jane Doe', age: 25 }] },
      { key: 'Peter Parker', value: [{ name: 'Peter Parker', age: 20 }] },
    ];

    const actualOutput = groupBy(input, prop);

    expect(actualOutput).toEqual(expectedOutput);
  });
});
