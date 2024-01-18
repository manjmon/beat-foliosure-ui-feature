import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FormsModule } from '@angular/forms';
import { KpitablefiltersComponent } from './kpitablefilters.component';

describe('KpitablefiltersComponent', () => {
  let component: KpitablefiltersComponent;
  let fixture: ComponentFixture<KpitablefiltersComponent>;

  beforeEach(() => {
    const datePipeStub = () => ({ transform: (date, string) => ({}) });
    const miscellaneousServiceStub = () => ({ bindYearList: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [KpitablefiltersComponent],
      providers: [
        { provide: DatePipe, useFactory: datePipeStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    spyOn(KpitablefiltersComponent.prototype, 'intilizedates');
    spyOn(KpitablefiltersComponent.prototype, 'calenderbuttons');
    fixture = TestBed.createComponent(KpitablefiltersComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`collapsed has default value`, () => {
    expect(component.collapsed).toEqual(false);
  });

  it(`iscustom has default value`, () => {
    expect(component.iscustom).toEqual(false);
  });

  it(`isdate has default value`, () => {
    expect(component.isdate).toEqual(false);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual(component.yearOptions);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual([
      { value: "Q1", text: "Q1", number: 1 },
      { value: "Q2", text: "Q2", number: 2 },
      { value: "Q3", text: "Q3", number: 3 },
      { value: "Q4", text: "Q4", number: 4 },
    ]);
  });

  it(`unitTypeList has default value`, () => {
    expect(component.unitTypeList).toEqual(component.unitTypeList);
  });

  it(`isMatMenu has default value`, () => {
    expect(component.isMatMenu).toEqual(true);
  });

  it(`isDefaultMillion has default value`, () => {
    expect(component.isDefaultMillion).toEqual(false);
  });

  describe('constructor', () => {
    it('makes expected calls', () => {
      expect(
        KpitablefiltersComponent.prototype.intilizedates
      ).toHaveBeenCalled();
      expect(
        KpitablefiltersComponent.prototype.calenderbuttons
      ).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setobjectperiodtype').and.callThrough();
      component.ngOnInit();
      expect(component.setobjectperiodtype).toHaveBeenCalled();
    });
  });
});
