import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { DataAnalyticsService } from "./data-analytics.service";

describe("DocumentService", () => {
  let service: DataAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataAnalyticsService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(DataAnalyticsService);
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
  describe('getDataAnalyticsList', () =>{
    it('spyOn getDataAnalyticsList', () =>{
      const isCustom = true;
      spyOn(service, 'getDataAnalyticsList').and.callThrough();
      service.getDataAnalyticsList(isCustom);
      expect(service.getDataAnalyticsList).toHaveBeenCalled();
    })
  });
  describe('http getDataAnalyticsList',() => {
    it('http getDataAnalyticsList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        const isCustom = true;
        service.getDataAnalyticsList(isCustom).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +  "api/dataAnalytics/get/" + isCustom);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetAllFilterData', () =>{
    it('spyOn GetAllFilterData', () =>{
      spyOn(service, 'GetAllFilterData').and.callThrough();
      service.GetAllFilterData();
      expect(service.GetAllFilterData).toHaveBeenCalled();
    })
  });
  describe('http GetAllFilterData',() => {
    it('http GetAllFilterData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.GetAllFilterData().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +  "api/data-analytics/filters",{});
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetCompanies', () =>{
    it('spyOn GetCompanies', () =>{
        let filter = 'test';
      spyOn(service, 'GetCompanies').and.callThrough();
      service.GetCompanies(filter);
      expect(service.GetCompanies).toHaveBeenCalled();
    })
  });
  describe('http GetCompanies',() => {
    it('http GetCompanies', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.GetCompanies(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +  "api/data-analytics/filters/companies", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetFundsByInvestor', () =>{
    it('spyOn GetFundsByInvestor', () =>{
        let filter = 'test';
      spyOn(service, 'GetFundsByInvestor').and.callThrough();
      service.GetFundsByInvestor(filter);
      expect(service.GetFundsByInvestor).toHaveBeenCalled();
    })
  });
  describe('http GetFundsByInvestor',() => {
    it('http GetFundsByInvestor', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.GetFundsByInvestor(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +  "api/data-analytics/filters/funds", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getInvestorsList', () =>{
    it('spyOn getInvestorsList', () =>{
      spyOn(service, 'getInvestorsList').and.callThrough();
      service.getInvestorsList();
      expect(service.getInvestorsList).toHaveBeenCalled();
    })
  });
  describe('http getInvestorsList',() => {
    it('http getInvestorsList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getInvestorsList().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/data-analytics/filters/investors");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetKpisByModuleId', () =>{
    it('spyOn GetKpisByModuleId', () =>{
        let filter = 'test';
      spyOn(service, 'GetKpisByModuleId').and.callThrough();
      service.GetKpisByModuleId(filter);
      expect(service.GetKpisByModuleId).toHaveBeenCalled();
    })
  });
  describe('http GetKpisByModuleId',() => {
    it('http GetKpisByModuleId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.GetKpisByModuleId(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +  "api/data-analytics/filters/kpis", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});