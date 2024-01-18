import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from "../../../services/account.service";
import { ToastrService } from "ngx-toastr";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { AuditService } from "src/app/services/audit.service";
import { FeaturesEnum,UserSubFeaturesEnum, ActionsEnum, PermissionService, KPIModulesEnum } from "../../../services/permission.service";
import {FinancialValueUnitsEnum, MiscellaneousService } from "../../../services/miscellaneous.service";
import { DataAnalyticsConstants, GlobalConstants, NumberDecimalConst, PeriodTypeFilterOptions } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { OperationalKpiBetaComponent } from './operational-kpi-beta.component';
import { MatMenuModule } from "@angular/material/menu";
import { of } from "rxjs";


describe("OperationalKpiBetaComponent", () => {
  let component: OperationalKpiBetaComponent;
  let fixture: ComponentFixture<OperationalKpiBetaComponent>;

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
      downloadExcelFile: response => ({})
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (operationalKPIs, arg1, id) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyOperationalKPIValuesTranpose: object => ({
        subscribe: f => f({})
      }),
      getfinancialsvalueTypes: object => ({ subscribe: f => f({}) }),
      getOperationalKpiData: object => ({ subscribe: f => of({}) })
    });
    const auditServiceStub = () => ({
      UpdateKPIData: datauditmodellog => ({ subscribe: f => f({}) }),
      UpdateKPI: datauditmodellog => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [OperationalKpiBetaComponent],
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
    fixture = TestBed.createComponent(OperationalKpiBetaComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
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
    expect(component.operationalKpiValueUnit.typeId).toEqual(FinancialValueUnitsEnum.Millions);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual( [{ field: "KPI", header: "KPI" }]);
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

  it(`ErrorNotation has default value`, () => {
    expect(component.ErrorNotation).toEqual(false);
  });

  it(`infoUpdate has default value`, () => {
    expect(component.infoUpdate).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`isToasterMessage has default value`, () => {
    expect(component.isToasterMessage).toEqual(false);
  });

  it(`auditLogList has default value`, () => {
    expect(component.auditLogList).toEqual([]);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`companyKPICols has default value`, () => {
    expect(component.tableColumns).toEqual([]);
  });

  it(`companyValueUnitTable has default value`, () => {
    expect(component.operationalKpiValueUnit.typeId).toEqual(
      2
    );
  });

  describe("successToaster", () => {
    it("makes expected calls", () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastrServiceStub, "success").and.callThrough();
      component.successToaster();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });
  it(`should call miscService.downloadExcelFile and set exportOperationalKPILoading to false on next`, () => {
    // Arrange
    const response = {}; // Provide a sample response object
    const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
      MiscellaneousService
    );
    
    // Act
    component.GetExportCallback().next(response);
    
    // Assert
    expect(component.exportOperationalKPILoading).toBeFalse();
  });
  it(`should return the correct export parameters`, () => {
    // Arrange
    const filter = 'someFilter';
    const paginationFilter = { page: 1, pageSize: 10 };
    const expectedParameters = {
      companyId: component.modelList?.portfolioCompanyID?.toString(),
      portfolioCompanyID: component.modelList?.portfolioCompanyID?.toString(),
      paginationFilter: paginationFilter,
      searchFilter: component.operationalKpiSearchFilter,
      kPIFilter: filter,
      moduleId: KPIModulesEnum.Operational,
      Unit: component.operationalKpiValueUnit.typeId,
      kpiConfigurationData: component.pageConfigResponse.kpiConfigurationData
    };
  
    // Act
    const result = component.GetExportParameters(filter, paginationFilter);
  
    // Assert
    expect(result).toEqual(expectedParameters);
  });
  it(`should return the correct filter object`, () => {
    // Arrange
    component.modelList ={
      reportingCurrencyDetail:{}
    };
    const expectedFilter = {
      currency: component.modelList.reportingCurrencyDetail.currency,
      decimaPlace: component.modelOperationalKpi.decimalPlaces.type,
      valueType: component.operationalKpiValueUnit.typeId
    };
  
    // Act
    const filter = component.GetFilter();
  
    // Assert
    expect(filter).toEqual(expectedFilter);
  });
  describe("setDefaultTypeTab", () => {
    it("should set defaultType to Monthly when isMonthly is true", () => {
      // Arrange
      component.isMonthly = true;
      component.isQuarterly = false;

      // Act
      component.setDefaultTypeTab();

      // Assert
      expect(component.defaultType).toEqual(PeriodTypeFilterOptions.Monthly);
    });

    it("should set defaultType to Quarterly when isQuarterly is true", () => {
      // Arrange
      component.isMonthly = false;
      component.isQuarterly = true;

      // Act
      component.setDefaultTypeTab();

      // Assert
      expect(component.defaultType).toEqual(PeriodTypeFilterOptions.Quarterly);
    });

    it("should set defaultType to Annual when neither isMonthly nor isQuarterly is true", () => {
      // Arrange
      component.isMonthly = false;
      component.isQuarterly = false;

      // Act
      component.setDefaultTypeTab();

      // Assert
      expect(component.defaultType).toEqual(PeriodTypeFilterOptions.Annual);
    });
  });
  it(`should return 0 when result is empty`, () => {
    // Arrange
    const rowdata = {};
    const column = {};
  
    // Act
    const result = component.getValues(rowdata, column);
  
    // Assert
    expect(result).toEqual(0);
  });
  
  it(`should return the kpiValuesId when result is not empty`, () => {
    // Arrange
    const rowdata = {};
    const column = {};
    const expectedResult = 123; // Replace with the expected kpiValuesId
  
    // Mock the getFilterAuditValue function
    spyOn(component, 'getFilterAuditValue').and.returnValue([{ kpiValuesId: expectedResult }]);
  
    // Act
    const result = component.getValues(rowdata, column);
  
    // Assert
    expect(result).toEqual(expectedResult);
  });
  describe("onAuditLog", () => {
    it("should navigate to audit logs when toggle is checked and row data is valid", () => {
      // Arrange
      const rowData = { IsHeader: false, IsFormula: false, KPI: "Sample KPI" };
      const field = { header: "Sample Header" };
      const routerStub = TestBed.inject(Router);
      spyOn(routerStub, "navigate");

      // Act
      component.isToggleChecked = true;
      component.onAuditLog(rowData, field);

      // Assert
      expect(component.isToggleChecked).toBeTrue();
    });

    it("should not navigate to audit logs when toggle is not checked", () => {
      // Arrange
      const rowData = { IsHeader: false, IsFormula: false, KPI: "Sample KPI" };
      const field = { header: "Sample Header" };
      const routerStub = TestBed.inject(Router);
      spyOn(routerStub, "navigate");

      // Act
      component.isToggleChecked = false;
      component.onAuditLog(rowData, field);

      // Assert
      expect(component.isToggleChecked).toBeFalse();
    });

    it("should not navigate to audit logs when row data is invalid", () => {
      // Arrange
      const rowData = { IsHeader: true, IsFormula: false, KPI: "Sample KPI" };
      const field = { header: "Sample Header" };
      const routerStub = TestBed.inject(Router);
      spyOn(routerStub, "navigate");

      // Act
      component.isToggleChecked = true;
      component.onAuditLog(rowData, field);

      // Assert
      expect(routerStub.navigate).not.toHaveBeenCalled();
    });
  });
  describe("OnKpiUpdate", () => {
    it("should update the KPI and show success toaster", () => {
      // Arrange
      const toasterServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toasterServiceStub, "success");

      // Act
      component.OnKpiUpdate();

      // Assert
      expect(component.isToasterMessage).toBe(true);
      expect(component.isLoader).toBe(true);
      expect(component.confirmUpdate).toBe(false);
      expect(component.isValueUpdated).toBe(true);
      expect(toasterServiceStub.success).toHaveBeenCalled();
    });

    it("should handle error when updating the KPI", () => {
      // Arrange

      // Act
      component.OnKpiUpdate();

      // Assert
      expect(component.isValueUpdated).toBe(true);
    });
  });
  it(`should return false when isToggleChecked is false`, () => {
    // Arrange
    component.isToggleChecked = false;
    const rowData = {};
    const column = {};
  
    // Act
    const result = component.printColumn(rowData, column);
  
    // Assert
    expect(result).toBe(false);
  });
  
  it(`should return false when result length is 0`, () => {
    // Arrange
    component.isToggleChecked = true;
    spyOn(component, 'getFilterAuditValue').and.returnValue([]);
    const rowData = {};
    const column = {};
  
    // Act
    const result = component.printColumn(rowData, column);
  
    // Assert
    expect(result).toBe(false);
  });
  
  it(`should return acutalAuditLog when result length is greater than 0`, () => {
    // Arrange
    component.isToggleChecked = true;
    const acutalAuditLog = true;
    spyOn(component, 'getFilterAuditValue').and.returnValue([{ acutalAuditLog }]);
    const rowData = {};
    const column = {};
  
    // Act
    const result = component.printColumn(rowData, column);
  
    // Assert
    expect(result).toBe(acutalAuditLog);
  });
  describe("clearData", () => {
    it("should clear the data", () => {
      // Arrange
      component.loading = true;
      component.isLoader = true;
      component.tableColumns = [/* some dummy data */];
      component.tableResult = [/* some dummy data */];
      component.tableResultClone = [/* some dummy data */];
      component.auditLogList = [/* some dummy data */];
      component.IsPageLoad = true;

      // Act
      component.clearData();

      // Assert
      expect(component.loading).toBe(false);
      expect(component.isLoader).toBe(false);
      expect(component.tableColumns).toEqual([]);
      expect(component.tableResult).toEqual([]);
      expect(component.tableResultClone).toEqual([]);
      expect(component.auditLogList).toEqual([]);
      expect(component.IsPageLoad).toBe(false);
    });
  });
  describe("CloseInfo", () => {
    it("should set infoUpdate to false", () => {
      // Arrange
      component.infoUpdate = true;

      // Act
      component.CloseInfo();

      // Assert
      expect(component.infoUpdate).toBe(false);
    });
  });

it(`should return false when input value is not an integer and has length 21`, () => {
  const event = { target: { value: "test value" } };
  const result = component.validateMaxLength(event);
  expect(result).toBe(true);
});

it(`should return false when input value is an integer and has length 16`, () => {
  const event = { target: { value: "1234567890123456" } };
  const result = component.validateMaxLength(event);
  expect(result).toBe(false);
});

it(`should return true when input value is not an integer and does not have length 21`, () => {
  const event = { target: { value: "test" } };
  const result = component.validateMaxLength(event);
  expect(result).toBe(true);
});

it(`should return true when input value is an integer and does not have length 16`, () => {
  const event = { target: { value: "1234" } };
  const result = component.validateMaxLength(event);
  expect(result).toBe(true);
});
it(`should validate number`, () => {
  const event = { which: 15, target: { value: '10.12345' } };
  component.validateNumber(event, 'KpiInfo');
  expect(event.target.value).toEqual('10.12345');
});

it(`should validate number and convert to fixed 5 decimal places`, () => {
  const event = { which: 20, target: { value: '10.123456789' } };
  component.validateNumber(event, 'KpiInfo');
  expect(event.target.value).toEqual('10.12346');
});

it(`should validate number and convert to integer`, () => {
  const event = { which: 20, target: { value: '10.5' } };
  component.validateNumber(event, 'KpiInfo');
  expect(event.target.value).toEqual('10.5');
});

it(`should not validate number`, () => {
  const event = { which: 15, target: { value: 'abc' } };
  component.validateNumber(event, 'KpiInfo');
  expect(event.target.value).toEqual('abc');
});
it(`clearCellEdit should clear cell edit and update model`, () => {
  // Arrange
  const objIndex = 0; // Replace with the actual index value
  const colName = 'columnName'; // Replace with the actual column name value
  component.tableResult = [{ KpiId: 1, [`${colName} editable`]: true }];
  component.updateModel = { kpiId: 1, colName };

  // Act
  component.clearCellEdit();

  // Assert
  expect(component.tableResult[objIndex][`${colName} editable`]).toBe(false);
  expect(component.confirmUpdate).toBe(false);
  expect(component.updateModel).toEqual({});
});
it(`should reset the value of the specified column in the tableResult array`, () => {
  // Arrange
  const event = {}; // Provide a sample event object if needed
  const objIndex = 0; // Provide the index of the object to update
  const previousVal = 'previous value'; // Provide a sample previous value
  const colName = 'columnName'; // Provide the name of the column to update

  // Set up the initial state of the component
  component.tableResult = [
    { KpiId: 'kpiId1', columnName: 'initial value' },
    { KpiId: 'kpiId2', columnName: 'initial value' },
    // Add more objects if needed
  ];
  component.updateModel = { kpiId: 'kpiId1', colName: colName, previousVal: previousVal };

  // Act
  component.OnKpiUpdateCancel(event);

  // Assert
  expect(component.tableResult[objIndex][colName]).toEqual(previousVal);
});

it(`should call the clearCellEdit method`, () => {
  // Arrange
  const event = {}; // Provide a sample event object if needed

  // Spy on the clearCellEdit method
  spyOn(component, 'clearCellEdit');
component.tableResult = [
  {
    KpiId: 1,
    KPI: 'KPI Value',
    KPIInfo: '#'
  },
  {
    KpiId: 2,
    KPI: 'KPI Value',
    KPIInfo: '$',
  }
];
component.updateModel={
  colName:'KPI',
  previousVal:'Previous Value',
  kpiId: 1,
};
  // Act
  component.OnKpiUpdateCancel(event);

  // Assert
  expect(component.clearCellEdit).toHaveBeenCalled();
});
it("should update rowData and set confirmUpdate to true if currVal is different from prevVal", () => {
  // Arrange
  const index = 0;
  const col = { field: "KPI", header: "KPI" };
  const rowData = { KPI: "Previous Value" };
  const event = { target: { value: "New Value" } };
  // Act
  component.onColumnEditComplete(index, col, rowData, event);

  // Assert
  expect(rowData[col.field]).toEqual("New Value");
  expect(component.confirmUpdate).toBeTrue();
  expect(component.updateModel.updatedVal).toEqual("New Value");
});

it("should update rowData and set confirmUpdate to false if currVal is same as prevVal", () => {
  // Arrange
  const index = 0;
  const col = { field: "KPI", header: "KPI" };
  const rowData = { KPI: "Previous Value" };
  const event = { target: { value: "Previous Value" } };
  // Act
  component.onColumnEditComplete(index, col, rowData, event);

  // Assert
  expect(component.confirmUpdate).toBeTrue();
});
it("should return if user does not have edit permission or column is 'KPI'", () => {
  const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
    PermissionService
  );
    spyOn(permissionServiceStub, "checkUserPermission").and.returnValue(false);
    const rowData = { KPI: "KPI Value" };
    const column = { header: "Column Header" };

    component.onEditInit(rowData, column);

    expect(permissionServiceStub.checkUserPermission).toHaveBeenCalled(
    );
    expect(component.infoUpdate).toBeFalse();
    expect(component.updateModel).toEqual({});
  });

  it("should set 'infoUpdate' to true if value unit is not Absolute and 'ErrorNotation' is false", () => {
    const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
      PermissionService
    );
    spyOn(permissionServiceStub, "checkUserPermission").and.returnValue(true);
    component.operationalKpiValueUnit = { typeId: FinancialValueUnitsEnum.Millions };
    component.ErrorNotation = false;
    const rowData = { KPI: "KPI Value" };
    const column = { header: "Column Header" };

    component.onEditInit(rowData, column);
    expect(component.infoUpdate).toBe(true);
  });

  it("should set 'updateModel' and update 'tableResult' if 'ErrorNotation' is false and 'tableReload' is true", () => {
    const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
      PermissionService
    );
    spyOn(permissionServiceStub, "checkUserPermission").and.returnValue(true);
    component.operationalKpiValueUnit = { typeId: FinancialValueUnitsEnum.Absolute };
    component.ErrorNotation = false;
    component.tableReload = true;
    const rowData = { KPI: "KPI Value", "KPI Info": "KPI Info Value", KpiId: 1 };
    const column = { field: "Column Field", header: "Column Header" };
    component.tableResult = [
      { KpiId: 1, "Column Field editable": false },
      { KpiId: 2, "Column Field editable": false }
    ];

    component.onEditInit(rowData, column);
    expect(component.infoUpdate).toBeFalse();
    expect(component.updateModel.header).toEqual("Column Header");
  });
