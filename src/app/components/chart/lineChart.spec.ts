import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ElementRef } from '@angular/core';
import { LineChartComponent } from './lineChart';

describe('lineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LineChartComponent],
      providers: [{ provide: ElementRef, useFactory: elementRefStub }]
    });
    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`data has default value`, () => {
    expect(component.data).toEqual(component.data);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createChart').and.callThrough();
      component.ngOnInit();
      expect(component.createChart).toHaveBeenCalled();
    });
  });
  
});
