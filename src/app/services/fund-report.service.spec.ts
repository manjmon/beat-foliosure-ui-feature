import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { FundReportService } from "./fund-report.service";

describe("fundReportService", () => {
  let service: FundReportService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FundReportService,
        { provide: Router, useFactory: routerStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.inject(FundReportService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
  describe('errorHandler', () =>{
    it('spyOn errorHandler', () =>{
      let error = 'Errors occured'
      spyOn(service, 'errorHandler').and.callThrough();
      service.errorHandler(error);
      expect(service.errorHandler).toHaveBeenCalled();
    })
  });
  describe('getFundReportTemplates', () =>{
    it('spyOn getFundReportTemplates', () =>{
      spyOn(service, 'getFundReportTemplates').and.callThrough();
      service.getFundReportTemplates();
      expect(service.getFundReportTemplates).toHaveBeenCalled();
    })
  });
  describe('http getFundReportTemplates',() => {
    it('http getFundReportTemplates', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        service.getFundReportTemplates().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/reportTemplate/fund/templateList");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('fundtemplateConfig', () =>{
    it('spyOn fundtemplateConfig', () =>{
      let templateObj = 'test';
      spyOn(service, 'fundtemplateConfig').and.callThrough();
      service.fundtemplateConfig(templateObj);
      expect(service.fundtemplateConfig).toHaveBeenCalled();
    })
  });
  describe('http fundtemplateConfig',() => {
    it('http fundtemplateConfig', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        let templateObj = 'test';
        service.fundtemplateConfig(templateObj).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/reportTemplate/fund/configurationSettings", templateObj);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('saveFundTemplate', () =>{
    it('spyOn saveFundTemplate', () =>{
      let templateObj = 'test';
      spyOn(service, 'saveFundTemplate').and.callThrough();
      service.saveFundTemplate(templateObj);
      expect(service.saveFundTemplate).toHaveBeenCalled();
    })
  });
  describe('http saveFundTemplate',() => {
    it('http saveFundTemplate', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        let templateObj = 'test';
        service.saveFundTemplate(templateObj).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/reportTemplate/fund/save", templateObj);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getLoadFundReportTemplates', () =>{
    it('spyOn getLoadFundReportTemplates', () =>{
      let templateId = 23;
      spyOn(service, 'getLoadFundReportTemplates').and.callThrough();
      service.getLoadFundReportTemplates(templateId);
      expect(service.getLoadFundReportTemplates).toHaveBeenCalled();
    })
  });
  describe('http getLoadFundReportTemplates',() => {
    it('http getLoadFundReportTemplates', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        let templateId = 23;
        service.getLoadFundReportTemplates(templateId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + `api/reportTemplate/fund/fundTemplateDetails/${templateId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('fundReportGraphs', () =>{
    it('spyOn fundReportGraphs', () =>{
      let fundId = 23;
      spyOn(service, 'fundReportGraphs').and.callThrough();
      service.fundReportGraphs(fundId);
      expect(service.fundReportGraphs).toHaveBeenCalled();
    })
  });
  describe('http fundReportGraphs',() => {
    it('http fundReportGraphs', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
        const expected = 'Reportedone';
        let fundId = 23;
        service.fundReportGraphs(fundId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + `api/reportTemplate/fund/fundreportGraphDetails/${fundId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});