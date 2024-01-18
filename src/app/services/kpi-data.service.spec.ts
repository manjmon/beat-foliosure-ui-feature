import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { KPIDataService } from "./kpi-data.service";

describe("KPIDataService", () => {
  let service: KPIDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KPIDataService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(KPIDataService);
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
  describe('getKPIsByType', () =>{
    it('spyOn getKPIsByType', () =>{
      let type = 'test';
      let compId = 11;
      spyOn(service, 'getKPIsByType').and.callThrough();
      service.getKPIsByType(type, compId);
      expect(service.getKPIsByType).toHaveBeenCalled();
    })
  });
  describe('http getKPIsByType',() => {
    it('http getKPIsByType', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let type = 'test';
        let compId = 11;
        service.getKPIsByType(type, compId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/kpi/get/"+type+"/"+compId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('GetKpiFormula', () =>{
    it('spyOn GetKpiFormula', () =>{
      let formulaModel = 'test';
      spyOn(service, 'GetKpiFormula').and.callThrough();
      service.GetKpiFormula(formulaModel);
      expect(service.GetKpiFormula).toHaveBeenCalled();
    })
  });
  describe('http GetKpiFormula',() => {
    it('http GetKpiFormula', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let formulaModel = 'test';
        service.GetKpiFormula(formulaModel).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/kpi-formula",formulaModel);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('UpdateFormulaByKPIId', () =>{
    it('spyOn UpdateFormulaByKPIId', () =>{
      let formulaModel = 'test';
      spyOn(service, 'UpdateFormulaByKPIId').and.callThrough();
      service.UpdateFormulaByKPIId(formulaModel);
      expect(service.UpdateFormulaByKPIId).toHaveBeenCalled();
    })
  });
  describe('http UpdateFormulaByKPIId',() => {
    it('http UpdateFormulaByKPIId', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let formulaModel = 'test';
        service.UpdateFormulaByKPIId(formulaModel).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/kpi/formula/update",formulaModel);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});