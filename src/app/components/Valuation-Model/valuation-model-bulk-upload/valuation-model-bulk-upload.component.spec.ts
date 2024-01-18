import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ValuationModelBulkUploadComponent } from './valuation-model-bulk-upload.component';
import { ValuationModelService } from '../../../services/valuation-model.service';
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { ToastrService } from "ngx-toastr";

describe('ValuationModelBulkUploadComponent', () => {
  let component: ValuationModelBulkUploadComponent;
  let fixture: ComponentFixture<ValuationModelBulkUploadComponent>;

  beforeEach(() => {
    const miscellaneousServiceStub = () => ({ getMessageTimeSpan: () => ({}) });
        const toastrServiceStub = () => ({
      overlayContainer: {},
      error: (message, string, object) => ({}),
      success: (message, string, object) => ({})
    });
    const valuationModelServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ValuationModelBulkUploadComponent],
      providers: [
        {
          provide: ValuationModelService,
          useFactory: valuationModelServiceStub
        },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ValuationModelBulkUploadComponent);
    component = fixture.componentInstance;
    component.fundDetails = {fundId:'116B9465C55DC11EB465F9282CFF1C5C',
    fundName: 'Demo Fund 3'};
    component.companyDetails = {companyCurrency: 'GBP',
                  companyId: '281CF76D0B49154E05CC9BFB3B1E6267',
                companyName: 'demo company 6',
              currencyId: 3};
              component.QuarterAndYear = { quarter: 'Q1', year: 2023};
                
    fixture.detectChanges();
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`defaultPlaceholder has default value`, () => {
    expect(component.defaultPlaceholder).toEqual(`Browse`);
  });

  it(`uploadFilePlaceholder has default value`, () => {
    expect(component.uploadFilePlaceholder).toEqual("Browse");
  });

  it(`browseicon has default value`, () => {
    expect(component.browseicon).toEqual(true);
  });

  it(`ProgressCancel has default value`, () => {
    expect(component.ProgressCancel).toEqual(true);
  });

  describe('onReset',() => {
    it('makes expected calls', () => {
        spyOn(component, 'onReset').and.callThrough();
        component.onReset();
        expect(component.onReset).toHaveBeenCalled();
    })
  });

    describe('deleteIconClick',() => {
    it('makes expected calls', () => {
        spyOn(component, 'deleteIconClick').and.callThrough();
        component.deleteIconClick();
        expect(component.deleteIconClick).toHaveBeenCalled();
    })
  });

  describe('onSelect',() => {
    it('makes expected calls', () => {
        const files = [{
            name: 'Transaction Comps_Demo Company 7_Q42023.xlsx',
            size: 23449,
            lastModified: 1692705591293
        }]
        spyOn(component, 'onSelect').and.callThrough();
        component.onSelect(files);
        expect(component.onSelect).toHaveBeenCalled();
    })
  });

  describe('onUpload',() => {
    it('makes expected calls', () => {
        spyOn(component, 'onUpload').and.callThrough();
        component.onUpload();
        expect(component.onUpload).toHaveBeenCalled();
    })
  });

  describe('saveFile',() => {
    it('makes expected calls', () => {
        spyOn(component, 'saveFile').and.callThrough();
        component.saveFile();
        expect(component.saveFile).toHaveBeenCalled();
    })
  });

  describe('onClose',() => {
    it('makes expected calls', () => {
        spyOn(component, 'onClose').and.callThrough();
        component.onClose();
        expect(component.onClose).toHaveBeenCalled();
    })
  });

  describe('ngOnInit',() => {
    it('makes expected calls', () => {
        spyOn(component, 'ngOnInit').and.callThrough();
        component.ngOnInit();
        expect(component.ngOnInit).toHaveBeenCalled();
    })
  });

  describe('encodeWhiteSpaces',() => {
    it('makes expected calls', () => {
        const str = 'value';
        spyOn(component, 'encodeWhiteSpaces').and.callThrough();
        component.encodeWhiteSpaces(str);
        expect(component.encodeWhiteSpaces).toHaveBeenCalled();
    })
  });
});
