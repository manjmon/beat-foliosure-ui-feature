import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { WorkflowCompanyService } from './workflow-company.service';

describe('WorkflowCompanyService', () => {
  let service: WorkflowCompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkflowCompanyService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(WorkflowCompanyService);
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
   });
   describe('createWorkflow',()=>{
    it('should spy on', () =>{
      let workFlowRequest = 'test';
      spyOn(service, 'createWorkflow').and.callThrough();
      service.createWorkflow(workFlowRequest);
      expect(service.createWorkflow).toHaveBeenCalled();
    });
   });
   describe('http createWorkflow',() => {
    it('http createWorkflow', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workFlowRequest = 'test';
        service.createWorkflow(workFlowRequest).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/workflow/create", workFlowRequest);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateWorkflow',()=>{
    it('should spy on', () =>{
      let workFlowRequest = 'test';
      spyOn(service, 'updateWorkflow').and.callThrough();
      service.updateWorkflow(workFlowRequest);
      expect(service.updateWorkflow).toHaveBeenCalled();
    });
   });
   describe('http updateWorkflow',() => {
    it('http updateWorkflow', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workFlowRequest = 'test';
        service.updateWorkflow(workFlowRequest).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/workflow/Update", workFlowRequest);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getWorkflowStatus',()=>{
    it('should spy on', () =>{
      spyOn(service, 'getWorkflowStatus').and.callThrough();
      service.getWorkflowStatus();
      expect(service.getWorkflowStatus).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowStatus',() => {
    it('http getWorkflowStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workFlowRequest = 'test';
        service.getWorkflowStatus().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/workflow/status/get");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getWorkflowCurrentStatus',()=>{
    it('should spy on', () =>{
      let workFlowRequest = 'test';
      spyOn(service, 'getWorkflowCurrentStatus').and.callThrough();
      service.getWorkflowCurrentStatus(workFlowRequest);
      expect(service.getWorkflowCurrentStatus).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowCurrentStatus',() => {
    it('http getWorkflowCurrentStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workFlowRequest = 'test';
        service.getWorkflowCurrentStatus(workFlowRequest).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/workflow/submit/status",workFlowRequest);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('moveStatusToNextLevel',()=>{
    it('should spy on moveStatusToNextLevel', () =>{
      let workFlowRequest = 12;
      spyOn(service, 'moveStatusToNextLevel').and.callThrough();
      service.moveStatusToNextLevel(workFlowRequest);
      expect(service.moveStatusToNextLevel).toHaveBeenCalled();
    });
   });
   describe('http moveStatusToNextLevel',() => {
    it('http moveStatusToNextLevel', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workFlowRequest = 23;
        service.moveStatusToNextLevel(workFlowRequest).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/workflow/submit/next/${workFlowRequest}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('publishWorkflow',()=>{
    it('should spy on publishWorkflow', () =>{
      let workflowRequestId = 12;
      spyOn(service, 'publishWorkflow').and.callThrough();
      service.publishWorkflow(workflowRequestId);
      expect(service.publishWorkflow).toHaveBeenCalled();
    });
   });
   describe('http publishWorkflow',() => {
    it('http publishWorkflow', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workflowRequestId = 23;
        service.publishWorkflow(workflowRequestId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+`api/workflow/submit/publish/${workflowRequestId}`,'');
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyWorkFlowDraft',()=>{
    it('should spy on getCompanyWorkFlowDraft', () =>{
      let workflowRequestId = 12;
      let encryptedRequestId = 'defa1234fghsdesd';
      spyOn(service, 'getCompanyWorkFlowDraft').and.callThrough();
      service.getCompanyWorkFlowDraft(workflowRequestId, encryptedRequestId);
      expect(service.getCompanyWorkFlowDraft).toHaveBeenCalled();
    });
   });
   describe('http getCompanyWorkFlowDraft',() => {
    it('http getCompanyWorkFlowDraft', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workflowRequestId = 12;
        let encryptedRequestId = 'defa1234fghsdesd';
        service.getCompanyWorkFlowDraft(workflowRequestId, encryptedRequestId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/workflowrequest/IsCompanyWorkflowTable/${workflowRequestId}/${encryptedRequestId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getWorkflowPermissions',()=>{
    it('should spy on getWorkflowPermissions', () =>{
      let model = 'test';
      spyOn(service, 'getWorkflowPermissions').and.callThrough();
      service.getWorkflowPermissions(model);
      expect(service.getWorkflowPermissions).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowPermissions',() => {
    it('http getWorkflowPermissions', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let model = 'test';
        service.getWorkflowPermissions(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+'api/workflowrequest/getPermission/',model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('addWorkflowComment',()=>{
    it('should spy on addWorkflowComment', () =>{
      let comment = 'test';
      spyOn(service, 'addWorkflowComment').and.callThrough();
      service.addWorkflowComment(comment);
      expect(service.addWorkflowComment).toHaveBeenCalled();
    });
   });
   describe('http addWorkflowComment',() => {
    it('http addWorkflowComment', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let comment = 'test';
        service.addWorkflowComment(comment).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/workflow/AddOrUpdateComment`, comment);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateWorkflowRequest',()=>{
    it('should spy on updateWorkflowRequest', () =>{
      let request = 'test';
      spyOn(service, 'updateWorkflowRequest').and.callThrough();
      service.updateWorkflowRequest(request);
      expect(service.updateWorkflowRequest).toHaveBeenCalled();
    });
   });
   describe('http updateWorkflowRequest',() => {
    it('http updateWorkflowRequest', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let request = 'test';
        service.updateWorkflowRequest(request).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/workflow/updateStatus`, request);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getWorkflowComments',()=>{
    it('should spy on getWorkflowComments', () =>{
      let mappingId = 'test';
      spyOn(service, 'getWorkflowComments').and.callThrough();
      service.getWorkflowComments(mappingId);
      expect(service.getWorkflowComments).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowComments',() => {
    it('http getWorkflowComments', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let mappingId = 'test';
        service.getWorkflowComments(mappingId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/workflow/comments/get/${mappingId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('discardWorkflow',()=>{
    it('should spy on discardWorkflow', () =>{
      let workFlowRequest = 'test';
      spyOn(service, 'discardWorkflow').and.callThrough();
      service.discardWorkflow(workFlowRequest);
      expect(service.discardWorkflow).toHaveBeenCalled();
    });
   });
   describe('http discardWorkflow',() => {
    it('http discardWorkflow', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workFlowRequest = 'test';
        service.discardWorkflow(workFlowRequest).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/workflow/Discard", workFlowRequest);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPCCompanyKPIValues',()=>{
    it('should spy on getPCCompanyKPIValues', () =>{
      let id = 'test';
      spyOn(service, 'getPCCompanyKPIValues').and.callThrough();
      service.getPCCompanyKPIValues(id);
      expect(service.getPCCompanyKPIValues).toHaveBeenCalled();
    });
   });
   describe('http getPCCompanyKPIValues',() => {
    it('http getPCCompanyKPIValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let id = 'test';
        service.getPCCompanyKPIValues(id).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+  "api/workflow/company-kpi-values/get", id);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPortfolioCompanyOperationalKpiValues',()=>{
    it('should spy on getPortfolioCompanyOperationalKpiValues', () =>{
      let id = 'test';
      spyOn(service, 'getPortfolioCompanyOperationalKpiValues').and.callThrough();
      service.getPortfolioCompanyOperationalKpiValues(id);
      expect(service.getPortfolioCompanyOperationalKpiValues).toHaveBeenCalled();
    });
   });
   describe('http getPortfolioCompanyOperationalKpiValues',() => {
    it('http getPortfolioCompanyOperationalKpiValues', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let id = 'test';
        service.getPortfolioCompanyOperationalKpiValues(id).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/workflow/operational-kpi-values/get", id);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateWorkflowKpiValue',()=>{
    it('should spy on updateWorkflowKpiValue', () =>{
      let model = 'test';
      spyOn(service, 'updateWorkflowKpiValue').and.callThrough();
      service.updateWorkflowKpiValue(model);
      expect(service.updateWorkflowKpiValue).toHaveBeenCalled();
    });
   });
   describe('http updateWorkflowKpiValue',() => {
    it('http updateWorkflowKpiValue', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let model = 'test';
        service.updateWorkflowKpiValue(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ 'api/workflow/investment/update-kpi',model);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('ResetWorkflowStatus',()=>{
    it('should spy on ResetWorkflowStatus', () =>{
      let workflowRequestId = 23;
      spyOn(service, 'ResetWorkflowStatus').and.callThrough();
      service.ResetWorkflowStatus(workflowRequestId);
      expect(service.ResetWorkflowStatus).toHaveBeenCalled();
    });
   });
   describe('http ResetWorkflowStatus',() => {
    it('http ResetWorkflowStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workflowRequestId = 23;
        service.ResetWorkflowStatus(workflowRequestId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/workflow/status/reset/${workflowRequestId}`,'');
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('UpdateWorkflowMappingStatus',()=>{
    it('should spy on UpdateWorkflowMappingStatus', () =>{
      let workflowRequestMappingId = 23;
      spyOn(service, 'UpdateWorkflowMappingStatus').and.callThrough();
      service.UpdateWorkflowMappingStatus(workflowRequestMappingId);
      expect(service.UpdateWorkflowMappingStatus).toHaveBeenCalled();
    });
   });
   describe('http UpdateWorkflowMappingStatus',() => {
    it('http UpdateWorkflowMappingStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workflowRequestMappingId = 23;
        service.UpdateWorkflowMappingStatus(workflowRequestMappingId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/workflow/mappingstatus/update/${workflowRequestMappingId}`,'');
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getWorkflowAllDetails',()=>{
    it('should spy on getWorkflowAllDetails', () =>{
      let workflowRequestId = 23;
      spyOn(service, 'getWorkflowAllDetails').and.callThrough();
      service.getWorkflowAllDetails(workflowRequestId);
      expect(service.getWorkflowAllDetails).toHaveBeenCalled();
    });
   });
   describe('http getWorkflowAllDetails',() => {
    it('http getWorkflowAllDetails', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let workflowRequestId = 23;
        service.getWorkflowAllDetails(workflowRequestId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/workflow/GetAll/${workflowRequestId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});
