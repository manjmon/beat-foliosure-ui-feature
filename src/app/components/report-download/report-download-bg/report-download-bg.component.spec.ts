import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReportDownloadBgComponent } from "./report-download-bg.component";
import { ReportDownloadService } from "../../../services/report-download.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { of, throwError } from "rxjs";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";

describe("ReportDownloadBgComponent", () => {
  let component: ReportDownloadBgComponent;
  let fixture: ComponentFixture<ReportDownloadBgComponent>;
  let reportDownloadService: ReportDownloadService;
  let miscService: MiscellaneousService;

  beforeEach(() => {
    const reportDownloadServiceStub = () => ({
      downloadBackgroundReport: jobId => ({
        subscribe: successCallback => successCallback({}),
      }),
    });

    const miscServiceStub = () => ({
      downloadExcelFile: result => {},
    });
    const activatedRouteStub = { // Create a stub for ActivatedRoute
      snapshot: {
        paramMap: {
          get: (param) => param === 'id' ? '123' : null, // Return '123' for 'id' parameter
        },
        params: of({ id: '123' }), // Add this if 'id' is accessed from 'params'
        queryParams: of({ id: '123' }) // Add this if 'id' is accessed from 'queryParams'
      },
    };

    TestBed.configureTestingModule({
      declarations: [ReportDownloadBgComponent],
      providers: [
        { provide: ReportDownloadService, useFactory: reportDownloadServiceStub },
        { provide: MiscellaneousService, useFactory: miscServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
    });

    fixture = TestBed.createComponent(ReportDownloadBgComponent);
    component = fixture.componentInstance;
    reportDownloadService = TestBed.inject(ReportDownloadService);
    miscService = TestBed.inject(MiscellaneousService);
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });


    it("should call downloadBackgroundReport and downloadExcelFile", () => {
      const jobId = "123";
      const mockResponse = new HttpResponse<Blob>({ body: new Blob(), headers: new HttpHeaders(), status: 200, statusText: 'OK' });
      spyOn(reportDownloadService, "downloadBackgroundReport").and.returnValue(of(mockResponse));
      spyOn(miscService, "downloadExcelFile");

      component.downloadReport(jobId);

      expect(reportDownloadService.downloadBackgroundReport).toHaveBeenCalledWith(jobId);
      expect(miscService.downloadExcelFile).toHaveBeenCalled();
    });

    it("should handle error", () => {
      const jobId = "123";
      spyOn(reportDownloadService, "downloadBackgroundReport").and.returnValue(throwError({}));
      spyOn(miscService, "downloadExcelFile");

      component.downloadReport(jobId);

      expect(reportDownloadService.downloadBackgroundReport).toHaveBeenCalledWith(jobId);
      expect(miscService.downloadExcelFile).not.toHaveBeenCalled();
    });
  });