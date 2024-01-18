import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TooltipControlComponent } from './tooltip-control.component';

describe('TooltipControlComponent', () => {
  let component: TooltipControlComponent;
  let fixture: ComponentFixture<TooltipControlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TooltipControlComponent]
    });
    fixture = TestBed.createComponent(TooltipControlComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
