import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ChangeDetectorRef } from "@angular/core";
import { SimpleChanges } from "@angular/core";
import { QuarterYearControlComponent } from "./quarter-year-control.component";

describe("QuarterYearControlComponent", () => {
  let component: QuarterYearControlComponent;
  let fixture: ComponentFixture<QuarterYearControlComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [QuarterYearControlComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub }
      ]
    });
    fixture = TestBed.createComponent(QuarterYearControlComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`isRequired has default value`, () => {
    expect(component.isRequired).toEqual(false);
  });

  it(`placeHolder has default value`, () => {
    expect(component.placeHolder).toEqual(`Select quarter & year`);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(240);
  });

  it(`showHideYearModal has default value`, () => {
    expect(component.showHideYearModal).toEqual(false);
  });

  it(`allYears has default value`, () => {
    expect(component.allYears).toEqual([]);
  });

  it(`showDropDown has default value`, () => {
    expect(component.showDropDown).toEqual(false);
  });

  it(`startYear has default value`, () => {
    expect(component.startYear).toEqual(1987);
  });

  it(`enableInitButton has default value`, () => {
    expect(component.enableInitButton).toEqual(false);
  });

  it(`initialInput has default value`, () => {
    expect(component.initialInput).toEqual(true);
  });

  it(`enableModalTop has default value`, () => {
    expect(component.enableModalTop).toEqual(false);
  });

  it(`isReLoad has default value`, () => {
    expect(component.isReLoad).toEqual(false);
  });

  describe("ngOnChanges", () => {
    it("makes expected calls", () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, "onLoad").and.callThrough();
      spyOn(component, "reLoadChange").and.callThrough();
      component.ngOnChanges(simpleChangesStub);
      expect(component.onLoad).toHaveBeenCalled();
      expect(component.reLoadChange).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "onLoad").and.callThrough();
      component.ngOnInit();
      expect(component.onLoad).toHaveBeenCalled();
    });
  });
});
