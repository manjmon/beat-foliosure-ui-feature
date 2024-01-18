import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { WorkflowAccessService } from './workflow-access.service';

describe('WorkflowAccessService', () => {
  let service: WorkflowAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkflowAccessService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(WorkflowAccessService);
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
   describe('updateGroupPermission',()=>{
    it('should spy on', () =>{
      let permissionModel = 'test';
      spyOn(service, 'updateGroupPermission').and.callThrough();
      service.updateGroupPermission(permissionModel);
      expect(service.updateGroupPermission).toHaveBeenCalled();
    });
   });
   describe('http updateGroupPermission',() => {
    it('http updateGroupPermission', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let permissionModel = 'test';
        service.updateGroupPermission(permissionModel).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/mapping/subfeatures/update/", permissionModel);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getGroups',()=>{
    it('should spy getGroups  ', () =>{
      let filter = 'test';
      spyOn(service, 'getGroups').and.callThrough();
      service.getGroups(filter);
      expect(service.getGroups).toHaveBeenCalled();
    });
   });
   describe('http getGroups',() => {
    it('http getGroups', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getGroups(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+"api/group/getgrouplists",filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('createGroup',()=>{
    it('should spy createGroup  ', () =>{
      let group = 'test';
      spyOn(service, 'createGroup').and.callThrough();
      service.createGroup(group);
      expect(service.createGroup).toHaveBeenCalled();
    });
   });
   describe('http createGroup',() => {
    it('http createGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let group = 'test';
        service.createGroup(group).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+"api/mastergroup/addupdate", group);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('createSubGroup',()=>{
    it('should spy createSubGroup  ', () =>{
      let subGroup = 'test';
      spyOn(service, 'createSubGroup').and.callThrough();
      service.createSubGroup(subGroup);
      expect(service.createSubGroup).toHaveBeenCalled();
    });
   });
   describe('http createSubGroup',() => {
    it('http createSubGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let subGroup = 'test';
        service.createSubGroup(subGroup).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+"api/subGroup/add", subGroup);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('checkIfAdmin',()=>{
    it('should spy checkIfAdmin  ', () =>{
      spyOn(service, 'checkIfAdmin').and.callThrough();
      service.checkIfAdmin();
      expect(service.checkIfAdmin).toHaveBeenCalled();
    });
   });
   describe('http checkIfAdmin',() => {
    it('http checkIfAdmin', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.checkIfAdmin().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+"api/group/checkIfAdmin");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});