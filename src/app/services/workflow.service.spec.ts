import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { WorkflowService } from './workflow.service';

describe('WorkflowService', () => {
  let service: WorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkflowService,{ provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(WorkflowService);
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
   describe('getWorkflowStatus',()=>{
    it('should spy on getWorkflowStatus', () =>{
      spyOn(service, 'getWorkflowStatus').and.callThrough();
      service.getWorkflowStatus();
      expect(service.getWorkflowStatus).toHaveBeenCalled();
    });
   });
   describe('getWorkflowDetails',()=>{
    it('should spy on getWorkflowDetails', () =>{
      let featureId = 957;
      let requestId = 756;
      spyOn(service, 'getWorkflowDetails').and.callThrough();
      service.getWorkflowDetails(featureId, requestId);
      expect(service.getWorkflowDetails).toHaveBeenCalled();
    });
   });
});