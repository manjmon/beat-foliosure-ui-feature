export type CollectionPredicate = (item?: any, index?: number, collection?: any[]) => boolean;

export function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

export function isNull(value: any): value is null {
  return value === null;
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export function isNumberFinite(value: any): value is number {
  return isNumber(value) && isFinite(value);
}

// Not strict positive
export function isPositive(value: number): boolean {
  return value >= 0;
}

export function isInteger(value: number): boolean {
  // No rest, is an integer
  return value % 1 === 0;
}

export function isNil(value: any): value is null | undefined {
  return value === null || typeof value === 'undefined';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isObject(value: any): boolean {
  return value !== null && typeof value === 'object';
}

export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

export function toDecimal(value: number, decimal: number): number {
  return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function upperFirst(value: string): string {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

export function createRound(method: string): Function {
  // <any>Math to suppress error
  const func: any = (<any>Math)[method];
  return function(value: number, precision: number = 0) {
    if (typeof value === 'string') {
      throw new TypeError('Rounding method needs a number');
    }

    if (typeof precision !== 'number' || isNaN(precision)) {
      precision = 0;
    }

    if (precision) {
      let pair = `${value}e`.split('e');
      const val = func(`${pair[0]}e` + (+pair[1] + precision));

      pair = `${val}e`.split('e');
      return +(pair[0] + 'e' + (+pair[1] - precision));
    }

    return func(value);
  };
}

export function leftPad(str: string, len: number = 0, ch: any = ' ') {
  str = String(str);
  ch = toString(ch);
  let i = -1;
  const length = len - str.length;

  while (++i < length && str.length + ch.length <= len) {
    str = ch + str;
  }

  return str;
}

export function rightPad(str: string, len: number = 0, ch: any = ' ') {
  str = String(str);
  ch = toString(ch);

  let i = -1;
  const length = len - str.length;

  while (++i < length && str.length + ch.length <= len) {
    str += ch;
  }

  return str;
}

export function toString(value: number | string) {
  return `${value}`;
}

export function pad(str: string, len: number = 0, ch: any = ' '): string {
  str = String(str);
  ch = toString(ch);
  let i = -1;
  const length = len - str.length;

  let left = true;
  while (++i < length) {
    const l = str.length + ch.length <= len ? str.length + ch.length : str.length + 1;

    if (left) {
      str = leftPad(str, l, ch);
    } else {
      str = rightPad(str, l, ch);
    }

    left = !left;
  }

  return str;
}

export function flatten(input: any[], index: number = 0): any[] {
  if (index >= input.length) {
    return input;
  }

  if (isArray(input[index])) {
    return flatten(input.slice(0, index).concat(input[index], input.slice(index + 1)), index);
  }

  return flatten(input, index + 1);
}

export function getProperty(value: { [key: string]: any }, key: string): any {
  if (isNil(value) || !isObject(value)) {
    return undefined;
  }

  const keys: string[] = key.split('.');
  let result: any = value[keys.shift()!];

  for (const key of keys) {
    if (isNil(result) || !isObject(result)) {
      return undefined;
    }

    result = result[key];
  }

  return result;
}

export function sum(input: Array<number>, initial = 0): number {
  return input.reduce((previous: number, current: number) => previous + current, initial);
}
export function shuffle(input: any): any {
  if (!isArray(input)) {
    return input;
  }

  const copy = [...input];

  for (let i = copy.length; i; --i) {
    const j = Math.floor(Math.random() * i);
    const x = copy[i - 1];
    copy[i - 1] = copy[j];
    copy[j] = x;
  }

  return copy;
}

export function deepIndexOf(collection: any[], value: any) {
  let index = -1;
  const length = collection.length;

  while (++index < length) {
    if (deepEqual(value, collection[index])) {
      return index;
    }
  }

  return -1;
}

export function deepEqual(a: any, b: any) {
  if (a === b) {
    return true;
  }

  if (!(typeof a === 'object' && typeof b === 'object')) {
    return a === b;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  let hasOwn = Object.prototype.hasOwnProperty;
  for (const key of keysA) {
    if (!hasOwn.call(b, key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export function isDeepObject(object: any) {
  return object.__isDeepObject__;
}

export function wrapDeep(object: any) {
  return new DeepWrapper(object);
}

export function unwrapDeep(object: any) {
  if (isDeepObject(object)) {
    return object.data;
  }

  return object;
}

export class DeepWrapper {
  public __isDeepObject__: boolean = true;

  constructor(public data: any) {}
}

export function count(input: any): any {
  if (!isArray(input) && !isObject(input) && !isString(input)) {
    return input;
  }

  if (isObject(input)) {
    return Object.keys(input).map(value => input[value]).length;
  }

  return input.length;
}

export function empty(input: any): any {
  if (!isArray(input)) {
    return input;
  }

  return input.length === 0;
}

export function every(input: any, predicate: CollectionPredicate) {
  if (!isArray(input) || !predicate) {
    return input;
  }

  let result = true;
  let i = -1;

  while (++i < input.length && result) {
    result = predicate(input[i], i, input);
  }

  return result;
}

export function takeUntil(input: any[], predicate: CollectionPredicate) {
  let i = -1;
  const result: any = [];
  while (++i < input.length && !predicate(input[i], i, input)) {
    result[i] = input[i];
  }

  return result;
}

export function takeWhile(input: any[], predicate: CollectionPredicate) {
  return takeUntil(input, (item: any, index: number, collection: any[]) => !predicate(item, index, collection));
}
  export function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }
export function groupBy(input: any, prop: string): Array<any> {
  if (!isArray(input)) {
    return input;
  }
  const arr: { [key: string]: Array<any> } = {};

  for (const value of input) {
    const field: any = getProperty(value, prop);

    if (isUndefined(arr[field])) {
      arr[field] = [];
    }

    arr[field].push(value);
  }

  return Object.keys(arr).map(key => ({ key, value: arr[key] }));
}
export function  maxValue(input: any): any {
  if (!isArray(input)) {
    return input;
  }

  if (input.length === 0) {
    return undefined;
  }

  let max = input[0];

  input.forEach((value: any) => {
    if (max < value) {
      max = value;
    }
  });

  return max;
}
export function minValue(input: any): any {
  if (!isArray(input)) {
    return input;
  }

  if (input.length === 0) {
    return undefined;
  }

  let min = input[0];

  input.forEach((value: any) => {
    if (min > value) {
      min = value;
    }
  });

  return min;
}
export function dynamicSort(property) {
  let sortOrder = 1;

  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }

  return function (a,b) {
      if(sortOrder == -1){
          return b[property].localeCompare(a[property]);
      }else{
          return a[property].localeCompare(b[property]);
      }        
  }
}
export function getQuarter(date) {
  return  'Q' + Math.ceil((date.getMonth()+ 1)/3)+' '+date.getFullYear();
}
export function getListQuarters(sDate, eDate) {
  if (sDate > eDate) {
    let t = eDate;
    eDate = sDate;
    sDate = t;
  }
  sDate = new Date(sDate);
  sDate.setDate(2);
  let startQ = getQuarter(sDate);
  let endQ   = getQuarter(eDate);
  let result = [startQ];
  while (startQ != endQ) {
    sDate.setMonth(sDate.getMonth() + 3);
    startQ = getQuarter(sDate);
    result.push(startQ);
  }  
  return result;
}