import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService,ExportTypeEnum ,FinancialValueUnitsEnum} from "../../services/miscellaneous.service";
import { KPIModulesEnum,UserSubFeaturesEnum,ActionsEnum, PermissionService,FeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { ToastrService } from "ngx-toastr";
import { AuditService } from "src/app/services/audit.service";
import { NumberDecimalConst } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { PortfolioCompanyImpactKPIComponent } from "./portfolioCompany-ImpactKPI.component";
import { MatMenuModule } from "@angular/material/menu";
import { PrimeNgModule } from "src/app/custom-modules/prime-ng.module";
import { of, throwError } from "rxjs";


describe("PortfolioCompanyImpactKPIComponent", () => {
  let component: PortfolioCompanyImpactKPIComponent;
  let fixture: ComponentFixture<PortfolioCompanyImpactKPIComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getSmallPagerLength: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getMessageTimeSpan: () => ({}),
      showAlertMessages: (string, message) => ({}),
      downloadExcelFile: response => ({})
    });
    const permissionServiceStub = () => ({
      checkUserPermission: (impactKPIs, arg1, id) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyById: object => ({ subscribe: f => f({}) }),
      getPortfolioCompanyImpactKPIValues: object => ({ subscribe: f => f({}) }),
      exportImpactKPIList: object => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      error: (somethingWentWrong, string, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const auditServiceStub = () => ({
      UpdateKPIData: datauditmodellog => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule,PrimeNgModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyImpactKPIComponent],
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
    fixture = TestBed.createComponent(PortfolioCompanyImpactKPIComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`kpiModuleId has default value`, () => {
    expect(component.kpiModuleId).toEqual(KPIModulesEnum.Impact);
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
    expect(component.financialKPIMultiSortMeta).toEqual(component.financialKPIMultiSortMeta);
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

  it(`exportLoading has default value`, () => {
    expect(component.exportLoading).toEqual(false);
  });

  it(`exportImpactKPILoading has default value`, () => {
    expect(component.exportImpactKPILoading).toEqual(false);
  });

  it(`ErrorNotation has default value`, () => {
    expect(component.ErrorNotation).toEqual(false);
  });

  it(`confirmUpdate has default value`, () => {
    expect(component.confirmUpdate).toEqual(false);
  });

  it(`tableReload has default value`, () => {
    expect(component.tableReload).toEqual(false);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
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
    expect(component.expandedImpactKPIs).toEqual(component.expandedImpactKPIs);
  });

  it(`impactKPIMultiSortMeta has default value`, () => {
    expect(component.impactKPIMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "month", order: -1 },
    ]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "getPortfolioCompanies").and.callThrough();
      spyOn(miscellaneousServiceStub, "GetPriviousPageUrl").and.callThrough();
      spyOn(miscellaneousServiceStub, "getMessageTimeSpan").and.callThrough();
      component.ngOnInit();
      expect(component.getPortfolioCompanies).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getMessageTimeSpan).toHaveBeenCalled();
    });
  });

  describe("exportImpactKpiValues", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      spyOn(
        portfolioCompanyServiceStub,
        "exportImpactKPIList"
      ).and.callThrough();
      component.exportImpactKpiValues();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(
        portfolioCompanyServiceStub.exportImpactKPIList
      ).toHaveBeenCalled();
    });
  });
  describe("convertImpactKPIValueUnits", () => {
    it("should convert impact KPI value units correctly", () => {
      // Mock input data
      const impactKpiValueUnit = {
        typeId: FinancialValueUnitsEnum.Thousands,
      };
      const portfolioCompanyImpactKPIValuesListClone = [
        {
          pcImpactKPIQuarterlyValueModel: {
            kpiInfo: "%",
            kpiActualValue: 1000,
          },
          childPCImpactKPIQuarterlyValueModelList: [],
        },
      ];

      // Set the input data
      component.impactKpiValueUnit = impactKpiValueUnit;
      component.portfolioCompanyImpactKPIValuesListClone = portfolioCompanyImpactKPIValuesListClone;

      // Call the method
      component.convertImpactKPIValueUnits();

      // Assert the expected results
      expect(component.portfolioCompanyImpactKPIValuesListClone.length).toEqual(1);
    });
  });
  describe("getPortfolioCompanies", () => {
    it("should set the loading flag to true", () => {
      // Arrange
      component.id = "sampleId";
  
      // Act
      component.getPortfolioCompanies();
  
      // Assert
      expect(component.loading).toBeFalse();
    });
  
    it("should call the getPortfolioCompanyById method with the correct parameters", () => {
      // Arrange
      const portfolioCompanyService = TestBed.inject(PortfolioCompanyService);
      spyOn(portfolioCompanyService, "getPortfolioCompanyById").and.callThrough();
      component.id = "sampleId";
  
      // Act
      component.getPortfolioCompanies();
  
      // Assert
      expect(portfolioCompanyService.getPortfolioCompanyById).toHaveBeenCalledWith({ Value: "sampleId" });
    });
  
    it("should set the model and portfolioCompanyCommentaryDetails properties with the response data", () => {
      // Arrange
      const mockResponse = { /* mock response data */ };
      const portfolioCompanyService = TestBed.inject(PortfolioCompanyService);
      spyOn(portfolioCompanyService, "getPortfolioCompanyById").and.returnValue(of({ body: mockResponse, code: "OK" }));
      component.id = "sampleId";
  
      // Act
      component.getPortfolioCompanies();
  
      // Assert
      expect(component.model).toEqual(mockResponse);
    });
  
    it("should set the loading flag to false", () => {
      // Arrange
      const portfolioCompanyService = TestBed.inject(PortfolioCompanyService);
      spyOn(portfolioCompanyService, "getPortfolioCompanyById").and.returnValue(of({ body: { /* mock response data */ }, code: "OK" }));
      component.id = "sampleId";
  
      // Act
      component.getPortfolioCompanies();
  
      // Assert
      expect(component.loading).toBeFalse();
    });
  
    it("should handle error when calling the getPortfolioCompanyById method", () => {
      // Arrange
      const portfolioCompanyService = TestBed.inject(PortfolioCompanyService);
      spyOn(portfolioCompanyService, "getPortfolioCompanyById").and.returnValue(throwError("error"));
      component.id = "sampleId";
  
      // Act
      component.getPortfolioCompanies();
  
      // Assert
      expect(component.loading).toBeFalse();
      // Add additional assertions for error handling if necessary
    });
    it("should update the updateModel and set confirmUpdate to true when currVal is different from prevVal", () => {
      // Arrange
      const index = 0;
      const col = { field: "fieldName" };
      const rowData = { fieldName: "newValue" };
      component.updateModel = { previousVal: "oldValue", updatedVal: "" };
      component.confirmUpdate = false;
  
      // Act
      component.onColumnEditComplete(index, col, rowData);
  
      // Assert
      expect(component.updateModel.updatedVal).toEqual("newValue");
      expect(component.confirmUpdate).toBeTrue();
    });
  
    it("should call OnKpiUpdateCancel when currVal is the same as prevVal", () => {
      // Arrange
      const index = 0;
      const col = { field: "fieldName" };
      const rowData = { fieldName: "oldValue" };
      component.updateModel = { previousVal: "oldValue", updatedVal: "" };
      component.confirmUpdate = false;
      spyOn(component, "OnKpiUpdateCancel");
  
      // Act
      component.onColumnEditComplete(index, col, rowData);
  
      // Assert
      expect(component.OnKpiUpdateCancel).toHaveBeenCalledWith("");
    });
    it("should call toastrService.success with the correct parameters", () => {
      // Arrange
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastrServiceStub, "success");
  
      // Act
      component.successToaster();
  
      // Assert
      expect(toastrServiceStub.success).toHaveBeenCalledWith(
        "Entry updated successfully",
        "",
        { positionClass: "toast-center-center" }
      );
    });
});
    it("should return false when the length of the input value is 15", () => {
      // Arrange
      const event = { target: { value: "123456789012345" } };
    
      // Act
      const result = component.validateMaxLength(event);
    
      // Assert
      expect(result).toBeFalse();
    });
    
    it("should return true when the length of the input value is not 15", () => {
      // Arrange
      const event = { target: { value: "1234567890" } };
    
      // Act
      const result = component.validateMaxLength(event);
    
      // Assert
      expect(result).toBeTrue();
    });
    describe("validateNumber", () => {
      it("should not modify the value if the key code is 15", () => {
        // Arrange
        const event = { which: 15, target: { value: "10.00" } };
  
        // Act
        component.validateNumber(event);
  
        // Assert
        expect(event.target.value).toEqual("10.00");
      });
  
      it("should round the value to 2 decimal places if it is not a valid number", () => {
        // Arrange
        const event = { which: 13, target: { value: "10.123" } };
  
        // Act
        component.validateNumber(event);
  
        // Assert
        expect(event.target.value).toEqual("10.12");
      });
  
      it("should not modify the value if it is a valid number", () => {
        // Arrange
        const event = { which: 13, target: { value: "10.00" } };
  
        // Act
        component.validateNumber(event);
  
        // Assert
        expect(event.target.value).toEqual("10.00");
      });
  
      it("should convert the value to a float with 2 decimal places if it is not an integer", () => {
        // Arrange
        const event = { which: 13, target: { value: "10.5" } };
  
        // Act
        component.validateNumber(event);
  
        // Assert
        expect(event.target.value).toEqual("10.5");
      });
    });
    
  describe("clearcellEdit", () => {
    it("should clear the cell edit state and update the object", () => {
      // Arrange
      const objIndex = 0;
      const kpiId = 1;
      const colName = "columnName";
      component.objImpactKPIList = {
        Results: [
          { KpiId: 1, "columnName editable": true },
          { KpiId: 2, "columnName editable": true },
        ],
      };
      component.updateModel = { kpiId, colName };
      component.confirmUpdate = true;

      // Act
      component.clearcellEdit();

      // Assert
      expect(component.objImpactKPIList.Results[objIndex][`${colName} editable`]).toBe(false);
      expect(component.confirmUpdate).toBe(false);
      expect(component.updateModel).toEqual({});
    });
  });
});
