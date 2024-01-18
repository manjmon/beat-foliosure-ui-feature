import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { CashflowService } from "./cashflow.service";

describe("CashflowService", () => {
  let service: CashflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CashflowService,  { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(CashflowService);
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
  describe('getCashflowFileList', () =>{
    it('spyOn getCashflowFileList', () =>{
      let filter = 'test';
      spyOn(service, 'getCashflowFileList').and.callThrough();
      service.getCashflowFileList(filter);
      expect(service.getCashflowFileList).toHaveBeenCalled();
    })
  });
  describe('http getCashflowFileList',() => {
    it('http getCashflowFileList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getCashflowFileList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/cashflow/files/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getCashFlowDeatils', () =>{
    it('spyOn getCashFlowDeatils', () =>{
      let fileId = 'test';
      spyOn(service, 'getCashFlowDeatils').and.callThrough();
      service.getCashFlowDeatils(fileId);
      expect(service.getCashFlowDeatils).toHaveBeenCalled();
    })
  });
  describe('http getCashFlowDeatils',() => {
    it('http getCashFlowDeatils', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fileId = 'test';
        service.getCashFlowDeatils(fileId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/cashflow/getbyid", fileId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getCashFlowFxRates', () =>{
    it('spyOn getCashFlowFxRates', () =>{
      let cashflow = 'test';
      spyOn(service, 'getCashFlowFxRates').and.callThrough();
      service.getCashFlowFxRates(cashflow);
      expect(service.getCashFlowFxRates).toHaveBeenCalled();
    })
  });
  describe('http getCashFlowFxRates',() => {
    it('http getCashFlowFxRates', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let cashflow = 'test';
        service.getCashFlowFxRates(cashflow).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/cashflow/fxrates", cashflow);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetReportngCurrencyValuesForFundPerformance', () =>{
    it('spyOn GetReportngCurrencyValuesForFundPerformance', () =>{
      let fp = 'test';
      spyOn(service, 'GetReportngCurrencyValuesForFundPerformance').and.callThrough();
      service.GetReportngCurrencyValuesForFundPerformance(fp);
      expect(service.GetReportngCurrencyValuesForFundPerformance).toHaveBeenCalled();
    })
  });
  describe('http GetReportngCurrencyValuesForFundPerformance',() => {
    it('http GetReportngCurrencyValuesForFundPerformance', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let fp = 'test';
        service.GetReportngCurrencyValuesForFundPerformance(fp).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/fundPerformance/fxrates", fp);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('downloadCashflowFile', () =>{
    it('spyOn downloadCashflowFile', () =>{
      let FileUploadDetails = 'test';
      spyOn(service, 'downloadCashflowFile').and.callThrough();
      service.downloadCashflowFile(FileUploadDetails);
      expect(service.downloadCashflowFile).toHaveBeenCalled();
    })
  });
  describe('exportCashflowData', () =>{
    it('spyOn exportCashflowData', () =>{
      let filter = 'test';
      spyOn(service, 'exportCashflowData').and.callThrough();
      service.exportCashflowData(filter);
      expect(service.exportCashflowData).toHaveBeenCalled();
    })
  });
  describe('newExportCashflowData', () =>{
    it('spyOn newExportCashflowData', () =>{
      let filter = 'test';
      spyOn(service, 'newExportCashflowData').and.callThrough();
      service.newExportCashflowData(filter);
      expect(service.newExportCashflowData).toHaveBeenCalled();
    })
  });
  describe('getCashFlowUploadValidate', () =>{
    it('spyOn getCashFlowUploadValidate', () =>{
      spyOn(service, 'getCashFlowUploadValidate').and.callThrough();
      service.getCashFlowUploadValidate();
      expect(service.getCashFlowUploadValidate).toHaveBeenCalled();
    })
  });
  describe('http getCashFlowUploadValidate',() => {
    it('http getCashFlowUploadValidate', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getCashFlowUploadValidate().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/cashflow-upload/validate");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getCashFlowPageConfigTransactionTypes', () =>{
    it('spyOn getCashFlowPageConfigTransactionTypes', () =>{
      spyOn(service, 'getCashFlowPageConfigTransactionTypes').and.callThrough();
      service.getCashFlowPageConfigTransactionTypes();
      expect(service.getCashFlowPageConfigTransactionTypes).toHaveBeenCalled();
    })
  });
  describe('http getCashFlowPageConfigTransactionTypes',() => {
    it('http getCashFlowPageConfigTransactionTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getCashFlowPageConfigTransactionTypes().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/cashflow/TransactionTypes");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});
