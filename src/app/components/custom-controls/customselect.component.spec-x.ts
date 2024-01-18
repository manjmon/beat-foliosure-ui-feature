import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,Renderer2 } from '@angular/core';
import { CustomSelectComponent } from './customselect.component';

describe('CustomSelectComponent', () => {
  let component: CustomSelectComponent;
  let fixture: ComponentFixture<CustomSelectComponent>;

  beforeEach(() => {
    const renderer2Stub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CustomSelectComponent],
      providers: [{ provide: Renderer2, useFactory: renderer2Stub }]
    });
    fixture = TestBed.createComponent(CustomSelectComponent);
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

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'writeValue').and.callThrough();
      component.ngOnInit();
      expect(component.writeValue).toHaveBeenCalled();
    });
  });
});
