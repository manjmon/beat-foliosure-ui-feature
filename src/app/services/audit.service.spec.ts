import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { AuditService } from "./audit.service";

describe("AuditService", () => {
  let service: AuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(AuditService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
  describe('UpdateKPIData', () =>{
    it('spyOn UpdateKPIData', () =>{
      let dataauditlog = 'test';
      spyOn(service, 'UpdateKPIData').and.callThrough();
      service.UpdateKPIData(dataauditlog);
      expect(service.UpdateKPIData).toHaveBeenCalled();
    })
  });
  describe('http UpdateKPIData',() => {
    it('http UpdateKPIData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let dataauditlog = 'test';
        service.UpdateKPIData(dataauditlog).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/DataAudit/ResetKPI", dataauditlog);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('UpdateKPI', () =>{
    it('spyOn UpdateKPI', () =>{
      let dataauditlog = 'test';
      spyOn(service, 'UpdateKPI').and.callThrough();
      service.UpdateKPI(dataauditlog);
      expect(service.UpdateKPI).toHaveBeenCalled();
    })
  });
  describe('http UpdateKPI',() => {
    it('http UpdateKPI', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let dataauditlog = 'test';
        service.UpdateKPI(dataauditlog).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/pc-kpis/update-kpi", dataauditlog);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getMasterKpiAuditLog', () =>{
    it('spyOn getMasterKpiAuditLog', () =>{
      let datalog = 'test';
      spyOn(service, 'getMasterKpiAuditLog').and.callThrough();
      service.getMasterKpiAuditLog(datalog);
      expect(service.getMasterKpiAuditLog).toHaveBeenCalled();
    })
  });
  describe('http getMasterKpiAuditLog',() => {
    it('http getMasterKpiAuditLog', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let datalog = 'test';
        service.getMasterKpiAuditLog(datalog).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/master-kpis/auditlog", datalog);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('revertMasterKpiData', () =>{
    it('spyOn revertMasterKpiData', () =>{
      let dataauditlog = 'test';
      spyOn(service, 'revertMasterKpiData').and.callThrough();
      service.revertMasterKpiData(dataauditlog);
      expect(service.revertMasterKpiData).toHaveBeenCalled();
    })
  });
  describe('http revertMasterKpiData',() => {
    it('http revertMasterKpiData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let dataauditlog = 'test';
        service.revertMasterKpiData(dataauditlog).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/master-kpi-values/update", dataauditlog);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('exportMasterKpiAuditLog', () =>{
    it('spyOn exportMasterKpiAuditLog', () =>{
      let datalog = 'test';
      spyOn(service, 'exportMasterKpiAuditLog').and.callThrough();
      service.exportMasterKpiAuditLog(datalog);
      expect(service.exportMasterKpiAuditLog).toHaveBeenCalled();
    })
  });
});