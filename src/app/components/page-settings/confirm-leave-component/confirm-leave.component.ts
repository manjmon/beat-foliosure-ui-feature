import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-confirm-leave',
  templateUrl: './confirm-leave.component.html'
})
export class ConfirmLeaveComponent {

  subject: Subject<boolean>;
  @Output() onSave = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal,) { }

  CloseModal(CloseModal: any) {
    if (CloseModal == 'Yes') {
      this.onSave.emit(true);
      this.activeModal.close();
    }
    else {
      this.onSave.emit(false);
      this.activeModal.close();
    }
  }
}