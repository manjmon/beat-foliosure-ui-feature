import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PopoverComponentComponent } from './popover.component';

describe('PopoverComponentComponent', () => {
  let component: PopoverComponentComponent;
  let fixture: ComponentFixture<PopoverComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PopoverComponentComponent]
    });
    fixture = TestBed.createComponent(PopoverComponentComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`showPopoverArrow has default value`, () => {
    expect(component.showPopoverArrow).toEqual(false);
  });

  it(`marginLeft has default value`, () => {
    expect(component.marginLeft).toEqual(`0`);
  });

  it(`marginTop has default value`, () => {
    expect(component.marginTop).toEqual(`0`);
  });

  it(`show has default value`, () => {
    expect(component.show).toEqual(false);
  });
});
