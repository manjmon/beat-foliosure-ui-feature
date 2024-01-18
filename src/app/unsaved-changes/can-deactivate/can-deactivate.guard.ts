import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { IComponentCanDeactivate } from './component-can-deactivate';
import { DataService } from 'src/app/services/data-service.service';
import { ConfirmLeaveComponent } from '../../components/page-settings/confirm-leave-component/confirm-leave.component';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<IComponentCanDeactivate> {
  currentModelRef: any;
  status: boolean = false;
  constructor(private dataService: DataService, private modalService: NgbModal) {
  }

  canDeactivate(component: IComponentCanDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    if (!component.canDeactivate()) {
      this.dataService.updateApprovalMessage(false);
      this.currentModelRef = this.modalService.open(
        ConfirmLeaveComponent, { 
          windowClass : "myCustomModalClass",
          backdrop : 'static',
          keyboard : false}
      );
      this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
        this.status = status;
      })
      return this.currentModelRef.result.then(() => {
        return this.status
      }, () => { console.log('Backdrop click') })

    }
    return true;
  }
}
