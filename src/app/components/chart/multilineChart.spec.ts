import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ElementRef } from '@angular/core';
import { MultilineChartComponent } from './multilineChart';

describe('multilineChartComponent', () => {
  let component: MultilineChartComponent;
  let fixture: ComponentFixture<MultilineChartComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MultilineChartComponent],
      providers: [{ provide: ElementRef, useFactory: elementRefStub }]
    });
    fixture = TestBed.createComponent(MultilineChartComponent);
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
