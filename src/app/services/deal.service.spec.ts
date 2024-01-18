import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { DealService } from "./deal.service";

describe("FilterService", () => {
  let service: DealService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DealService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(DealService);
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
  describe('getDealsList', () =>{
    it('spyOn getDealsList', () =>{
      let filter = 'test';
      spyOn(service, 'getDealsList').and.callThrough();
      service.getDealsList(filter);
      expect(service.getDealsList).toHaveBeenCalled();
    })
  });
  describe('http getDealsList',() => {
    it('http getDealsList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getDealsList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Deals/Get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getDealsPageConfiguration', () =>{
    it('spyOn getDealsPageConfiguration', () =>{
      let filter = 'test';
      spyOn(service, 'getDealsPageConfiguration').and.callThrough();
      service.getDealsPageConfiguration(filter);
      expect(service.getDealsPageConfiguration).toHaveBeenCalled();
    })
  });
  describe('http getDealsPageConfiguration',() => {
    it('http getDealsPageConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getDealsPageConfiguration(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/deal/get-deal-configuration", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getDealsQuery', () =>{
    it('spyOn getDealsQuery', () =>{
      let filter = 'test';
      spyOn(service, 'getDealsQuery').and.callThrough();
      service.getDealsQuery(filter);
      expect(service.getDealsQuery).toHaveBeenCalled();
    })
  });
  describe('http getDealsQuery',() => {
    it('http getDealsQuery', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getDealsQuery(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/deals/getAll", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getPortfolioCompanyFundHolding', () =>{
    it('spyOn getPortfolioCompanyFundHolding', () =>{
      let filter = 'test';
      spyOn(service, 'getPortfolioCompanyFundHolding').and.callThrough();
      service.getPortfolioCompanyFundHolding(filter);
      expect(service.getPortfolioCompanyFundHolding).toHaveBeenCalled();
    })
  });
  describe('http getPortfolioCompanyFundHolding',() => {
    it('http getPortfolioCompanyFundHolding', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getPortfolioCompanyFundHolding(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Deals/GetPortfolioCompanyFundHolding", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('saveDeal', () =>{
    it('spyOn saveDeal', () =>{
      let dealDetail = 'test';
      spyOn(service, 'saveDeal').and.callThrough();
      service.saveDeal(dealDetail);
      expect(service.saveDeal).toHaveBeenCalled();
    })
  });
  describe('http saveDeal',() => {
    it('http saveDeal', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let dealDetail = 'test';
        service.saveDeal(dealDetail).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Deals/Save", dealDetail);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('savePortfolioCompanyFundHolding', () =>{
    it('spyOn savePortfolioCompanyFundHolding', () =>{
      let portfolioCompanyFundHolding = 'test';
      spyOn(service, 'savePortfolioCompanyFundHolding').and.callThrough();
      service.savePortfolioCompanyFundHolding(portfolioCompanyFundHolding);
      expect(service.savePortfolioCompanyFundHolding).toHaveBeenCalled();
    })
  });
  describe('http savePortfolioCompanyFundHolding',() => {
    it('http savePortfolioCompanyFundHolding', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let portfolioCompanyFundHolding = 'test';
        service.savePortfolioCompanyFundHolding(portfolioCompanyFundHolding).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Deals/SavePortfolioCompanyFundHolding", portfolioCompanyFundHolding);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('savecustomPortfolioCompanyFundHolding', () =>{
    it('spyOn savecustomPortfolioCompanyFundHolding', () =>{
      let customFieldsData = 'test';
      spyOn(service, 'savecustomPortfolioCompanyFundHolding').and.callThrough();
      service.savecustomPortfolioCompanyFundHolding(customFieldsData);
      expect(service.savecustomPortfolioCompanyFundHolding).toHaveBeenCalled();
    })
  });
  describe('http savecustomPortfolioCompanyFundHolding',() => {
    it('http savecustomPortfolioCompanyFundHolding', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let customFieldsData = 'test';
        service.savecustomPortfolioCompanyFundHolding(customFieldsData).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Deals/SaveCustomPortfolioCompanyFundHolding", customFieldsData);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getDealsTradingRecordsEditAddConfiguration', () =>{
    it('spyOn getDealsTradingRecordsEditAddConfiguration', () =>{
      let portfolioCompanyFundHolding = 'test';
      spyOn(service, 'getDealsTradingRecordsEditAddConfiguration').and.callThrough();
      service.getDealsTradingRecordsEditAddConfiguration(portfolioCompanyFundHolding);
      expect(service.getDealsTradingRecordsEditAddConfiguration).toHaveBeenCalled();
    })
  });
  describe('http getDealsTradingRecordsEditAddConfiguration',() => {
    it('http getDealsTradingRecordsEditAddConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let portfolioCompanyFundHolding = 'test';
        service.getDealsTradingRecordsEditAddConfiguration(portfolioCompanyFundHolding).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/deal/get-dealtrackrecord-configuration", portfolioCompanyFundHolding);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getMasterDealModel', () =>{
    it('spyOn getMasterDealModel', () =>{
      spyOn(service, 'getMasterDealModel').and.callThrough();
      service.getMasterDealModel();
      expect(service.getMasterDealModel).toHaveBeenCalled();
    })
  });
  describe('http getMasterDealModel',() => {
    it('http getMasterDealModel', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getMasterDealModel().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/deal/master-data");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetMasterPortfolioFundHoldingModel', () =>{
    it('spyOn GetMasterPortfolioFundHoldingModel', () =>{
      spyOn(service, 'GetMasterPortfolioFundHoldingModel').and.callThrough();
      service.GetMasterPortfolioFundHoldingModel();
      expect(service.GetMasterPortfolioFundHoldingModel).toHaveBeenCalled();
    })
  });
  describe('http GetMasterPortfolioFundHoldingModel',() => {
    it('http GetMasterPortfolioFundHoldingModel', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.GetMasterPortfolioFundHoldingModel().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/master/FundHoldingStatus/get");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('deleteTrackRecord', () =>{
    it('spyOn deleteTrackRecord', () =>{
      let fundHoldingId = 45;
      let dealId = 23;
      spyOn(service, 'deleteTrackRecord').and.callThrough();
      service.deleteTrackRecord(dealId, fundHoldingId);
      expect(service.deleteTrackRecord).toHaveBeenCalled();
    })
  });
  describe('http deleteTrackRecord',() => {
    it('http deleteTrackRecord', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fundHoldingId = 45;
        let dealId = 23;
        service.deleteTrackRecord(dealId, fundHoldingId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/delete/fund-holding/"+dealId+"/"+fundHoldingId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('exportDealList', () =>{
    it('spyOn exportDealList', () =>{
      let filter = 23;
      spyOn(service, 'exportDealList').and.callThrough();
      service.exportDealList(filter);
      expect(service.exportDealList).toHaveBeenCalled();
    })
  });
  describe('GetPortfolioCompanyFundHolding', () =>{
    it('spyOn GetPortfolioCompanyFundHolding', () =>{
      let filter = 23;
      spyOn(service, 'GetPortfolioCompanyFundHolding').and.callThrough();
      service.GetPortfolioCompanyFundHolding(filter);
      expect(service.GetPortfolioCompanyFundHolding).toHaveBeenCalled();
    })
  });
  describe('getLatestDealQuarterYear', () =>{
    it('spyOn getLatestDealQuarterYear', () =>{
      spyOn(service, 'getLatestDealQuarterYear').and.callThrough();
      service.getLatestDealQuarterYear();
      expect(service.getLatestDealQuarterYear).toHaveBeenCalled();
    })
  });
  describe('http getLatestDealQuarterYear',() => {
    it('http getLatestDealQuarterYear', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getLatestDealQuarterYear().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/deal/latest-quarter-year");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFilterLatestDealQuarterYearCount', () =>{
    it('spyOn getFilterLatestDealQuarterYearCount', () =>{
      let filter = 'test';
      spyOn(service, 'getFilterLatestDealQuarterYearCount').and.callThrough();
      service.getFilterLatestDealQuarterYearCount(filter);
      expect(service.getFilterLatestDealQuarterYearCount).toHaveBeenCalled();
    })
  });
  describe('http getFilterLatestDealQuarterYearCount',() => {
    it('http getFilterLatestDealQuarterYearCount', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFilterLatestDealQuarterYearCount(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/deal/latest-quarter-year/count", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('exportDealNewTransaction', () =>{
    it('spyOn exportDealNewTransaction', () =>{
      let filter = 'test';
      spyOn(service, 'exportDealNewTransaction').and.callThrough();
      service.exportDealNewTransaction(filter);
      expect(service.exportDealNewTransaction).toHaveBeenCalled();
    })
  });
  describe('getDealDropDown', () =>{
    it('spyOn getDealDropDown', () =>{
      spyOn(service, 'getDealDropDown').and.callThrough();
      service.getDealDropDown();
      expect(service.getDealDropDown).toHaveBeenCalled();
    })
  });
  describe('http getDealDropDown',() => {
    it('http getDealDropDown', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getDealDropDown().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/deals/get/dealsDropDown");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});