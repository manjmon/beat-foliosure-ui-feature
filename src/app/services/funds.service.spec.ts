import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { FundService } from "./funds.service";

describe("FilterService", () => {
  let service: FundService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FundService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(FundService);
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
  describe('GetPortfolioCompanyFundHolding', () =>{
    it('spyOn GetPortfolioCompanyFundHolding', () =>{
      let filter = 'test';
      spyOn(service, 'GetPortfolioCompanyFundHolding').and.callThrough();
      service.GetPortfolioCompanyFundHolding(filter);
      expect(service.GetPortfolioCompanyFundHolding).toHaveBeenCalled();
    })
  });
  describe('getFundsList', () =>{
    it('spyOn getFundsList', () =>{
      let filter = 'test';
      spyOn(service, 'getFundsList').and.callThrough();
      service.getFundsList(filter);
      expect(service.getFundsList).toHaveBeenCalled();
    })
  });
  describe('http getFundsList',() => {
    it('http getFundsList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundsList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Funds/GetFunds", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFundsData', () =>{
    it('spyOn getFundsData', () =>{
      let filter = 'test';
      spyOn(service, 'getFundsData').and.callThrough();
      service.getFundsData(filter);
      expect(service.getFundsData).toHaveBeenCalled();
    })
  });
  describe('http getFundsData',() => {
    it('http getFundsData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundsData(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/fund/get/all", "");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFundsListQuery', () =>{
    it('spyOn getFundsListQuery', () =>{
      let filter = 'test';
      spyOn(service, 'getFundsListQuery').and.callThrough();
      service.getFundsListQuery(filter);
      expect(service.getFundsListQuery).toHaveBeenCalled();
    })
  });
  describe('http getFundsListQuery',() => {
    it('http getFundsListQuery', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundsListQuery(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/Funds/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFundData', () =>{
    it('spyOn getFundData', () =>{
      spyOn(service, 'getFundData').and.callThrough();
      service.getFundData();
      expect(service.getFundData).toHaveBeenCalled();
    })
  });
  describe('http getFundData',() => {
    it('http getFundData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getFundData().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/Fund/get", "");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFundNamesList', () =>{
    it('spyOn getFundNamesList', () =>{
      let filter = 'test';
      spyOn(service, 'getFundNamesList').and.callThrough();
      service.getFundNamesList(filter);
      expect(service.getFundNamesList).toHaveBeenCalled();
    })
  });
  describe('http getFundNamesList',() => {
    it('http getFundNamesList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundNamesList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/Funds/GetFundNames", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFundTrackRecordList', () =>{
    it('spyOn getFundTrackRecordList', () =>{
      let filter = 'test';
      spyOn(service, 'getFundTrackRecordList').and.callThrough();
      service.getFundTrackRecordList(filter);
      expect(service.getFundTrackRecordList).toHaveBeenCalled();
    })
  });
  describe('http getFundTrackRecordList',() => {
    it('http getFundTrackRecordList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundTrackRecordList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Funds/GetTrackRecordList", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFundById', () =>{
    it('spyOn getFundById', () =>{
      let fundId = 'test';
      spyOn(service, 'getFundById').and.callThrough();
      service.getFundById(fundId);
      expect(service.getFundById).toHaveBeenCalled();
    })
  });
  describe('http getFundById',() => {
    it('http getFundById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fundId = 'test';
        service.getFundById(fundId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/Funds/GetFunds", fundId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('createFund', () =>{
    it('spyOn createFund', () =>{
      let fundDetail = 'test';
      spyOn(service, 'createFund').and.callThrough();
      service.createFund(fundDetail);
      expect(service.createFund).toHaveBeenCalled();
    })
  });
  describe('http createFund',() => {
    it('http createFund', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fundDetail = 'test';
        service.createFund(fundDetail).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/Funds/CreateFund", fundDetail);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('updateFund', () =>{
    it('spyOn updateFund', () =>{
      let fundDetail = 'test';
      spyOn(service, 'updateFund').and.callThrough();
      service.updateFund(fundDetail);
      expect(service.updateFund).toHaveBeenCalled();
    })
  });
  describe('http updateFund',() => {
    it('http updateFund', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fundDetail = 'test';
        service.updateFund(fundDetail).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/Funds/CreateFund", fundDetail);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('saveFundTrackRecord', () =>{
    it('spyOn saveFundTrackRecord', () =>{
      let fundDetail = 'test';
      spyOn(service, 'saveFundTrackRecord').and.callThrough();
      service.saveFundTrackRecord(fundDetail);
      expect(service.saveFundTrackRecord).toHaveBeenCalled();
    })
  });
  describe('http saveFundTrackRecord',() => {
    it('http saveFundTrackRecord', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fundDetail = 'test';
        service.saveFundTrackRecord(fundDetail).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Funds/SaveFundTrackRecord", fundDetail);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFundTrackRecordConfiguration', () =>{
    it('spyOn getFundTrackRecordConfiguration', () =>{
      let fundDetail = 'test';
      spyOn(service, 'getFundTrackRecordConfiguration').and.callThrough();
      service.getFundTrackRecordConfiguration(fundDetail);
      expect(service.getFundTrackRecordConfiguration).toHaveBeenCalled();
    })
  });
  describe('http getFundTrackRecordConfiguration',() => {
    it('http getFundTrackRecordConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fundDetail = 'test';
        service.getFundTrackRecordConfiguration(fundDetail).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/fund/get-fundtrackrecord-configuration", fundDetail);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getMasterFundModel', () =>{
    it('spyOn getMasterFundModel', () =>{
      spyOn(service, 'getMasterFundModel').and.callThrough();
      service.getMasterFundModel();
      expect(service.getMasterFundModel).toHaveBeenCalled();
    })
  });
  describe('http getMasterFundModel',() => {
    it('http getMasterFundModel', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getMasterFundModel().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +  "api/Funds/master-model");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getInvestors', () =>{
    it('spyOn getInvestors', () =>{
      spyOn(service, 'getInvestors').and.callThrough();
      service.getInvestors();
      expect(service.getInvestors).toHaveBeenCalled();
    })
  });
  describe('http getInvestors',() => {
    it('http getInvestors', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getInvestors().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +  "getAll/investor","");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFundInvestors', () =>{
    it('spyOn getFundInvestors', () =>{
      let id = 12;
      spyOn(service, 'getFundInvestors').and.callThrough();
      service.getFundInvestors(id);
      expect(service.getFundInvestors).toHaveBeenCalled();
    })
  });
  describe('http getFundInvestors',() => {
    it('http getFundInvestors', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let id = 23;
        const url = `${service.myAppUrl}get/investor/${id}`;
        service.getFundInvestors(id).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne( url,"");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('exportFundList', () =>{
    it('spyOn exportFundList', () =>{
      let filter = 'test';
      spyOn(service, 'exportFundList').and.callThrough();
      service.exportFundList(filter);
      expect(service.exportFundList).toHaveBeenCalled();
    })
  });
  describe('downloadFile', () =>{
    it('spyOn downloadFile', () =>{
      let filter = 'test';
      spyOn(service, 'downloadFile').and.callThrough();
      service.downloadFile(filter);
      expect(service.downloadFile).toHaveBeenCalled();
    })
  });
  describe('getFundsListData', () =>{
    it('spyOn getFundsListData', () =>{
      let filter = 'test';
      spyOn(service, 'getFundsListData').and.callThrough();
      service.getFundsListData(filter);
      expect(service.getFundsListData).toHaveBeenCalled();
    })
  });
  describe('http getFundsListData',() => {
    it('http getFundsListData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFundsListData(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Funds/getFundList", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});