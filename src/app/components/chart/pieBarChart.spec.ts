import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { PieBarChartComponent } from "./pieBarChart";
import * as d3 from "d3";

describe("pieBarChartComponent", () => {
  let component: PieBarChartComponent;
  let fixture: ComponentFixture<PieBarChartComponent>;

  beforeEach(() => {
    const miscellaneousServiceStub = () => ({
      getMax: (yearlyData, string) => ({ category: {} })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PieBarChartComponent],
      providers: [
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PieBarChartComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`unit has default value`, () => {
    expect(component.unit).toEqual(`M`);
  });

  it(`colors has default value`, () => {
    expect(component.colors).toEqual(d3.schemeCategory10);
  });

  it(`group has default value`, () => {
    expect(component.group).toEqual(component.group);
  });

  describe("dsBarChart", () => {
    beforeEach(() => {
      component.barChartContainer = {
        nativeElement: document.createElement("div")
      };
      component.colors = d3.schemeCategory10;
    });

    it("should render the bar chart", () => {
      // Arrange
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const firstDatasetBarChart = [
        { category: "Category 1", measure: 10 },
        { category: "Category 2", measure: 20 },
        { category: "Category 3", measure: 30 }
      ];
      const yearlyData = [
        { category: "Category 1", measure: 5 },
        { category: "Category 2", measure: 15 },
        { category: "Category 3", measure: 25 }
      ];
      const maxYear = { category: "Max Year" };

      spyOn(component, "datasetBarChosen").and.returnValue(firstDatasetBarChart);
      spyOn(component, "datasetLineChartChosen").and.returnValue(yearlyData);
      spyOn(miscellaneousServiceStub, "getMax").and.returnValue(maxYear);
     

      // Act
      component.dsBarChart();

      // Assert
    
      expect(component.datasetBarChosen).toHaveBeenCalledWith(component.group);
      expect(component.datasetLineChartChosen).toHaveBeenCalledWith(component.group);
      expect(miscellaneousServiceStub.getMax).toHaveBeenCalledWith(yearlyData, "Year");
      // Add more assertions as needed
    });
  });

  describe("dsLineChart", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "datasetLineChartChosen").and.callThrough();
      spyOn(component, "dsLineChartBasics").and.callThrough();
      spyOn(miscellaneousServiceStub, "getMax").and.callThrough();
      component.dsLineChart();
      expect(component.datasetLineChartChosen).toHaveBeenCalled();
      expect(component.dsLineChartBasics).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getMax).toHaveBeenCalled();
    });
  });
});
