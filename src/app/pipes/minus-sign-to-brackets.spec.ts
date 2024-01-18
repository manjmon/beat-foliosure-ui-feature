import { TestBed } from "@angular/core/testing";
import { MiscellaneousService } from "../services/miscellaneous.service";
import { MinusSignToBracketsPipe } from "./minus-sign-to-brackets";
import { FormatNumbersPipe } from "./minus-sign-to-brackets";

describe("MinusSignToBracketsPipe", () => {
  let pipe: MinusSignToBracketsPipe;

  beforeEach(() => {
    const miscellaneousServiceStub = () => ({
      checkIfStringIsFloat: value => ({}),
      checkIfStringIsIneger: value => ({})
    });
    TestBed.configureTestingModule({
      providers: [
        MinusSignToBracketsPipe,
        FormatNumbersPipe,
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    pipe = TestBed.inject(MinusSignToBracketsPipe);
  });

  it("can load instance", () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original value if the value is null or undefined', () => {
    const value = null;

    const expectedOutput = value;
    const actualOutput = pipe.transform(value);

    expect(actualOutput).toEqual(expectedOutput);
  });
  it('should handle null and undefined values', () => {
    const expected = null;
    const actual = pipe.transform(null);
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
        MinusSignToBracketsPipe,
        FormatNumbersPipe,
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    pipe = TestBed.inject(FormatNumbersPipe);
  });

  it("can load instance", () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original value if the value is null or undefined', () => {
    const value = null;

    const expectedOutput = value;
    const actualOutput = pipe.transform(value);

    expect(actualOutput).toEqual(expectedOutput);
  });
  it('should handle null and undefined values', () => {
    const expected = null;
    const actual = pipe.transform(null);

    expect(actual).toEqual(expected);
  });
  
});
