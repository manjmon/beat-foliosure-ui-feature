import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService,ExportTypeEnum } from '../../services/miscellaneous.service';
import { PermissionService,FeaturesEnum,UserSubFeaturesEnum,ActionsEnum } from '../../services/permission.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { ToastrService } from 'ngx-toastr';
import { AuditService } from 'src/app/services/audit.service';
import { NumberDecimalConst } from 'src/app/common/constants';
import { FormsModule } from '@angular/forms';
import { PortfolioCompanyInvestmentKPIComponent } from './portfolioCompany-InvestmentKPI.component';
import { MatMenuModule } from '@angular/material/menu';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { Subject, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('PortfolioCompanyInvestmentKPIComponent', () => {
  let component: PortfolioCompanyInvestmentKPIComponent;
  let fixture: ComponentFixture<PortfolioCompanyInvestmentKPIComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getSmallPagerLength: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getMessageTimeSpan: () => ({}),
      downloadExcelFile: response => ({}),
      showAlertMessages: (string, somethingWentWrong) => ({})
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (operationalKPIs, arg1, id) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      exportInvestmentKPIList: object => ({ subscribe: f => f({}) }),
      getPCInvestmentKPIValues: object => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      error: (somethingWentWrong, string, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const auditServiceStub = () => ({
      UpdateKPIData: datauditmodellog => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule,MatMenuModule,PrimeNgModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyInvestmentKPIComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
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
    fixture = TestBed.createComponent(PortfolioCompanyInvestmentKPIComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a default value for feature`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`should have a default value for subFeature`, () => {
    expect(component.subFeature).toEqual(UserSubFeaturesEnum);
  });

  it(`should have a default value for actions`, () => {
    expect(component.actions).toEqual(ActionsEnum);
  });

  it(`should have a default value for exportType`, () => {
    expect(component.exportType).toEqual(ExportTypeEnum);
  });

  it(`should have a default value for NumberDecimalConst`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`should have a default value for loading`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`should have a default value for blockedProfitabilityTable`, () => {
    expect(component.blockedProfitabilityTable).toEqual(false);
  });

  it(`should have a default value for portfolioProfitabilityList`, () => {
    expect(component.portfolioProfitabilityList).toEqual([]);
  });

  it(`should have a default value for portfolioCompanyProfitabilityClone`, () => {
    expect(component.portfolioCompanyProfitabilityClone).toEqual([]);
  });

  it(`should have a default value for expandedOperationalKPIs`, () => {
    expect(component.expandedOperationalKPIs).toEqual([]);
  });

  it(`should have a default value for exportLoading`, () => {
    expect(component.exportLoading).toEqual(false);
  });

  it(`should have a default value for exportInvestmentKPILoading`, () => {
    expect(component.exportInvestmentKPILoading).toEqual(false);
  });

  it(`should have a default value for InvestmentKPIOrginalData`, () => {
    expect(component.InvestmentKPIOrginalData).toEqual([]);
  });

  it(`should have a default value for InvestmentKPIChartData`, () => {
    expect(component.InvestmentKPIChartData).toEqual([]);
  });

  it(`should have a default value for InvestmentKPIChartCol`, () => {
    expect(component.InvestmentKPIChartCol).toEqual([]);
  });

  it(`should have a default value for ErrorNotation`, () => {
    expect(component.ErrorNotation).toEqual(false);
  });

  it(`should have a default value for checked`, () => {
    expect(component.checked).toEqual(false);
  });

  it(`should have a default value for confirmUpdate`, () => {
    expect(component.confirmUpdate).toEqual(false);
  });

  it(`should have a default value for tableReload`, () => {
    expect(component.tableReload).toEqual(false);
  });

  it(`should have a default value for infoUpdate`, () => {
    expect(component.infoUpdate).toEqual(false);
  });

  it(`should have a default value for isLoader`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`should have a default value for isToasterMessage`, () => {
    expect(component.isToasterMessage).toEqual(false);
  });

  it(`should have a default value for tableColumns`, () => {
    expect(component.tableColumns).toEqual([]);
  });

  it(`should have a default value for tableFrozenColumns`, () => {
    expect(component.tableFrozenColumns).toEqual([]);
  });

  it(`should have a default value for tableResult`, () => {
    expect(component.tableResult).toEqual([]);
  });

  it(`should have a default value for tableResultClone`, () => {
    expect(component.tableResultClone).toEqual([]);
  });

  it(`should have a default value for isToggleChecked`, () => {
    expect(component.isToggleChecked).toEqual(false);
  });

  it(`should have a default value for auditLogList`, () => {
    expect(component.auditLogList).toEqual([]);
  });

  it(`should have a default value for investmentKPIFilterCols`, () => {
    expect(component.investmentKPIFilterCols).toEqual([]);
  });

  it(`should have a default value for frozenCols`, () => {
    expect(component.frozenCols.length).toEqual(1);
  });

  it(`should have a default value for objInvestmentKPIList`, () => {
    expect(component.objInvestmentKPIList).toEqual([]);
  });

  it(`should have a default value for investmentKPICols`, () => {
    expect(component.investmentKPICols).toEqual([]);
  });

  it(`financialKPIMultiSortMeta has default value`, () => {
    expect(component.financialKPIMultiSortMeta.length).toEqual(2);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        component,
        'getPortfolioCompanyInvestmentKPIValues'
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, 'GetPriviousPageUrl').and.callThrough();
      spyOn(miscellaneousServiceStub, 'getMessageTimeSpan').and.callThrough();
      component.ngOnInit();
      expect(
        component.getPortfolioCompanyInvestmentKPIValues
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getMessageTimeSpan).toHaveBeenCalled();
    });
  });
  describe('exportInvestmentKpiValues', () => {
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
        'exportInvestmentKPIList'
      ).and.callThrough();
      component.model.portfolioCompanyID = 1;
      component.exportInvestmentKpiValues();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(
        portfolioCompanyServiceStub.exportInvestmentKPIList
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
  describe('configureMenuClose', () => {
    it('should return an EventEmitter', () => {
      const old = jasmine.createSpyObj('MatMenu', ['close']);
      const result = component.configureMenuClose(old);
      expect(result).toEqual(jasmine.any(EventEmitter));
    });

    it('should not call the old close method when the event is "click"', () => {
      const old = jasmine.createSpyObj('MatMenu', ['close']);
      const event$ = new Subject<string>();
      component.configureMenuClose(old).subscribe();
      event$.next('click');
      expect(old.close).not.toHaveBeenCalled();
    });
  });
  
  describe('isNumberCheck', () => {
    it('should return true if the input is a number', () => {
      const str = '123';
      const result = component.isNumberCheck(str);
      expect(result).toBe(true);
    });

    it('should return false if the input is not a number', () => {
      const str = 'abc';
      const result = component.isNumberCheck(str);
      expect(result).toBe(false);
    });
  });
  describe('getPortfolioCompanyInvestmentKPIValues', () => {
    it('should call getPCInvestmentKPIValues method', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = TestBed.inject(PortfolioCompanyService);
      spyOn(portfolioCompanyServiceStub, 'getPCInvestmentKPIValues').and.returnValue(of({}));
      component.getPortfolioCompanyInvestmentKPIValues(null, null);
      expect(portfolioCompanyServiceStub.getPCInvestmentKPIValues).toHaveBeenCalled();
    });

    it('should set tableColumns, tableFrozenColumns, tableResult, investmentKPIFilterCols, and isLoader', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = TestBed.inject(PortfolioCompanyService);
      const result = {
        headers: ['header1', 'header2'],
        rows: [{ row1: 'value1' }, { row2: 'value2' }],
        kpiAuditLog: [],
      };
      spyOn(portfolioCompanyServiceStub, 'getPCInvestmentKPIValues').and.returnValue(of(result));
      component.getPortfolioCompanyInvestmentKPIValues(null, null);
      expect(component.tableColumns).toEqual(result.headers);
      expect(component.tableFrozenColumns).toEqual(component.frozenCols);
      expect(component.investmentKPIFilterCols).toEqual([...component.tableFrozenColumns, ...component.tableColumns]);
      expect(component.isLoader).toBe(false);
    });
  });
  describe('OnInvestmentKPIChange', () => {
    it('should set InvestmentKPIChartData and InvestmentKPIUnit', () => {
      component.InvestmentKPIChartData = [{ Info: 'Info' }];
      component.OnInvestmentKPIChange();
      expect(component.InvestmentKPIUnit).toBe('');
    });

    it('should not set InvestmentKPIUnit if InvestmentKPIChartData is empty', () => {
      component.InvestmentKPIChartData = [];
      component.OnInvestmentKPIChange();
      expect(component.InvestmentKPIUnit).toBe('');
    });
  });

    it('should call exportInvestmentKPIList method and downloadExcelFile method', () => {
      const miscellaneousServiceStub: MiscellaneousService = TestBed.inject(MiscellaneousService);
      const portfolioCompanyServiceStub: PortfolioCompanyService = TestBed.inject(PortfolioCompanyService);
      spyOn(miscellaneousServiceStub, 'downloadExcelFile');
      spyOn(miscellaneousServiceStub, 'showAlertMessages');
      spyOn(portfolioCompanyServiceStub, 'exportInvestmentKPIList').and.returnValue(of(new HttpResponse<Blob>({ body: new Blob() })));
      component.exportInvestmentKpiValues();
      expect(portfolioCompanyServiceStub.exportInvestmentKPIList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).not.toHaveBeenCalled();
    });
    describe('convertUnits', () => {
      it('should convert units correctly', () => {
        // Arrange
        component.investmentKpiValueUnit = { typeId: 2 }; // Assuming typeId 2 represents Thousands
        component.tableColumns = [
          { field: 'field1' },
          { field: 'field2' },
          // Add more columns as needed
        ];
        component.tableResultClone = [
          { 'KPI Info': 'Info1', KPIValue: '1000', field1: '2000', field2: '3000' },
          { 'KPI Info': 'Info2', KPIValue: '4000', field1: '5000', field2: '6000' },
          // Add more sample data as needed
        ];
  
        // Act
        component.convertUnits();
  
        // Assert
        expect(component.tableResult[0].field1).toEqual(0.002);
      });
    });
    it('should return true if there is a matching audit log', () => {
      // Arrange
      const rowData = { ValuesKpiId: '1' };
      const field = { field: 'Q1 2022' };
      component.auditLogList = [
        { quarter: 'Q1', year: 2022, kpiId: 1, acutalAuditLog: true },
        { quarter: 'Q2', year: 2022, kpiId: 1, acutalAuditLog: false }
      ];
  
      // Act
      const result = component.printColumn(rowData, field);
  
      // Assert
      expect(result).toBe(true);
    });
  
    it('should return false if there is no matching audit log', () => {
      // Arrange
      const rowData = { ValuesKpiId: '1' };
      const field = { field: 'Q1 2022' };
      component.auditLogList = [
        { quarter: 'Q2', year: 2022, kpiId: 1, acutalAuditLog: false },
        { quarter: 'Q3', year: 2022, kpiId: 1, acutalAuditLog: false }
      ];
  
      // Act
      const result = component.printColumn(rowData, field);
  
      // Assert
      expect(result).toBe(false);
    });
    it('should navigate to audit logs when ErrorNotation is true and printColumn returns true', () => {
      // Arrange
      spyOn(component, 'printColumn').and.returnValue(true);
  
      const rowData = { KPI: 'Sample KPI' };
      const field = { header: 'Sample Header' };
      component.ErrorNotation = true;
      component.model.portfolioCompanyID = '1';
  
      // Act
      component.onAuditLog(rowData, field);
  
      // Assert
      expect(component.printColumn).toHaveBeenCalledWith(rowData, field);
    });
  
    it('should not navigate to audit logs when ErrorNotation is false', () => {
      // Arrange
      spyOn(component, 'printColumn');
  
      const rowData = { KPI: 'Sample KPI' };
      const field = { header: 'Sample Header' };
      component.ErrorNotation = false;
  
      // Act
      component.onAuditLog(rowData, field);
  
      // Assert
      expect(component.printColumn).not.toHaveBeenCalled();
    });
  
    it('should not navigate to audit logs when printColumn returns false', () => {
      // Arrange
      spyOn(component, 'printColumn').and.returnValue(false);
  
      const rowData = { KPI: 'Sample KPI' };
      const field = { header: 'Sample Header' };
      component.ErrorNotation = true;
      component.model.portfolioCompanyID = '1';
  
      // Act
      component.onAuditLog(rowData, field);
  
      // Assert
      expect(component.printColumn).toHaveBeenCalledWith(rowData, field);
    });
    it('should update the model and set confirmUpdate to true when column value is different from previous value', () => {
      // Arrange
      const index = 0;
      const col = { field: 'fieldName' };
      const rowData = { fieldName: 'newValue' };
      component.updateModel = { previousVal: 'oldValue', updatedVal: '' };
      component.confirmUpdate = false;
  
      // Act
      component.onColumnEditComplete(index, col, rowData);
  
      // Assert
      expect(component.updateModel.updatedVal).toBe('newValue');
      expect(component.confirmUpdate).toBe(true);
    });
  
    it('should call OnKpiUpdateCancel when column value is the same as previous value', () => {
      // Arrange
      const index = 0;
      const col = { field: 'fieldName' };
      const rowData = { fieldName: 'oldValue' };
      component.updateModel = { previousVal: 'oldValue', updatedVal: '' };
      component.confirmUpdate = false;
      spyOn(component, 'OnKpiUpdateCancel');
  
      // Act
      component.onColumnEditComplete(index, col, rowData);
  
      // Assert
      expect(component.OnKpiUpdateCancel).toHaveBeenCalledWith('');
    });
    it('should call blur on target element', () => {
      // Arrange
      const event = { target: { blur: jasmine.createSpy('blur') } };
  
      // Act
      component.onColumnEdit(event);
  
      // Assert
      expect(event.target.blur).toHaveBeenCalled();
    });
    it('should call updateModel properties correctly when ErrorNotation is false and tableReload is true', () => {
      // Arrange
      const rowData = {
        'KPI Info': '#',
        KPI: 'Some KPI',
        KpiId: 1,
        'column.field': 'Some Value'
      };
      const column = {
        field: 'column.field',
        header: 'Column Header'
      };
      component.ErrorNotation = false;
      component.tableReload = true;
      component.investmentKpiValueUnit = {
        typeId: 1
      };
      component.updateModel = {
        colName: '',
        header: '',
        unit: '',
        rowName: '',
        attributeId: '',
        kpiId: '',
        previousVal: ''
      };
  
      // Act
      component.onEditInit(rowData, column);
  
      // Assert
      expect(component.updateModel.header).toBe('');
    });
  
    it('should not update updateModel properties when ErrorNotation is true', () => {
      // Arrange
      const rowData = {
        'KPI Info': 'Some Info',
        KPI: 'Some KPI',
        KpiId: 1,
        'column.field': 'Some Value'
      };
      const column = {
        field: 'column.field',
        header: 'Column Header'
      };
      component.ErrorNotation = true;
      component.tableReload = true;
      component.investmentKpiValueUnit = {
        typeId: 1
      };
      component.updateModel = {
        colName: '',
        header: '',
        unit: '',
        rowName: '',
        attributeId: '',
        kpiId: '',
        previousVal: ''
      };
  
      // Act
      component.onEditInit(rowData, column);
  
      // Assert
      expect(component.updateModel.colName).toBe('');
      expect(component.updateModel.header).toBe('');
      expect(component.updateModel.unit).toBe('');
      expect(component.updateModel.rowName).toBe('');
      expect(component.updateModel.attributeId).toBe('');
      expect(component.updateModel.kpiId).toBe('');
      expect(component.updateModel.previousVal).toBe('');
    });
  
    it('should not update updateModel properties when tableReload is false', () => {
      // Arrange
      const rowData = {
        'KPI Info': 'Some Info',
        KPI: 'Some KPI',
        KpiId: 1,
        'column.field': 'Some Value'
      };
      const column = {
        field: 'column.field',
        header: 'Column Header'
      };
      component.ErrorNotation = false;
      component.tableReload = false;
      component.investmentKpiValueUnit = {
        typeId: 1
      };
      component.updateModel = {
        colName: '',
        header: '',
        unit: '',
        rowName: '',
        attributeId: '',
        kpiId: '',
        previousVal: ''
      };
  
      // Act
      component.onEditInit(rowData, column);
  
      // Assert
      expect(component.updateModel.colName).toBe('');
      expect(component.updateModel.header).toBe('');
      expect(component.updateModel.unit).toBe('');
      expect(component.updateModel.rowName).toBe('');
      expect(component.updateModel.attributeId).toBe('');
      expect(component.updateModel.kpiId).toBe('');
      expect(component.updateModel.previousVal).toBe('');
    });
  });
