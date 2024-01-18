import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { CashflowBetaService } from './cashflow-beta.service';

describe("FileUploadService", () => {
  let service: CashflowBetaService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CashflowBetaService,
        { provide: Router, useFactory: routerStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.get(CashflowBetaService);
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
  describe('getPCCashFlowValues', () =>{
    it('spyOn getPCCashFlowValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCCashFlowValues').and.callThrough();
      service.getPCCashFlowValues(filter);
      expect(service.getPCCashFlowValues).toHaveBeenCalled();
    })
  });
  describe('http getPCCashFlowValues',() => {
    it('http getPCCashFlowValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getPCCashFlowValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Financials/cashflow", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});