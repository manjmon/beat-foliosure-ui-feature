import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { JSChartComponent } from './js-charts';

describe('JSChartComponent', () => {
  let component: JSChartComponent;
  let fixture: ComponentFixture<JSChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JSChartComponent]
    });
    fixture = TestBed.createComponent(JSChartComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`lineChartData has default value`, () => {
    expect(component.lineChartData).toEqual(component.lineChartData);
  });

  it(`lineChartLabels has default value`, () => {
    expect(component.lineChartLabels).toEqual([
      `January`,
      `February`,
      `March`,
      `April`,
      `May`,
      `June`,
      `July`
    ]);
  });

  it(`lineChartColors has default value`, () => {
    expect(component.lineChartColors.length).toBeGreaterThan(1);
  });

  it(`lineChartLegend has default value`, () => {
    expect(component.lineChartLegend).toEqual(true);
  });

  it(`lineChartType has default value`, () => {
    expect(component.lineChartType).toEqual(`line`);
  });

  it(`barChartLabels has default value`, () => {
    expect(component.barChartLabels).toEqual([
      `2006`,
      `2007`,
      `2008`,
      `2009`,
      `2010`,
      `2011`,
      `2012`
    ]);
  });

  it(`barChartType has default value`, () => {
    expect(component.barChartType).toEqual(`bar`);
  });

  it(`barChartLegend has default value`, () => {
    expect(component.barChartLegend).toEqual(true);
  });

  it(`barChartData has default value`, () => {
    expect(component.barChartData.length).toBeGreaterThan(0);
  });

  it(`pieChartLabels has default value`, () => {
    expect(component.pieChartLabels).toEqual([
      `Download Sales`,
      `In-Store Sales`,
      `Mail Sales`
    ]);
  });

  it(`pieChartData has default value`, () => {
    expect(component.pieChartData).toEqual([300, 500, 100]);
  });

  it(`pieChartType has default value`, () => {
    expect(component.pieChartType).toEqual(`pie`);
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`lineChartData has default value`, () => {
    expect(component.lineChartData).toEqual([
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
      { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
    ]);
  });

  it(`lineChartLabels has default value`, () => {
    expect(component.lineChartLabels).toEqual([
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July'
    ]);
  });

  it(`lineChartColors has default value`, () => {
    expect(component.lineChartColors).toEqual([
      {
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      },
      {
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)'
      },
      {
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)'
      }
    ]);
  });

  it(`lineChartLegend has default value`, () => {
    expect(component.lineChartLegend).toEqual(true);
  });

  it(`lineChartType has default value`, () => {
    expect(component.lineChartType).toEqual('line');
  });

  it(`barChartLabels has default value`, () => {
    expect(component.barChartLabels).toEqual([
      '2006',
      '2007',
      '2008',
      '2009',
      '2010',
      '2011',
      '2012'
    ]);
  });

  it(`barChartType has default value`, () => {
    expect(component.barChartType).toEqual('bar');
  });

  it(`barChartLegend has default value`, () => {
    expect(component.barChartLegend).toEqual(true);
  });

  it(`barChartData has default value`, () => {
    expect(component.barChartData).toEqual([
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]);
  });

  it(`pieChartLabels has default value`, () => {
    expect(component.pieChartLabels).toEqual([
      'Download Sales',
      'In-Store Sales',
      'Mail Sales'
    ]);
  });

  it(`pieChartData has default value`, () => {
    expect(component.pieChartData).toEqual([300, 500, 100]);
  });

  it(`pieChartType has default value`, () => {
    expect(component.pieChartType).toEqual('pie');
  });

  it(`randomize method should update lineChartData`, () => {
    component.randomize();
    expect(component.lineChartData).not.toEqual([
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
      { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
    ]);
  });

  it(`randomizeBar method should update barChartData`, () => {
    component.randomizeBar();
    expect(component.barChartData).not.toEqual([
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
    ]);
  });
});
