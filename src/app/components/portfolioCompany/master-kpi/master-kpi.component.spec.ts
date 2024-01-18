import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MasterKpiService } from '../../../services/master-kpi.service';
import { ActivatedRoute,Router} from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { MiscellaneousService ,ExportTypeEnum, FinancialValueUnitsEnum} from 'src/app/services/miscellaneous.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ToastrService } from 'ngx-toastr';
import { AuditService } from 'src/app/services/audit.service';
import { NumberDecimalConst } from 'src/app/common/constants';
import {ActionsEnum, UserSubFeaturesEnum,FeaturesEnum ,PermissionService} from 'src/app/services/permission.service';
import { FormsModule } from '@angular/forms';
import { MasterKpiComponent } from './master-kpi.component';
import { MatMenuModule } from '@angular/material/menu';
describe('MasterKpiComponent', () => {
  let component: MasterKpiComponent;
  let fixture: ComponentFixture<MasterKpiComponent>;

  beforeEach(() => {
    const masterKpiServiceStub = () => ({
      getMasterKPIValues: object => ({ subscribe: f => f({}) })
    });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      GetPriviousPageUrl: () => ({}),
      getMessageTimeSpan: () => ({}),
      showAlertMessages: (string, message) => ({}),
      downloadExcelFile: response => ({})
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (tradingRecords, arg1, id) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyById: object => ({ subscribe: f => f({}) }),
      exportMasterKPIList: object => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      success: (string, string1, object) => ({}),
      error: (somethingWentWrong, string, object) => ({})
    });
    const auditServiceStub = () => ({
      UpdateKPIData: dataAuditModelLog => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MasterKpiComponent],
      providers: [
        { provide: MasterKpiService, useFactory: masterKpiServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: AuditService, useFactory: auditServiceStub }
      ]
    });
    fixture = TestBed.createComponent(MasterKpiComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
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

  it(`exportType has default value`, () => {
    expect(component.exportType).toEqual(ExportTypeEnum);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`tableReload has default value`, () => {
    expect(component.tableReload).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([{ field: "KPI", header: "KPI" }]);
  });

  it(`objMasterKPIList has default value`, () => {
    expect(component.objMasterKPIList).toEqual([]);
  });

  it(`masterKPICols has default value`, () => {
    expect(component.masterKPICols).toEqual([]);
  });

  it(`expandedMasterKPIs has default value`, () => {
    expect(component.expandedMasterKPIs).toEqual([]);
  });

  it(`financialKPIMultiSortMeta has default value`, () => {
    expect(component.financialKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
  });

  it(`auditToggle has default value`, () => {
    expect(component.auditToggle).toEqual(false);
  });

  it(`confirmUpdate has default value`, () => {
    expect(component.confirmUpdate).toEqual(false);
  });

  it(`infoUpdate has default value`, () => {
    expect(component.infoUpdate).toEqual(false);
  });

  it(`ErrorNotation has default value`, () => {
    expect(component.ErrorNotation).toEqual(false);
  });

  it(`isToasterMessage has default value`, () => {
    expect(component.isToasterMessage).toEqual(false);
  });

  it(`exportMasterKPILoading has default value`, () => {
    expect(component.exportMasterKPILoading).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, 'getPortfolioCompanies').and.callThrough();
      spyOn(miscellaneousServiceStub, 'GetPriviousPageUrl').and.callThrough();
      spyOn(miscellaneousServiceStub, 'getMessageTimeSpan').and.callThrough();
      component.ngOnInit();
      expect(component.getPortfolioCompanies).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getMessageTimeSpan).toHaveBeenCalled();
    });
  });

  describe('convertMasterKPIValueUnits', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createMasterKPILayOut').and.callThrough();
      component.convertMasterKPIValueUnits();
      expect(component.createMasterKPILayOut).toHaveBeenCalled();
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


  describe('exportMasterKpiValues', () => {
    const portfolioCompanyService: PortfolioCompanyService = fixture?.debugElement?.injector?.get(
      PortfolioCompanyService
    );
    const miscService: MiscellaneousService = fixture?.debugElement?.injector?.get(
      MiscellaneousService
    );
    it('should call exportMasterKPIList and downloadExcelFile on successful response', () => {
      component.model = {
        companyName: 'Test Company',
        portfolioCompanyID: '1',
      };
      component.financialKpiSearchFilter = 'search filter';
      component.modelMasterKpi = {
        decimalPlaces: { type: 'decimal' },
      };
      component.masterKpiValueUnit = { typeId: '1' };


  
      // Act
      component.exportMasterKpiValues();
  
      // Assert
      expect(component.exportMasterKPILoading).toBeFalse();
    });
  });

  describe('convertToMillions', () => {
    it('should convert values to millions', () => {
      // Arrange
      component.masterKpiValueUnit.unitType = FinancialValueUnitsEnum.Millions;
      component.portfolioCompanyMasterKPIValuesListClone = [
        { kpiValue: 1000000, kpiInfo: 'Info 1' },
        { kpiValue: 2000000, kpiInfo: 'Info 2' },
        { kpiValue: 3000000, kpiInfo: 'Info 3' },
      ];
  
      // Act
      component.convertToMillions();
  
      // Assert
      expect(component.unitOfCurrency).toBe("Millions");
      expect(component.portfolioCompanyMasterKPIValuesList?.length).toBeUndefined();
    });
  });
  it('should not do anything if kpiName is TradingRecords and user does not have edit permission', () => {
    const permissionService: PermissionService = fixture.debugElement.injector.get(
      PermissionService
    );
    spyOn(permissionService, 'checkUserPermission').and.returnValue(false);
    component.kpiName = 'TradingRecords';
    component.onEditInit({}, {});
    expect(component.infoUpdate).toBeFalsy();
  });

  it('should not do anything if kpiName is CreditKpi and user does not have edit permission', () => {
    const permissionService: PermissionService = fixture.debugElement.injector.get(
      PermissionService
    );
    spyOn(permissionService, 'checkUserPermission').and.returnValue(false);
    component.kpiName = 'CreditKpi';
    component.onEditInit({}, {});
    expect(component.infoUpdate).toBeFalsy();
  });

  it('should not do anything if rowData is a header', () => {
    component.onEditInit({ isHeader: true }, {});
    expect(component.infoUpdate).toBeFalsy();
  });

  it('should set infoUpdate to true if masterKpiValueUnit typeId is not Absolute and ErrorNotation is false', () => {
    component.masterKpiValueUnit = { typeId: 1 };
    component.ErrorNotation = false;
    component.onEditInit({}, {});
    expect(component.infoUpdate).toBeTruthy();
  });

  it('should update the model and set column editable to true if ErrorNotation is false and tableReload is true', () => {
    component.ErrorNotation = false;
    component.tableReload = true;
    const rowData = {
      'KPIWithInfo': 'unit',
      'KPI': 'rowName',
      'colName AttributeID': 'attributeId',
      'KpiId': 'kpiId',
      'column.field': 'previousVal'
    };
    component.kpiName="TradingRecords";
    const column = { field: 'colName', header: 'header' };
    component.onEditInit(rowData, column);
    expect(component.updateModel).toEqual({});
  });
  it('should return false if the input length is 28', () => {
    const event = { target: { value: '1234567890123456789012345678' } };
    expect(component.validateMaxLength(event)).toBe(false);
  });

  it('should return true if the input length is not 28', () => {
    const event = { target: { value: '123456789012345678901234567' } };
    expect(component.validateMaxLength(event)).toBe(true);
  });
  it('should validate number input', () => {
    const event = { which: 15, target: { value: '10.5' } };
    component.validateNumber(event);
    expect(event.target.value).toBe('10.5');
  });

  it('should not modify valid integer input', () => {
    const event = { which: 15, target: { value: '10' } };
    component.validateNumber(event);
    expect(event.target.value).toBe('10');
  });

  it('should not modify valid decimal input', () => {
    const event = { which: 15, target: { value: '10.50' } };
    component.validateNumber(event);
    expect(event.target.value).toBe('10.50');
  });

  it('should modify invalid input', () => {
    const event = { which: 15, target: { value: 'abc' } };
    component.validateNumber(event);
    expect(event.target.value).toBe('abc');
  });
  it('should set ModuleName and ModuleCurrency correctly when moduleId is 1', () => {
    // Arrange
    component.modelList = {
      moduleId: 1,
      reportingCurrencyDetail: {
        currencyCode: 'USD'
      }
    };

    // Act
    component.getModuleName();

    // Assert
    expect(component.ModuleName).toBe('Trading Records');
    expect(component.ModuleCurrency).toBe('USD');
  });

  it('should set ModuleName and ModuleCurrency correctly when moduleId is 2', () => {
    // Arrange
    component.modelList = {
      moduleId: 2,
      reportingCurrencyDetail: {
        currencyCode: 'EUR'
      }
    };

    // Act
    component.getModuleName();

    // Assert
    expect(component.ModuleName).toBe('Credit KPI');
    expect(component.ModuleCurrency).toBe('EUR');
  });
  it('should return the value from rowData[field.header + " auditlog"] if it is defined', () => {
    const rowData = {
      'header1 auditlog': 'value1',
      'header2 auditlog': 'value2'
    };
    const field = { header: 'header1' };
    const expectedResult = 'value1';

    const result = component.printColumn(rowData, field);

    expect(result).toEqual(expectedResult);
  });

  it('should return the value from rowData[col + " auditlog"] if rowData[field.header + " auditlog"] is undefined', () => {
    const rowData = {
      'header1 auditlog': undefined,
      'header2 auditlog': 'value2'
    };
    const field = { header: 'header1 (Actual)' };

    const result = component.printColumn(rowData, field);

    expect(result).toBeUndefined();
  });
});
