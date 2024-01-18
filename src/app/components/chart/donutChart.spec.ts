import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ElementRef,SimpleChanges} from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { DonutChartComponent } from "./donutChart";

describe("DonutChartComponent", () => {
  let component: DonutChartComponent;
  let fixture: ComponentFixture<DonutChartComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    const miscellaneousServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DonutChartComponent],
      providers: [
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(DonutChartComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`showLegends has default value`, () => {
    expect(component.showLegends).toEqual(false);
  });

  it(`NoOfDecimals has default value`, () => {
    expect(component.NoOfDecimals).toEqual(1);
  });

  it(`isDynamicHeight has default value`, () => {
    expect(component.isDynamicHeight).toEqual(false);
  });

  it(`fullView has default value`, () => {
    expect(component.fullView).toEqual(false);
  });

  it(`totalValue has default value`, () => {
    expect(component.totalValue).toEqual(0);
  });

  it(`chartElementHeight has default value`, () => {
    expect(component.chartElementHeight).toEqual(0);
  });

  it(`chartCreated has default value`, () => {
    expect(component.chartCreated).toEqual(false);
  });

  it(`r has default value`, () => {
    expect(component.r).toEqual(150);
  });

  it(`textOffset has default value`, () => {
    expect(component.textOffset).toEqual(15);
  });

  describe("ngOnChanges", () => {
    it("makes expected calls", () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, "createChart").and.callThrough();
      component.ngOnChanges(simpleChangesStub);
      expect(component.createChart).toHaveBeenCalled();
    });
  });

  describe("ngAfterViewChecked", () => {
    it("makes expected calls", () => {
      spyOn(component, "createChart").and.callThrough();
      component.ngAfterViewChecked();
      expect(component.createChart).toHaveBeenCalled();
    });
  });

  describe("CreateHighChart", () => {
    it("makes expected calls", () => {
      spyOn(component, "filterZeroValues").and.callThrough();
      component.CreateHighChart();
      expect(component.filterZeroValues).toHaveBeenCalled();
    });
  });

  describe("createChart", () => {
    it("makes expected calls", () => {
      spyOn(component, "CreateHighChart").and.callThrough();
      component.createChart();
      expect(component.CreateHighChart).toHaveBeenCalled();
    });
  });

  describe("updateDonut", () => {
    it("makes expected calls", () => {
      spyOn(component, "genData").and.callThrough();
      spyOn(component, "arrangeLabels").and.callThrough();
      component.updateDonut();
      expect(component.genData).toHaveBeenCalled();
    });
  });

  describe("genData", () => {
    it("makes expected calls", () => {
      spyOn(component, "filterZeroValues").and.callThrough();
      component.genData();
      expect(component.filterZeroValues).toHaveBeenCalled();
    });
  });
});
