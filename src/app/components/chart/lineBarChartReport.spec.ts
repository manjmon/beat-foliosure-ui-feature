import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ElementRef} from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { LineBarChartReportComponent } from "./lineBarChartReport";

describe("lineBarChartReportComponent", () => {
  let component: LineBarChartReportComponent;
  let fixture: ComponentFixture<LineBarChartReportComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    const miscellaneousServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LineBarChartReportComponent],
      providers: [
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(LineBarChartReportComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`NoOfDecimals has default value`, () => {
    expect(component.NoOfDecimals).toEqual(2);
  });

  it(`colorRange has default value`, () => {
    expect(component.colorRange).toEqual([
      `rgb(70, 190, 245)`,
      `rgb(245, 140, 60)`,
      `rgb(210, 15, 70)`,
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

  describe("ngOnChanges", () => {
    it("makes expected calls", () => {
      spyOn(component, "createHightChart").and.callThrough();
      component.ngOnChanges();
      expect(component.createHightChart).toHaveBeenCalled();
    });
  });
});
