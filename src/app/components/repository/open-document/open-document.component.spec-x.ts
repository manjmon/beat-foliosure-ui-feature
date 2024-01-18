import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DealService } from "../../../services/deal.service";
import { FirmService } from "../../../services/firm.service";
import { FundService } from "../../../services/funds.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { AccountService } from "../../../services/account.service";
import { DocumentService } from "../../../services/document.service";
import { FeaturesEnum } from "../../../services/permission.service";
import { FormsModule } from "@angular/forms";
import { OpenDocumentComponent } from "./open-document.component";

describe("OpenDocumentComponent", () => {
  let component: OpenDocumentComponent;
  let fixture: ComponentFixture<OpenDocumentComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({
      url: { includes: () => ({}) },
      navigateByUrl: string => ({})
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (msg, string, object) => ({})
    });
    const dealServiceStub = () => ({
      getDealsList: object => ({ subscribe: f => f({}) })
    });
    const firmServiceStub = () => ({
      getFirmList: object => ({ subscribe: f => f({}) })
    });
    const fundServiceStub = () => ({
      getFundsList: object => ({ subscribe: f => f({}) })
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyList: object => ({ subscribe: f => f({}) })
    });
    const accountServiceStub = () => ({
      getUserList: object => ({ subscribe: f => f({}) })
    });
    const documentServiceStub = () => ({
      getFolders: () => ({ subscribe: f => f({}) }),
      getAllDocumentStatus: () => ({ subscribe: f => f({}) }),
      getAllDocumentTypes: doctype => ({ subscribe: f => f({}) }),
      getDocumentByID: id => ({ subscribe: f => f({}) }),
      MoveToRecycleBin: arg => ({ subscribe: f => f({}) }),
      ChangeFolder: selectedDocument => ({ subscribe: f => f({}) }),
      UpdatelDocument: (id, selectedDocument) => ({ subscribe: f => f({}) }),
      VaidateDocExists: selectedDocument => ({ subscribe: f => f({}) }),
      RequestDownload: id => ({ subscribe: f => f({}) }),
      downloadFile: pdfblobvalue => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [OpenDocumentComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: DocumentService, useFactory: documentServiceStub }
      ]
    });
    fixture = TestBed.createComponent(OpenDocumentComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`pipelineList has default value`, () => {
    expect(component.pipelineList).toEqual([]);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`editMode has default value`, () => {
    expect(component.editMode).toEqual(true);
  });

  it(`isDocUpdated has default value`, () => {
    expect(component.isDocUpdated).toEqual(false);
  });

  it(`documentTypes has default value`, () => {
    expect(component.documentTypes).toEqual([]);
  });

  it(`documentSubTypes has default value`, () => {
    expect(component.documentSubTypes).toEqual([]);
  });

  it(`hasDocNameUpdated has default value`, () => {
    expect(component.hasDocNameUpdated).toEqual(false);
  });

  it(`hasTypeUpdated has default value`, () => {
    expect(component.hasTypeUpdated).toEqual(false);
  });

  it(`hasSubTypeUpdated has default value`, () => {
    expect(component.hasSubTypeUpdated).toEqual(false);
  });

  it(`hasDocDateUpdated has default value`, () => {
    expect(component.hasDocDateUpdated).toEqual(false);
  });

  it(`hasFolderUpdated has default value`, () => {
    expect(component.hasFolderUpdated).toEqual(false);
  });

  it(`hasFirmNameUpdated has default value`, () => {
    expect(component.hasFirmNameUpdated).toEqual(false);
  });

  it(`hasFundNameUpdated has default value`, () => {
    expect(component.hasFundNameUpdated).toEqual(false);
  });

  it(`hasPortfolioCompanyNameUpdated has default value`, () => {
    expect(component.hasPortfolioCompanyNameUpdated).toEqual(false);
  });

  it(`hasDealNameUpdated has default value`, () => {
    expect(component.hasDealNameUpdated).toEqual(false);
  });

  it(`cancelEditing has default value`, () => {
    expect(component.cancelEditing).toEqual(false);
  });

  it(`ShowValidation has default value`, () => {
    expect(component.ShowValidation).toEqual(false);
  });

  it(`primaryButtonName has default value`, () => {
    expect(component.primaryButtonName).toEqual(`Yes`);
  });

  it(`secondaryButtonName has default value`, () => {
    expect(component.secondaryButtonName).toEqual(`No`);
  });

  it(`modalTitle has default value`, () => {
    expect(component.modalTitle).toEqual(`Cancel Editing`);
  });

  it(`modalBody1 has default value`, () => {
    expect(component.modalBody1).toEqual(`All your changes will be lost.`);
  });

  it(`modalBody2 has default value`, () => {
    expect(component.modalBody2).toEqual(`Are you sure you want to cancel?`);
  });

  it(`cancelDeleteDoc has default value`, () => {
    expect(component.cancelDeleteDoc).toEqual(false);
  });

  it(`deleteModalTitle has default value`, () => {
    expect(component.deleteModalTitle).toEqual(`Delete Document`);
  });

  it(`deleteModalBody1 has default value`, () => {
    expect(component.deleteModalBody1).toEqual(
      `Are you sure want to delete this document?`
    );
  });

  it(`deleteModalBody2 has default value`, () => {
    expect(component.deleteModalBody2).toEqual(
      `The deleted documents can be restored from Recycle Bin within next 45 days`
    );
  });

  it(`confirmSave has default value`, () => {
    expect(component.confirmSave).toEqual(false);
  });

  it(`confirmChangeFolder has default value`, () => {
    expect(component.confirmChangeFolder).toEqual(false);
  });

  it(`savePrimaryButtonName has default value`, () => {
    expect(component.savePrimaryButtonName).toEqual(`Confirm`);
  });

  it(`saveSecondaryButtonName has default value`, () => {
    expect(component.saveSecondaryButtonName).toEqual(`Cancel`);
  });

  it(`saveModalTitle has default value`, () => {
    expect(component.saveModalTitle).toEqual(`Save Changes`);
  });

  it(`saveModalBody1 has default value`, () => {
    expect(component.saveModalBody1).toEqual(
      `Are you sure you want to update Document Details?`
    );
  });

  it(`folders has default value`, () => {
    expect(component.folders).toEqual([]);
  });

  it(`documentTags has default value`, () => {
    expect(component.documentTags).toEqual([]);
  });

  it(`isFolderUpdated has default value`, () => {
    expect(component.isFolderUpdated).toEqual(false);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(true);
  });

  it(`allUsers has default value`, () => {
    expect(component.allUsers).toEqual([]);
  });

  it(`selectedAssignedTo has default value`, () => {
    expect(component.selectedAssignedTo).toEqual([]);
  });

  it(`userInfo has default value`, () => {
    expect(component.userInfo).toEqual([]);
  });

  it(`showassign has default value`, () => {
    expect(component.showassign).toEqual(false);
  });

  it(`showatags has default value`, () => {
    expect(component.showatags).toEqual(false);
  });

  it(`AllStatusTypes has default value`, () => {
    expect(component.AllStatusTypes).toEqual([]);
  });

  it(`StatusTypes has default value`, () => {
    expect(component.StatusTypes).toEqual([]);
  });

  it(`isPreviewMode has default value`, () => {
    expect(component.isPreviewMode).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "getDocumentByID").and.callThrough();
      spyOn(component, "getAllStatusTypes").and.callThrough();
      spyOn(component, "PdfBlobValue").and.callThrough();
      spyOn(component, "getAllDocTypes").and.callThrough();
      spyOn(component, "getAllFirms").and.callThrough();
      spyOn(component, "getAllFunds").and.callThrough();
      spyOn(component, "getAllPortfolioCompanies").and.callThrough();
      spyOn(component, "getAllDeals").and.callThrough();
      spyOn(component, "getAllUsers").and.callThrough();
      spyOn(documentServiceStub, "getFolders").and.callThrough();
      component.ngOnInit();
      expect(component.getDocumentByID).toHaveBeenCalled();
      expect(component.getAllStatusTypes).toHaveBeenCalled();
      expect(component.PdfBlobValue).toHaveBeenCalled();
      expect(component.getAllDocTypes).toHaveBeenCalled();
      expect(component.getAllFirms).toHaveBeenCalled();
      expect(component.getAllFunds).toHaveBeenCalled();
      expect(component.getAllPortfolioCompanies).toHaveBeenCalled();
      expect(component.getAllDeals).toHaveBeenCalled();
      expect(component.getAllUsers).toHaveBeenCalled();
      expect(documentServiceStub.getFolders).toHaveBeenCalled();
    });
  });

  describe("getAllUsers", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      spyOn(accountServiceStub, "getUserList").and.callThrough();
      component.getAllUsers();
      expect(accountServiceStub.getUserList).toHaveBeenCalled();
    });
  });

  describe("getAllStatusTypes", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, "getAllDocumentStatus").and.callThrough();
      component.getAllStatusTypes();
      expect(documentServiceStub.getAllDocumentStatus).toHaveBeenCalled();
    });
  });

  describe("getAllFirms", () => {
    it("makes expected calls", () => {
      const firmServiceStub: FirmService = fixture.debugElement.injector.get(
        FirmService
      );
      spyOn(firmServiceStub, "getFirmList").and.callThrough();
      component.getAllFirms();
      expect(firmServiceStub.getFirmList).toHaveBeenCalled();
    });
  });

  describe("getAllFunds", () => {
    it("makes expected calls", () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      spyOn(fundServiceStub, "getFundsList").and.callThrough();
      component.getAllFunds();
      expect(fundServiceStub.getFundsList).toHaveBeenCalled();
    });
  });

  describe("getAllPortfolioCompanies", () => {
    it("makes expected calls", () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(
        portfolioCompanyServiceStub,
        "getPortfolioCompanyList"
      ).and.callThrough();
      component.getAllPortfolioCompanies();
      expect(
        portfolioCompanyServiceStub.getPortfolioCompanyList
      ).toHaveBeenCalled();
    });
  });

  describe("getAllDeals", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(dealServiceStub, "getDealsList").and.callThrough();
      component.getAllDeals();
      expect(dealServiceStub.getDealsList).toHaveBeenCalled();
    });
  });

  describe("getAllDocTypes", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, "getAllDocumentTypes").and.callThrough();
      component.getAllDocTypes();
      expect(documentServiceStub.getAllDocumentTypes).toHaveBeenCalled();
    });
  });

  describe("onDocumentTypeChanged", () => {
    it("makes expected calls", () => {
      spyOn(component, "getSubTypes").and.callThrough();
      spyOn(component, "hasDocUpdated").and.callThrough();
      component.onDocumentTypeChanged();
      expect(component.getSubTypes).toHaveBeenCalled();
      expect(component.hasDocUpdated).toHaveBeenCalled();
    });
  });

  describe("onDocumentSubTypeChanged", () => {
    it("makes expected calls", () => {
      spyOn(component, "hasDocUpdated").and.callThrough();
      component.onDocumentSubTypeChanged();
      expect(component.hasDocUpdated).toHaveBeenCalled();
    });
  });

  describe("onYesDeleteModal", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "closeDoc").and.callThrough();
      spyOn(component, "delDoc").and.callThrough();
      spyOn(component, "onNoDeleteModal").and.callThrough();
      spyOn(documentServiceStub, "MoveToRecycleBin").and.callThrough();
      component.onYesDeleteModal();
      expect(component.closeDoc).toHaveBeenCalled();
      expect(component.delDoc).toHaveBeenCalled();
      expect(component.onNoDeleteModal).toHaveBeenCalled();
      expect(documentServiceStub.MoveToRecycleBin).toHaveBeenCalled();
    });
  });

  describe("onCancelEditing", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "closeCancelModal").and.callThrough();
      spyOn(component, "convertToUTC").and.callThrough();
      spyOn(documentServiceStub, "ChangeFolder").and.callThrough();
      component.onCancelEditing();
      expect(component.closeCancelModal).toHaveBeenCalled();
      expect(component.convertToUTC).toHaveBeenCalled();
      expect(documentServiceStub.ChangeFolder).toHaveBeenCalled();
    });
  });

  describe("onConfirmSave", () => {
    it("makes expected calls", () => {
      spyOn(component, "vaidateDocExists").and.callThrough();
      component.onConfirmSave();
      expect(component.vaidateDocExists).toHaveBeenCalled();
    });
  });

  describe("onUpdateDocument", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "convertToUTC").and.callThrough();
      spyOn(component, "onUpdateDoc").and.callThrough();
      spyOn(documentServiceStub, "UpdatelDocument").and.callThrough();
      component.onUpdateDocument();
      expect(component.convertToUTC).toHaveBeenCalled();
      expect(component.onUpdateDoc).toHaveBeenCalled();
      expect(documentServiceStub.UpdatelDocument).toHaveBeenCalled();
    });
  });

  describe("DownloadFile", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, "RequestDownload").and.callThrough();
      spyOn(documentServiceStub, "downloadFile").and.callThrough();
      component.DownloadFile();
      expect(documentServiceStub.RequestDownload).toHaveBeenCalled();
      expect(documentServiceStub.downloadFile).toHaveBeenCalled();
    });
  });

  describe("closeDoc", () => {
    it("makes expected calls", () => {
      const routerStub: Router = fixture.debugElement.injector.get(Router);
      spyOn(routerStub, "navigateByUrl").and.callThrough();
      component.closeDoc();
      expect(routerStub.navigateByUrl).toHaveBeenCalled();
    });
  });

  describe("OnFolderKeyUp", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, "getFolders").and.callThrough();
      component.OnFolderKeyUp();
      expect(documentServiceStub.getFolders).toHaveBeenCalled();
    });
  });
});
