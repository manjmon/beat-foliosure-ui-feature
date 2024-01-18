import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { InternalReportService } from './internal-report.service';

describe('investorService', () => {
  let service: InternalReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InternalReportService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(InternalReportService);
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
  describe('getInternalReportConfiguration', () =>{
    it('spyOn getInternalReportConfiguration', () =>{
      spyOn(service, 'getInternalReportConfiguration').and.callThrough();
      service.getInternalReportConfiguration();
      expect(service.getInternalReportConfiguration).toHaveBeenCalled();
    })
  });
  describe('http getInternalReportConfiguration',() => {
    it('http getInternalReportConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getInternalReportConfiguration().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "get/internal-report/config");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getInternalReportKpis', () =>{
    it('spyOn getInternalReportKpis', () =>{
        let companyId = 45;
        let templateId =33;
      spyOn(service, 'getInternalReportKpis').and.callThrough();
      service.getInternalReportKpis(companyId, templateId);
      expect(service.getInternalReportKpis).toHaveBeenCalled();
    })
  });
  describe('http getInternalReportKpis',() => {
    it('http getInternalReportKpis', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let companyId = 45;
        let templateId =33;
        service.getInternalReportKpis(companyId,templateId ).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "get/internal-report/kpis/"+companyId+"/"+templateId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getAllConfig', () =>{
    it('spyOn getAllConfig', () =>{
        let templateId =33;
      spyOn(service, 'getAllConfig').and.callThrough();
      service.getAllConfig(templateId);
      expect(service.getAllConfig).toHaveBeenCalled();
    })
  });
  describe('http getAllConfig',() => {
    it('http getAllConfig', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let templateId =33;
        service.getAllConfig(templateId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "template/config/"+templateId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateTemplate', () =>{
    it('spyOn updateTemplate', () =>{
        let template =33;
      spyOn(service, 'updateTemplate').and.callThrough();
      service.updateTemplate(template);
      expect(service.updateTemplate).toHaveBeenCalled();
    })
  });
  describe('http updateTemplate',() => {
    it('http updateTemplate', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let template =33;
        service.updateTemplate(template).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "template/update",template);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('mapKpis', () =>{
    it('spyOn mapKpis', () =>{
        let template =33;
      spyOn(service, 'mapKpis').and.callThrough();
      service.mapKpis(template);
      expect(service.mapKpis).toHaveBeenCalled();
    })
  });
  describe('http mapKpis',() => {
    it('http mapKpis', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let config =33;
        service.mapKpis(config).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl +  "template/kpi/update",config);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('addOrUpdateTemplate', () =>{
    it('spyOn addOrUpdateTemplate', () =>{
        let template =33;
      spyOn(service, 'addOrUpdateTemplate').and.callThrough();
      service.addOrUpdateTemplate(template);
      expect(service.addOrUpdateTemplate).toHaveBeenCalled();
    })
  });
  describe('http addOrUpdateTemplate',() => {
    it('http addOrUpdateTemplate', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let template =33;
        service.addOrUpdateTemplate(template).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "template/add",template);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('deleteTemplate', () =>{
    it('spyOn deleteTemplate', () =>{
        let template =33;
      spyOn(service, 'deleteTemplate').and.callThrough();
      service.deleteTemplate(template);
      expect(service.deleteTemplate).toHaveBeenCalled();
    })
  });
  describe('http deleteTemplate',() => {
    it('http deleteTemplate', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let template =33;
        service.deleteTemplate(template).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "template/delete/"+template);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});