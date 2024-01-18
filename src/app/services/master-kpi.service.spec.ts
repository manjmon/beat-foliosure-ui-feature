import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { MasterKpiService } from './master-kpi.service';

describe('MasterKpiService', () => {
  let service: MasterKpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MasterKpiService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(MasterKpiService);
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
  describe('getMasterKPIValues', () =>{
    it('spyOn getMasterKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getMasterKPIValues').and.callThrough();
      service.getMasterKPIValues(filter);
      expect(service.getMasterKPIValues).toHaveBeenCalled();
    })
  });
  describe('http getMasterKPIValues',() => {
    it('http getMasterKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getMasterKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "api/portfolio-company/master-kpi-values/get",
         filter
        );
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getBetaMasterKPIValues', () =>{
    it('spyOn getBetaMasterKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getBetaMasterKPIValues').and.callThrough();
      service.getBetaMasterKPIValues(filter);
      expect(service.getBetaMasterKPIValues).toHaveBeenCalled();
    })
  });
  describe('http getBetaMasterKPIValues',() => {
    it('http getBetaMasterKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getBetaMasterKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl + "api/pc-kpis/master-kpi",
         filter
        );
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});