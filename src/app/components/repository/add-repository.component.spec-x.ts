import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  HttpClientTestingModule,
} from "@angular/common/http/testing";
import { DocumentService } from "./../../services/document.service";
import { FirmService } from "src/app/services/firm.service";
import { FundService } from "src/app/services/funds.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { DealService } from "src/app/services/deal.service";
import { ToastrService } from "ngx-toastr";
import { HelperService } from "src/app/services/helper.service";
import { FormsModule } from "@angular/forms";
import { AddRepositoryComponent } from "./add-repository.component";
import { MatMenuModule } from "@angular/material/menu";

describe("AddRepositoryComponent", () => {
  let component: AddRepositoryComponent;
  let fixture: ComponentFixture<AddRepositoryComponent>;

  beforeEach(() => {
    const documentServiceStub = () => ({
      getAllDocumentTypes: number => ({ subscribe: f => f({}) }),
      getRestrictFileTypes: string => ({ subscribe: f => f({}) }),
      AddDocument: newDocuments => ({ subscribe: f => f({}) }),
      VaidateBulkDocExists: newDocuments => ({ subscribe: f => f({}) }),
      VaidateDocExists: newDocument => ({ subscribe: f => f({}) }),
      DeleteFiles: encodedFileNames => ({ subscribe: f => f({}) })
    });
    const firmServiceStub = () => ({
      getFirmList: object => ({ subscribe: f => f({}) })
    });
    const fundServiceStub = () => ({
      getFundsData: object => ({ subscribe: f => f({}) })
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyList: object => ({ subscribe: f => f({}) })
    });
    const dealServiceStub = () => ({
      getDealsList: object => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      warning: (string, string1, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const helperServiceStub = () => ({
      getstaticIconPath: name => ({}),
      getIconFromFileName: filename => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddRepositoryComponent],
      providers: [
        { provide: DocumentService, useFactory: documentServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: HelperService, useFactory: helperServiceStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    fixture = TestBed.createComponent(AddRepositoryComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`fileAdded has default value`, () => {
    expect(component.fileAdded).toEqual(false);
  });

  it(`newDocuments has default value`, () => {
    expect(component.newDocuments).toEqual([]);
  });

  it(`documentTypes has default value`, () => {
    expect(component.documentTypes).toEqual([]);
  });

  it(`documentSubTypes has default value`, () => {
    expect(component.documentSubTypes).toEqual([]);
  });

  it(`firms has default value`, () => {
    expect(component.firms).toEqual([]);
  });

  it(`funds has default value`, () => {
    expect(component.funds).toEqual([]);
  });

  it(`porfoliocompanies has default value`, () => {
    expect(component.porfoliocompanies).toEqual([]);
  });

  it(`deals has default value`, () => {
    expect(component.deals).toEqual([]);
  });

  it(`encodedFileNames has default value`, () => {
    expect(component.encodedFileNames).toEqual([]);
  });

  it(`disableSaveButton has default value`, () => {
    expect(component.disableSaveButton).toEqual(true);
  });

  it(`uploadedFilesCount has default value`, () => {
    expect(component.uploadedFilesCount).toEqual(0);
  });

  it(`renameInProgress has default value`, () => {
    expect(component.renameInProgress).toEqual(false);
  });

  it(`isRetry has default value`, () => {
    expect(component.isRetry).toEqual(false);
  });

  it(`failedFilesCount has default value`, () => {
    expect(component.failedFilesCount).toEqual(0);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`files has default value`, () => {
    expect(component.files).toEqual([]);
  });

  it(`confirmDiscard has default value`, () => {
    expect(component.confirmDiscard).toEqual(false);
  });

  it(`confirmDelete has default value`, () => {
    expect(component.confirmDelete).toEqual(false);
  });

  it(`allfiletypes has default value`, () => {
    expect(component.allfiletypes).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      const firmServiceStub: FirmService = fixture.debugElement.injector.get(
        FirmService
      );
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(documentServiceStub, "getAllDocumentTypes").and.callThrough();
      spyOn(documentServiceStub, "getRestrictFileTypes").and.callThrough();
      spyOn(firmServiceStub, "getFirmList").and.callThrough();
      spyOn(fundServiceStub, "getFundsData").and.callThrough();
      spyOn(
        portfolioCompanyServiceStub,
        "getPortfolioCompanyList"
      ).and.callThrough();
      spyOn(dealServiceStub, "getDealsList").and.callThrough();
      component.ngOnInit();
      expect(documentServiceStub.getAllDocumentTypes).toHaveBeenCalled();
      expect(documentServiceStub.getRestrictFileTypes).toHaveBeenCalled();
      expect(firmServiceStub.getFirmList).toHaveBeenCalled();
      expect(fundServiceStub.getFundsData).toHaveBeenCalled();
      expect(
        portfolioCompanyServiceStub.getPortfolioCompanyList
      ).toHaveBeenCalled();
      expect(dealServiceStub.getDealsList).toHaveBeenCalled();
    });
  });

  describe("showtoasterOnuploadComplete", () => {
    it("makes expected calls", () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastrServiceStub, "warning").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      component.showtoasterOnuploadComplete();
      expect(toastrServiceStub.warning).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });

  describe("Save", () => {
    it("makes expected calls", () => {
      spyOn(component, "recreateNewDocument").and.callThrough();
      spyOn(component, "ValidateBulkDocExists").and.callThrough();
      spyOn(component, "AddDocuments").and.callThrough();
      component.Save();
      expect(component.recreateNewDocument).toHaveBeenCalled();
      expect(component.ValidateBulkDocExists).toHaveBeenCalled();
      expect(component.AddDocuments).toHaveBeenCalled();
    });
  });

  describe("AddDocuments", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "AddHtmlValidation").and.callThrough();
      spyOn(documentServiceStub, "AddDocument").and.callThrough();
      component.AddDocuments();
      expect(component.AddHtmlValidation).toHaveBeenCalled();
      expect(documentServiceStub.AddDocument).toHaveBeenCalled();
    });
  });

  describe("VaidateDocExists", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "AddHtmlValidation").and.callThrough();
      spyOn(component, "RemoveHtmlValidation").and.callThrough();
      spyOn(documentServiceStub, "VaidateDocExists").and.callThrough();
      component.VaidateDocExists();
      expect(component.AddHtmlValidation).toHaveBeenCalled();
      expect(component.RemoveHtmlValidation).toHaveBeenCalled();
      expect(documentServiceStub.VaidateDocExists).toHaveBeenCalled();
    });
  });

  describe("YesOnCancel", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, "DeleteFiles").and.callThrough();
      component.YesOnCancel();
      expect(documentServiceStub.DeleteFiles).toHaveBeenCalled();
    });
  });

  describe("OnDeleteUploadedFile", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "getFileIcons").and.callThrough();
      spyOn(component, "AddHtmlValidation").and.callThrough();
      spyOn(documentServiceStub, "DeleteFiles").and.callThrough();
      component.OnDeleteUploadedFile();
      expect(component.getFileIcons).toHaveBeenCalled();
      expect(component.AddHtmlValidation).toHaveBeenCalled();
      expect(documentServiceStub.DeleteFiles).toHaveBeenCalled();
    });
  });

  describe("onDocumentTypeChanged", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, "getAllDocumentTypes").and.callThrough();
      component.onDocumentTypeChanged();
      expect(documentServiceStub.getAllDocumentTypes).toHaveBeenCalled();
    });
  });

  describe("documentNameOnBlur", () => {
    it("makes expected calls", () => {
      spyOn(component, "VaidateDocExists").and.callThrough();
      component.documentNameOnBlur();
      expect(component.VaidateDocExists).toHaveBeenCalled();
    });
  });
});
