import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
@Component({
  selector: "modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"]
})
export class ModalComponent implements OnInit {
  @Input() primaryButtonName: string = "";
  @Input() secondaryButtonName: string = "";
  @Input() customwidth: string = "456px";
  @Input() modalTitle: string = "";
  @Input() modalBody1: string = "";
  @Input() modalBody2: string = "";
  @Input() disablePrimaryButton: boolean = false;
  @Input() IsInfoPopup: boolean = false;
  @Output() primaryButtonEvent = new EventEmitter<any>();
  @Output() secondaryButtonEvent = new EventEmitter<any>();
  @Input() toasterMessage = "";
  @Output() showToasterMessage = new EventEmitter<any>();

  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  constructor(
    private toastrService: ToastrService) {}

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;}

  ngOnChanges() {
    if (this.toasterMessage !== '') {
      this.toastrService.success(this.toasterMessage,"",{positionClass:"custom-toast"});
    }
  }

  onPrimaryEvent() {
    this.primaryButtonEvent.emit();
  }

  onSecondaryEvent() {
    this.secondaryButtonEvent.emit();
  }
}
