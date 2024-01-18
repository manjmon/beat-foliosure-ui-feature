import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ElementRef,SimpleChanges } from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { LineBarChartComponent } from "./lineBarChart";

describe("lineBarChartComponent", () => {
  let component: LineBarChartComponent;
  let fixture: ComponentFixture<LineBarChartComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    const miscellaneousServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LineBarChartComponent],
      providers: [
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(LineBarChartComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`NoOfDecimals has default value`, () => {
    expect(component.NoOfDecimals).toEqual(1);
  });

  it(`dynamicSpline has default value`, () => {
    expect(component.dynamicSpline).toEqual(`0`);
  });

  describe("ngOnChanges", () => {
    it("makes expected calls", () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, "createHightChart").and.callThrough();
      component.ngOnChanges(simpleChangesStub);
      expect(component.createHightChart).toHaveBeenCalled();
    });
  });
});

