import { MiscellaneousService } from '../services/miscellaneous.service';
import { MinusToBracketsWPercentagePipe, FormatNumbersPipe } from "./minus-to-brackets-with-percentage";
import { TestBed } from "@angular/core/testing";

let pipe: MinusToBracketsWPercentagePipe;
describe('minusToBracketsWithPercentagePipe', () => {
    let pipe: MinusToBracketsWPercentagePipe;
    beforeEach(() => {
        const miscellaneousServiceStub = () => ({
            checkIfStringIsFloat: value => ({}),
            checkIfStringIsIneger: value => ({})
        });
        TestBed.configureTestingModule({
            providers: [
                MinusToBracketsWPercentagePipe,
                FormatNumbersPipe,
                { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
            ]
        });
        pipe = TestBed.inject(MinusToBracketsWPercentagePipe);
    });
    it("can load instance", () => {
        expect(pipe).toBeTruthy();
      });

    it('should return the value if it is not a number', () => {
        expect(pipe.transform('string')).toBe('string');
    });
    it('should return the original value if it is not a number', () => {
        const expected = 'string value';
        const actual = pipe.transform(expected);
    
        expect(actual).toEqual(expected);
      });
     
    
});

describe("FormatNumbersPipe", () => {
    let pipe: FormatNumbersPipe;

    beforeEach(() => {
        const miscellaneousServiceStub = () => ({
            checkIfStringIsFloat: value => ({}),
            checkIfStringIsIneger: value => ({})
        });
        TestBed.configureTestingModule({
            providers: [
                MinusToBracketsWPercentagePipe,
                FormatNumbersPipe,
                { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
            ]
        });
        pipe = TestBed.inject(FormatNumbersPipe);
    });

    it("can load instance", () => {
        expect(pipe).toBeTruthy();
    });
    it('should return the original value if the value is undefined, null, or empty', () => {
        let expected = undefined;
        let actual = pipe.transform(undefined);
    
        expect(actual).toEqual(expected);
    
        expected = null;
        actual = pipe.transform(null);
    
        expect(actual).toEqual(expected);
    
        expected = '';
        actual = pipe.transform('');
    
        expect(actual).toEqual(expected);
      });
});