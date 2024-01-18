import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { ClientReportingService } from "./client-reporting.service";

describe("ClientReportingService", () => {
  let service: ClientReportingService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClientReportingService,
        { provide: Router, useFactory: routerStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.get(ClientReportingService);
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
  describe('getUnstructerDataByPortfolioCompanyId', () =>{
    it('spyOn getUnstructerDataByPortfolioCompanyId', () =>{
      let portfolioCompanyId = 'test';
      let guId = 123;
      spyOn(service, 'getUnstructerDataByPortfolioCompanyId').and.callThrough();
      service.getUnstructerDataByPortfolioCompanyId(portfolioCompanyId,guId);
      expect(service.getUnstructerDataByPortfolioCompanyId).toHaveBeenCalled();
    })
  });
  describe('http addFirm',() => {
    it('http addFirm', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let portfolioCompanyId = 'test';
        let guId = 123;
        service.getUnstructerDataByPortfolioCompanyId(portfolioCompanyId, guId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/UnstructuredHistory/GetUnstructuredList/" + portfolioCompanyId+"/"+guId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getTabsByPortfolioCompanyId', () =>{
    it('spyOn getTabsByPortfolioCompanyId', () =>{
      let portfolioCompanyId = 'test';
      spyOn(service, 'getTabsByPortfolioCompanyId').and.callThrough();
      service.getTabsByPortfolioCompanyId(portfolioCompanyId);
      expect(service.getTabsByPortfolioCompanyId).toHaveBeenCalled();
    })
  });
  describe('http addFirm',() => {
    it('http addFirm', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let portfolioCompanyId = 'test';
        service.getTabsByPortfolioCompanyId(portfolioCompanyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/UnstructuredHistory/GetClientReportTabs/" + portfolioCompanyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getTabs', () =>{
    it('spyOn getTabs', () =>{
      let filter = 'test';
      spyOn(service, 'getTabs').and.callThrough();
      service.getTabs(filter);
      expect(service.getTabs).toHaveBeenCalled();
    })
  });
  describe('http getTabs',() => {
    it('http getTabs', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getTabs(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/UnstructuredHistory/GetClientReportTabs", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getPeriodTypes', () =>{
    it('spyOn getPeriodTypes', () =>{
      let portfolioCompanyId = 'test';
      spyOn(service, 'getPeriodTypes').and.callThrough();
      service.getPeriodTypes(portfolioCompanyId);
      expect(service.getPeriodTypes).toHaveBeenCalled();
    })
  });
  describe('http getPeriodTypes',() => {
    it('http getPeriodTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let portfolioCompanyId = 'test';
        service.getPeriodTypes(portfolioCompanyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/UnstructuredHistory/adhoc-periodTypes/" + portfolioCompanyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('exportReports', () =>{
    it('spyOn exportReports', () =>{
      let filter = 'test';
      spyOn(service, 'exportReports').and.callThrough();
      service.exportReports(filter);
      expect(service.exportReports).toHaveBeenCalled();
    })
  });
});