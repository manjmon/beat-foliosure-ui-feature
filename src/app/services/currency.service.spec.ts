import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { CurrencyService } from "./currency.service";

describe("FilterService", () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(CurrencyService);
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
  describe('getAllCurrencies', () =>{
    it('spyOn getAllCurrencies', () =>{
      spyOn(service, 'getAllCurrencies').and.callThrough();
      service.getAllCurrencies();
      expect(service.getAllCurrencies).toHaveBeenCalled();
    })
  });
  describe('http getAllCurrencies',() => {
    it('http getAllCurrencies', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getAllCurrencies().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/master/GetAllCurrencies");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetToCurrenciesByFromCurrency', () =>{
    it('spyOn GetToCurrenciesByFromCurrency', () =>{
        let currCode = 'USD';
      spyOn(service, 'GetToCurrenciesByFromCurrency').and.callThrough();
      service.GetToCurrenciesByFromCurrency(currCode);
      expect(service.GetToCurrenciesByFromCurrency).toHaveBeenCalled();
    })
  });
  describe('http GetToCurrenciesByFromCurrency',() => {
    it('http GetToCurrenciesByFromCurrency', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let currCode = 'USD';
        service.GetToCurrenciesByFromCurrency(currCode).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/master/GetToCurrenciesByFromCurrency?fromCurrency=" + currCode);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('GetFxratesBulkUpload', () =>{
    it('spyOn GetFxratesBulkUpload', () =>{
      spyOn(service, 'GetFxratesBulkUpload').and.callThrough();
      service.GetFxratesBulkUpload();
      expect(service.GetFxratesBulkUpload).toHaveBeenCalled();
    })
  });
  describe('http GetFxratesBulkUpload',() => {
    it('http GetFxratesBulkUpload', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.GetFxratesBulkUpload().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/master/fxrates");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});