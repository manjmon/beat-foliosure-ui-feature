import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SearchSelectComponent } from './search-select.component';

describe('SearchSelectComponent', () => {
  let component: SearchSelectComponent;
  let fixture: ComponentFixture<SearchSelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SearchSelectComponent]
    });
    fixture = TestBed.createComponent(SearchSelectComponent);
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

  it(`selectData has default value`, () => {
    expect(component.selectData).toEqual([
      `red`,
      `orange`,
      `yellow`,
      `green`,
      `cyan`,
      `blue`,
      `violet`
    ]);
  });

  it(`keyword has default value`, () => {
    expect(component.keyword).toEqual(`name`);
  });

  it(`data has default value`, () => {
    expect(component.data).toEqual([, , , , , ,]);
  });
});
