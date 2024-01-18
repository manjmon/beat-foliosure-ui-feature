import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { GraphChartComponent } from "./graphChart";

describe("GraphChartComponent", () => {
  let component: GraphChartComponent;
  let fixture: ComponentFixture<GraphChartComponent>;

  beforeEach(() => {
    const miscellaneousServiceStub = () => ({
      getJSON: string => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [GraphChartComponent],
      providers: [
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(GraphChartComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
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

  it(`population has default value`, () => {
    expect(component.population).toEqual([]);
  });

  it(`countryData has default value`, () => {
    expect(component.countryData).toEqual([]);
  });

  it(`chartCreated has default value`, () => {
    expect(component.chartCreated).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getJSON").and.callThrough();
      component.ngOnInit();
      expect(miscellaneousServiceStub.getJSON).toHaveBeenCalled();
    });
  });
});
