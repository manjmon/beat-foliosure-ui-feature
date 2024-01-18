import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService ,ExportTypeEnum,FinancialValueUnitsEnum} from '../../services/miscellaneous.service';
import { PermissionService,FeaturesEnum,UserSubFeaturesEnum,ActionsEnum } from '../../services/permission.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { ReportService,ReportType,ReportCategory } from '../../services/report.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyPageSectionConstants,CompanyInformationConstants } from '../../common/constants';
import { PortfolioCompanyDetailComponent } from './portfolioCompany-detail.component';
import { of } from 'rxjs';

describe('PortfolioCompanyDetailComponent', () => {
  let component: PortfolioCompanyDetailComponent;
  let fixture: ComponentFixture<PortfolioCompanyDetailComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const ngbModalStub = () => ({
      open: (savePortfolioProfitabilityComponent, modalOption) => ({})
    });
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({ redirectToUnauthorized: () => ({}) });
    const miscellaneousServiceStub = () => ({
      getSmallPagerLength: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getMessageTimeSpan: () => ({}),
      getTitle: arg => ({}),
      showAlertMessages: (string, message) => ({}),
      GetCompanywiseOperationalKPIList: portfolioCompanyID => ({
        subscribe: f => of({})
      }),
      GetFinancialKPIList: () => ({ subscribe: f => of({}) }),
      GetCompanyOrInvestmentKPIList: kPIQueryModel => ({
        subscribe: f => of({})
      }),
      downloadExcelFile: response => ({}),
      downloadPDFFile: results => ({}),
      redirectToLogin: error => ({})
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (company, arg1, id) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyById: object => ({ subscribe: f => f({}) }),
      getfinaluploadfiles: path2 => ({ subscribe: f => f({}) }),
      getPortfolioCompanyProfitabilityList: object => ({
        subscribe: f => of({})
      }),
      getPortfolioCompanyOperationalKPIValuesTranpose: object => ({
        subscribe: f => of({})
      }),
      exportProfitabilityList: object => ({ subscribe: f => of({}) }),
      getPortfolioCompanyInvestmentKPIValues: object => ({
        subscribe: of => of({}) 
      }),
      getPCCompanyKPIValues: object => ({ subscribe: f => f({}) }),
      getPortfolioCompanyImpactKPIValues: object => ({ subscribe: f => f({}) }),
      pdfExport: object => ({ subscribe: f => of({}) }),
      exportImpactKPIList: object => ({ subscribe: f => of({}) }),
      exportCompanywiseKPIList: object => ({ subscribe: f => of({}) }),
      getMasterKPITabs: string => ({ subscribe: f => f({}) }),
      saveCustomCommentary: string => ({ subscribe: f => f({}) }),
      getPageConfigSubSectionField: string => ({ subscribe: f => f({}) }),
      getPortfolioCompanyCommentarySections: string => ({ subscribe: f => f({}) })
    });
    const reportServiceStub = () => ({
      setDataAvailabilityInReport: arg => ({})
    });
    const toastrServiceStub = () => ({
      success: (message, string, object) => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyDetailComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgbModal, useFactory: ngbModalStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: ReportService, useFactory: reportServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    spyOn(
      PortfolioCompanyDetailComponent.prototype,
      'exportProfitabilityKeyValues'
    );
    spyOn(
      PortfolioCompanyDetailComponent.prototype,
      'exportProfitabilityDetails'
    );
    spyOn(PortfolioCompanyDetailComponent.prototype, 'LPReport');
    fixture = TestBed.createComponent(PortfolioCompanyDetailComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`subFeature has default value`, () => {
    expect(component.subFeature).toEqual(UserSubFeaturesEnum);
  });

  it(`actions has default value`, () => {
    expect(component.actions).toEqual(ActionsEnum);
  });

  it(`financialValueUnits has default value`, () => {
    expect(component.financialValueUnits).toEqual(FinancialValueUnitsEnum);
  });

  it(`exportType has default value`, () => {
    expect(component.exportType).toEqual(ExportTypeEnum);
  });

  it(`istrade has default value`, () => {
    expect(component.istrade).toEqual(true);
  });

  it(`collapsed has default value`, () => {
    expect(component.collapsed).toEqual(true);
  });

  it(`uploadedfiles has default value`, () => {
    expect(component.uploadedfiles).toEqual([]);
  });

  it(`reportType has default value`, () => {
    expect(component.reportType).toEqual(ReportType);
  });

  it(`reportCategory has default value`, () => {
    expect(component.reportCategory).toEqual(ReportCategory);
  });

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`blockedProfitabilityTable has default value`, () => {
    expect(component.blockedProfitabilityTable).toEqual(false);
  });

  it(`portfolioProfitabilityList has default value`, () => {
    expect(component.portfolioProfitabilityList).toEqual([]);
  });

  it(`portfolioCompanyProfitabilityClone has default value`, () => {
    expect(component.portfolioCompanyProfitabilityClone).toEqual([]);
  });

  it(`totalProfitabilityRecords has default value`, () => {
    expect(component.totalProfitabilityRecords).toEqual(0);
  });

  it(`blockedCompanyOperationalKPIValuesTable has default value`, () => {
    expect(component.blockedCompanyOperationalKPIValuesTable).toEqual(false);
  });

  it(`expandedOperationalKPIs has default value`, () => {
    expect(component.expandedOperationalKPIs).toEqual([]);
  });

  it(`showProfitabilityValueDecimals has default value`, () => {
    expect(component.showProfitabilityValueDecimals).toEqual(true);
  });

  it(`profitabilityMultiSortMeta has default value`, () => {
    expect(component.profitabilityMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "quarter", order: -1 },
    ]);
  });

  it(`operationalKPIMultiSortMeta has default value`, () => {
    expect(component.operationalKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "quarter", order: -1 },
    ]);
  });

  it(`unitTypeList has default value`, () => {
    expect(component.unitTypeList).toEqual(component.unitTypeList);
  });

  it(`exportLoading has default value`, () => {
    expect(component.exportLoading).toEqual(false);
  });

  it(`exportInvestmentKPILoading has default value`, () => {
    expect(component.exportInvestmentKPILoading).toEqual(false);
  });

  it(`exportCompanyKPILoading has default value`, () => {
    expect(component.exportCompanyKPILoading).toEqual(false);
  });

  it(`exportImpactKPILoading has default value`, () => {
    expect(component.exportImpactKPILoading).toEqual(false);
  });

  it(`CompanyKPIOrginalData has default value`, () => {
    expect(component.CompanyKPIOrginalData).toEqual([]);
  });

  it(`CompanyKPIChartData has default value`, () => {
    expect(component.CompanyKPIChartData).toEqual([]);
  });

  it(`CompanyKPIChartCol has default value`, () => {
    expect(component.CompanyKPIChartCol).toEqual([]);
  });

  it(`InvestmentKPIOrginalData has default value`, () => {
    expect(component.InvestmentKPIOrginalData).toEqual([]);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`isCompanyInfo has default value`, () => {
    expect(component.isCompanyInfo).toEqual(true);
  });

  it(`isOperationalKPI has default value`, () => {
    expect(component.isOperationalKPI).toEqual(true);
  });

  it(`isCompanyKPI has default value`, () => {
    expect(component.isCompanyKPI).toEqual(true);
  });

  it(`isInvestmentKPI has default value`, () => {
    expect(component.isInvestmentKPI).toEqual(true);
  });

  it(`isImpactKPI has default value`, () => {
    expect(component.isImpactKPI).toEqual(true);
  });

  it(`isCreditKPI has default value`, () => {
    expect(component.isCreditKPI).toEqual(true);
  });

  it(`isFinancials has default value`, () => {
    expect(component.isFinancials).toEqual(true);
  });

  it(`isTradingRecord has default value`, () => {
    expect(component.isTradingRecord).toEqual(true);
  });

  it(`CIFieldExclude has default value`, () => {
    expect(component.CIFieldExclude).toEqual([CompanyInformationConstants.CompanyLogo, CompanyInformationConstants.BusinessDescription]);
  });

  it(`fieldValueList has default value`, () => {
    expect(component.fieldValueList).toEqual([]);
  });

  it(`subPageList has default value`, () => {
    expect(component.subPageList).toEqual([]);
  });

  it(`companyPageSectionConstants has default value`, () => {
    expect(component.companyPageSectionConstants).toEqual(
      CompanyPageSectionConstants
    );
  });

  it(`companyInformationConstants has default value`, () => {
    expect(component.companyInformationConstants).toEqual(
      CompanyInformationConstants
    );
  });

  it(`isCommentarySection has default value`, () => {
    expect(component.isCommentarySection).toEqual(true);
  });

  it(`isTaabo has default value`, () => {
    expect(component.isTaabo).toEqual(false);
  });

  it(`isLarissa has default value`, () => {
    expect(component.isLarissa).toEqual(false);
  });

  it(`colsOperationalKPI has default value`, () => {
    expect(component.colsOperationalKPI).toEqual([
      { field: "fullQuarter", header: "Quarter", sortField: "year-quarter" },
    ]);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([{ field: "KPI", header: "KPI" }]);
  });

  it(`objInvestmentKPIList has default value`, () => {
    expect(component.objInvestmentKPIList).toEqual([]);
  });

  it(`investmentKPICols has default value`, () => {
    expect(component.investmentKPICols).toEqual([]);
  });

  it(`expandedInvestmentKPIs has default value`, () => {
    expect(component.expandedInvestmentKPIs).toEqual([]);
  });

  it(`financialKPIMultiSortMeta has default value`, () => {
    expect(component.financialKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
  });

  it(`objCompanyKPIList has default value`, () => {
    expect(component.objCompanyKPIList).toEqual([]);
  });

  it(`companyKPICols has default value`, () => {
    expect(component.companyKPICols).toEqual([]);
  });

  it(`companyValueUnitTable has default value`, () => {
    expect(component.companyValueUnitTable).toEqual(
      FinancialValueUnitsEnum.Absolute
    );
  });

  it(`expandedCompanyKPIs has default value`, () => {
    expect(component.expandedCompanyKPIs).toEqual([]);
  });

  it(`companywiseKPIMultiSortMeta has default value`, () => {
    expect(component.companywiseKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
  });

  it(`objImpactKPIList has default value`, () => {
    expect(component.objImpactKPIList).toEqual([]);
  });

  it(`impactKPICols has default value`, () => {
    expect(component.impactKPICols).toEqual([]);
  });

  it(`impactValueUnitTable has default value`, () => {
    expect(component.impactValueUnitTable).toEqual(
      FinancialValueUnitsEnum.Absolute
    );
  });

  it(`expandedImpactKPIs has default value`, () => {
    expect(component.expandedImpactKPIs).toEqual([]);
  });

  it(`impactKPIMultiSortMeta has default value`, () => {
    expect(component.impactKPIMultiSortMeta).toEqual( [
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
  });

  describe('loadOperationalKPILazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(
        component,
        'getPortfolioCompanyOperationalKPIValues'
      ).and.callThrough();
      component.loadOperationalKPILazy(lazyLoadEventStub);
      expect(
        component.getPortfolioCompanyOperationalKPIValues
      ).toHaveBeenCalled();
    });
  });

  describe('loadProfitabilityLazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, 'getPortfolioProfitabilityRecords').and.callThrough();
      component.loadProfitabilityLazy(lazyLoadEventStub);
      expect(component.getPortfolioProfitabilityRecords).toHaveBeenCalled();
    });
  });8
  describe('getuploadedfiles', () => {
    it('makes expected calls', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(
        portfolioCompanyServiceStub,
        'getfinaluploadfiles'
      ).and.callThrough();
      component.getuploadedfiles();
      expect(
        portfolioCompanyServiceStub.getfinaluploadfiles
      ).toHaveBeenCalled();
    });
  });

  describe('getCompanyWiseOperationalKPIs', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'GetCompanywiseOperationalKPIList'
      ).and.callThrough();
      component.getCompanyWiseOperationalKPIs();
      expect(
        miscellaneousServiceStub.GetCompanywiseOperationalKPIList
      ).toHaveBeenCalled();
    });
  });

  describe('getFinancialKPIs', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, 'GetFinancialKPIList').and.callThrough();
      component.getFinancialKPIs();
      expect(miscellaneousServiceStub.GetFinancialKPIList).toHaveBeenCalled();
    });
  });

  describe('getInvestmentKPIs', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        'GetCompanyOrInvestmentKPIList'
      ).and.callThrough();
      component.getInvestmentKPIs();
      expect(
        miscellaneousServiceStub.GetCompanyOrInvestmentKPIList
      ).toHaveBeenCalled();
    });
  });
  describe('CheckIfNoDataInReport', () => {
    it('makes expected calls', () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, 'setDataAvailabilityInReport').and.callThrough();
      component.CheckIfNoDataInReport();
      expect(reportServiceStub.setDataAvailabilityInReport).toHaveBeenCalled();
    });
  });

  describe('convertCompanyKPIValueUnits', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createCompanyKPILayOut').and.callThrough();
      component.convertCompanyKPIValueUnits();
      expect(component.createCompanyKPILayOut).toHaveBeenCalled();
    });
  });

  describe('convertImpactKPIValueUnits', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createImpactKPILayOut').and.callThrough();
      component.convertImpactKPIValueUnits();
      expect(component.createImpactKPILayOut).toHaveBeenCalled();
    });
  });

  describe('LPReport', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(miscellaneousServiceStub, 'downloadPDFFile').and.callThrough();
      spyOn(miscellaneousServiceStub, 'redirectToLogin').and.callThrough();
      spyOn(portfolioCompanyServiceStub, 'pdfExport').and.callThrough();
      (<jasmine.Spy>component.LPReport).and.callThrough();
      component.LPReport();
      expect(portfolioCompanyServiceStub.pdfExport).toHaveBeenCalled();
    });
  });
  describe('getTabList', () => {
    it('makes expected calls', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(portfolioCompanyServiceStub, 'getMasterKPITabs').and.callThrough();
      component.getTabList();
      expect(portfolioCompanyServiceStub.getMasterKPITabs).toHaveBeenCalled();
    });
  });
  
});

