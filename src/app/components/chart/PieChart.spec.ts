import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PieChartComponent } from "./PieChart";

describe("PieChartComponent", () => {
  let component: PieChartComponent;
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PieChartComponent]
    });
    fixture = TestBed.createComponent(PieChartComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`chartCreated has default value`, () => {
    expect(component.chartCreated).toEqual(false);
  });

  it(`totalValue has default value`, () => {
    expect(component.totalValue).toEqual(0);
  });

  it(`colorRange has default value`, () => {
    expect(component.colorRange).toEqual([
      `#00568F`,
      `#F39C12`,
      `#26A69A`,
      `#F77468`,
      `#75787B`
    ]);
  });

  describe("ngOnChanges", () => {
    it("makes expected calls", () => {
      spyOn(component, "createPieChart").and.callThrough();
      component.ngOnChanges();
      expect(component.createPieChart).toHaveBeenCalled();
    });
  });

  describe("ngAfterViewChecked", () => {
    it("makes expected calls", () => {
      spyOn(component, "createPieChart").and.callThrough();
      component.ngAfterViewChecked();
      expect(component.createPieChart).toHaveBeenCalled();
    });
  });
});
