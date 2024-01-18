import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { HelperService } from "../../services/helper.service";
import { AccountService } from "../../services/account.service";
import { DocumentService } from "../../services/document.service";
import { ToastrService } from "ngx-toastr";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { FeaturesEnum } from "../../services/permission.service";
import { FormsModule } from "@angular/forms";
import { RepositoryListComponent } from "./repository-list.component";
import { RepositoryConstants } from "src/app/common/constants";
import {  MatMenuModule } from "@angular/material/menu";

describe("RepositoryListComponent", () => {
  let component: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({});
    const routerStub = () => ({});
    const ngxSpinnerServiceStub = () => ({});
    const helperServiceStub = () => ({ getstaticIconPath: name => ({}) });
    const accountServiceStub = () => ({});
    const documentServiceStub = () => ({
      RequestDownload: id => ({ subscribe: f => f({}) }),
      downloadFile: response => ({}),
      getAllDocuments: object => ({ subscribe: f => f({}) }),
      MoveToRecycleBin: (arg, isPermanentDelete) => ({ subscribe: f => f({}) }),
      RestoreDocuments: arg => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [RepositoryListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: HelperService, useFactory: helperServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: DocumentService, useFactory: documentServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(RepositoryListComponent);
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

  it(`displayUploadDocument has default value`, () => {
    expect(component.displayUploadDocument).toEqual(false);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`documents has default value`, () => {
    expect(component.documents).toEqual([]);
  });

  it(`folderType has default value`, () => {
    expect(component.folderType).toEqual(RepositoryConstants.sharedFolderType);
  });

  it(`showDocFilters has default value`, () => {
    expect(component.showDocFilters).toEqual(false);
  });

  it(`enableAdvancedFilters has default value`, () => {
    expect(component.enableAdvancedFilters).toEqual(false);
  });

  it(`hasAdvancedFilters has default value`, () => {
    expect(component.hasAdvancedFilters).toEqual(false);
  });

  it(`ResetAdvFilters has default value`, () => {
    expect(component.ResetAdvFilters).toEqual(false);
  });

  it(`IsOpenDocument has default value`, () => {
    expect(component.IsOpenDocument).toEqual(false);
  });

  it(`documentId has default value`, () => {
    expect(component.documentId).toEqual(0);
  });

  it(`filteredFileFormats has default value`, () => {
    expect(component.filteredFileFormats).toEqual([]);
  });

  it(`filteredDocTypes has default value`, () => {
    expect(component.filteredDocTypes).toEqual([]);
  });

  it(`filteredSubDocTypes has default value`, () => {
    expect(component.filteredSubDocTypes).toEqual([]);
  });

  it(`advancedFilters has default value`, () => {
    expect(component.advancedFilters).toEqual([]);
  });

  it(`docTableHeaders has default value`, () => {
    expect(component.docTableHeaders).toEqual([]);
  });

  it(`selectedDocuments has default value`, () => {
    expect(component.selectedDocuments).toEqual([]);
  });

  it(`restoreDocument has default value`, () => {
    expect(component.restoreDocument).toEqual(undefined);
  });

  it(`isDeleteDocumentConfirmed has default value`, () => {
    expect(component.isDeleteDocumentConfirmed).toEqual(false);
  });

  it(`isRestoreDocumentConfirmed has default value`, () => {
    expect(component.isRestoreDocumentConfirmed).toEqual(false);
  });

  it(`fileDeleted has default value`, () => {
    expect(component.fileDeleted).toEqual(false);
  });

  it(`checkAll has default value`, () => {
    expect(component.checkAll).toEqual(false);
  });

  it(`links has default value`, () => {
    expect(component.links).toEqual([]);
  });

  it(`selectedIndex has default value`, () => {
    expect(component.selectedIndex).toEqual(0);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`parentFolderType has default value`, () => {
    expect(component.parentFolderType).toEqual(undefined);
  });

  it(`isPermanentDelete has default value`, () => {
    expect(component.isPermanentDelete).toEqual(false);
  });

  it(`deletedialogMessage has default value`, () => {
    expect(component.deletedialogMessage).toEqual(
      `Are you sure you want to delete the selected document(s)? `
    );
  });

  it(`permdeletedialogMessage has default value`, () => {
    expect(component.permdeletedialogMessage).toEqual(
      `This action cannot be undone, the document(s) once deleted cannot be recovered.`
    );
  });

  it(`deletedialogMessage1 has default value`, () => {
    expect(component.deletedialogMessage1).toEqual(
      `The deleted documents can be restored from Recycle Bin within next 45 days`
    );
  });

  it(`permdeletedialogMessage1 has default value`, () => {
    expect(component.permdeletedialogMessage1).toEqual(
      `Are you sure you want to delete the selected document(s) permanently?`
    );
  });

  it(`updatePopularTags has default value`, () => {
    expect(component.updatePopularTags).toEqual(false);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`tabName has default value`, () => {
    expect(component.tabName).toEqual(`Shared Folder`);
  });

  it(`subTabName has default value`, () => {
    expect(component.subTabName).toEqual(`Uploaded Files`);
  });

  describe("onTabClick", () => {
    it("makes expected calls", () => {
      const iTabStub: ITab = <any>{};
      spyOn(component, "showInfo").and.callThrough();
      component.onTabClick(iTabStub);
      expect(component.showInfo).toHaveBeenCalled();
    });
  });

  describe("onSubTabClick", () => {
    it("makes expected calls", () => {
      const iTabStub: ITab = <any>{};
      spyOn(component, "showInfo").and.callThrough();
      component.onSubTabClick(iTabStub);
      expect(component.showInfo).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getHeaders").and.callThrough();
      spyOn(component, "getAllDocuments").and.callThrough();
      spyOn(component, "getSubTabList").and.callThrough();
      component.ngOnInit();
      expect(component.getHeaders).toHaveBeenCalled();
      expect(component.getAllDocuments).toHaveBeenCalled();
      expect(component.getSubTabList).toHaveBeenCalled();
    });
  });

  describe("ResetSearch", () => {
    it("makes expected calls", () => {
      spyOn(component, "getAllDocuments").and.callThrough();
      component.ResetSearch();
      expect(component.getAllDocuments).toHaveBeenCalled();
    });
  });

  describe("showNoResultWhenSearchedElement1", () => {
    it("makes expected calls", () => {
      spyOn(component, "showNoDocsElement").and.callThrough();
      component.showNoResultWhenSearchedElement1();
      expect(component.showNoDocsElement).toHaveBeenCalled();
    });
  });

  describe("GetDocuments", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "setLastUpdateOn").and.callThrough();
      spyOn(component, "getIsRecycleBin").and.callThrough();
      spyOn(documentServiceStub, "getAllDocuments").and.callThrough();
      component.GetDocuments();
      expect(component.setLastUpdateOn).toHaveBeenCalled();
      expect(component.getIsRecycleBin).toHaveBeenCalled();
      expect(documentServiceStub.getAllDocuments).toHaveBeenCalled();
    });
  });

  describe("closeDocument", () => {
    it("makes expected calls", () => {
      spyOn(component, "GetDocuments").and.callThrough();
      spyOn(component, "getAllDocuments").and.callThrough();
      component.closeDocument();
      expect(component.GetDocuments).toHaveBeenCalled();
      expect(component.getAllDocuments).toHaveBeenCalled();
    });
  });

  describe("clearAllFilters", () => {
    it("makes expected calls", () => {
      spyOn(component, "getAllDocuments").and.callThrough();
      component.clearAllFilters();
      expect(component.getAllDocuments).toHaveBeenCalled();
    });
  });

  describe("deleteSelectedDocuments", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "onDelete").and.callThrough();
      spyOn(component, "GetDocuments").and.callThrough();
      spyOn(component, "getAllDocuments").and.callThrough();
      spyOn(documentServiceStub, "MoveToRecycleBin").and.callThrough();
      component.deleteSelectedDocuments();
      expect(component.onDelete).toHaveBeenCalled();
      expect(component.GetDocuments).toHaveBeenCalled();
      expect(component.getAllDocuments).toHaveBeenCalled();
      expect(documentServiceStub.MoveToRecycleBin).toHaveBeenCalled();
    });
  });

  describe("RestoreSelectedDocuments", () => {
    it("makes expected calls", () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(component, "onDelete").and.callThrough();
      spyOn(component, "GetDocuments").and.callThrough();
      spyOn(component, "getAllDocuments").and.callThrough();
      spyOn(documentServiceStub, "RestoreDocuments").and.callThrough();
      component.RestoreSelectedDocuments();
      expect(component.onDelete).toHaveBeenCalled();
      expect(component.GetDocuments).toHaveBeenCalled();
      expect(component.getAllDocuments).toHaveBeenCalled();
      expect(documentServiceStub.RestoreDocuments).toHaveBeenCalled();
    });
  });
});
