import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ElementRef } from "@angular/core";
import { BubbleChartComponent } from "./bubbleChart";

describe("BubbleChartComponent", () => {
  let component: BubbleChartComponent;
  let fixture: ComponentFixture<BubbleChartComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BubbleChartComponent],
      providers: [{ provide: ElementRef, useFactory: elementRefStub }],
    });
    fixture = TestBed.createComponent(BubbleChartComponent);
    component = fixture.componentInstance;
  });
  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should create the chart", () => {
    component.ngOnInit();
    expect(component.svg).toBeDefined();
  });
});