import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { WorkflowTradingRecordsService } from './workflow-trading-records.service';

describe('WorkflowTradingRecordsService', () => {
  let service: WorkflowTradingRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkflowTradingRecordsService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(WorkflowTradingRecordsService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('errorHandler',()=>{
    it('should spy on', () =>{
      const value = true;
      spyOn(service, 'errorHandler').and.callThrough();
      service.errorHandler(value)
      expect(service.errorHandler).toHaveBeenCalled();
    });
   })
   describe('getWorkflowTradingRecordsKPIValues',()=>{
    it('should spy on getWorkflowTradingRecordsKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getWorkflowTradingRecordsKPIValues').and.callThrough();
      service.getWorkflowTradingRecordsKPIValues(filter);
      expect(service.getWorkflowTradingRecordsKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowTradingRecordsKPIValues',() => {
    it('http getWorkflowTradingRecordsKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getWorkflowTradingRecordsKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+"api/workflow/master-kpi-draft-values/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});