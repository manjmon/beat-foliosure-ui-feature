import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ElementRef } from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { BarChartReportComponent } from "./barChartReport";

describe("BarChartReportComponent", () => {
  let component: BarChartReportComponent;
  let fixture: ComponentFixture<BarChartReportComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    const miscellaneousServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BarChartReportComponent],
      providers: [
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(BarChartReportComponent);
    component = fixture.componentInstance;
  });

  it(`isMultiColorBars has default value`, () => {
    expect(component.isMultiColorBars).toEqual(false);
  });

  it(`NoOfDecimals has default value`, () => {
    expect(component.NoOfDecimals).toEqual(1);
  });

  it(`shrinkSize has default value`, () => {
    expect(component.shrinkSize).toEqual(false);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(1000);
  });

  it(`height has default value`, () => {
    expect(component.height).toEqual(300);
  });

  it(`colorRange has default value`, () => {
    expect(component.colorRange).toEqual([
      `#46BEF5`,
      `#197ec3`,
      `#addb62`,
      `#686662`,
      `#ff99cc`,
      `#c8e796`,
      `#65b5eb`,
      `#e4f3cb`,
      `#ffcccc`,
      `#9b9995`,
      `#a1f7ec`,
      `#f08e7f`,
      `#a2befa`,
      `#f5a905`,
      `#ff7878`,
      `#fffd94`,
      `#2533f7`,
      `#a1edf7`,
      `#de4949`,
      `#f5befa`
    ]);
  });

  it(`chartCreated has default value`, () => {
    expect(component.chartCreated).toEqual(false);
  });

  describe("ngAfterViewChecked", () => {
    it("makes expected calls", () => {
      spyOn(component, "createHightChart").and.callThrough();
      component.ngAfterViewChecked();
      expect(component.createHightChart).toHaveBeenCalled();
    });
  });
});
