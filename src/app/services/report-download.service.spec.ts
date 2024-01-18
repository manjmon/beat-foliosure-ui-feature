import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ReportDownloadService } from './report-download.service';

describe('ReportDownloadService', () => {
  let service: ReportDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportDownloadService,
      { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(ReportDownloadService);
  });

  it('can load instance', () => {
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
  describe('getReportTypes', () =>{
    it('spyOn getReportTypes', () =>{
      spyOn(service, 'getReportTypes').and.callThrough();
      service.getReportTypes();
      expect(service.getReportTypes).toHaveBeenCalled();
    })
  });
  describe('httpgetReportTypes',() => {
    it('http getReportTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        service.getReportTypes().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/get/download/report-types");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getInternalReportTemplates', () =>{
    it('spyOn getInternalReportTemplates', () =>{
      spyOn(service, 'getInternalReportTemplates').and.callThrough();
      service.getInternalReportTemplates();
      expect(service.getInternalReportTemplates).toHaveBeenCalled();
    })
  });
  describe('httpgetInternalReportTemplates',() => {
    it('http getInternalReportTemplates', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        service.getInternalReportTemplates().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/get/internal-report/templates");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getInternalReportCompanies', () =>{
    it('spyOn getInternalReportCompanies', () =>{
      const template = 'Demo company'
      spyOn(service, 'getInternalReportCompanies').and.callThrough();
      service.getInternalReportCompanies(template);
      expect(service.getInternalReportCompanies).toHaveBeenCalled();
    })
  });
  describe('httpgetInternalReportCompanies',() => {
    it('http getInternalReportCompanies', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        const template = 'Demo company'
        service.getInternalReportCompanies(template).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/internal-report/companies/template", template);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('downloadReport', () =>{
    it('spyOn downloadReport', () =>{
      const template = 'Demo company'
      spyOn(service, 'downloadReport').and.callThrough();
      service.downloadReport(template);
      expect(service.downloadReport).toHaveBeenCalled();
    })
  });
  describe('downloadConsolidatedReport', () =>{
    it('spyOn downloadConsolidatedReport', () =>{
      const template = 'Demo company'
      spyOn(service, 'downloadConsolidatedReport').and.callThrough();
      service.downloadConsolidatedReport(template);
      expect(service.downloadConsolidatedReport).toHaveBeenCalled();
    })
  });
  describe('downloadBackgroundReport', () =>{
    it('spyOn downloadBackgroundReport', () =>{
      const template = 'Demo company'
      spyOn(service, 'downloadBackgroundReport').and.callThrough();
      service.downloadBackgroundReport(template);
      expect(service.downloadBackgroundReport).toHaveBeenCalled();
    })
  });
  describe('getConsolidatedReportTemplates', () =>{
    it('spyOn getConsolidatedReportTemplates', () =>{
      spyOn(service, 'getConsolidatedReportTemplates').and.callThrough();
      service.getConsolidatedReportTemplates();
      expect(service.getConsolidatedReportTemplates).toHaveBeenCalled();
    })
  });
  describe('httpgetConsolidatedReportTemplates',() => {
    it('http getConsolidatedReportTemplates', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        service.getConsolidatedReportTemplates().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/get/consolidated-report/templates");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});