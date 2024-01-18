import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { IComponentCanDeactivate } from './component-can-deactivate';
import { DataService } from 'src/app/services/data-service.service';
import { ConfirmLeaveValuationComponent } from '../../components/Valuation-Model/valuation-model/confirm-leave-valuation/confirm-leave-valuation.component';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
@Injectable()
export class CanValuationDeactivateGuard implements CanDeactivate<IComponentCanDeactivate> {
  currentModelRef: any;
  status: boolean = false;
  constructor(private dataService: DataService, private modalService: NgbModal) {
  }

  canDeactivate(component: IComponentCanDeactivate): Observable<boolean> | Promise<boolean> | boolean {
    if (!component.canDeactivate()) {
      this.dataService.updateApprovalMessage(false);
      this.currentModelRef = this.modalService.open(
        ConfirmLeaveValuationComponent, { 
          windowClass : "myCustomModalClass",
          backdrop : false,
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
