import { TestBed, async, inject } from '@angular/core/testing';
import { ProfitLossService } from './profit-loss.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ReportDownloadService } from './report-download.service';

describe('ProfitLossService', () => {
  let service: ProfitLossService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfitLossService,
      { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(ProfitLossService);
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
  describe('getPCProfitAndLossValues', () =>{
    it('spyOn getPCProfitAndLossValues', () =>{
      let filter = 'Profit'
      spyOn(service, 'getPCProfitAndLossValues').and.callThrough();
      service.getPCProfitAndLossValues(filter);
      expect(service.getPCProfitAndLossValues).toHaveBeenCalled();
    })
  });
  describe('httpgetPCProfitAndLossValues',() => {
    it('http getPCProfitAndLossValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        let filter = 'Profit'
        service.getPCProfitAndLossValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/Financials/profitloss", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('exportCompanyProfitAndLoss', () =>{
    it('spyOn exportCompanyProfitAndLoss', () =>{
      let filter = 'Profit'
      spyOn(service, 'exportCompanyProfitAndLoss').and.callThrough();
      service.exportCompanyProfitAndLoss(filter);
      expect(service.exportCompanyProfitAndLoss).toHaveBeenCalled();
    })
  });
});