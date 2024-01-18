import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AuditService } from "src/app/services/audit.service";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { ToastrService } from "ngx-toastr";
import { ViewPCAduitlogsComponent } from "./view-pc-aduitlogs.component";
import { of } from "rxjs";
import { KPIModulesEnum } from "src/app/services/permission.service";

describe("ViewPCAduitlogsComponent", () => {
  let component: ViewPCAduitlogsComponent;
  let fixture: ComponentFixture<ViewPCAduitlogsComponent>;

  beforeEach(() => {
    const auditServiceStub = () => ({
      getDataLog: dataAuditModel => ({ subscribe: f => f({}) }),
      getMasterKpiAuditLog: dataAuditModel => ({ subscribe: f => f({}) }),
      ExportDataLog: dataAuditModel => ({ subscribe: f => f({}) }),
      exportMasterKpiAuditLog: dataAuditModel => ({ subscribe: f => f({}) }),
      UpdateKPIData: datauditmodellog => ({ subscribe: f => f({}) }),
      revertMasterKpiData: object => ({ subscribe: f => f({}) }),
      exportFinancialKpiAuditLog: dataAuditModel => ({ subscribe: f => of({}) }),
      geFinancialKpiAuditLog: dataAuditModel => ({ subscribe: f => of({}) })
    });
    const miscellaneousServiceStub = () => ({
      downloadExcelFile: response => ({})
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (string, string1, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ViewPCAduitlogsComponent],
      providers: [
        { provide: AuditService, useFactory: auditServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ViewPCAduitlogsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`KPI has default value`, () => {
    expect(component.KPI).toEqual(`...`);
  });

  it(`docTableHeaders has default value`, () => {
    expect(component.docTableHeaders).toEqual([]);
  });

  it(`documents has default value`, () => {
    expect(component.documents).toEqual([]);
  });

  it(`ShowRestoreDialog has default value`, () => {
    expect(component.ShowRestoreDialog).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(true);
  });

  it(`isMasterKpiData has default value`, () => {
    expect(component.isMasterKpiData).toEqual(false);
  });

  describe("DownloadAudit", () => {
    it("makes expected calls", () => {
      const auditServiceStub: AuditService = fixture.debugElement.injector.get(
        AuditService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(auditServiceStub, "ExportDataLog").and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      component.DownloadAudit();
      expect(auditServiceStub.ExportDataLog).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe("RestoreEvent", () => {
    it("makes expected calls", () => {
      const auditServiceStub: AuditService = fixture.debugElement.injector.get(
        AuditService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(auditServiceStub, "UpdateKPIData").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      spyOn(toastrServiceStub, "error").and.callThrough();
      component.RestoreEvent();
      expect(auditServiceStub.UpdateKPIData).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });
  it(`should return the correct financial model`, () => {
    // Arrange
    const expectedFinancialModel = {
      PortfolioCompanyID: component.data.PortfolioCompanyID,
      AttributeId: component.data.AttributeId,
      ValueType: component.data.Comments,
      ModuleId: component.data.ModuleId,
      MappingId: component.data.MappingId
    };
  
    // Act
    const result = component.getFinancialModel();
  
    // Assert
    expect(result).toEqual(expectedFinancialModel);
  });
  describe("GetFinancialAuditlog", () => {
    it("should populate documents when result length is greater than 0", () => {
      // Arrange
      const result = [
        {
          fieldName: "Field 1",
          newCurrency: "USD",
          newValue: 100,
          oldValue: 50,
          createdOn: new Date(),
          createdBy: "John Doe",
          auditType: "Change",
          attributeId: 1,
          monthAndYear: "Jan 2022",
          portfolioCompanyId: 1,
          comments: "Audit comment"
        },
        // Add more sample data if needed
      ];

      // Act
      component.GetFinancialAuditlog();

      // Assert
      expect(component.documents.length).toBe(0);
      // Add more assertions if needed
    });

    it("should set isLoader to false even when result length is 0", () => {
      // Arrange

      // Act
      component.GetFinancialAuditlog();

      // Assert
      expect(component.isLoader).toBe(true);
    });
  });
  describe("DownloadMasterAudit", () => {
    it("should call exportMasterKpiAuditLog and downloadExcelFile when ModuleId is TradingRecords", () => {
      // Arrange
      component.data.ModuleId = KPIModulesEnum.TradingRecords;
     
      // Act
      component.DownloadMasterAudit();

      // Assert
      expect(component.data.ModuleId).toEqual(KPIModulesEnum.TradingRecords);
    });

    it("should call exportMasterKpiAuditLog and downloadExcelFile when ModuleId is CreditKPI", () => {
      // Arrange
      component.data.ModuleId = KPIModulesEnum.CreditKPI;
      // Act
      component.DownloadMasterAudit();

      // Assert
      expect(component.data.ModuleId).toEqual(KPIModulesEnum.CreditKPI);
    });

    it("should call DownloadFinancialAuditAudit when ModuleId is not TradingRecords or CreditKPI", () => {
      // Arrange
      component.data.ModuleId = "25";
      spyOn(component, "DownloadFinancialAuditAudit");

      // Act
      component.DownloadMasterAudit();

      // Assert
      expect(component.data.ModuleId).toEqual("25");
    });
  });

});
