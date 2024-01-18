import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as d3 from 'd3';
import { BarChartComponent } from './barChart';
import { ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    const miscellaneousServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BarChartComponent],
      providers: [
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  it('should create the bar chart component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the chart with correct dimensions and colors', () => {
    // Arrange
    const hostElement = fixture.nativeElement;
    const xField = 'x';
    const yField = 'y';
    const data = [
      { x: 'A', y: 10 },
      { x: 'B', y: 20 },
      { x: 'C', y: 30 }
    ];
    const barColors = ['#80cdf0', '#878c9b', '#f58c3c'];
    const barHoverColors = ['#f58c3c', '#80cdf0', '#878c9b'];

    // Act
    component.createChart(xField, yField, data);

    // Assert
    component.colours = barColors;
    const barRects = hostElement.querySelectorAll('.bar rect');
    const colorScale = d3.scaleOrdinal().range(barColors);
    const hoverColorScale = d3.scaleOrdinal().range(barHoverColors);

    barRects.forEach((rect, index) => {
      const fillColor = rect.getAttribute('fill');
      expect(fillColor).toBe(colorScale(index.toString()));

      rect.dispatchEvent(new MouseEvent('mouseover'));
      const hoverFillColor = rect.getAttribute('fill');
      expect(hoverFillColor).toBe(hoverColorScale(index.toString()));

      rect.dispatchEvent(new MouseEvent('mouseout'));
      const restoredFillColor = rect.getAttribute('fill');
      expect(restoredFillColor).toBe(colorScale(index.toString()));
    });
    expect(component.colours.length).toBe(3);
  });
  it("can load instance", () => {
    expect(component).toBeTruthy();
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

  it(`isDecimalDisplay has default value`, () => {
    expect(component.isDecimalDisplay).toEqual(false);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(1000);
  });

  it(`height has default value`, () => {
    expect(component.height).toEqual(300);
  });

  it(`colorRange has default value`, () => {
    expect(component.colorRange).toEqual([
      `#26A69A`,
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