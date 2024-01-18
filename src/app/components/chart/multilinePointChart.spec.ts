import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ElementRef} from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { MultilinePointChartComponent } from "./multilinePointChart";

describe("multilinePointChartComponent", () => {
  let component: MultilinePointChartComponent;
  let fixture: ComponentFixture<MultilinePointChartComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    const miscellaneousServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MultilinePointChartComponent],
      providers: [
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MultilinePointChartComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "createHightChart").and.callThrough();
      component.ngOnInit();
      expect(component.createHightChart).toHaveBeenCalled();
    });
  });
});
