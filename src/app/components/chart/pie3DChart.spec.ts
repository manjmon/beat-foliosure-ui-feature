import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Pie3DChartComponent } from './pie3DChart';

describe('Pie3DChartComponent', () => {
  let component: Pie3DChartComponent;
  let fixture: ComponentFixture<Pie3DChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [Pie3DChartComponent]
    });
    fixture = TestBed.createComponent(Pie3DChartComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
