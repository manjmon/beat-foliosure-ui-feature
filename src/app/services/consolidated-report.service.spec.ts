import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { ConsolidatedReportService } from "./consolidated-report.service";

describe("ConsolidatedReportService", () => {
  let service: ConsolidatedReportService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ConsolidatedReportService,
        { provide: Router, useFactory: routerStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.get(ConsolidatedReportService);
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
  describe('getConsolidatedReportConfiguration', () =>{
    it('spyOn getConsolidatedReportConfiguration', () =>{
      spyOn(service, 'getConsolidatedReportConfiguration').and.callThrough();
      service.getConsolidatedReportConfiguration();
      expect(service.getConsolidatedReportConfiguration).toHaveBeenCalled();
    })
  });
  describe('http getConsolidatedReportConfiguration',() => {
    it('http getConsolidatedReportConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getConsolidatedReportConfiguration().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"get/consolidated-report/config");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getConsolidatedReportKpis', () =>{
    it('spyOn getConsolidatedReportKpis', () =>{
        let templateId = 243;
      spyOn(service, 'getConsolidatedReportKpis').and.callThrough();
      service.getConsolidatedReportKpis(templateId);
      expect(service.getConsolidatedReportKpis).toHaveBeenCalled();
    })
  });
  describe('http getConsolidatedReportKpis',() => {
    it('http getConsolidatedReportKpis', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let templateId = 243;
        service.getConsolidatedReportKpis(templateId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"get/cr-report/kpis/"+templateId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getAllConfig', () =>{
    it('spyOn getAllConfig', () =>{
        let templateId = 243;
      spyOn(service, 'getAllConfig').and.callThrough();
      service.getAllConfig(templateId);
      expect(service.getAllConfig).toHaveBeenCalled();
    })
  });
  describe('http getAllConfig',() => {
    it('http getAllConfig', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let templateId = 243;
        service.getAllConfig(templateId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"c-report/template/config/"+templateId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('updateTemplate', () =>{
    it('spyOn updateTemplate', () =>{
        let template = 'test';
      spyOn(service, 'updateTemplate').and.callThrough();
      service.updateTemplate(template);
      expect(service.updateTemplate).toHaveBeenCalled();
    })
  });
  describe('http updateTemplate',() => {
    it('http updateTemplate', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let template = 'test';
        service.updateTemplate(template).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"c-report/template/update",template);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('addOrUpdateTemplate', () =>{
    it('spyOn addOrUpdateTemplate', () =>{
        let template = 'test';
      spyOn(service, 'addOrUpdateTemplate').and.callThrough();
      service.addOrUpdateTemplate(template);
      expect(service.addOrUpdateTemplate).toHaveBeenCalled();
    })
  });
  describe('http addOrUpdateTemplate',() => {
    it('http addOrUpdateTemplate', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let template = 'test';
        service.addOrUpdateTemplate(template).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"c-report/template/add",template);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('deleteTemplate', () =>{
    it('spyOn deleteTemplate', () =>{
        let templateId = 243;
      spyOn(service, 'deleteTemplate').and.callThrough();
      service.deleteTemplate(templateId);
      expect(service.deleteTemplate).toHaveBeenCalled();
    })
  });
  describe('http deleteTemplate',() => {
    it('http deleteTemplate', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let templateId = 243;
        service.deleteTemplate(templateId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"c-report/template/delete/"+templateId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('mapKpis', () =>{
    it('spyOn mapKpis', () =>{
        let config = 'test';
      spyOn(service, 'mapKpis').and.callThrough();
      service.mapKpis(config);
      expect(service.mapKpis).toHaveBeenCalled();
    })
  });
  describe('http mapKpis',() => {
    it('http mapKpis', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let config = 'test';
        service.mapKpis(config).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +"c-report/template/kpi/update",config);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
});