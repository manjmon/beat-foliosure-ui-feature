import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-leave-valuation',
  templateUrl: './confirm-leave-valuation.component.html'
})

export class ConfirmLeaveValuationComponent {

  subject: Subject<boolean>;
  @Output() onSave = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal,) { }

  CloseModal(CloseModal: any) {
    if (CloseModal == 'Yes') {
      this.onSave.emit(true);
      this.activeModal.close();
      localStorage.removeItem("tempEVData");
      localStorage.removeItem("tempEquityValueData");
    }
    else {
      this.onSave.emit(false);
      this.activeModal.close();
    }
  }
}
