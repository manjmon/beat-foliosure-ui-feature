import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MultiSelectComponent } from './multi-select.component';

describe('MultiSelectComponent', () => {
  let component: MultiSelectComponent;
  let fixture: ComponentFixture<MultiSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MultiSelectComponent]
    });
    fixture = TestBed.createComponent(MultiSelectComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`placeholderText has default value`, () => {
    expect(component.placeholderText).toEqual(`Search and Select`);
  });

  it(`isMultiSearch has default value`, () => {
    expect(component.isMultiSearch).toEqual(true);
  });

  it(`selectedData has default value`, () => {
    expect(component.selectedData).toEqual([]);
  });

  it(`keyword has default value`, () => {
    expect(component.keyword).toEqual(`name`);
  });

  it(`multiSelectdata has default value`, () => {
    expect(component.multiSelectdata).toEqual([, , , , , ,]);
  });
});
