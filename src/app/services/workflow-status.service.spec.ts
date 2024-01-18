import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { WorkflowStatusService } from './workflow-status.service';

describe('WorkflowStatusService', () => {
  let service: WorkflowStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkflowStatusService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(WorkflowStatusService);
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
   describe('http getWorkflowStatus',() => {
    it('http getWorkflowStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.getWorkflowStatus().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/WorkFlowStatus/get");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('addOrUpdateWorkflowStatus',()=>{
    it('should spy on addOrUpdateWorkflowStatus', () =>{
      let workFlowStatus = 'test';
      spyOn(service, 'addOrUpdateWorkflowStatus').and.callThrough();
      service.addOrUpdateWorkflowStatus(workFlowStatus);
      expect(service.addOrUpdateWorkflowStatus).toHaveBeenCalled();
    });
   });
   describe('http addOrUpdateWorkflowStatus',() => {
    it('http addOrUpdateWorkflowStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workFlowStatus = 'test';
        service.addOrUpdateWorkflowStatus(workFlowStatus).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/WorkFlowStatus/add-or-update", workFlowStatus);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('deleteWorkflowStatus',()=>{
    it('should spy on deleteWorkflowStatus', () =>{
      let statusId = 567;
      spyOn(service, 'deleteWorkflowStatus').and.callThrough();
      service.deleteWorkflowStatus(statusId);
      expect(service.deleteWorkflowStatus).toHaveBeenCalled();
    });
   });
   describe('http deleteWorkflowStatus',() => {
    it('http deleteWorkflowStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let statusId = 454;
        service.deleteWorkflowStatus(statusId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+  "api/WorkFlowStatus/delete/" + statusId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('MapStatusToGroup',()=>{
    it('should spy on MapStatusToGroup', () =>{
      let workFlowStatus = 'test';
      spyOn(service, 'MapStatusToGroup').and.callThrough();
      service.MapStatusToGroup(workFlowStatus);
      expect(service.MapStatusToGroup).toHaveBeenCalled();
    });
   });
   describe('http MapStatusToGroup',() => {
    it('http MapStatusToGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workFlowStatus = 'test';
        service.MapStatusToGroup(workFlowStatus).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/WorkFlowStatus/mapStatusToGroup", workFlowStatus);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});