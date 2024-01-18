import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from "../../../services/account.service";
import { ToastrService } from "ngx-toastr";
import { KPIModulesEnum, ActionsEnum, UserSubFeaturesEnum, PermissionService, FeaturesEnum } from "../../../services/permission.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { AuditService } from "src/app/services/audit.service";
import { MiscellaneousService, FinancialValueUnitsEnum, ExportTypeEnum } from "../../../services/miscellaneous.service";
import { NumberDecimalConst } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { PortfolioOperationalKPIComponent } from "./portfolioCompany-detail.operational-KPI.component";
import { MatMenuModule } from "@angular/material/menu";

describe("PortfolioOperationalKPIComponent", () => {
  let component: PortfolioOperationalKPIComponent;
  let fixture: ComponentFixture<PortfolioOperationalKPIComponent>;

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
      downloadExcelFile: (array, string) => ({}),
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (operationalKPIs, arg1, id) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyOperationalKPIValuesTranpose: object => ({
        subscribe: f => f({})
      }),
      exportPCOperationalKPIList: object => ({ subscribe: f => f({}) }),
      getPCOperationalKPIValues: object => ({ subscribe: f => f({}) })
    });
    const auditServiceStub = () => ({
      UpdateKPIData: datauditmodellog => ({ subscribe: f => f({ body:{code:"success"}}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioOperationalKPIComponent],
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
    fixture = TestBed.createComponent(PortfolioOperationalKPIComponent);
    component = fixture.componentInstance;
    component.tableResult = [
      { KpiId: 1, 'colName editable': true },
      { KpiId: 2, 'colName editable': true },
      { KpiId: 3, 'colName editable': true },
    ];
    component.updateModel = { kpiId: 2, colName: 'colName' };
    component.auditLogList = [
      { quarter: 'Q1', year: 2022, sectorId: 1, operationalValuedId: 100 },
      { quarter: 'Q2', year: 2022, sectorId: 1, operationalValuedId: 200 },
      { quarter: 'Q3', year: 2022, sectorId: 2, operationalValuedId: 300 },
    ];
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize component properties", () => {
    expect(component.isTaabo).toBe(false);
    expect(component.kpiModuleId).toBe(KPIModulesEnum.Operational);
    expect(component.feature).toBe(FeaturesEnum);
    expect(component.subFeature).toBe(UserSubFeaturesEnum);
    expect(component.actions).toBe(ActionsEnum);
    expect(component.financialValueUnits).toBe(FinancialValueUnitsEnum);
    expect(component.exportType).toBe(ExportTypeEnum);
    expect(component.dataTable).toBeUndefined();
    expect(component.message).toBeUndefined();
    expect(component.id).toBeUndefined();
    expect(component.searchFilter).toBeNull();
    expect(component.frozenCols).toEqual([{ field: "KPI", header: "KPI" }]);
    expect(component.operationalKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "quarter", order: -1 },
    ]);
    expect(component.financialKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
    expect(component.companyKPIs).toBeUndefined();
    expect(component.model).toBeUndefined();
    expect(component.items).toEqual([]);
    expect(component.ddlModel).toEqual({
      companyKPIList: [],
      selectedCompanyKPI: "",
    });
    expect(component.updateModel.kpiId).toEqual(2);
    expect(component.msgTimeSpan).toBeUndefined();
    expect(component.loading).toBe(false);
    expect(component.confirmUpdate).toBe(false);
    expect(component.operationalKpiValueUnit.typeId).toEqual(2);
    expect(component.tableReload).toBe(false);
    expect(component.blockedCompanyOperationalKPIValuesTable).toBe(false);
    expect(component.portfolioCompanyOperationalKPIValuesDataTableList).toBeUndefined();
    expect(component.totalCompanyOperationalKPIValuesRecords).toBeUndefined();
    expect(component.portfolioCompanyOperationalKPIValuesList).toBeUndefined();
    expect(component.portfolioCompanyOperationalKPIValuesListCol).toBeUndefined();
    expect(component.portfolioCompanyOperationalKPIValuesListClone).toBeUndefined();
    expect(component.isloadevent).toBe(false);
    expect(component.exportCompanyKPILoading).toBe(false);
    expect(component.CompanyKPIOrginalData).toEqual([]);
    expect(component.ErrorNotation).toBe(false);
    expect(component.infoUpdate).toBe(false);
    expect(component.isLoader).toBe(false);
    expect(component.isToasterMessage).toBe(false);
    expect(component.search).toBe("");
    expect(component.operationalKPIFilterCols).toEqual([]);
    expect(component.companyKpiValueUnit).toBeUndefined();
    expect(component.auditLogList.length).toEqual(3);
    expect(component.dt).toBeUndefined();
    expect(component.uiuxMenu).toBeUndefined();
    expect(component.menuTrigger).toBeUndefined();
    expect(component.NumberDecimalConst).toBe(NumberDecimalConst);
    expect(component.tableColumns).toEqual([]);
    expect(component.tableFrozenColumns).toEqual([]);
    expect(component.tableResult.length).toEqual(3);
    expect(component.tableResultClone).toEqual([]);
    expect(component.isToggleChecked).toBe(false);
    expect(component.isExeter).toBe(false);
  });

  it("should call checkHost method and set isTaabo to true if host is Taabo", () => {
    component.isTaabo = true;
    component.checkHost();
    expect(component.isTaabo).toBe(true);
  });

  it("should call checkHost method and set isExeter to true if host is Exeter", () => {
    component.isExeter = true;
    component.checkHost();
    expect(component.isExeter).toBe(true);
  });

  it("should call isNumberCheck method and return true if the input is a number", () => {
    const result = component.isNumberCheck(123);
    expect(result).toBe(true);
  });

  it("should call isNumberCheck method and return false if the input is not a number", () => {
    const result = component.isNumberCheck("abc");
    expect(result).toBe(false);
  });

  it("should call exportOperationalKpiValues method and export the operational KPI values", () => {
    component.model = {
      portfolioCompanyID:1,
      companyName:"Test Company",
    }
    component.exportOperationalKpiValues(null);
    expect(component.exportCompanyKPILoading).toBe(false);
  });

  it("should call getPortfolioCompanyOperationalKPIValues method and get the portfolio company operational KPI values", () => {
    component.model = {
      portfolioCompanyID:1,
      companyName:"Test Company",
    }
    component.getPortfolioCompanyOperationalKPIValues(null);
    expect(component.isLoader).toBe(false);
    expect(component.isToggleChecked).toBe(false);
    expect(component.ErrorNotation).toBe(false);
    expect(component.isLoader).toBe(false);
    expect(component.tableReload).toBe(true);
    expect(component.tableColumns).toEqual([]);
    expect(component.tableFrozenColumns).toEqual([{ field: "KPI", header: "KPI" }]);
    expect(component.tableResult).toEqual([]);
    expect(component.auditLogList).toEqual([]);
    expect(component.tableResultClone).toEqual([]);
  });
  describe('compare', () => {
    it('should return true when objects are equal', () => {
      const objectA = { name: 'John', age: 30 };
      const objectB = { name: 'John', age: 30 };
  
      const result = component.compare(objectA, objectB);
  
      expect(result).toBe(true);
    });
  
    it('should return false when objects are not equal', () => {
      const objectA = { name: 'John', age: 30 };
      const objectB = { name: 'Jane', age: 25 };
  
      const result = component.compare(objectA, objectB);
  
      expect(result).toBe(false);
    });
  
    it('should return false when objects have different properties', () => {
      const objectA = { name: 'John', age: 30 };
      const objectB = { name: 'John', age: 30, city: 'New York' };
  
      const result = component.compare(objectA, objectB);
  
      expect(result).toBe(false);
    });
  });
  it('should validate number', () => {
    const event = {
      which: 10,
      target: {
        value: '10.5'
      }
    };

    component.validateNumber(event);

    expect(event.target.value).toBe('10.5');
  });

  it('should not modify value if it is already a valid number', () => {
    const event = {
      which: 15,
      target: {
        value: '10.50'
      }
    };

    component.validateNumber(event);

    expect(event.target.value).toBe('10.50');
  });

  it('should not modify value if it is not a valid number', () => {
    const event = {
      which: 10,
      target: {
        value: 'abc'
      }
    };

    component.validateNumber(event);

    expect(event.target.value).toEqual("NaN");
  });

  it('should not modify value if it is an integer', () => {
    const event = {
      which: 10,
      target: {
        value: '10'
      }
    };

    component.validateNumber(event);

    expect(event.target.value).toBe('10');
  });
  it('should clear cell edit', () => {
    component.clearCellEdit();

    expect(component.tableResult[1]['colName editable']).toBe(false);
    expect(component.confirmUpdate).toBe(false);
    expect(component.updateModel).toEqual({});
  });

  it('should not modify other tableResult entries', () => {
    component.clearCellEdit();

    expect(component.tableResult[0]['colName editable']).toBe(true);
    expect(component.tableResult[2]['colName editable']).toBe(true);
  });
  it('should update the table result with the previous value', () => {
    component.OnKpiUpdateCancel(null);
    expect(component.tableResult[1].col2).toBeUndefined();
  });
  it('should update KPI data and show success toaster', () => {
    // Arrange
    component.updateModel = {
      colName: 'Budget',
      updatedVal: 100,
      attributeId: 1,
      rowName: 'Some Row',
      kpiId: 1,
    };
    component.model = {
      portfolioCompanyID: 1,
    };
    // Act
    component.OnKpiUpdate({});

    // Assert
    expect(component.isToasterMessage).toBe(true);
    expect(component.tableReload).toBe(true);
    expect(component.confirmUpdate).toBe(false);
    expect(component.updateModel).toEqual({});
  });
  it('should set infoUpdate to false', () => {
    component.CloseInfo();
    expect(component.infoUpdate).toBe(false);
  });
  it('should return the operational value id if a matching audit log is found', () => {
    const rowdata = { ValuesKpiId: 1 };
    const column = { field: 'Q1 2022' };
    const result = component.getValues(rowdata, column);
    expect(result).toBe(100);
  });

  it('should return 0 if no matching audit log is found', () => {
    const rowdata = { ValuesKpiId: 2 };
    const column = { field: 'Q1 2022' };
    const result = component.getValues(rowdata, column);
    expect(result).toBe(0);
  });
  it('should not make any changes if user permission is not granted or row data is a formula', () => {
    const rowData = { IsFormula: true };
    const column = { field: 'someField', header: 'Some Header' };

    component.onEditInit(rowData, column);

    // Assert that no changes were made
    expect(component.infoUpdate).toBeFalsy();
    expect(component.updateModel.kpiId).toEqual(2);
    expect(component.tableResult.length).toEqual(3);
  });

  it('should set infoUpdate to true if operationalKpiValueUnit type is not Absolute and ErrorNotation is falsy', () => {
    component.operationalKpiValueUnit = { typeId: 1 }; // Assuming 1 is not Absolute
    component.ErrorNotation = false;
    const rowData = { IsFormula: false };
    const column = { field: 'someField', header: 'Some Header' };

    component.onEditInit(rowData, column);

    // Assert that infoUpdate is set to true
    expect(component.infoUpdate).toBeTruthy();
    expect(component.updateModel.kpiId).toEqual(2);
    expect(component.tableResult.length).toEqual(3);
  });

  it('should update the model and set column as editable if ErrorNotation is falsy and tableReload is truthy', () => {
    component.operationalKpiValueUnit = { typeId: 2 }; // Assuming 2 is not Absolute
    component.ErrorNotation = false;
    component.tableReload = true;
    const rowData = { IsFormula: false, 'KPI Info': 'Some Info', KPI: 'Some KPI', KpiId: 1 };
    const column = { field: 'someField', header: 'Some Header' };

    component.onEditInit(rowData, column);

    // Assert that updateModel and tableResult are updated correctly
    expect(component.updateModel.kpiId).toEqual(2);
    expect(component.tableResult.length).toEqual(3);
  });
  it('should update the model and set confirmUpdate to true if the current value is different from the previous value', () => {
    // Arrange
    const index = 0;
    const col = { field: 'kpiValue' };
    const rowData = { kpiValue: 10 };
    component.updateModel = { previousVal: 5, updatedVal: null };
    component.confirmUpdate = false;

    // Act
    component.onColumnEditComplete(index, col, rowData);

    // Assert
    expect(component.updateModel.updatedVal).toBe(rowData[col.field]);
    expect(component.confirmUpdate).toBe(true);
  });

  it('should call OnKpiUpdateCancel method if confirmUpdate is true or the current value is the same as the previous value', () => {
    // Arrange
    const index = 0;
    const col = { field: 'kpiValue' };
    const rowData = { kpiValue: 10 };
    component.tableResult = [
      { KpiId: 1, colName: 'col1', previousVal: 'value1' },
      { KpiId: 2, colName: 'col2', previousVal: 'value2' },
      { KpiId: 3, colName: 'col3', previousVal: 'value3' }
    ];
    component.updateModel = { kpiId: 2, colName: 'col2', previousVal: 'value2' };
    component.confirmUpdate = false;
    spyOn(component, 'OnKpiUpdateCancel');
    // Act
    component.onColumnEditComplete(index, col, rowData);

    // Assert
    expect(component.tableResult.length).toEqual(3);
  });
  it('should update the table result when cancelling KPI update', () => {
    // Arrange
    component.tableResult = [
      { KpiId: 1, colName: 'col1', previousVal: 'value1' },
      { KpiId: 2, colName: 'col2', previousVal: 'value2' },
      { KpiId: 3, colName: 'col3', previousVal: 'value3' }
    ];
    component.updateModel = { kpiId: 2, colName: 'col2', previousVal: 'value2' };

    // Act
    component.OnKpiUpdateCancel(null);

    // Assert
    expect(component.tableResult[1].col2).toBe('value2');
  });

  it('should clear the cell edit after cancelling KPI update', () => {
    // Arrange
    component.tableResult = [
      { KpiId: 1, colName: 'col1', previousVal: 'value1' },
      { KpiId: 2, colName: 'col2', previousVal: 'value2' },
      { KpiId: 3, colName: 'col3', previousVal: 'value3' }
    ];
    component.updateModel = { kpiId: 2, colName: 'col2', previousVal: 'value2' };

    // Act
    component.OnKpiUpdateCancel(null);

    // Assert
    expect(component.updateModel).toEqual({});
  });
  it('should return true if there is a matching audit log', () => {
    // Arrange
    component.auditLogList = [
      { quarter: 'Q1', year: 2022, sectorId: 1, acutalAuditLog: true },
      { quarter: 'Q2', year: 2022, sectorId: 2, acutalAuditLog: false },
    ];
    const rowData = { ValuesKpiId: '1' };
    const field = { field: 'Q1 2022' };

    // Act
    const result = component.printColumn(rowData, field);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false if there is no matching audit log', () => {
    // Arrange
    component.auditLogList = [
      { quarter: 'Q1', year: 2022, sectorId: 1, acutalAuditLog: false },
      { quarter: 'Q2', year: 2022, sectorId: 2, acutalAuditLog: false },
    ];
    const rowData = { ValuesKpiId: '1' };
    const field = { field: 'Q1 2022' };

    // Act
    const result = component.printColumn(rowData, field);

    // Assert
    expect(result).toBe(false);
  });
  it('should convert values to thousands', () => {
    component.operationalKpiValueUnit = { typeId: FinancialValueUnitsEnum.Thousands };
    component.tableResultClone = [
      { "KPI Info": "Info 1", KPIValue: "1000", field1: "1000", field2: "2000" },
      { "KPI Info": "Info 2", KPIValue: "2000", field1: "3000", field2: "4000" },
    ];
    component.tableColumns = [{ field: "field1" }, { field: "field2" }];

    component.convertUnits();

    expect(component.tableResult).toEqual([
      { "KPI Info": "Info 1", KPIValue: "1000", field1: 1, field2: 2 },
      { "KPI Info": "Info 2", KPIValue: "2000", field1: 3, field2: 4 },
    ]);
  });

  it('should convert values to millions', () => {
    component.operationalKpiValueUnit = { typeId: FinancialValueUnitsEnum.Millions };
    component.tableResultClone = [
      { "KPI Info": "Info 1", KPIValue: "1000000", field1: "1000000", field2: "2000000" },
      { "KPI Info": "Info 2", KPIValue: "2000000", field1: "3000000", field2: "4000000" },
    ];
    component.tableColumns = [{ field: "field1" }, { field: "field2" }];

    component.convertUnits();

    expect(component.tableResult).toEqual([
      { "KPI Info": "Info 1", KPIValue: "1000000", field1: 1, field2: 2 },
      { "KPI Info": "Info 2", KPIValue: "2000000", field1: 3, field2: 4 },
    ]);
  });
  describe('isNumberCheck', () => {
    it('should return true if the input is a number', () => {
      expect(component.isNumberCheck(123)).toBe(true);
      expect(component.isNumberCheck('456')).toBe(true);
      expect(component.isNumberCheck(0)).toBe(true);
    });
  
    it('should return false if the input is not a number', () => {
      expect(component.isNumberCheck('abc')).toBe(false);
      expect(component.isNumberCheck(null)).toBe(false);
      expect(component.isNumberCheck(undefined)).toBe(false);
    });
  });
});