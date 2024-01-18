import { TestBed } from '@angular/core/testing';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter_uk } from './NgbDateParserFormatter_uk';

describe('NgbDateParserFormatter_uk', () => {
  let parserFormatter: NgbDateParserFormatter_uk;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NgbDateParserFormatter_uk
        // other providers here
      ]
    });
    parserFormatter = TestBed.inject(NgbDateParserFormatter_uk);
  });
  it('should parse a valid date string', () => {
    const dateString = '2022-01-01';
    const expectedDate: NgbDateStruct = { year: 2022, month: 1, day: 1 };
    const parsedDate = parserFormatter.parse(dateString);
    expect(parsedDate).toEqual(expectedDate);
  });

  it('should return null for an empty string', () => {
    const dateString = '';
    const parsedDate = parserFormatter.parse(dateString);
    expect(parsedDate).toBeNull();
  });

  it('should format a valid date object', () => {
    const date: NgbDateStruct = { year: 2022, month: 1, day: 1 };
    const expectedDateString = '01/01/2022';
    const formattedDate = parserFormatter.format(date);
    expect(formattedDate).toEqual(expectedDateString);
  });

  it('should return an empty string for a null date object', () => {
    const date: NgbDateStruct = null;
    const formattedDate = parserFormatter.format(date);
    expect(formattedDate).toEqual('');
  });
});