import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { ImpliedEvService } from './implied-ev.service';

describe("FilterService", () => {
  let service: ImpliedEvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImpliedEvService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(ImpliedEvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('setCopmValues', () => {
    it('should spy on setCopmValues', () =>{
      let copmValues = {
        data: 'test'
      }
      spyOn(service, 'setCopmValues').and.callThrough();
      service.setCopmValues(copmValues);
      expect(service.setCopmValues).toHaveBeenCalled();
    })
  });
  describe('getCopmValues', () => {
    it('should spy on getCopmValues', () =>{
      let copmValues = {
        data: 'test'
      }
      spyOn(service, 'getCopmValues').and.returnValue(copmValues);
      service.getCopmValues();
      expect(service.getCopmValues).toHaveBeenCalled();
    })
  });
  describe('setHeaders', () => {
    it('should spy on setHeaders', () =>{
      let headers = {
        data: '2021A'
      }
      spyOn(service, 'setHeaders').and.callThrough();
      service.setHeaders(headers);
      expect(service.setHeaders).toHaveBeenCalled();
    })
  });
  describe('setdropdownvalues', () => {
    it('should spy on setdropdownvalues', () =>{
      let kpiModel = <any>{
        kpiName: '2021A'
      };
      let kpiId = 21;
      spyOn(service, 'setdropdownvalues').and.callThrough();
      service.setdropdownvalues(kpiModel, kpiId);
      expect(service.setdropdownvalues).toHaveBeenCalled();
    })
  });
  describe('setKpiData', () => {
    it('should spy on setKpiData', () =>{
      let kpiData = <any>{
        kpiData: 'test'
      };
      spyOn(service, 'setKpiData').and.callThrough();
      service.setKpiData(kpiData);
      expect(service.setKpiData).toHaveBeenCalled();
    })
  });
  describe('setColumsWithoutSector', () => {
    it('should spy on setColumsWithoutSector', () =>{
      let ColumsWithoutSector = 'test';
      spyOn(service, 'setColumsWithoutSector').and.callThrough();
      service.setColumsWithoutSector(ColumsWithoutSector);
      expect(service.setColumsWithoutSector).toHaveBeenCalled();
    })
  });
  describe('getHeaders', () => {
    it('should spy on getHeaders', () =>{
      spyOn(service, 'getHeaders').and.callThrough();
      service.getHeaders();
      expect(service.getHeaders).toHaveBeenCalled();
    })
  });
  describe('setCheckBoxStateSubject', () => {
    it('should spy on setCheckBoxStateSubject', () =>{
      let value = false;
      spyOn(service, 'setCheckBoxStateSubject').and.callThrough();
      service.setCheckBoxStateSubject(value);
      expect(service.setCheckBoxStateSubject).toHaveBeenCalled();
    })
  });
  describe('getdropdownValues', () => {
    it('should spy on getdropdownValues', () =>{
      spyOn(service, 'getdropdownValues').and.callThrough();
      service.getdropdownValues();
      expect(service.getdropdownValues).toHaveBeenCalled();
    })
  });
  describe('getColumsWithoutSector', () => {
    it('should spy on getColumsWithoutSector', () =>{
      spyOn(service, 'getColumsWithoutSector').and.callThrough();
      service.getColumsWithoutSector();
      expect(service.getColumsWithoutSector).toHaveBeenCalled();
    })
  });
  describe('setTransactionTabStateSubject', () => {
    it('should spy on setTransactionTabStateSubject', () =>{
      let tab = 'test';
      spyOn(service, 'setTransactionTabStateSubject').and.callThrough();
      service.setTransactionTabStateSubject(tab);
      expect(service.setTransactionTabStateSubject).toHaveBeenCalled();
    })
  });
  describe('getTransactionSelectedTab', () => {
    it('should spy on getTransactionSelectedTab', () =>{
      spyOn(service, 'getTransactionSelectedTab').and.callThrough();
      service.getTransactionSelectedTab();
      expect(service.getTransactionSelectedTab).toHaveBeenCalled();
    })
  });
  describe('setValuationId', () => {
    it('should spy on setValuationId', () =>{
      let id = 21;
      let reportId = 'test';
      spyOn(service, 'setValuationId').and.callThrough();
      service.setValuationId(id, reportId);
      expect(service.setValuationId).toHaveBeenCalled();
    })
  });
  describe('getValuationId', () => {
    it('should spy on getValuationId', () =>{
      spyOn(service, 'getValuationId').and.callThrough();
      service.getValuationId();
      expect(service.getValuationId).toHaveBeenCalled();
    })
  });
  describe('setUnselectedRecords', () => {
    it('should spy on setUnselectedRecords', () =>{
      let records = 'test';
      spyOn(service, 'setUnselectedRecords').and.callThrough();
      service.setUnselectedRecords(records);
      expect(service.setUnselectedRecords).toHaveBeenCalled();
    })
  });
  describe('getUnselectedRecords', () => {
    it('should spy on getUnselectedRecords', () =>{
      spyOn(service, 'getUnselectedRecords').and.callThrough();
      service.getUnselectedRecords();
      expect(service.getUnselectedRecords).toHaveBeenCalled();
    })
  });
  describe('setRawDataTradingComps', () => {
    it('should spy on setRawDataTradingComps', () =>{
      let raw = 'test';
      spyOn(service, 'setRawDataTradingComps').and.callThrough();
      service.setRawDataTradingComps(raw);
      expect(service.setRawDataTradingComps).toHaveBeenCalled();
    })
  });
  describe('getRawDataTradingComps', () => {
    it('should spy on getRawDataTradingComps', () =>{
      spyOn(service, 'getRawDataTradingComps').and.callThrough();
      service.getRawDataTradingComps();
      expect(service.getRawDataTradingComps).toHaveBeenCalled();
    })
  });
  describe('getRefreshValuationComponent', () => {
    it('should spy on getRefreshValuationComponent', () =>{
      spyOn(service, 'getRefreshValuationComponent').and.callThrough();
      service.getRefreshValuationComponent();
      expect(service.getRefreshValuationComponent).toHaveBeenCalled();
    })
  });
  describe('setRefreshValuationComponent', () => {
    it('should spy on setRefreshValuationComponent', () =>{
      let value = false;
      spyOn(service, 'setRefreshValuationComponent').and.callThrough();
      service.setRefreshValuationComponent(value);
      expect(service.setRefreshValuationComponent).toHaveBeenCalled();
    })
  });
  describe('errorHandler', () =>{
    it('spyOn errorHandler', () =>{
      let error = 'Errors occured'
      spyOn(service, 'errorHandler').and.callThrough();
      service.errorHandler(error);
      expect(service.errorHandler).toHaveBeenCalled();
    })
  });
  describe('getEmpliedEvDetails', () =>{
    it('spyOn getEmpliedEvDetails', () =>{
      let valuationId = 21;
      let valuationReportId = 'test';
      let kpiId = 23;
      spyOn(service, 'getEmpliedEvDetails').and.callThrough();
      service.getEmpliedEvDetails(valuationId, valuationReportId, kpiId);
      expect(service.getEmpliedEvDetails).toHaveBeenCalled();
    })
  });
  describe('http getEmpliedEvDetails',() => {
    it('http getEmpliedEvDetails', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let valuationId = 21;
        let valuationReportId = 'test';
        let kpiId = 23;
        service.getEmpliedEvDetails(valuationId, valuationReportId, kpiId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/implied-ev/get?valuationId="+ valuationId + "&kpiId=" + kpiId + "&valuationReportId=" + valuationReportId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('saveImpliedEvValue', () =>{
    it('spyOn saveImpliedEvValue', () =>{
     let model = 'test';
      spyOn(service, 'saveImpliedEvValue').and.callThrough();
      service.saveImpliedEvValue(model);
      expect(service.saveImpliedEvValue).toHaveBeenCalled();
    })
  });
  describe('http saveImpliedEvValue',() => {
    it('http saveImpliedEvValue', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let model = 'test';
        service.saveImpliedEvValue(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/implied-ev/save", model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getTargetKpiValue', () =>{
    it('spyOn getTargetKpiValue', () =>{
     let model = 'test';
      spyOn(service, 'getTargetKpiValue').and.callThrough();
      service.getTargetKpiValue(model);
      expect(service.getTargetKpiValue).toHaveBeenCalled();
    })
  });
  describe('http getTargetKpiValue',() => {
    it('http getTargetKpiValue', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let model = 'test';
        service.getTargetKpiValue(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/implied-ev/get-target-kpi-calculated-value", model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('setInternalSelectedTabName', () =>{
    it('spyOn setInternalSelectedTabName', () =>{
     let selectedTab = 'test';
      spyOn(service, 'setInternalSelectedTabName').and.callThrough();
      service.setInternalSelectedTabName(selectedTab);
      expect(service.setInternalSelectedTabName).toHaveBeenCalled();
    })
  });
  describe('getInternalSelectedTabName', () =>{
    it('spyOn getInternalSelectedTabName', () =>{
      spyOn(service, 'getInternalSelectedTabName').and.callThrough();
      service.getInternalSelectedTabName();
      expect(service.getInternalSelectedTabName).toHaveBeenCalled();
    })
  });
});
