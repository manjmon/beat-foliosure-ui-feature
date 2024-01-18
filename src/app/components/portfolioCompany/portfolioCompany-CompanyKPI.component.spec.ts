import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { MiscellaneousService, FinancialValueUnitsEnum,ExportTypeEnum } from '../../services/miscellaneous.service';
import { KPIModulesEnum,FeaturesEnum,ActionsEnum,UserSubFeaturesEnum, PermissionService } from '../../services/permission.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { AuditService } from 'src/app/services/audit.service';
import { NumberDecimalConst, PeriodTypeFilterOptions } from 'src/app/common/constants';
import { FormsModule } from '@angular/forms';
import { PortfolioCompanyKPIComponent } from './portfolioCompany-CompanyKPI.component';
import { MatMenuModule } from '@angular/material/menu';
import { of, throwError } from 'rxjs';

describe('PortfolioCompanyKPIComponent', () => {
  let component: PortfolioCompanyKPIComponent;
  let fixture: ComponentFixture<PortfolioCompanyKPIComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const ngbModalStub = () => ({});
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const toastrServiceStub = () => ({
      overlayContainer: {},
      error: (somethingWentWrong, string, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const miscellaneousServiceStub = () => ({
      GetPriviousPageUrl: () => ({}),
      getMessageTimeSpan: () => ({}),
      showAlertMessages: (string, message) => ({}),
      GetCompanyOrInvestmentKPIList: kPIQueryModel => ({
        subscribe: f => f({})
      }),
      downloadExcelFile: response => ({})
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (companyKPIs, arg1, id) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyById: object => ({ subscribe: f => f({}) }),
      getPCCompanyKPIValues: object => ({ subscribe: f => f({}) }),
      exportCompanywiseKPIList: object => ({ subscribe: f => f({}) }),
      getfinancialsvalueTypes: () => ({ subscribe: f => f({}) }),
      getCompanyKpiData: object => ({ subscribe: f => f({}) })
    });
    const auditServiceStub = () => ({
      UpdateKPIData: datauditmodellog => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyKPIComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgbModal, useFactory: ngbModalStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: AuditService, useFactory: auditServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PortfolioCompanyKPIComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`kpiModuleId has default value`, () => {
    expect(component.kpiModuleId).toEqual(KPIModulesEnum.Company);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
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

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([{ field: "KPI", header: "KPI" }]);
  });

  it(`financialKPIMultiSortMeta has default value`, () => {
    expect(component.financialKPIMultiSortMeta).toEqual( [
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`confirmUpdate has default value`, () => {
    expect(component.confirmUpdate).toEqual(false);
  });

  it(`tableReload has default value`, () => {
    expect(component.tableReload).toEqual(false);
  });

  it(`exportCompanyKPILoading has default value`, () => {
    expect(component.exportCompanyKPILoading).toEqual(false);
  });

  it(`CompanyKPIOrginalData has default value`, () => {
    expect(component.CompanyKPIOrginalData).toEqual([]);
  });

  it(`ErrorNotation has default value`, () => {
    expect(component.ErrorNotation).toEqual(false);
  });

  it(`infoUpdate has default value`, () => {
    expect(component.infoUpdate).toEqual(false);
  });

  it(`blankSpace has default value`, () => {
    expect(component.blankSpace).toEqual(`&nbsp`);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`isToasterMessage has default value`, () => {
    expect(component.isToasterMessage).toEqual(false);
  });

  it(`objCompanyKPIList has default value`, () => {
    expect(component.objCompanyKPIList).toEqual([]);
  });

  it(`companyKPICols has default value`, () => {
    expect(component.companyKPICols).toEqual([]);
  });

  it(`companyValueUnitTable has default value`, () => {
    expect(component.companyValueUnitTable).toEqual(
      FinancialValueUnitsEnum.Millions
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

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'getPortfolioCompanies').and.callThrough();
      spyOn(component, 'ngOnInit').and.callThrough();
      spyOn(miscellaneousServiceStub, 'GetPriviousPageUrl').and.callThrough();
      spyOn(miscellaneousServiceStub, 'getMessageTimeSpan').and.callThrough();
      component.ngOnInit();
      expect(component.getPortfolioCompanies).toHaveBeenCalled();
      expect(component.ngOnInit).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getMessageTimeSpan).toHaveBeenCalled();
    });
  });

  describe('exportCompanyKpiValues', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(miscellaneousServiceStub, 'downloadExcelFile').and.callThrough();
      spyOn(miscellaneousServiceStub, 'showAlertMessages').and.callThrough();
      spyOn(
        portfolioCompanyServiceStub,
        'exportCompanywiseKPIList'
      ).and.callThrough();
      component.exportCompanyKpiValues();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(
        portfolioCompanyServiceStub.exportCompanywiseKPIList
      ).toHaveBeenCalled();
    });
  });

  describe('successToaster', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastrServiceStub, 'success').and.callThrough();
      component.successToaster();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });
  describe('onChangePeriodOption', () => {
    it('makes expected calls', () => {
      spyOn(component, "onChangePeriodOption").and.callThrough();
      component.onChangePeriodOption({field: "Monthly", key: true});
      expect(component.onChangePeriodOption).toHaveBeenCalled();
    });
  });
  describe('selectValueTab', () => {
    it('makes expected calls', () => {
      spyOn(component, "selectValueTab").and.callThrough();
      component.selectValueTab({
        name: '',
        active: false
      });
      expect(component.selectValueTab).toHaveBeenCalled();
    });
  });
  describe('setDefaultTypeTab', () => {
    it('should set defaultType to Monthly when isMonthly is true', () => {
      // Arrange
      component.isMonthly = true;

      // Act
      component.setDefaultTypeTab();

      // Assert
      expect(component.defaultType).toEqual(PeriodTypeFilterOptions.Monthly);
    });

    it('should set defaultType to Quarterly when isQuarterly is true', () => {
      // Arrange
      component.isQuarterly = true;

      // Act
      component.setDefaultTypeTab();

      // Assert
      expect(component.defaultType).toEqual(PeriodTypeFilterOptions.Quarterly);
    });

    it('should set defaultType to Annual when isAnnually is true', () => {
      // Arrange
      component.isAnnually = true;

      // Act
      component.setDefaultTypeTab();

      // Assert
      expect(component.defaultType).toEqual(PeriodTypeFilterOptions.Annual);
    });
  });
describe('getValueTypeTabList', () => {
    it('should set tabValueTypeList and tabName when tabList is not empty', () => {
      // Arrange
      const mockTabList = [
        { name: 'Tab 1', active: false },
        { name: 'Tab 2', active: false },
        { name: 'Tab 3', active: false },
      ];
      const mockPageConfigTabs = [
        { aliasName: 'Tab 1', chartValue: 'Chart 1' },
        { aliasName: 'Tab 2', chartValue: 'Chart 2' },
      ];
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(portfolioCompanyServiceStub, 'getfinancialsvalueTypes').and.returnValue(of({ body: { financialTypesModelList: mockTabList } }));

      // Act
      component.getValueTypeTabList();

      // Assert
      expect(component.tabValueTypeList.length).toEqual(0);
    });

    it('should not set tabValueTypeList and tabName when tabList is empty', () => {
      // Arrange
      const mockTabList = [];
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(portfolioCompanyServiceStub, 'getfinancialsvalueTypes').and.returnValue(of({ body: { financialTypesModelList: mockTabList } }));

      // Act
      component.getValueTypeTabList();

      // Assert
      expect(component.tabValueTypeList).toEqual([]);
    });
  });

  describe('isNumberCheck', () => {
    it('should return true if the input is a number', () => {
      const component = fixture.componentInstance;
      const result = component.isNumberCheck(123);
      expect(result).toBeTrue();
    });

    it('should return true if the input is a numeric string', () => {
      const component = fixture.componentInstance;
      const result = component.isNumberCheck('123');
      expect(result).toBeTrue();
    });

    it('should return false if the input is not a number', () => {
      const component = fixture.componentInstance;
      const result = component.isNumberCheck('abc');
      expect(result).toBeFalse();
    });
  });
  it('should call getCompanyKpiData method with correct parameters', () => {
    // Arrange
    const event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: 'CompanywiseKPI.KPI',
      multiSortMeta: component.companywiseKPIMultiSortMeta,
      sortOrder: -1
    };
    component.id = 123;
    component.model = { portfolioCompanyID: 456 };
    component.modelCompanyKpi = {
      orderType: { type: 'LatestOnRight' },
      periodType: { type: 'Date Range' },
      startPeriod: new Date(),
      endPeriod: new Date()
    };
    component.tabValueTypeList = [];
    component.tabName = 'Actual';
    component.isMonthly = true;
    component.isQuarterly = false;
    component.isAnnually = false;
    component.IsPageLoad = true;
    component.companyKpiConfigData = {
      kpiConfigurationData: [],
      hasChart: false,
      kpiType: ''
    };

    // Act

    const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
      PortfolioCompanyService
    );
    spyOn(portfolioCompanyServiceStub, 'getCompanyKpiData').and.callThrough();
    component.getPortfolioCompanies(event);

    // Assert
    expect(portfolioCompanyServiceStub.getCompanyKpiData).toHaveBeenCalled();
  });

  it('should set loading, isToggleChecked, ErrorNotation, isLoader, tableReload, tableColumns, tableFrozenColumns, tableResult, auditLogList, companyKpiFilterCols, isMonthly, isQuarterly, isAnnually, and call SetFilterOptionsKeys on success', () => {
    // Arrange
    const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
      PortfolioCompanyService
    );
    const result = {
      headers: ['Header 1', 'Header 2'],
      rows: ['Row 1', 'Row 2'],
      companyKpiAuditLog: ['Audit Log 1', 'Audit Log 2'],
      isMonthly: true,
      isQuarterly: false,
      isAnnually: false
    };

    spyOn(portfolioCompanyServiceStub, 'getCompanyKpiData').and.returnValue(of(result));

    // Act
    component.getPortfolioCompanies(null);

    // Assert
    expect(component.loading).toBe(false);
    expect(component.isToggleChecked).toBe(false);
    expect(component.ErrorNotation).toBe(false);
    expect(component.isLoader).toBe(true);
    // Add additional assertions for SetFilterOptionsKeys if needed
  });

  it('should set loading, isLoader, tableResult, tableResultClone, auditLogList, and IsPageLoad on error', () => {
    // Arrange
    const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
      PortfolioCompanyService
    );
    spyOn(portfolioCompanyServiceStub, 'getCompanyKpiData').and.callFake(() => {
      throw new Error('Fake error');
    });

    // Act
    component.getPortfolioCompanies(null);

    // Assert
    expect(component.loading).toBe(false);
    expect(component.isLoader).toBe(true);
    expect(component.tableResult).toEqual([]);
    expect(component.tableResultClone).toEqual([]);
    expect(component.auditLogList).toEqual([]);
    expect(component.IsPageLoad).toBe(true);
  });
});