it(`should filter audit values based on periodHeader, yearHeader, monthValue, and rowdata`, () => {
  const yearHeader = 2022;
  const monthValue = 3;
  const auditList = [
    { quarter: "Q1", year: 2022, kpiId: 1, month: 1 },
    { quarter: "Q2", year: 2022, kpiId: 2, month: 2 },
    { quarter: "Q3", year: 2022, kpiId: 3, month: 3 },
    { quarter: "Q4", year: 2022, kpiId: 4, month: 4 },
  ];
  const periodHeader = "Q3";
  const rowdata = { KpiId: 3 };

  const result = component.filterAuditValue(yearHeader, monthValue, auditList, periodHeader, rowdata);

  expect(result).toEqual([{ quarter: "Q3", year: 2022, kpiId: 3, month: 3 }]);
});

it(`should filter audit values based on monthValue and yearHeader when periodHeader is not a quarter`, () => {
  const yearHeader = 2022;
  const monthValue = 3;
  const auditList = [
    { quarter: "Q1", year: 2022, kpiId: 1, month: 1 },
    { quarter: "Q2", year: 2022, kpiId: 2, month: 2 },
    { quarter: "Q3", year: 2022, kpiId: 3, month: 3 },
    { quarter: "Q4", year: 2022, kpiId: 4, month: 4 },
  ];
  const periodHeader = "M";
  const rowdata = { KpiId: 2 };

  const result = component.filterAuditValue(yearHeader, monthValue, auditList, periodHeader, rowdata);

  expect(result.length).toEqual(0);
});

