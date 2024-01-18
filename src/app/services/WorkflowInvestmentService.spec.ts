import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { WorkflowInvestmentService } from './WorkflowInvestmentService';

describe('WorkflowInvestmentService', () => {
  let service: WorkflowInvestmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkflowInvestmentService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(WorkflowInvestmentService);
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
   describe('getWorkflowInvestmentKPIValues',()=>{
    it('should spy on getWorkflowInvestmentKPIValues', () =>{
      let filter = 'test';
      spyOn(service, 'getWorkflowInvestmentKPIValues').and.callThrough();
      service.getWorkflowInvestmentKPIValues(filter);
      expect(service.getWorkflowInvestmentKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowInvestmentKPIValues',() => {
    it('http getWorkflowInvestmentKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getWorkflowInvestmentKPIValues(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+"api/workflow/investment-kpi-value/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});
