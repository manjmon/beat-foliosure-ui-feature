import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PortfolioCompanyService } from "./portfolioCompany.service";

describe('PortfolioCompanyService', () => {
  let service: PortfolioCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PortfolioCompanyService,
        { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.inject(PortfolioCompanyService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
  describe('errorHandler',()=>{
    it('should spy on', () =>{
      const value = true;
      spyOn(service, 'errorHandler').and.callThrough();
      service.errorHandler(value)
      expect(service.errorHandler).toHaveBeenCalled();
    });
   })
   describe('addPortfolioCompany',()=>{
    it('should spy on addPortfolioCompany', () =>{
      let portfoliocompany = 'test';
      spyOn(service, 'addPortfolioCompany').and.callThrough();
      service.addPortfolioCompany(portfoliocompany);
      expect(service.addPortfolioCompany).toHaveBeenCalled();
    });
   });
   describe('http addPortfolioCompany',() => {
    it('http addPortfolioCompany', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let portfoliocompany = 'test';
        service.addPortfolioCompany(portfoliocompany).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfolio-company/add", portfoliocompany);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('pdfExport',()=>{
    it('should spy on pdfExport', () =>{
      let formData = 'test';
      spyOn(service, 'pdfExport').and.callThrough();
      service.pdfExport(formData);
      expect(service.pdfExport).toHaveBeenCalled();
    });
   });
   describe('updatePortfolioCompany',()=>{
    it('should spy on updatePortfolioCompany', () =>{
      let portfoliocompany = 'test';
      spyOn(service, 'updatePortfolioCompany').and.callThrough();
      service.updatePortfolioCompany(portfoliocompany);
      expect(service.updatePortfolioCompany).toHaveBeenCalled();
    });
   });
   describe('http updatePortfolioCompany',() => {
    it('http updatePortfolioCompany', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let portfoliocompany = 'test';
        service.updatePortfolioCompany(portfoliocompany).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfolio-company/add", portfoliocompany);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyList',()=>{
    it('should spy on getPortfolioCompanyList', () =>{
      let filter = 'test';
      spyOn(service, 'getPortfolioCompanyList').and.callThrough();
      service.getPortfolioCompanyList(filter);
      expect(service.getPortfolioCompanyList).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyList',() => {
    it('http getPortfolioCompanyList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPortfolioCompanyList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfoliocompany/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompany',()=>{
    it('should spy on getPortfolioCompany', () =>{
      spyOn(service, 'getPortfolioCompany').and.callThrough();
      service.getPortfolioCompany();
      expect(service.getPortfolioCompany).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompany',() => {
    it('http getPortfolioCompany', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.getPortfolioCompany().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/company/get",'');
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyByGroup',()=>{
    it('should spy on getPortfolioCompanyByGroup', () =>{
      let event = 'test';
      spyOn(service, 'getPortfolioCompanyByGroup').and.callThrough();
      service.getPortfolioCompanyByGroup(event);
      expect(service.getPortfolioCompanyByGroup).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyByGroup',() => {
    it('http getPortfolioCompanyByGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let event = 'test';
        service.getPortfolioCompanyByGroup(event).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/companies/get",event);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getReportsType',()=>{
    it('should spy on getReportsType', () =>{
      spyOn(service, 'getReportsType').and.callThrough();
      service.getReportsType();
      expect(service.getReportsType).toHaveBeenCalled();
    });
   });
   describe('http getReportsType',() => {
    it('http getReportsType', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.getReportsType().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/workflow/reporttypes/get");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getWorkflowMappingStatusByUserId',()=>{
    it('should spy on getWorkflowMappingStatusByUserId', () =>{
      spyOn(service, 'getWorkflowMappingStatusByUserId').and.callThrough();
      service.getWorkflowMappingStatusByUserId();
      expect(service.getWorkflowMappingStatusByUserId).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowMappingStatusByUserId',() => {
    it('http getWorkflowMappingStatusByUserId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.getWorkflowMappingStatusByUserId().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/workflow/mappingstatusbyuserid/get");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getLpReportConfiguration',()=>{
    it('should spy on getLpReportConfiguration', () =>{
      let fundId = 'test';
      spyOn(service, 'getLpReportConfiguration').and.callThrough();
      service.getLpReportConfiguration(fundId);
      expect(service.getLpReportConfiguration).toHaveBeenCalled();
    });
   });
   describe('http getLpReportConfiguration',() => {
    it('http getLpReportConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let fundId = 'test';
        service.getLpReportConfiguration(fundId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/getLpReportConfiguration/${fundId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateLpReportConfiguration',()=>{
    it('should spy on updateLpReportConfiguration', () =>{
      let fundId = 'test';
      let model = 'testing';
      spyOn(service, 'updateLpReportConfiguration').and.callThrough();
      service.updateLpReportConfiguration(fundId, model);
      expect(service.updateLpReportConfiguration).toHaveBeenCalled();
    });
   });
   describe('http updateLpReportConfiguration',() => {
    it('http updateLpReportConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let fundId = 'test';
        let model = 'testing';
        service.updateLpReportConfiguration(fundId, model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/updateLPReportConfig/${fundId}`, model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('createDraft',()=>{
    it('should spy on createDraft', () =>{
      let model = 'test';
      spyOn(service, 'createDraft').and.callThrough();
      service.createDraft(model);
      expect(service.createDraft).toHaveBeenCalled();
    });
   });
   describe('http createDraft',() => {
    it('http createDraft', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let model = 'test';
        service.createDraft(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ 'api/workflow/draft', model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyProfitabilityList',()=>{
    it('should spy on getPortfolioCompanyProfitabilityList', () =>{
      let model = 'test';
      spyOn(service, 'getPortfolioCompanyProfitabilityList').and.callThrough();
      service.getPortfolioCompanyProfitabilityList(model);
      expect(service.getPortfolioCompanyProfitabilityList).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyProfitabilityList',() => {
    it('http getPortfolioCompanyProfitabilityList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let model = 'test';
        service.getPortfolioCompanyProfitabilityList(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfoliocompany/getProfitability", model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyById',()=>{
    it('should spy on getPortfolioCompanyById', () =>{
      let id = 'test';
      spyOn(service, 'getPortfolioCompanyById').and.callThrough();
      service.getPortfolioCompanyById(id);
      expect(service.getPortfolioCompanyById).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyById',() => {
    it('http getPortfolioCompanyById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let id = 'test';
        service.getPortfolioCompanyById(id).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfoliocompany/getbyid", id);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyDraftById',()=>{
    it('should spy on getPortfolioCompanyDraftById', () =>{
      let workflowRequestId = 'test';
      let companyId = 'test';
      spyOn(service, 'getPortfolioCompanyDraftById').and.callThrough();
      service.getPortfolioCompanyDraftById(companyId, workflowRequestId);
      expect(service.getPortfolioCompanyDraftById).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyDraftById',() => {
    it('http getPortfolioCompanyById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workflowRequestId = 'test';
        let companyId = 'testing';
        let getCompanyDraftendPoint = `${service.myAppUrl}api/portfoliocompany/draft/getbyid/${companyId}/${workflowRequestId}`;
        service.getPortfolioCompanyDraftById(companyId, workflowRequestId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(getCompanyDraftendPoint, "");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getMasterPCModel',()=>{
    it('should spy on getMasterPCModel', () =>{
      spyOn(service, 'getMasterPCModel').and.callThrough();
      service.getMasterPCModel();
      expect(service.getMasterPCModel).toHaveBeenCalled();
    });
   });
   describe('http getMasterPCModel',() => {
    it('http getMasterPCModel', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.getMasterPCModel().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfolio-company/master-model/get");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('savePortfolioProfitability',()=>{
    it('should spy on savePortfolioProfitability', () =>{
      let portfolioProfitability = 'test';
      spyOn(service, 'savePortfolioProfitability').and.callThrough();
      service.savePortfolioProfitability(portfolioProfitability);
      expect(service.savePortfolioProfitability).toHaveBeenCalled();
    });
   });
   describe('http savePortfolioProfitability',() => {
    it('http savePortfolioProfitability', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let portfolioProfitability = 'test';
        service.savePortfolioProfitability(portfolioProfitability).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfoliocompany/saveprofitability",
         portfolioProfitability);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('exportPortfolioCompanyList',()=>{
    it('should spy on exportPortfolioCompanyList', () =>{
      let filter = 'test';
      spyOn(service, 'exportPortfolioCompanyList').and.callThrough();
      service.exportPortfolioCompanyList(filter);
      expect(service.exportPortfolioCompanyList).toHaveBeenCalled();
    });
   });
   describe('exportPortfolioCompanyKPIDataList',()=>{
    it('should spy on exportPortfolioCompanyKPIDataList', () =>{
      spyOn(service, 'exportPortfolioCompanyKPIDataList').and.callThrough();
      service.exportPortfolioCompanyKPIDataList();
      expect(service.exportPortfolioCompanyKPIDataList).toHaveBeenCalled();
    });
   });
   describe('exportProfitabilityList',()=>{
    it('should spy on exportProfitabilityList', () =>{
      let filter = 'test';
      spyOn(service, 'exportProfitabilityList').and.callThrough();
      service.exportProfitabilityList(filter);
      expect(service.exportProfitabilityList).toHaveBeenCalled();
    });
   });
   describe('getPortfolioCompanyOperationalKPIValues',()=>{
    it('should spy on getPortfolioCompanyOperationalKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPortfolioCompanyOperationalKPIValues').and.callThrough();
      service.getPortfolioCompanyOperationalKPIValues(filter);
      expect(service.getPortfolioCompanyOperationalKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyOperationalKPIValues',() => {
    it('http getPortfolioCompanyOperationalKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPortfolioCompanyOperationalKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfoliocompany/getoperationalKPIValues",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyOperationalKPIValuesTranpose',()=>{
    it('should spy on getPortfolioCompanyOperationalKPIValuesTranpose', () =>{
      let filter = 'test';
      spyOn(service, 'getPortfolioCompanyOperationalKPIValuesTranpose').and.callThrough();
      service.getPortfolioCompanyOperationalKPIValuesTranpose(filter);
      expect(service.getPortfolioCompanyOperationalKPIValuesTranpose).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyOperationalKPIValuesTranpose',() => {
    it('http getPortfolioCompanyOperationalKPIValuesTranpose', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPortfolioCompanyOperationalKPIValuesTranpose(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfoliocompany/getoperationalKPIValuesTranpose",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPCOperationalKPIValues',()=>{
    it('should spy on getPCOperationalKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCOperationalKPIValues').and.callThrough();
      service.getPCOperationalKPIValues(filter);
      expect(service.getPCOperationalKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getPCOperationalKPIValues',() => {
    it('http getPCOperationalKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPCOperationalKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/get/operational-kpi-values",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('exportPCOperationalKPIList',()=>{
    it('should spy on exportPCOperationalKPIList', () =>{
      let filter = 'test';
      spyOn(service, 'exportPCOperationalKPIList').and.callThrough();
      service.exportPCOperationalKPIList(filter);
      expect(service.exportPCOperationalKPIList).toHaveBeenCalled();
    });
   });
   describe('getCompanyKpiValues',()=>{
    it('should spy on getCompanyKpiValues', () =>{
      let filter = 'test';
      spyOn(service, 'getCompanyKpiValues').and.callThrough();
      service.getCompanyKpiValues(filter);
      expect(service.getCompanyKpiValues).toHaveBeenCalled();
    });
   });
   describe('http getCompanyKpiValues',() => {
    it('http getCompanyKpiValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getCompanyKpiValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/get/company-kpi-values",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('SavePortfolioCompanyOperationalKPIValue',()=>{
    it('should spy on SavePortfolioCompanyOperationalKPIValue', () =>{
      let filter = 'test';
      spyOn(service, 'SavePortfolioCompanyOperationalKPIValue').and.callThrough();
      service.SavePortfolioCompanyOperationalKPIValue(filter);
      expect(service.SavePortfolioCompanyOperationalKPIValue).toHaveBeenCalled();
    });
   });
   describe('http SavePortfolioCompanyOperationalKPIValue',() => {
    it('http SavePortfolioCompanyOperationalKPIValue', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.SavePortfolioCompanyOperationalKPIValue(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolioCompany/SaveOperationalKPIValue",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('GetOperationalKPIList',()=>{
    it('should spy on GetOperationalKPIList', () =>{
      let portfolioCompanyId = 'test';
      spyOn(service, 'GetOperationalKPIList').and.callThrough();
      service.GetOperationalKPIList(portfolioCompanyId);
      expect(service.GetOperationalKPIList).toHaveBeenCalled();
    });
   });
   describe('http GetOperationalKPIList',() => {
    it('http GetOperationalKPIList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let portfolioCompanyId = 'test';
        service.GetOperationalKPIList(portfolioCompanyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfoliocompany/getoperationalKPI ",
         portfolioCompanyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('redirectToLogin',()=>{
    it('should spy on redirectToLogin', () =>{
      let error = 'test';
      spyOn(service, 'redirectToLogin').and.callThrough();
      service.redirectToLogin(error);
      expect(service.redirectToLogin).toHaveBeenCalled();
    });
   });
   describe('getPCBalanceSheetValues',()=>{
    it('should spy on getPCBalanceSheetValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCBalanceSheetValues').and.callThrough();
      service.getPCBalanceSheetValues(filter);
      expect(service.getPCBalanceSheetValues).toHaveBeenCalled();
    });
   });
   describe('http getPCBalanceSheetValues',() => {
    it('http getPCBalanceSheetValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPCBalanceSheetValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolio-company/balance-sheet-value/get",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPCProfitAndLossValues',()=>{
    it('should spy on getPCProfitAndLossValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCProfitAndLossValues').and.callThrough();
      service.getPCProfitAndLossValues(filter);
      expect(service.getPCProfitAndLossValues).toHaveBeenCalled();
    });
   });
   describe('http getPCProfitAndLossValues',() => {
    it('http getPCProfitAndLossValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPCProfitAndLossValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolio-company/profit-loss-value/get",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPCCashFlowValues',()=>{
    it('should spy on getPCCashFlowValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCCashFlowValues').and.callThrough();
      service.getPCCashFlowValues(filter);
      expect(service.getPCCashFlowValues).toHaveBeenCalled();
    });
   });
   describe('http getPCCashFlowValues',() => {
    it('http getPCCashFlowValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPCCashFlowValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfolio-company/cashflow-value/get",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPCCashFlowValues',()=>{
    it('should spy on getPCCashFlowValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCCashFlowValues').and.callThrough();
      service.getPCCashFlowValues(filter);
      expect(service.getPCCashFlowValues).toHaveBeenCalled();
    });
   });
   describe('http getPCCashFlowValues',() => {
    it('http getPCCashFlowValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPCCashFlowValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfolio-company/cashflow-value/get",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getSegmentTypeForFinancialsByCompanyID',()=>{
    it('should spy on getSegmentTypeForFinancialsByCompanyID', () =>{
      let filter = 'test';
      spyOn(service, 'getSegmentTypeForFinancialsByCompanyID').and.callThrough();
      service.getSegmentTypeForFinancialsByCompanyID(filter);
      expect(service.getSegmentTypeForFinancialsByCompanyID).toHaveBeenCalled();
    });
   });
   describe('http getSegmentTypeForFinancialsByCompanyID',() => {
    it('http getSegmentTypeForFinancialsByCompanyID', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getSegmentTypeForFinancialsByCompanyID(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/getSegmentTypeForFinancialsByCompanyId",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('exportCompanyBalanceSheet',()=>{
    it('should spy on exportCompanyBalanceSheet', () =>{
      let filter = 'test';
      spyOn(service, 'exportCompanyBalanceSheet').and.callThrough();
      service.exportCompanyBalanceSheet(filter);
      expect(service.exportCompanyBalanceSheet).toHaveBeenCalled();
    });
   });
   describe('exportCompanyCashFlow',()=>{
    it('should spy on exportCompanyCashFlow', () =>{
      let filter = 'test';
      spyOn(service, 'exportCompanyCashFlow').and.callThrough();
      service.exportCompanyCashFlow(filter);
      expect(service.exportCompanyCashFlow).toHaveBeenCalled();
    });
   });
   describe('getPortfolioCompanyInvestmentKPIValues',()=>{
    it('should spy on getPortfolioCompanyInvestmentKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPortfolioCompanyInvestmentKPIValues').and.callThrough();
      service.getPortfolioCompanyInvestmentKPIValues(filter);
      expect(service.getPortfolioCompanyInvestmentKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyInvestmentKPIValues',() => {
    it('http getPortfolioCompanyInvestmentKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPortfolioCompanyInvestmentKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfolio-company/investment-kpi-value/get",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPCInvestmentKPIValues',()=>{
    it('should spy on getPCInvestmentKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCInvestmentKPIValues').and.callThrough();
      service.getPCInvestmentKPIValues(filter);
      expect(service.getPCInvestmentKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getPCInvestmentKPIValues',() => {
    it('http getPCInvestmentKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPCInvestmentKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/get/investment/investment-kpi-values",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPCCompanyKPIValues',()=>{
    it('should spy on getPCCompanyKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCCompanyKPIValues').and.callThrough();
      service.getPCCompanyKPIValues(filter);
      expect(service.getPCCompanyKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getPCCompanyKPIValues',() => {
    it('http getPCCompanyKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPCCompanyKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfolio-company/company-kpi-value/get",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyImpactKPIValues',()=>{
    it('should spy on getPortfolioCompanyImpactKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPortfolioCompanyImpactKPIValues').and.callThrough();
      service.getPortfolioCompanyImpactKPIValues(filter);
      expect(service.getPortfolioCompanyImpactKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyImpactKPIValues',() => {
    it('http getPortfolioCompanyImpactKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPortfolioCompanyImpactKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolio-company/impact-kpi-value/get",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('exportInvestmentKPIList',()=>{
    it('should spy on exportInvestmentKPIList', () =>{
      let filter = 'test';
      spyOn(service, 'exportInvestmentKPIList').and.callThrough();
      service.exportInvestmentKPIList(filter);
      expect(service.exportInvestmentKPIList).toHaveBeenCalled();
    });
   });
   describe('exportMasterKPIList',()=>{
    it('should spy on exportMasterKPIList', () =>{
      let filter = 'test';
      spyOn(service, 'exportMasterKPIList').and.callThrough();
      service.exportMasterKPIList(filter);
      expect(service.exportMasterKPIList).toHaveBeenCalled();
    });
   });
   describe('exportMasterKPIListdraft',()=>{
    it('should spy on exportMasterKPIListdraft', () =>{
      let filter = 'test';
      spyOn(service, 'exportMasterKPIListdraft').and.callThrough();
      service.exportMasterKPIListdraft(filter);
      expect(service.exportMasterKPIListdraft).toHaveBeenCalled();
    });
   });
   describe('exportOperationalKPIListdraft',()=>{
    it('should spy on exportOperationalKPIListdraft', () =>{
      let filter = 'test';
      spyOn(service, 'exportOperationalKPIListdraft').and.callThrough();
      service.exportOperationalKPIListdraft(filter);
      expect(service.exportOperationalKPIListdraft).toHaveBeenCalled();
    });
   });
   describe('exportToExcel',()=>{
    it('should spy on exportToExcel', () =>{
      let filter = <any>'test';
      let fileName = 'testing';
      spyOn(service, 'exportToExcel').and.callThrough();
      service.exportToExcel(filter, fileName);
      expect(service.exportToExcel).toHaveBeenCalled();
    });
   });
   describe('exportInvestmentKPIData',()=>{
    it('should spy on exportInvestmentKPIData', () =>{
      let filter = 'test';
      spyOn(service, 'exportInvestmentKPIData').and.callThrough();
      service.exportInvestmentKPIData(filter);
      expect(service.exportInvestmentKPIData).toHaveBeenCalled();
    });
   });
   describe('exportImpactKPIList',()=>{
    it('should spy on exportImpactKPIList', () =>{
      let filter = 'test';
      spyOn(service, 'exportImpactKPIList').and.callThrough();
      service.exportImpactKPIList(filter);
      expect(service.exportImpactKPIList).toHaveBeenCalled();
    });
   });
   describe('exportCompanywiseKPIList',()=>{
    it('should spy on exportCompanywiseKPIList', () =>{
      let filter = 'test';
      spyOn(service, 'exportCompanywiseKPIList').and.callThrough();
      service.exportCompanywiseKPIList(filter);
      expect(service.exportCompanywiseKPIList).toHaveBeenCalled();
    });
   });
   describe('exportTradingRecordsList',()=>{
    it('should spy on exportTradingRecordsList', () =>{
      let filter = 'test';
      spyOn(service, 'exportTradingRecordsList').and.callThrough();
      service.exportTradingRecordsList(filter);
      expect(service.exportTradingRecordsList).toHaveBeenCalled();
    });
   });
   describe('saveCompanyCommentaryDetails',()=>{
    it('should spy on saveCompanyCommentaryDetails', () =>{
      let filter = 'test';
      spyOn(service, 'saveCompanyCommentaryDetails').and.callThrough();
      service.saveCompanyCommentaryDetails(filter);
      expect(service.saveCompanyCommentaryDetails).toHaveBeenCalled();
    });
   });
   describe('http saveCompanyCommentaryDetails',() => {
    it('http saveCompanyCommentaryDetails', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.saveCompanyCommentaryDetails(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/portfolio-company/commentary/save",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('saveCustomCommentary',()=>{
    it('should spy on saveCustomCommentary', () =>{
      let filter = 'test';
      spyOn(service, 'saveCustomCommentary').and.callThrough();
      service.saveCustomCommentary(filter);
      expect(service.saveCustomCommentary).toHaveBeenCalled();
    });
   });
   describe('http saveCustomCommentary',() => {
    it('http saveCustomCommentary', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.saveCustomCommentary(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolio-company/commentary/save/custom",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyCommentarySections',()=>{
    it('should spy on getPortfolioCompanyCommentarySections', () =>{
      let filter = 'test';
      spyOn(service, 'getPortfolioCompanyCommentarySections').and.callThrough();
      service.getPortfolioCompanyCommentarySections(filter);
      expect(service.getPortfolioCompanyCommentarySections).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyCommentarySections',() => {
    it('http getPortfolioCompanyCommentarySections', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPortfolioCompanyCommentarySections(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolio-company/commentary-section/get",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyCommentarySections1',()=>{
    it('should spy on getPortfolioCompanyCommentarySections1', () =>{
      let filter = 'test';
      spyOn(service, 'getPortfolioCompanyCommentarySections1').and.callThrough();
      service.getPortfolioCompanyCommentarySections1(filter);
      expect(service.getPortfolioCompanyCommentarySections1).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyCommentarySections1',() => {
    it('http getPortfolioCompanyCommentarySections1', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getPortfolioCompanyCommentarySections1(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolio-company/commentary-section/get/custom",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getKPIMappingList',()=>{
    it('should spy on getKPIMappingList', () =>{
      let filter = 'test';
      spyOn(service, 'getKPIMappingList').and.callThrough();
      service.getKPIMappingList(filter, 'testing', 12);
      expect(service.getKPIMappingList).toHaveBeenCalled();
    });
   });
   describe('http getKPIMappingList',() => {
    it('http getKPIMappingList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let Id = 'test';
        let type = 'testing';
        let moduleID = 23;
        service.getKPIMappingList(Id, type, moduleID).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/KPI/${Id}/${type}/${moduleID}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getKPIUnMappingList',()=>{
    it('should spy on getKPIUnMappingList', () =>{
      let filter = 'test';
      spyOn(service, 'getKPIUnMappingList').and.callThrough();
      service.getKPIUnMappingList(filter, 'testing', 12);
      expect(service.getKPIUnMappingList).toHaveBeenCalled();
    });
   });
   describe('http getKPIUnMappingList',() => {
    it('http getKPIUnMappingList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let id = 'test';
        let type = 'testing';
        let moduleID = 23;
        service.getKPIUnMappingList(id, type, moduleID).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/un-mapped-kpi/${id}/${type}/${moduleID}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateKPIMappingList',()=>{
    it('should spy on updateKPIMappingList', () =>{
      let filter = 'test';
      spyOn(service, 'updateKPIMappingList').and.callThrough();
      service.updateKPIMappingList(filter, 'testing', 'test', 12);
      expect(service.updateKPIMappingList).toHaveBeenCalled();
    });
   });
   describe('http updateKPIMappingList',() => {
    it('http updateKPIMappingList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let KpiList = 'Google';
        let id = 'test';
        let type = 'testing';
        let moduleID = 23;
        service.updateKPIMappingList(KpiList,id, type, moduleID).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/KPI/${id}/${type}/${moduleID}`, KpiList);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('createDuplicateKPI',()=>{
    it('should spy on createDuplicateKPI', () =>{
      let filter = 'test';
      spyOn(service, 'createDuplicateKPI').and.callThrough();
      service.createDuplicateKPI(filter);
      expect(service.createDuplicateKPI).toHaveBeenCalled();
    });
   });
   describe('http createDuplicateKPI',() => {
    it('http createDuplicateKPI', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let KpiList = 'test';
        service.createDuplicateKPI(KpiList).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/kpi/create/duplicate`, KpiList);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('impactsaveuploadlogs',()=>{
    it('should spy on impactsaveuploadlogs', () =>{
      let path = 'test';
      spyOn(service, 'impactsaveuploadlogs').and.callThrough();
      service.impactsaveuploadlogs(path);
      expect(service.impactsaveuploadlogs).toHaveBeenCalled();
    });
   });
   describe('http impactsaveuploadlogs',() => {
    it('http impactsaveuploadlogs', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let path = 'test';
        service.impactsaveuploadlogs(path).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/update/folder`,path);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getfiles',()=>{
    it('should spy on getfiles', () =>{
      let year = '2022';
      let quater = 'Q4';
      let company = 'Demo company';
      spyOn(service, 'getfiles').and.callThrough();
      service.getfiles(year, quater,company);
      expect(service.getfiles).toHaveBeenCalled();
    });
   });
   describe('http getfiles',() => {
    it('http getfiles', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let year = '2022';
        let quater = 'Q4';
        let company = 'Demo company';
        service.getfiles(year, quater,company).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/impactfilefiles/${company}/${year}/${quater}/0`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('finalfilesuploaded',()=>{
    it('should spy on finalfilesuploaded', () =>{
      let year = '2022';
      let quater = 'Q4';
      let company = 'Demo company';
      spyOn(service, 'finalfilesuploaded').and.callThrough();
      service.finalfilesuploaded(year, quater,company);
      expect(service.finalfilesuploaded).toHaveBeenCalled();
    });
   });
   describe('http finalfilesuploaded',() => {
    it('http finalfilesuploaded', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let year = '2022';
        let quater = 'Q4';
        let company = 'Demo company';
        service.finalfilesuploaded(year, quater,company).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/impactfilefiles/${company}/${year}/${quater}/1`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('uploadlogos',()=>{
    it('should spy on uploadlogos', () =>{
      let formData = 'testing';
      let path = 'Demo test';
      spyOn(service, 'uploadlogos').and.callThrough();
      service.uploadlogos(formData, path);
      expect(service.uploadlogos).toHaveBeenCalled();
    });
   });
   describe('http uploadlogos',() => {
    it('http uploadlogos', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let formData = 'testing';
        let path = 'Demo test';
        service.uploadlogos(formData, path).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/upload/logo",
         formData);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('ondeletefinal',()=>{
    it('should spy on ondeletefinal', () =>{
      let path = 'Demo test';
      spyOn(service, 'ondeletefinal').and.callThrough();
      service.ondeletefinal(path);
      expect(service.ondeletefinal).toHaveBeenCalled();
    });
   });
   describe('http ondeletefinal',() => {
    it('http ondeletefinal', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let path = 'Demo test';
        service.ondeletefinal(path).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/finalremoveimpactfile/${path}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('onDeleteTempFiles',()=>{
    it('should spy on onDeleteTempFiles', () =>{
      let path = 'Demo test';
      spyOn(service, 'onDeleteTempFiles').and.callThrough();
      service.onDeleteTempFiles(path);
      expect(service.onDeleteTempFiles).toHaveBeenCalled();
    });
   });
   describe('http onDeleteTempFiles',() => {
    it('http onDeleteTempFiles', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let path = 'Demo test';
        service.onDeleteTempFiles(path).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+`api/delete/file`,path);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getuploadfiles',()=>{
    it('should spy on getuploadfiles', () =>{
      let path = 'Demo test';
      spyOn(service, 'getuploadfiles').and.callThrough();
      service.getuploadfiles(path);
      expect(service.getuploadfiles).toHaveBeenCalled();
    });
   });
   describe('http getuploadfiles',() => {
    it('http getuploadfiles', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let path = 'Demo test';
        service.getuploadfiles(path).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+`api/impactfilefiles/${path}/0`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getfinaluploadfiles',()=>{
    it('should spy on getfinaluploadfiles', () =>{
      let path = 'Demo test';
      spyOn(service, 'getfinaluploadfiles').and.callThrough();
      service.getfinaluploadfiles(path);
      expect(service.getfinaluploadfiles).toHaveBeenCalled();
    });
   });
   describe('http getfinaluploadfiles',() => {
    it('http getfinaluploadfiles', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let path = 'Demo test';
        service.getfinaluploadfiles(path).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+`api/impactfilefiles/${path}/1`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getfinancialsvalueTypes',()=>{
    it('should spy on getfinancialsvalueTypes', () =>{
      spyOn(service, 'getfinancialsvalueTypes').and.callThrough();
      service.getfinancialsvalueTypes();
      expect(service.getfinancialsvalueTypes).toHaveBeenCalled();
    });
   });
   describe('http getfinancialsvalueTypes',() => {
    it('http getfinancialsvalueTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.getfinancialsvalueTypes().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+`api/portfolio-company/finacialvaluetypes`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getMasterKPITabs',()=>{
    it('should spy on getMasterKPITabs', () =>{
      let section = 'test';
      spyOn(service, 'getMasterKPITabs').and.callThrough();
      service.getMasterKPITabs(section);
      expect(service.getMasterKPITabs).toHaveBeenCalled();
    });
   });
   describe('http getMasterKPITabs',() => {
    it('http getMasterKPITabs', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let section = 'test';
        service.getMasterKPITabs(section).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+`api/KPITabsList/${section}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getWorkflowStatus',()=>{
    it('should spy on getWorkflowStatus', () =>{
      let featureId = 55;
      let requestId = 34;
      spyOn(service, 'getWorkflowStatus').and.callThrough();
      service.getWorkflowStatus(featureId, requestId);
      expect(service.getWorkflowStatus).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowStatus',() => {
    it('http getWorkflowStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let featureId = 55;
        let requestId = 34;
        service.getWorkflowStatus(featureId,requestId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+`api/workflowrequest/get/${featureId}/${requestId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('lpReportGraphs',()=>{
    it('should spy on lpReportGraphs', () =>{
      let companyId = 55;
      spyOn(service, 'lpReportGraphs').and.callThrough();
      service.lpReportGraphs(companyId);
      expect(service.lpReportGraphs).toHaveBeenCalled();
    });
   });
   describe('http lpReportGraphs',() => {
    it('http lpReportGraphs', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let companyId = 55;
        service.lpReportGraphs(companyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+`api/LPReportGraphData/${companyId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompaniesByFundId',()=>{
    it('should spy on getPortfolioCompaniesByFundId', () =>{
      let companyId = <any>55;
      spyOn(service, 'getPortfolioCompaniesByFundId').and.callThrough();
      service.getPortfolioCompaniesByFundId(companyId);
      expect(service.getPortfolioCompaniesByFundId).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompaniesByFundId',() => {
    it('http getPortfolioCompaniesByFundId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let companyId = <any>'test';
        service.getPortfolioCompaniesByFundId(companyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolioCompany/getByFundId",companyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('get_RegionCountrys_ByFundId',()=>{
    it('should spy on get_RegionCountrys_ByFundId', () =>{
      let companyId = <any>55;
      spyOn(service, 'get_RegionCountrys_ByFundId').and.callThrough();
      service.get_RegionCountrys_ByFundId(companyId);
      expect(service.get_RegionCountrys_ByFundId).toHaveBeenCalled();
    });
   });
   describe('http get_RegionCountrys_ByFundId',() => {
    it('http get_RegionCountrys_ByFundId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let companyId = <any>'test';
        service.get_RegionCountrys_ByFundId(companyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/master/getRegionsCountrysByFundId",companyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('addCompanyGroup',()=>{
    it('should spy on addCompanyGroup', () =>{
      let companyId = <any>55;
      spyOn(service, 'addCompanyGroup').and.callThrough();
      service.addCompanyGroup(companyId);
      expect(service.addCompanyGroup).toHaveBeenCalled();
    });
   });
   describe('http addCompanyGroup',() => {
    it('http addCompanyGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let companyId = <any>'test';
        service.addCompanyGroup(companyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/add/group-list",companyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateCompanyGroup',()=>{
    it('should spy on updateCompanyGroup', () =>{
      let companyId = <any>55;
      spyOn(service, 'updateCompanyGroup').and.callThrough();
      service.updateCompanyGroup(companyId);
      expect(service.updateCompanyGroup).toHaveBeenCalled();
    });
   });
   describe('http updateCompanyGroup',() => {
    it('http updateCompanyGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let companyId = <any>'test';
        service.updateCompanyGroup(companyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/update/group-list",companyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateDisplayOrder',()=>{
    it('should spy on updateDisplayOrder', () =>{
      let companyId = <any>55;
      spyOn(service, 'updateDisplayOrder').and.callThrough();
      service.updateDisplayOrder(companyId);
      expect(service.updateDisplayOrder).toHaveBeenCalled();
    });
   });
   describe('http updateDisplayOrder',() => {
    it('http updateDisplayOrder', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let companyId = <any>'test';
        service.updateDisplayOrder(companyId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/update/group-order",companyId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyGroup',()=>{
    it('should spy on getCompanyGroup', () =>{
      let featureId = 55;
      spyOn(service, 'getCompanyGroup').and.callThrough();
      service.getCompanyGroup(featureId);
      expect(service.getCompanyGroup).toHaveBeenCalled();
    });
   });
   describe('http getCompanyGroup',() => {
    it('http getCompanyGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let featureId = 55;
        service.getCompanyGroup(featureId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/get/groups/"+featureId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('deleteCompanyGroup',()=>{
    it('should spy on deleteCompanyGroup', () =>{
      let featureId = 55;
      spyOn(service, 'deleteCompanyGroup').and.callThrough();
      service.deleteCompanyGroup(featureId);
      expect(service.deleteCompanyGroup).toHaveBeenCalled();
    });
   });
   describe('http deleteCompanyGroup',() => {
    it('http deleteCompanyGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let featureId = 55;
        service.deleteCompanyGroup(featureId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/delete/group-list/"+featureId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyCustomList',()=>{
    it('should spy on getCompanyCustomList', () =>{
      let featureId = 55;
      let fieldId = 45;
      spyOn(service, 'getCompanyCustomList').and.callThrough();
      service.getCompanyCustomList(featureId, fieldId);
      expect(service.getCompanyCustomList).toHaveBeenCalled();
    });
   });
   describe('http getCompanyCustomList',() => {
    it('http getCompanyCustomList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let featureId = 55;
        let fieldId = 45;
        service.getCompanyCustomList(featureId, fieldId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/get/pcCustomList/${featureId}/${fieldId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyCustomListTypeDetails',()=>{
    it('should spy on getCompanyCustomListTypeDetails', () =>{
      let featureId = 55;
      spyOn(service, 'getCompanyCustomListTypeDetails').and.callThrough();
      service.getCompanyCustomListTypeDetails(featureId);
      expect(service.getCompanyCustomListTypeDetails).toHaveBeenCalled();
    });
   });
   describe('http getCompanyCustomListTypeDetails',() => {
    it('http getCompanyCustomListTypeDetails', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let featureId = 55;
        service.getCompanyCustomListTypeDetails(featureId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/portfolioCompany/portfolioCompanyTypeList/${featureId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyKpiData',()=>{
    it('should spy on getCompanyKpiData', () =>{
      let featureId = 55;
      spyOn(service, 'getCompanyKpiData').and.callThrough();
      service.getCompanyKpiData(featureId);
      expect(service.getCompanyKpiData).toHaveBeenCalled();
    });
   });
   describe('http getCompanyKpiData',() => {
    it('http getCompanyKpiData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let featureId = 55;
        service.getCompanyKpiData(featureId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pc-kpis/company-kpi", featureId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPageConfigSubSectionField',()=>{
    it('should spy on getPageConfigSubSectionField', () =>{
      spyOn(service, 'getPageConfigSubSectionField').and.callThrough();
      service.getPageConfigSubSectionField();
      expect(service.getPageConfigSubSectionField).toHaveBeenCalled();
    });
   });
   describe('http getPageConfigSubSectionField',() => {
    it('http getPageConfigSubSectionField', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.getPageConfigSubSectionField().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/pc-kpis/page-config");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getChartsKpiData',()=>{
    it('should spy on getChartsKpiData', () =>{
      let filter = 'test';
      spyOn(service, 'getChartsKpiData').and.callThrough();
      service.getChartsKpiData(filter);
      expect(service.getChartsKpiData).toHaveBeenCalled();
    });
   });
   describe('http getChartsKpiData',() => {
    it('http getChartsKpiData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getChartsKpiData(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/portfolio-company/kpis/chart",
         filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});