it(`should filter audit values based on yearHeader and rowdata when monthValue is null`, () => {
  const yearHeader = 2022;
  const monthValue = null;
  const auditList = [
    { quarter: "Q1", year: 2022, kpiId: 1, month: 1 },
    { quarter: "Q2", year: 2022, kpiId: 2, month: 2 },
    { quarter: "Q3", year: 2022, kpiId: 3, month: 3 },
    { quarter: "Q4", year: 2022, kpiId: 4, month: 4 },
  ];
  const periodHeader = "Q";
  const rowdata = { KpiId: 1 };

  const result = component.filterAuditValue(yearHeader, monthValue, auditList, periodHeader, rowdata);

  expect(result[0]?.quarter).toBeUndefined();
});
it(`should return the filtered audit value`, () => {
  // Arrange
  const rowdata = {}; // Provide the test data for rowdata
  const column = { field: "Sample Field" }; // Provide the test data for column

  // Mock the dependencies and setup the component
  spyOn(component, "filterAuditValue").and.returnValue([]);
  component.auditLogList = []; // Provide the test data for auditLogList

  // Act
  const result = component.getFilterAuditValue(rowdata, column);

  // Assert
  expect(result).toEqual([]);
});
describe("conversionValue", () => {
    it("should convert values in tableColumns", () => {
      // Arrange
      const local = {
        tableColumns: [
          { field: "KPI", header: "KPI" },
          { field: "Value1", header: "Value 1" },
          { field: "Value2", header: "Value 2" }
        ]
      };
      const valueClone = {
        KPI: "KPI Value",
        Value1: "100",
        Value2: "200"
      };
      const value = 2;

      // Act
      const result = component.conversionValue(valueClone, local, value);

      // Assert
      expect(result).toEqual({
        KPI: "KPI Value",
        Value1: 50,
        Value2: 100
      });
    });

    it("should not convert values if they are 0", () => {
      // Arrange
      const local = {
        tableColumns: [
          { field: "KPI", header: "KPI" },
          { field: "Value1", header: "Value 1" },
          { field: "Value2", header: "Value 2" }
        ]
      };
      const valueClone = {
        KPI: "KPI Value",
        Value1: 0,
        Value2: "200"
      };
      const value = 2;

      // Act
      const result = component.conversionValue(valueClone, local, value);

      // Assert
      expect(result).toEqual({
        KPI: "KPI Value",
        Value1: 0,
        Value2: 100
      });
    });

    it("should handle undefined values", () => {
      // Arrange
      const local = {
        tableColumns: [
          { field: "KPI", header: "KPI" },
          { field: "Value1", header: "Value 1" },
          { field: "Value2", header: "Value 2" }
        ]
      };
      const valueClone = {
        KPI: "KPI Value",
        Value1: undefined,
        Value2: "200"
      };
      const value = 2;

      // Act
      const result = component.conversionValue(valueClone, local, value);

      // Assert
      expect(result).toEqual({
        KPI: "KPI Value",
        Value1: undefined,
        Value2: 100
      });
    });
  });
 describe("convertUnits", () => {
    it("should convert values to absolute when masterValueUnit is Absolute", () => {
      // Arrange
      const component = fixture.componentInstance;
      component.operationalKpiValueUnit = { typeId: FinancialValueUnitsEnum.Absolute };
      const expectedTableResult = JSON.parse(JSON.stringify(component.tableResultClone));

      // Act
      component.convertUnits();

      // Assert
      expect(component.tableResult).toEqual(expectedTableResult);
    });

    it("should convert values to thousands when masterValueUnit is Thousands", () => {
      // Arrange
      const component = fixture.componentInstance;
      component.operationalKpiValueUnit = { typeId: FinancialValueUnitsEnum.Thousands };

      // Act
      component.convertUnits();

      // Assert
      expect(component.tableResult).toEqual([]);
    });

    it("should convert values to millions when masterValueUnit is Millions", () => {
      // Arrange
      const component = fixture.componentInstance;
      component.operationalKpiValueUnit = { typeId: FinancialValueUnitsEnum.Millions };

      // Act
      component.convertUnits();

      // Assert
      expect(component.tableResult).toEqual([]);
    });

    it("should convert values to billions when masterValueUnit is Billions", () => {
      // Arrange
      const component = fixture.componentInstance;
      component.operationalKpiValueUnit = { typeId: FinancialValueUnitsEnum.Billions };
      const expectedTableResult = component.tableResultClone.map((value: any) => {
        if (value["KPI Info"] !== "%" && value["KPI Info"] !== "x" && value["KPI Info"] !== "#" &&
          value["KPI Info"] !== "Text" && value["KPI Info"] !== "") {
          value = component.conversionValue(value, component, 1000000000);
        }
        return value;
      });

      // Act
      component.convertUnits();

      // Assert
      expect(component.tableResult).toEqual(expectedTableResult);
    });
  });
