import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  HttpClientTestingModule
} from "@angular/common/http/testing";
import { DocumentService } from "../../services/document.service";
import { FirmService } from "../../services/firm.service";
import { FundService } from "../../services/funds.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { DealService } from "../../services/deal.service";
import { ToastrService } from "ngx-toastr";
import { HelperService } from "../../services/helper.service";
import { ImpactuploadComponent } from "./impactupload.component";
import { of } from "rxjs";

describe("ImpactuploadComponent", () => {
  let component: ImpactuploadComponent;
  let fixture: ComponentFixture<ImpactuploadComponent>;

  beforeEach(() => {
    const documentServiceStub = () => ({});
    const firmServiceStub = () => ({});
    const fundServiceStub = () => ({});
    const portfolioCompanyServiceStub = () => ({
      uploadlogos: (formData, path) => ({ subscribe: f => f({}) }),
      ondeletefinal: path => ({ subscribe: f => f({}) }),
      getuploadfiles: path => ({ subscribe: f => f({}) }),
      getfinaluploadfiles: path => ({ subscribe: f => f({}) })
    });
    const dealServiceStub = () => ({});
    const toastrServiceStub = () => ({
      warning: msg => ({}),
      success: msg => ({})
    });
    const helperServiceStub = () => ({
      getstaticIconPath: name => ({}),
      getIconFromFileName: filename => ({})
    });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ImpactuploadComponent],
      providers: [
        { provide: 'BASE_URL', useValue: 'http://localhost:4200/' } ,
        { provide: DocumentService, useFactory: documentServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: HelperService, useFactory: helperServiceStub }
      ]
    });
    fixture = TestBed.createComponent(ImpactuploadComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`interval has default value`, () => {
    expect(component.interval).toEqual(0);
  });

  it(`failedFilesCount has default value`, () => {
    expect(component.failedFilesCount).toEqual(0);
  });

  it(`intervals has default value`, () => {
    expect(component.intervals).toEqual(1000);
  });

  it(`files has default value`, () => {
    expect(component.files).toEqual([]);
  });

  it(`value has default value`, () => {
    expect(component.value).toEqual(0);
  });

  it(`folder has default value`, () => {
    expect(component.folder).toEqual(`Impact`);
  });

  it(`final has default value`, () => {
    expect(component.final).toEqual(`Final`);
  });

  it(`ProgressCancel has default value`, () => {
    expect(component.ProgressCancel).toEqual(false);
  });

  it(`cancel has default value`, () => {
    expect(component.cancel).toEqual(false);
  });

  it(`FileProgresStatus has default value`, () => {
    expect(component.FileProgresStatus).toEqual(`File Processing...`);
  });

  it(`uploadedfiles has default value`, () => {
    expect(component.uploadedfiles).toEqual([]);
  });

  it(`finaluploadedfiles has default value`, () => {
    expect(component.finaluploadedfiles).toEqual([]);
  });

  it(`fileToBeDeleted has default value`, () => {
    expect(component.fileToBeDeleted).toEqual(undefined);
  });

  it(`confirmDiscard has default value`, () => {
    expect(component.confirmDiscard).toEqual(false);
  });

  it(`confirmDelete has default value`, () => {
    expect(component.confirmDelete).toEqual(false);
  });

  it(`ispopup has default value`, () => {
    expect(component.ispopup).toEqual(true);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getfiles").and.callThrough();
      component.ngOnInit();
      expect(component.getfiles).toHaveBeenCalled();
    });
  });

  describe("timing", () => {
    it("should update the value and clear the interval", () => {
      jasmine.clock().install();
      component.value = 0;
      component.timing();
      jasmine.clock().tick(2000);
      expect(component.value).toBeGreaterThan(0);
      jasmine.clock().tick(2000);
      jasmine.clock().uninstall();
    });
  });

  describe("changequateryare", () => {
    it("should update the qauter and year properties and call getfiles", () => {
      component.qauter = "Q1";
      component.year = 2021;
      spyOn(component, "getfiles").and.callThrough();
      component.changequateryare(2022, "Q3");
      expect(component.qauter).toEqual("Q3");
      expect(component.year).toEqual(2022);
      expect(component.getfiles).toHaveBeenCalled();
    });
  });

  describe("pickdata", () => {
    it("should emit the data through onInitEvent", () => {
      const data = "test data";
      spyOn(component.onInitEvent, "emit");
      component.pickdata(data);
      expect(component.onInitEvent.emit).toHaveBeenCalledWith(data);
    });
  });

  describe("showtoasterOnuploadComplete", () => {
    it("should show a warning toastr message when status is 'error'", () => {
      const msg = "Upload failed";
      const status = "error";
      const toasterService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toasterService, "warning");
      component.showtoasterOnuploadComplete(msg, status);
      expect(toasterService.warning).toHaveBeenCalledWith(msg);
    });

    it("should show a success toastr message when status is 'success'", () => {
      const msg = "Upload successful";
      const status = "success";
      const toasterService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toasterService, "success");
      component.showtoasterOnuploadComplete(msg, status);
      expect(toasterService.success).toHaveBeenCalledWith(msg);
    });
  });

  describe("impactupload", () => {
    it("should upload the file and call getfiles", () => {
      const file = new File(["test"], "test.txt");
      const formData = new FormData();
      formData.append("file", file);
      spyOn(component, "getfiles");
      component.impactupload(file);
      expect(component.getfiles).toHaveBeenCalled();
    });
  });

  describe("onFileDropped", () => {
    it("should prepare the files list and call impactupload for each file", () => {
      const files = [
        new File(["test1"], "test1.txt"),
        new File(["test2"], "test2.txt")
      ];
      spyOn(component, "prepareFilesList");
      spyOn(component, "impactupload");
      component.onFileDropped(files);
      expect(component.prepareFilesList).toHaveBeenCalledWith(files);
    });
  });

  describe("prepareFilesList", () => {
    it("should add valid image files to the files array and call impactupload for each file", () => {
      const files = [
        new File(["test1"], "test1.txt"),
        new File(["image1"], "image1.png"),
        new File(["image2"], "image2.jpg")
      ];
      spyOn(component, "pickdata");
      spyOn(component, "getFileIcons").and.returnValues();
      spyOn(component, "impactupload");
      component.prepareFilesList(files);
      expect(component.pickdata).toHaveBeenCalledWith(true);
      expect(component.pickdata).toHaveBeenCalledWith(false);
      expect(component.files.length).toEqual(2);
      expect(component.impactupload).toHaveBeenCalledTimes(2);
    });
  });

  describe("NoOnCancel", () => {
    it("should set confirmDiscard and confirmDelete to false", () => {
      component.confirmDiscard = true;
      component.confirmDelete = true;
      component.NoOnCancel();
      expect(component.confirmDiscard).toEqual(false);
      expect(component.confirmDelete).toEqual(false);
    });
  });

  describe("OnDeleteUploadedFile", () => {
    it("should remove the file from the files array and call ondeletefinal", () => {
      const fileToBeDeleted = "test.txt";
      component.files = [
        { name: "file1.txt" },
        { name: "file2.txt" },
        { name: fileToBeDeleted }
      ];
      const path = `${component.folder}&${component.compnayid}&${component.year}&${component.qauter}&${fileToBeDeleted}`;
      spyOn(component, "ondeletefinal");
      component.OnDeleteUploadedFile();
      expect(component.ondeletefinal).toHaveBeenCalledTimes(0);
    });
  });

  describe("ondeletefinal", () => {
    it("should call ondeletefinal and getfiles", () => {
      const fileToBeDeleted = "test.txt";
      const companyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      const path = `${component.compnayid}&${component.year}&${component.qauter}&${fileToBeDeleted}`;
      spyOn(component, "getfiles");
      spyOn(companyService, "ondeletefinal").and.returnValue(of({}));
      component.ondeletefinal();
      expect(component.getfiles).toHaveBeenCalled();
    });
  });

  describe("getfiles", () => {
    it("should call getuploadfiles and finalfilesuploaded", () => {
      const path = `${component.folder}&${component.compnayid}&${component.year}&${component.qauter}`;
      const companyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(companyService, "getuploadfiles").and.returnValue(of({}));
      spyOn(component, "finalfilesuploaded");
      component.getfiles();
      expect(component.finalfilesuploaded).toHaveBeenCalled();
    });
  });

  describe("finalfilesuploaded", () => {
    it("should call getfinaluploadfiles and update the finaluploadedfiles array", () => {
      const path = `${component.compnayid}&${component.year}&${component.qauter}`;
      const response = [
        { key: "file1", value: "value1" },
        { key: "file2", value: "value2" }
      ];
      const companyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(companyService, "getfinaluploadfiles").and.returnValue(of(response));
      component.finaluploadedfiles = [];
      component.finalfilesuploaded();
      expect(companyService.getfinaluploadfiles).toHaveBeenCalledWith(path);
      expect(component.finaluploadedfiles).toEqual(response);
    });

    it("should add files to the uploadedfiles array if they are not already present", () => {
      const path = `${component.compnayid}&${component.year}&${component.qauter}`;
      const response = [
        { key: "file1", value: "value1" },
        { key: "file2", value: "value2" }
      ];
      const companyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      component.uploadedfiles = [{ key: "file1", value: "value1" }];
      spyOn(companyService, "getfinaluploadfiles").and.returnValue(of(response));
      component.finalfilesuploaded();
      expect(companyService.getfinaluploadfiles).toHaveBeenCalledWith(path);
    });
  });

  describe("openDelete", () => {
    it("should set the fileToBeDeleted property and confirmDelete to true", () => {
      const file = "test.txt";
      component.fileToBeDeleted = undefined;
      component.confirmDelete = false;
      component.openDelete(file);
      expect(component.fileToBeDeleted).toEqual(file);
      expect(component.confirmDelete).toEqual(true);
    });
  });

  describe("getIcons", () => {
    it("should call getstaticIconPath from helperService", () => {
      const name = "test.png";
      const helperService = fixture?.debugElement?.injector.get(
        HelperService
      );
      spyOn(helperService, "getstaticIconPath");
      component.getIcons(name);
      expect(helperService.getstaticIconPath).toHaveBeenCalledWith(name);
    });
  });

  describe("fileBrowseHandler", () => {
    it("should call prepareFilesList", () => {
      const files = [
        new File(["test1"], "test1.txt"),
        new File(["test2"], "test2.txt")
      ];
      spyOn(component, "prepareFilesList");
      component.fileBrowseHandler(files);
      expect(component.prepareFilesList).toHaveBeenCalledWith(files);
    });
  });
});