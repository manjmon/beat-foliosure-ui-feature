import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FormsModule } from '@angular/forms';
import { LocationControlComponent } from './location-control.component';

describe('LocationControlComponent', () => {
  let component: LocationControlComponent;
  let fixture: ComponentFixture<LocationControlComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getCountryListByRegionId: regionId => ({ subscribe: f => f({}) }),
      GetLocationListByCountryId: countryId => ({ subscribe: f => f({}) }),
      GetLocationListByStateId: stateId => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LocationControlComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(LocationControlComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`pageFields has default value`, () => {
    expect(component.pageFields).toEqual([]);
  });

  it(`loadingState has default value`, () => {
    expect(component.loadingState).toEqual(false);
  });

  it(`loadingCity has default value`, () => {
    expect(component.loadingCity).toEqual(false);
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      spyOn(component, 'GetLocationListByCountryId').and.callThrough();
      spyOn(component, 'GetLocationListByStateId').and.callThrough();
      component.ngOnChanges();
      expect(component.GetLocationListByCountryId).toHaveBeenCalled();
      expect(component.GetLocationListByStateId).toHaveBeenCalled();
    });
  });

  describe('onCountryChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'GetLocationListByCountryId').and.callThrough();
      component.onCountryChange();
      expect(component.GetLocationListByCountryId).toHaveBeenCalled();
    });
  });

  describe('onStateChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'GetLocationListByStateId').and.callThrough();
      component.onStateChange();
      expect(component.GetLocationListByStateId).toHaveBeenCalled();
    });
  });

  describe('onRegionChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'GetCountryListByRegionId').and.callThrough();
      component.onRegionChange();
      expect(component.GetCountryListByRegionId).toHaveBeenCalled();
    });
  });

  describe('GetCountryListByRegionId', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'onLocationChange').and.callThrough();
      spyOn(
        miscellaneousServiceStub,
        'getCountryListByRegionId'
      ).and.callThrough();
      component.GetCountryListByRegionId();
      expect(component.onLocationChange).toHaveBeenCalled();
      expect(
        miscellaneousServiceStub.getCountryListByRegionId
      ).toHaveBeenCalled();
    });
  });

  describe('GetLocationListByCountryId', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'onLocationChange').and.callThrough();
      spyOn(
        miscellaneousServiceStub,
        'GetLocationListByCountryId'
      ).and.callThrough();
      component.GetLocationListByCountryId();
      expect(component.onLocationChange).toHaveBeenCalled();
      expect(
        miscellaneousServiceStub.GetLocationListByCountryId
      ).toHaveBeenCalled();
    });
  });

  describe('GetLocationListByStateId', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'onLocationChange').and.callThrough();
      spyOn(
        miscellaneousServiceStub,
        'GetLocationListByStateId'
      ).and.callThrough();
      component.GetLocationListByStateId();
      expect(component.onLocationChange).toHaveBeenCalled();
      expect(
        miscellaneousServiceStub.GetLocationListByStateId
      ).toHaveBeenCalled();
    });
  });
});