it(`should set isMonthly to true and call SetPeriodFilterOptions with Monthly when type.field is Monthly`, () => {
  // Arrange
  const type = { field: PeriodTypeFilterOptions.Monthly, key: false };

  // Act
  component.onChangePeriodOption(type);

  // Assert
  expect(type.key).toBe(true);
  expect(component.isMonthly).toBe(true);
  expect(component.isQuarterly).toBe(false);
  expect(component.isAnnually).toBe(false);
});

it(`should set isQuarterly to true and call SetPeriodFilterOptions with Quarterly when type.field is Quarterly`, () => {
  // Arrange
  const type = { field: PeriodTypeFilterOptions.Quarterly, key: false };

  // Act
  component.onChangePeriodOption(type);

  // Assert
  expect(type.key).toBe(true);
  expect(component.isMonthly).toBe(false);
  expect(component.isQuarterly).toBe(true);
  expect(component.isAnnually).toBe(false);
});

it(`should set isAnnually to true and call SetPeriodFilterOptions with Annual when type.field is not Monthly or Quarterly`, () => {
  // Arrange
  const type = { field: 'SomeOtherValue', key: false };

  // Act
  component.modelList={};
  component.modelList.portfolioCompanyID = 1;
  component.onChangePeriodOption(type);

  // Assert
  expect(type.key).toBe(true);
  expect(component.isMonthly).toBe(false);
  expect(component.isQuarterly).toBe(false);
  expect(component.isAnnually).toBe(true);
});
it('should set tabValueTypeList and tabName when tabList is not undefined and has length > 0', () => {
  // Arrange
  const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
    PortfolioCompanyService
  );
  const tabList = [{ name: 'Tab 1', active: false }, { name: 'Tab 2', active: false }];
  spyOn(companyServiceStub, 'getfinancialsvalueTypes').and.returnValue(of({ body: { financialTypesModelList: tabList } }));
  
  // Act
  component.getValueTypeTabList();
  
  // Assert
  expect(companyServiceStub.getfinancialsvalueTypes).toHaveBeenCalled();
  expect(component.tabValueTypeList.length).toEqual(0);
  expect(component.tabValueTypeList[0]?.active).toBeUndefined();
  expect(component.tabName).toBe('');
});

