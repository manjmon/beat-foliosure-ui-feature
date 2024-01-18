import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { ReportService } from "./report.service";
import { Subject } from 'rxjs';

describe("ReportService", () => {
  let service: ReportService;
  let subjectMock: Subject<any>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService,{ provide: 'BASE_URL', useValue: 'http://localhost'}]  
    });
    service = TestBed.inject(ReportService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  it(`AttributionTypeList has default value`, () => {
    expect(service.AttributionTypeList).toEqual(service.AttributionTypeList);
  });

  it(`ReportTypeList has default value`, () => {
    expect(service.ReportTypeList).toEqual(service.ReportTypeList);
  });

  it(`ReportCategoryList has default value`, () => {
    expect(service.ReportCategoryList).toEqual(service.ReportCategoryList);
  });

  describe("getReportMasterData", () => {
    it("makes expected calls", () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      service.getReportMasterData().subscribe(res => {
        expect(res).toEqual({});
      });
  
      const req = httpTestingController.expectOne("http://localhostapi/report/master-report-model/get");
      expect(req.request.method).toEqual("GET");
      req.flush({}, {});
      httpTestingController.verify();
    });
  });

  
  describe("getReportData", () => {
    it("makes expected calls", () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      service.getReportData({}).subscribe(res => { // Pass an empty object as the argument
        expect(res).toEqual({});
      });
  
      const req = httpTestingController.expectOne("http://localhostapi/report/get");
      expect(req.request.method).toEqual("POST"); // Change this line
      req.flush({}, {});
      httpTestingController.verify();
    });
  });
});

