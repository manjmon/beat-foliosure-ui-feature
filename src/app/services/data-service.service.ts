import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private workflowRequestId = new BehaviorSubject('workflowRequestId');
  private workflowMappingId = new BehaviorSubject('workflowMappingId');
  currentWorkflowRequest = this.workflowRequestId.asObservable();
  currentWorkflowMappingId = this.workflowMappingId.asObservable();

  private deactivateStageMessage = new BehaviorSubject(null);
  currentApprovalStageMessage = this.deactivateStageMessage.asObservable();

  changeWorkflowRequestId(id: string) {
    this.workflowRequestId.next(id);
  }
  changeWorkflowMappingId(id: string) {
    this.workflowMappingId.next(id);
  }
  updateApprovalMessage(message: boolean) {
    this.deactivateStageMessage.next(message)
    }
}