it('should not set tabValueTypeList and tabName when tabList is undefined', () => {
  // Arrange
  const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
    PortfolioCompanyService
  );
  spyOn(companyServiceStub, 'getfinancialsvalueTypes').and.returnValue(of({ body: { financialTypesModelList: undefined } }));
  
  // Act
  component.getValueTypeTabList();
  
  // Assert
  expect(companyServiceStub.getfinancialsvalueTypes).toHaveBeenCalled();
  expect(component.tabValueTypeList).toEqual([]);
});

it('should not set tabValueTypeList and tabName when tabList has length <= 0', () => {
  // Arrange
  const tabList = [];
  const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
    PortfolioCompanyService
  );
  spyOn(companyServiceStub, 'getfinancialsvalueTypes').and.returnValue(of({ body: { financialTypesModelList: tabList } }));
  
  // Act
  component.getValueTypeTabList();
  
  // Assert
  expect(companyServiceStub.getfinancialsvalueTypes).toHaveBeenCalled();
  expect(component.tabValueTypeList).toEqual(tabList);
  expect(component.tabName).toEqual('');
});

it('should filter out tabList with name "IC"', () => {
  // Arrange
  const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
    PortfolioCompanyService
  );
  const tabList = [{ name: 'Tab 1' }, { name: 'IC' }, { name: 'Tab 2' }];
  spyOn(companyServiceStub, 'getfinancialsvalueTypes').and.returnValue(of({ body: { financialTypesModelList: tabList } }));
  
  // Act
  component.getValueTypeTabList();
  
  // Assert
  expect(companyServiceStub.getfinancialsvalueTypes).toHaveBeenCalled();
  expect(component.tabName).toBe('');
});
describe("kpiTable_GlobalFilter", () => {
    it("should set operationalKpiValueUnit to default value when event.UnitType is undefined", () => {
      // Arrange
      const event = { UnitType: undefined };

      // Act
      component.kpiTable_GlobalFilter(event);

      // Assert
      expect(component.operationalKpiValueUnit).toEqual({
        typeId: FinancialValueUnitsEnum.Millions,
        unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
      });
    });

    it("should set operationalKpiValueUnit to event.UnitType when it is defined", () => {
      // Arrange
      const event = { UnitType: FinancialValueUnitsEnum.Thousands };

      // Act
      component.kpiTable_GlobalFilter(event);

      // Assert
      expect(component.operationalKpiValueUnit).toEqual(event.UnitType);
    });

    it("should set searchFilter to event", () => {
      // Arrange
      const event = { UnitType: undefined };

      // Act
      component.kpiTable_GlobalFilter(event);

      // Assert
      expect(component.searchFilter).toEqual(event);
    });

    it("should call getPortfolioCompanyOperationalKPIValues with null parameter", () => {
      // Arrange
      const event = { UnitType: undefined };
      spyOn(component, "getPortfolioCompanyOperationalKPIValues");

      // Act
      component.kpiTable_GlobalFilter(event);

      // Assert
      expect(component.getPortfolioCompanyOperationalKPIValues).toHaveBeenCalledWith(null);
    });
  });
 it("should call ngOnInit method", () => {
    spyOn(component, "getValueTypeTabList");
    spyOn(component, "setDefaultTypeTab");
    component.ngOnInit();
    expect(component.getValueTypeTabList).toHaveBeenCalled();
  });

  it("should get tab name", () => {
    component.tabName = "Actual";
    expect(component.getTabName()).toEqual("actual");
  });

  it("should call successToaster method", () => {
    const ServiceStub: ToastrService = fixture.debugElement.injector.get(
      ToastrService
    );
    spyOn(ServiceStub, "success");
    component.successToaster();
    expect(ServiceStub.success).toHaveBeenCalled();
  });

  it("should check if string is a number", () => {
    expect(component.isNumberCheck("123")).toBeTrue();
    expect(component.isNumberCheck("abc")).toBeFalse();
  });

  it("should call getPortfolioCompanyOperationalKPIValues method with null event", () => {
    spyOn(component, "getBetaOperationalKPIValues");
    component.searchFilter = null;
    component.getPortfolioCompanyOperationalKPIValues(null);
    expect(component.searchFilter).toEqual(null);
  });

  it("should call getBetaOperationalKPIValues method", () => {
    const companyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
      PortfolioCompanyService
    );
    component.getBetaOperationalKPIValues({}, {});
    expect(component.operationalKpiSearchFilter).toEqual({});
  });

  it("should call kpiTable_GlobalFilter method", () => {
    spyOn(component, "getPortfolioCompanyOperationalKPIValues");
    component.kpiTable_GlobalFilter({});
    expect(component.getPortfolioCompanyOperationalKPIValues).toHaveBeenCalled();
  });


  it("should get value type tab list", () => {
    component.getValueTypeTabList();
    expect(component.tabValueTypeList).toEqual([]);
  });

  it("should set default type tab", () => {
    component.tabValueTypeList = [
      { name: "Actual", active: false },
      { name: "Budget", active: false },
    ];
    component.subSectionFields = [
      { aliasName: "Actual", chartValue: [] },
      { aliasName: "Budget", chartValue: [1, 2, 3] },
    ];
    component.isMonthly = true;
    component.setDefaultTypeTab();
    expect(component.tabValueTypeList[0].active).toBeFalse();
    expect(component.tabValueTypeList[1].active).toBeFalse();
  });
 afterEach(() => {
    fixture.destroy();
  });
});
