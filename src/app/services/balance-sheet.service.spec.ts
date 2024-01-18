import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { BalanceSheetService } from "./balance-sheet.service";

describe("FileUploadService", () => {
  let service: BalanceSheetService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BalanceSheetService,
        { provide: Router, useFactory: routerStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.get(BalanceSheetService);
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
  describe('getPCBalanceSheetValues', () =>{
    it('spyOn getPCBalanceSheetValues', () =>{
      let filter = 'test';
      spyOn(service, 'getPCBalanceSheetValues').and.callThrough();
      service.getPCBalanceSheetValues(filter);
      expect(service.getPCBalanceSheetValues).toHaveBeenCalled();
    })
  });
  describe('http getPCBalanceSheetValues',() => {
    it('http getPCBalanceSheetValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getPCBalanceSheetValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/Financials/balancesheet", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('exportCompanyBalanceSheet', () =>{
    it('spyOn exportCompanyBalanceSheet', () =>{
      let filter = 'test';
      spyOn(service, 'exportCompanyBalanceSheet').and.callThrough();
      service.exportCompanyBalanceSheet(filter);
      expect(service.exportCompanyBalanceSheet).toHaveBeenCalled();
    })
  });
});
