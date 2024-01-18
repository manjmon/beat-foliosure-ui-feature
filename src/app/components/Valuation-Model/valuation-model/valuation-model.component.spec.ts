import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ValuationModelService } from '../../../services/valuation-model.service';
import { ImpliedEvService } from 'src/app/services/implied-ev.service';
import { FormsModule } from '@angular/forms';
import {
    HttpClientTestingModule
  } from "@angular/common/http/testing";
import { ValuationModelComponent } from './valuation-model.component';

describe('financialDataValidator',() => {
    let component: ValuationModelComponent;
  let fixture: ComponentFixture<ValuationModelComponent>;
  let myService: ValuationModelService;
  let impService: ImpliedEvService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientTestingModule],
        schemas: [NO_ERRORS_SCHEMA],
      declarations: [ ValuationModelComponent ],      
      providers: [
        
         ValuationModelService, ImpliedEvService,
          
        
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationModelComponent);
    component = fixture.componentInstance;
    component.fundList = [];
    component.companyList = [];
    component.tabList = [];
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isOpenUpload has default value`, () => {
    expect(component.isOpenUpload).toEqual(false);
  });

  it(`disableApply has default value`, () => {
    expect(component.disableApply).toEqual(true);
  });

  it(`disableQuarterAndYear has default value`, () => {
    expect(component.disableQuarterAndYear).toEqual(true);
  });

  it(`qandyear has default value`, () => {
    expect(component.qandyear).toEqual({});
  });
  it(`showTabs has default value`, () => {
    expect(component.showTabs).toEqual(false);
  });

  it(`canDeactivateStatus has default value`, () => {
    expect(component.canDeactivateStatus).toEqual(true);
  });
  it(`tabName has default value`, () => {
    expect(component.tabName).toEqual("");
  });
  it(`fundList has default value`, () => {
    expect(component.fundList).toEqual([]);
  });

  it(`companyList has default value`, () => {
    expect(component.companyList).toEqual([]);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getFundList').and.callThrough();
      component.ngOnInit();
      expect(component.getFundList).toHaveBeenCalled();
    });
  });
  describe('getFundList', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getFundList').and.callThrough();
      component.getFundList();
      expect(component.getFundList).toHaveBeenCalled();
    });
  });
  describe('receivedChildTabNameHandler', () => {
    it('makes expected calls', () => {
      const tabName = {
        id:23223,
        name: 'valuations',
        isActive: false
      }
      spyOn(component, 'receivedChildTabNameHandler').and.callThrough();
      component.receivedChildTabNameHandler(tabName);
      expect(component.receivedChildTabNameHandler).toHaveBeenCalled();
    });
  });
  describe('getCompanyList', () => {
    it('makes expected calls', () => {
      const fund = '116B9465C55DC11EB465F9282CFF1C5C';
      spyOn(component, 'getCompanyList').and.callThrough();
      component.getCompanyList(fund);
      expect(component.getCompanyList).toHaveBeenCalled();
    });
  });
  describe('onFundSelection', () => {
    it('makes expected calls', () => {
      let prevState = '';
      let currentStat = '';
      spyOn(component, 'onFundSelection').and.callThrough();
      component.onFundSelection(prevState,currentStat);
      expect(component.onFundSelection).toHaveBeenCalled();
    });
  });
  describe('canDeactivate', () => {
    it('makes expected calls', () => {
      spyOn(component, 'canDeactivate').and.callThrough();
      component.canDeactivate();
      expect(component.canDeactivate).toHaveBeenCalled();
    });
  });
  describe('getCompanyByFund', () => {
    it('makes expected calls', () => {
      const fundId = 'E608571F64AFC15BCC758C67EDCE3367';
      spyOn(component, 'getCompanyByFund').and.callThrough();
      component.getCompanyByFund(fundId);
      expect(component.getCompanyByFund).toHaveBeenCalled();
    });
  });
  describe('onCompanySelection', () => {
    it('makes expected calls', () => {
      let prevState = '';
      let currentStat = '';
      spyOn(component, 'onCompanySelection').and.callThrough();
      component.onCompanySelection(prevState, currentStat);
      expect(component.onCompanySelection).toHaveBeenCalled();
    });
  });
  describe('quarterYearPicker', () => {
    it('makes expected calls', () => {
      let prevState = '';
      let currentStat = '';
      spyOn(component, 'quarterYearPicker').and.callThrough();
      component.quarterYearPicker(prevState, currentStat);
      expect(component.quarterYearPicker).toHaveBeenCalled();
    });
  });
  describe('onFundClear', () => {
    it('makes expected calls', () => {
      spyOn(component, 'onFundClear').and.callThrough();
      component.onFundClear();
      expect(component.onFundClear).toHaveBeenCalled();
    });
  });
  describe('onApplyClick', () => {
    it('makes expected calls', () => {
      spyOn(component, 'onApplyClick').and.callThrough();
      component.onApplyClick();
      expect(component.onApplyClick).toHaveBeenCalled();
    });
  });
  describe('getTabs', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getTabs').and.callThrough();
      component.getTabs();
      expect(component.getTabs).toHaveBeenCalled();
    });
  });
  describe('setTab', () => {
    it('makes expected calls', () => {
      const tab = {
        name: 'Financials',
        id: 1003,
        isActive: false
      }
      spyOn(component, 'setTab').and.callThrough();
      component.setTab(tab);
      expect(component.setTab).toHaveBeenCalled();
    });
  }); 
});
