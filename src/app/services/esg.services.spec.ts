import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { EsgService } from "./esg.services";

describe("EsgService", () => {
  let service: EsgService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EsgService, 
        { provide: Router, useFactory: routerStub},
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.get(EsgService);
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
  describe('addFirm', () =>{
    it('spyOn addFirm', () =>{
      let pcId = 'test';
      spyOn(service, 'getEsgDashboardData').and.callThrough();
      service.getEsgDashboardData(pcId);
      expect(service.getEsgDashboardData).toHaveBeenCalled();
    })
  });
  describe('http getEsgDashboardData',() => {
    it('http getEsgDashboardData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let pcId = 'test';
        service.getEsgDashboardData(pcId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "api/esg/dashboard/data?encryptedPortfolioCompanyId="+ pcId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getEsgbarData', () =>{
    it('spyOn getEsgbarData', () =>{
      let filter = 'test';
      spyOn(service, 'getEsgbarData').and.callThrough();
      service.getEsgbarData(filter);
      expect(service.getEsgbarData).toHaveBeenCalled();
    })
  });
  describe('http getEsgbarData',() => {
    it('http getEsgbarData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getEsgbarData(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"api/esg/getEsgBar/data", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getCompanyKpiValueByEsgModuleId', () =>{
    it('spyOn getCompanyKpiValueByEsgModuleId', () =>{
      let filter = 'test';
      spyOn(service, 'getCompanyKpiValueByEsgModuleId').and.callThrough();
      service.getCompanyKpiValueByEsgModuleId(filter);
      expect(service.getCompanyKpiValueByEsgModuleId).toHaveBeenCalled();
    })
  });
  describe('http getCompanyKpiValueByEsgModuleId',() => {
    it('http getCompanyKpiValueByEsgModuleId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getCompanyKpiValueByEsgModuleId(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"api/esg/kpidetailsbyid/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('setselectedSubpageData', () =>{
    it('spyOn setselectedSubpageData', () =>{
      let filter = 'test';
      spyOn(service, 'setselectedSubpageData').and.callThrough();
      service.setselectedSubpageData(filter);
      expect(service.setselectedSubpageData).toHaveBeenCalled();
    })
  });
  describe('getSelectData', () =>{
    it('spyOn getSelectData', () =>{
      spyOn(service, 'getSelectData').and.callThrough();
      service.getSelectData();
      expect(service.getSelectData).toHaveBeenCalled();
    })
  });
});
