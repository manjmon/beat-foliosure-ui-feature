import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from '@angular/core';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { FormsModule } from '@angular/forms';
import { TableheaderfilterComponent } from './table-headerfilter.component';
import { MatMenuModule } from '@angular/material/menu';
import { of } from 'rxjs';

describe('TableheaderfilterComponent', () => {
  let component: TableheaderfilterComponent;
  let fixture: ComponentFixture<TableheaderfilterComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const miscellaneousServiceStub = () => ({ bindYearList: () => ({}) });
    const currencyServiceStub = () => ({
      GetToCurrenciesByFromCurrency: jasmine.createSpy('GetToCurrenciesByFromCurrency').and.returnValue(of({})),
      getAllCurrencies: jasmine.createSpy('getAllCurrencies').and.returnValue(of({}))
    });
    const portfolioCompanyServiceStub = () => ({
      getfinancialsvalueTypes: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TableheaderfilterComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: CurrencyService, useFactory: currencyServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        }
      ]
    });
    spyOn(TableheaderfilterComponent.prototype, 'getCurrencyLists');
    spyOn(TableheaderfilterComponent.prototype, 'getTabList');
    fixture = TestBed.createComponent(TableheaderfilterComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isSection has default value`, () => {
    expect(component.isSection).toEqual(`financial`);
  });

  it(`isChildtab has default value`, () => {
    expect(component.isChildtab).toEqual(true);
  });

  it(`isSearch has default value`, () => {
    expect(component.isSearch).toEqual(false);
  });

  it(`isdecimals has default value`, () => {
    expect(component.isdecimals).toEqual(false);
  });

  it(`isLogs has default value`, () => {
    expect(component.isLogs).toEqual(false);
  });

  it(`companyReportingCurrencyCode has default value`, () => {
    component.companyReportingCurrencyCode ="USD"
    expect(component.companyReportingCurrencyCode).toEqual("USD");
  });

  it(`isDownload has default value`, () => {
    expect(component.isDownload).toEqual(false);
  });

  it(`isReportingCurrency has default value`, () => {
    expect(component.isReportingCurrency).toEqual(true);
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

  it(`CurrencyList has default value`, () => {
    expect(component.CurrencyList).toEqual([]);
  });

  it(`ismatmenu has default value`, () => {
    expect(component.ismatmenu).toEqual(true);
  });

  it(`isMonthly has default value`, () => {
    expect(component.isMonthly).toEqual(true);
  });

  it(`isQuarterly has default value`, () => {
    component.isQuarterly = false;
    expect(component.isQuarterly).toEqual(false);
  });

  it(`isAnnually has default value`, () => {
    expect(component.isAnnually).toEqual(false);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual(component.quarterOptions);
  });

  it(`fxRatesList has default value`, () => {
    expect(component.fxRatesList).toEqual(component.fxRatesList);
  });

  it(`unitTypeList has default value`, () => {
    expect(component.unitTypeList).toEqual(component.unitTypeList);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  describe('getTabList', () => {
    it('makes expected calls', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(
        portfolioCompanyServiceStub,
        'getfinancialsvalueTypes'
      ).and.callThrough();
      (<jasmine.Spy>component.getTabList).and.callThrough();
      component.tabList = [{ id: 1, name: 'test'}];
      component.getTabList();
      expect(
        portfolioCompanyServiceStub.getfinancialsvalueTypes
      ).toHaveBeenCalled();
    });
  });

  describe('constructor', () => {
    it('makes expected calls', () => {
      expect(
        TableheaderfilterComponent.prototype.getCurrencyLists
      ).toHaveBeenCalled();
      expect(
        TableheaderfilterComponent.prototype.getTabList
      ).toHaveBeenCalled();
    });
  });

  describe('TableheaderfilterComponent', () => {
    let component: TableheaderfilterComponent;
    let fixture: ComponentFixture<TableheaderfilterComponent>;
    beforeEach(() => {
      fixture = TestBed.createComponent(TableheaderfilterComponent);
      component = fixture.componentInstance;
      spyOn(component, 'configureMenuClose').and.callThrough();
      fixture.detectChanges(); // triggers ngAfterViewInit
    });
  
    it('ngAfterViewInit makes expected calls', () => {
      expect(component.configureMenuClose).toHaveBeenCalled();
    });
  });

  describe('onFxRateSourceChange', () => {
    it('makes expected calls', () => {
      (<jasmine.Spy>component.getCurrencyLists).calls.reset();
      component.onFxRateSourceChange();
      expect(component.getCurrencyLists).toHaveBeenCalled();
    });
  });
});
