import { Injectable } from '@angular/core';
import { ConfirmLeaveValuationComponent } from '../valuation-model/confirm-leave-valuation/confirm-leave-valuation.component';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { IComponentCanDeactivate } from "../../../unsaved-changes/can-deactivate/component-can-deactivate"
 @Injectable()
export class ValuationChangesGuard {
  currentModelRef: any;
  status: boolean = false;
  constructor(private modalService: NgbModal) {
  }

  canDeactivate(component: IComponentCanDeactivate): Promise<boolean> {
   
    return new Promise<boolean>((resolve) => {
      if (!component.canDeactivate()) {
        this.currentModelRef = this.modalService.open(
        ConfirmLeaveValuationComponent, {
        windowClass: "myCustomModalClass",
        backdrop: false,
        keyboard: false
      });
      this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
        this.status = status;
        if (this.status)
          resolve(true);
        else
        resolve(false); 
      });
    }
    else resolve(true);  
    });
  }
}
