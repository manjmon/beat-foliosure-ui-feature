import { TestBed } from '@angular/core/testing';
import { DataService } from './data-service.service';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DataService] });
    service = TestBed.get(DataService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('changeWorkflowRequestId', () =>{
    it('spyOn changeWorkflowRequestId', () =>{
      let id = 'test123';
      spyOn(service, 'changeWorkflowRequestId').and.callThrough();
      service.changeWorkflowRequestId(id);
      expect(service.changeWorkflowRequestId).toHaveBeenCalled();
    })
  });
  // describe('changeWorkflowMappingId', () =>{
  //   it('spyOn changeWorkflowMappingId', () =>{
  //     let id = 'test123';
  //     spyOn(service, 'changeWorkflowMappingId').and.callThrough();
  //     service.changeWorkflowMappingId(id);
  //     expect(service.changeWorkflowMappingId).toHaveBeenCalled();
  //   })
  // });
  describe('updateApprovalMessage', () =>{
    it('spyOn updateApprovalMessage', () =>{
      let message = true;
      spyOn(service, 'updateApprovalMessage').and.callThrough();
      service.updateApprovalMessage(message);
      expect(service.updateApprovalMessage).toHaveBeenCalled();
    })
  });
});
