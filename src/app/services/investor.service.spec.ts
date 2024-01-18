import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { InvestorService } from './investor.service';

describe('investorService', () => {
  let service: InvestorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InvestorService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(InvestorService);
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
  describe('getInvestorAddEditConfiuration', () =>{
    it('spyOn getInvestorAddEditConfiuration', () =>{
      let filter = 'test';
      spyOn(service, 'getInvestorAddEditConfiuration').and.callThrough();
      service.getInvestorAddEditConfiuration(filter);
      expect(service.getInvestorAddEditConfiuration).toHaveBeenCalled();
    })
  });
  describe('http getInvestorAddEditConfiuration',() => {
    it('http getInvestorAddEditConfiuration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getInvestorAddEditConfiuration(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "get/investor/configuration", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getMasterGeoLocations', () =>{
    it('spyOn getMasterGeoLocations', () =>{
      spyOn(service, 'getMasterGeoLocations').and.callThrough();
      service.getMasterGeoLocations();
      expect(service.getMasterGeoLocations).toHaveBeenCalled();
    })
  });
  describe('http getMasterGeoLocations',() => {
    it('http getMasterGeoLocations', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getMasterGeoLocations().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "get/investor/locations");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('investorAddEdit', () =>{
    it('spyOn investorAddEdit', () =>{
      let model = 'test';
      spyOn(service, 'investorAddEdit').and.callThrough();
      service.investorAddEdit(model);
      expect(service.investorAddEdit).toHaveBeenCalled();
    })
  });
  describe('http investorAddEdit',() => {
    it('http investorAddEdit', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let model = 'test';
        service.investorAddEdit(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "investor/save", model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getinvestorlist', () =>{
    it('spyOn getinvestorlist', () =>{
      let filter = 'test';
      spyOn(service, 'getinvestorlist').and.callThrough();
      service.getinvestorlist(filter);
      expect(service.getinvestorlist).toHaveBeenCalled();
    })
  });
  describe('http getinvestorlist',() => {
    it('http getinvestorlist', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getinvestorlist(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "investor/getInvestorList", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFundsByInvestor', () =>{
    it('spyOn getFundsByInvestor', () =>{
      let encryptedId = 'test232424242dafa4q4';
      spyOn(service, 'getFundsByInvestor').and.callThrough();
      service.getFundsByInvestor(encryptedId);
      expect(service.getFundsByInvestor).toHaveBeenCalled();
    })
  });
  describe('getInvestorStakeTitle', () =>{
    it('spyOn getInvestorStakeTitle', () =>{
      spyOn(service, 'getInvestorStakeTitle').and.callThrough();
      service.getInvestorStakeTitle();
      expect(service.getInvestorStakeTitle).toHaveBeenCalled();
    })
  });
  describe('getInvestorByValuationTableSelection', () =>{
    it('spyOn getInvestorByValuationTableSelection', () =>{
      let filter = 'test';
      spyOn(service, 'getInvestorByValuationTableSelection').and.callThrough();
      service.getInvestorByValuationTableSelection(filter);
      expect(service.getInvestorByValuationTableSelection).toHaveBeenCalled();
    })
  });
  describe('http getInvestorByValuationTableSelection',() => {
    it('http getInvestorByValuationTableSelection', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getInvestorByValuationTableSelection(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "investor/get/Valuationtable/selections", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getInvestorById', () =>{
    it('spyOn getInvestorById', () =>{
      let filter = 'test';
      spyOn(service, 'getInvestorById').and.callThrough();
      service.getInvestorById(filter);
      expect(service.getInvestorById).toHaveBeenCalled();
    })
  });
  describe('http getInvestorById',() => {
    it('http getInvestorById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getInvestorById(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +  "investor/getInvestorDetails", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFundInvestorsById', () =>{
    it('spyOn getFundInvestorsById', () =>{
      let filter = 'test';
      spyOn(service, 'getFundInvestorsById').and.callThrough();
      service.getFundInvestorsById(filter);
      expect(service.getFundInvestorsById).toHaveBeenCalled();
    })
  });
  describe('http getFundInvestorsById',() => {
    it('http getFundInvestorsById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundInvestorsById(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "get/investor/investor-funds", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFundInvestorTrackRecord', () =>{
    it('spyOn getFundInvestorTrackRecord', () =>{
      let model = 'test';
      spyOn(service, 'getFundInvestorTrackRecord').and.callThrough();
      service.getFundInvestorTrackRecord(model);
      expect(service.getFundInvestorTrackRecord).toHaveBeenCalled();
    })
  });
  describe('http getFundInvestorTrackRecord',() => {
    it('http getFundInvestorTrackRecord', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let model = 'test';
        service.getFundInvestorTrackRecord(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "get/investor/fund-track-record", model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getInvestorDashBoard', () =>{
    it('spyOn getInvestorDashBoard', () =>{
      let filter = 'test';
      spyOn(service, 'getInvestorDashBoard').and.callThrough();
      service.getInvestorDashBoard(filter);
      expect(service.getInvestorDashBoard).toHaveBeenCalled();
    })
  });
  describe('http getInvestorDashBoard',() => {
    it('http getInvestorDashBoard', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getInvestorDashBoard(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"investor/getInvestorDashboardDetails", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFundInvestorWiseDealTrackRecord', () =>{
    it('spyOn getFundInvestorWiseDealTrackRecord', () =>{
      let filter = 'test';
      spyOn(service, 'getFundInvestorWiseDealTrackRecord').and.callThrough();
      service.getFundInvestorWiseDealTrackRecord(filter);
      expect(service.getFundInvestorWiseDealTrackRecord).toHaveBeenCalled();
    })
  });
  describe('http getFundInvestorWiseDealTrackRecord',() => {
    it('http getFundInvestorWiseDealTrackRecord', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundInvestorWiseDealTrackRecord(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "investor/get/company-details", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyPerformanceData', () =>{
    it('spyOn getCompanyPerformanceData', () =>{
      let filter = 'test';
      spyOn(service, 'getCompanyPerformanceData').and.callThrough();
      service.getCompanyPerformanceData(filter);
      expect(service.getCompanyPerformanceData).toHaveBeenCalled();
    })
  });
  describe('http getCompanyPerformanceData',() => {
    it('http getCompanyPerformanceData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getCompanyPerformanceData(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "get/investor/company-performance", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFundInvestorWiseValuationTable', () =>{
    it('spyOn getFundInvestorWiseValuationTable', () =>{
      let filter = 'test';
      spyOn(service, 'getFundInvestorWiseValuationTable').and.callThrough();
      service.getFundInvestorWiseValuationTable(filter);
      expect(service.getFundInvestorWiseValuationTable).toHaveBeenCalled();
    })
  });
  describe('http getFundInvestorWiseValuationTable',() => {
    it('http getFundInvestorWiseValuationTable', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundInvestorWiseValuationTable(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "investor/get/Valuation-table", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyPerformanceCompanyMasterList', () =>{
    it('spyOn getCompanyPerformanceCompanyMasterList', () =>{
      let filter = 'test';
      spyOn(service, 'getCompanyPerformanceCompanyMasterList').and.callThrough();
      service.getCompanyPerformanceCompanyMasterList(filter);
      expect(service.getCompanyPerformanceCompanyMasterList).toHaveBeenCalled();
    })
  });
  describe('http getCompanyPerformanceCompanyMasterList',() => {
    it('http getCompanyPerformanceCompanyMasterList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getCompanyPerformanceCompanyMasterList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "get/investor/company-performance/masterCompanyList", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getAllInvestorsList', () =>{
    it('spyOn getAllInvestorsList', () =>{
      spyOn(service, 'getAllInvestorsList').and.callThrough();
      service.getAllInvestorsList();
      expect(service.getAllInvestorsList).toHaveBeenCalled();
    })
  });
  describe('http getAllInvestorsList',() => {
    it('http getAllInvestorsList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getAllInvestorsList().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "investor/get/fillInvestors");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});