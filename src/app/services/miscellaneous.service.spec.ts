import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { MiscellaneousService } from "./miscellaneous.service";
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";



describe("MiscellaneousService", () => {
  let service: MiscellaneousService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, MatMenuModule],
      providers: [MiscellaneousService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(MiscellaneousService);
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
  describe('GetLocationListByCountryId', () =>{
    it('spyOn GetLocationListByCountryId', () =>{
      let countryId = '23252adaf';
      spyOn(service, 'GetLocationListByCountryId').and.callThrough();
      service.GetLocationListByCountryId(countryId);
      expect(service.GetLocationListByCountryId).toHaveBeenCalled();
    })
  });
  describe('http GetLocationListByCountryId',() => {
    it('http GetLocationListByCountryId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let countryId = '23252adaf';
        service.GetLocationListByCountryId(countryId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/master/GetLocationListByCountry", {
          value: "" + countryId + "",
        });
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('GetLocationListByStateId', () =>{
    it('spyOn GetLocationListByStateId', () =>{
      let stateId = '23252adaf';
      spyOn(service, 'GetLocationListByStateId').and.callThrough();
      service.GetLocationListByStateId(stateId);
      expect(service.GetLocationListByStateId).toHaveBeenCalled();
    })
  });
  describe('http GetLocationListByStateId',() => {
    it('http GetLocationListByStateId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let stateId = '23252adaf';
        service.GetLocationListByStateId(stateId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/master/GetLocationListByState", {
          value: "" + stateId + "",
        });
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanySubKpiList', () =>{
    it('spyOn getCompanySubKpiList', () =>{
      let portfolioCompanyId = '23252adaf';
      spyOn(service, 'getCompanySubKpiList').and.callThrough();
      service.getCompanySubKpiList(portfolioCompanyId);
      expect(service.getCompanySubKpiList).toHaveBeenCalled();
    })
  });
  describe('http getCompanySubKpiList',() => {
    it('http getCompanySubKpiList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let portfolioCompanyId = '23252adaf';
        service.getCompanySubKpiList(portfolioCompanyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/company-subkpi/get", {
          value: portfolioCompanyId,
        })
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFinancialKpiById', () =>{
    it('spyOn getFinancialKpiById', () =>{
      let kpiId = '23252adaf';
      spyOn(service, 'getFinancialKpiById').and.callThrough();
      service.getFinancialKpiById(kpiId);
      expect(service.getFinancialKpiById).toHaveBeenCalled();
    })
  });
  describe('http getFinancialKpiById',() => {
    it('http getFinancialKpiById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let kpiId = '23252adaf';
        service.getFinancialKpiById(kpiId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/financial-kpi/by-id", { value: kpiId })
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getOperationalKpiById', () =>{
    it('spyOn getOperationalKpiById', () =>{
      let kpiId = '23252adaf';
      spyOn(service, 'getOperationalKpiById').and.callThrough();
      service.getOperationalKpiById(kpiId);
      expect(service.getOperationalKpiById).toHaveBeenCalled();
    })
  });
  describe('http getOperationalKpiById',() => {
    it('http getOperationalKpiById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let kpiId = '23252adaf';
        service.getOperationalKpiById(kpiId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/operational-kpi/by-id", { value: kpiId })
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getSectorwiseKpiById', () =>{
    it('spyOn getSectorwiseKpiById', () =>{
      let kpiId = '23252adaf';
      spyOn(service, 'getSectorwiseKpiById').and.callThrough();
      service.getSectorwiseKpiById(kpiId);
      expect(service.getSectorwiseKpiById).toHaveBeenCalled();
    })
  });
  describe('http getSectorwiseKpiById',() => {
    it('http getSectorwiseKpiById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let kpiId = '23252adaf';
        service.getSectorwiseKpiById(kpiId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/sectorwise-kpi/by-id", { value: kpiId })
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getInvestmentKPI', () =>{
    it('spyOn getInvestmentKPI', () =>{
      let filter = {
        paginationFilter : 'testing'
      };
      spyOn(service, 'getInvestmentKPI').and.callThrough();
      service.getInvestmentKPI(filter);
      expect(service.getInvestmentKPI).toHaveBeenCalled();
    })
  });
  describe('http getInvestmentKPI',() => {
    it('http getInvestmentKPI', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = {
          paginationFilter : 'testing'
        };
        service.getInvestmentKPI(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/investment-kpis/get", filter)
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getImpactKPI', () =>{
    it('spyOn getImpactKPI', () =>{
      let filter = {
        paginationFilter : 'testing'
      };
      spyOn(service, 'getImpactKPI').and.callThrough();
      service.getImpactKPI(filter);
      expect(service.getImpactKPI).toHaveBeenCalled();
    })
  });
  describe('http getImpactKPI',() => {
    it('http getImpactKPI', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = {
          paginationFilter : 'testing'
        };
        service.getImpactKPI(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/impact-kpis/get", filter)
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyKpiById', () =>{
    it('spyOn getCompanyKpiById', () =>{
      let kpiId = '23252adaf';
      spyOn(service, 'getCompanyKpiById').and.callThrough();
      service.getCompanyKpiById(kpiId);
      expect(service.getCompanyKpiById).toHaveBeenCalled();
    })
  });
  describe('http getCompanyKpiById',() => {
    it('http getCompanyKpiById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let kpiId = '23252adaf';
        service.getCompanyKpiById(kpiId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/company-kpi/by-id", { value: kpiId })
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});