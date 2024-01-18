import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { CashflowService } from "src/app/services/cashflow.service";
import { AccountService } from "src/app/services/account.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { FundService } from "src/app/services/funds.service";
import { FeaturesEnum } from "src/app/services/permission.service";
import { FormsModule } from "@angular/forms";
import { CashflowUploadComponent } from "./cashflow-upload.component";
import { MatMenuModule } from "@angular/material/menu";

describe("CashflowUploadComponent", () => {
  let component: CashflowUploadComponent;
  let fixture: ComponentFixture<CashflowUploadComponent>;

  beforeEach(() => {
    const domSanitizerStub = () => ({
      bypassSecurityTrustHtml: statusDescription => ({})
    });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (message, string, object) => ({}),
      error: (message, string, object) => ({})
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      downloadExcelFile: response => ({})
    });
    const cashflowServiceStub = () => ({
      saveCashflowData: fundHoldingUpdateDetails => ({ subscribe: f => f({}) })
    });
    const accountServiceStub = () => ({});
    const fileUploadServiceStub = () => ({
      importCashflowDetails: formData => ({ subscribe: f => f({}) }),
      exportTemplates: object => ({ subscribe: f => f({}) })
    });
    const fundServiceStub = () => ({
      getFundNamesList: object => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CashflowUploadComponent],
      providers: [
        { provide: DomSanitizer, useFactory: domSanitizerStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: CashflowService, useFactory: cashflowServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FileUploadService, useFactory: fileUploadServiceStub },
        { provide: FundService, useFactory: fundServiceStub }
      ]
    });
    fixture = TestBed.createComponent(CashflowUploadComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`browseicon has default value`, () => {
    expect(component.browseicon).toEqual(true);
  });

  it(`defaultPlaceholder has default value`, () => {
    expect(component.defaultPlaceholder).toEqual(`Browse`);
  });

  it(`uploadFilePlaceholder has default value`, () => {
    expect(component.uploadFilePlaceholder).toEqual(component.uploadFilePlaceholder);
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`cashflowData has default value`, () => {
    expect(component.cashflowData).toEqual([]);
  });

  it(`cashflowCalculationData has default value`, () => {
    expect(component.cashflowCalculationData).toEqual([]);
  });

  it(`realizeData has default value`, () => {
    expect(component.realizeData).toEqual([]);
  });

  it(`unRealizeData has default value`, () => {
    expect(component.unRealizeData).toEqual([]);
  });

  it(`showUploadSection has default value`, () => {
    expect(component.showUploadSection).toEqual(true);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`cancel has default value`, () => {
    expect(component.cancel).toEqual(false);
  });

  it(`enableSaveButton has default value`, () => {
    expect(component.enableSaveButton).toEqual(true);
  });

  it(`interval has default value`, () => {
    expect(component.interval).toEqual(0);
  });

  it(`ProgressCancel has default value`, () => {
    expect(component.ProgressCancel).toEqual(true);
  });

  it(`showCancelButton has default value`, () => {
    expect(component.showCancelButton).toEqual(true);
  });

  it(`FileProgresStatus has default value`, () => {
    expect(component.FileProgresStatus).toEqual(`Cancel File Progress`);
  });

  it(`messageClass has default value`, () => {
    expect(component.messageClass).toEqual(`bulkMessage`);
  });

  it(`uploadedFiles has default value`, () => {
    expect(component.uploadedFiles).toEqual([]);
  });

  it(`value has default value`, () => {
    expect(component.value).toEqual(0);
  });

  it(`fundList has default value`, () => {
    expect(component.fundList).toEqual([]);
  });

  it(`isOverwriteHoldings has default value`, () => {
    expect(component.isOverwriteHoldings).toEqual(false);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([
      { field: "Date", header: "Date" },
      { field: "Transaction Type", header: "Transaction Type" },
    ]);
  });

  it(`frozenRows has default value`, () => {
    expect(component.frozenRows).toEqual([]);
  });

  it(`realizedColIndex has default value`, () => {
    expect(component.realizedColIndex).toEqual(0);
  });

  it(`unrealizedColIndex has default value`, () => {
    expect(component.unrealizedColIndex).toEqual(0);
  });

  it(`files has default value`, () => {
    expect(component.files).toEqual([]);
  });

  it(`displayUpdateConfirmationDialog has default value`, () => {
    expect(component.displayUpdateConfirmationDialog).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getFundList").and.callThrough();
      component.ngOnInit();
      expect(component.getFundList).toHaveBeenCalled();
    });
  });

  describe("onUpload", () => {
    it("makes expected calls", () => {
      spyOn(component, "uploadCashflow").and.callThrough();
      component.onUpload();
      expect(component.uploadCashflow).toHaveBeenCalled();
    });
  });

  describe("saveDataFlag", () => {
    it("makes expected calls", () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const cashflowServiceStub: CashflowService = fixture.debugElement.injector.get(
        CashflowService
      );
      spyOn(component, "onClose").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      spyOn(toastrServiceStub, "error").and.callThrough();
      spyOn(cashflowServiceStub, "saveCashflowData").and.callThrough();
      component.saveDataFlag();
      expect(component.onClose).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(cashflowServiceStub.saveCashflowData).toHaveBeenCalled();
    });
  });

  describe("getFundList", () => {
    it("makes expected calls", () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      spyOn(fundServiceStub, "getFundNamesList").and.callThrough();
      component.getFundList();
      expect(fundServiceStub.getFundNamesList).toHaveBeenCalled();
    });
  });

  describe("openConfirmationModal", () => {
    it("makes expected calls", () => {
      spyOn(component, "saveDataFlag").and.callThrough();
      component.openConfirmationModal();
      expect(component.saveDataFlag).toHaveBeenCalled();
    });
  });

  describe("DownloadTemplate", () => {
    it("makes expected calls", () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const fileUploadServiceStub: FileUploadService = fixture.debugElement.injector.get(
        FileUploadService
      );
      spyOn(toastrServiceStub, "error").and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      spyOn(fileUploadServiceStub, "exportTemplates").and.callThrough();
      component.DownloadTemplate();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(fileUploadServiceStub.exportTemplates).toHaveBeenCalled();
    });
  });
});
