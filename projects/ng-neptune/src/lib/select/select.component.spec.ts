import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SelectComponent]
    });
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`openOption has default value`, () => {
    expect(component.openOption).toEqual(false);
  });

  it(`isSearch has default value`, () => {
    expect(component.isSearch).toEqual(true);
  });

  it(`isMultiSearch has default value`, () => {
    expect(component.isMultiSearch).toEqual(true);
  });

  it(`placeholderText has default value`, () => {
    expect(component.placeholderText).toEqual(`Search and Select`);
  });

  it(`keyword has default value`, () => {
    expect(component.keyword).toEqual(`name`);
  });

  it(`data has default value`, () => {
    expect(component.data).toEqual([]);
  });

  it(`selectList has default value`, () => {
    expect(component.selectList).toEqual([]);
  });

  it(`lpreportSelect has default value`, () => {
    expect(component.lpreportSelect).toEqual(false);
  });
});
