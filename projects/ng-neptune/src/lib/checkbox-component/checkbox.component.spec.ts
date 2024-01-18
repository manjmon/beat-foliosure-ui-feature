import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckboxComponentComponent } from './checkbox.component';

describe('CheckboxComponentComponent', () => {
  let component: CheckboxComponentComponent;
  let fixture: ComponentFixture<CheckboxComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CheckboxComponentComponent]
    });
    fixture = TestBed.createComponent(CheckboxComponentComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  it(`height has default value`, () => {
    expect(component.height).toEqual(0);
  });

  it(`marginLeft has default value`, () => {
    expect(component.marginLeft).toEqual(0);
  });

  it(`marginTop has default value`, () => {
    expect(component.marginTop).toEqual(0);
  });

  it(`isChecked has default value`, () => {
    expect(component.isChecked).toEqual(false);
  });

  it(`disabled has default value`, () => {
    expect(component.disabled).toEqual(false);
  });
});
