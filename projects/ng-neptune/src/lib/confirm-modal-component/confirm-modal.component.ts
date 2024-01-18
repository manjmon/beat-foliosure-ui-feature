import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from "@angular/core";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
@Component({
  selector: "confirm-modal",
  templateUrl: "./confirm-modal.component.html",
  styleUrls: ["./confirm-modal.component.scss"]
})
export class ConfirmModalComponent implements OnInit {
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
  @Input() customTop: string = "35%";
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  @Input() isToasterSuccess: boolean = true;
  @Input() popupToasterStyle = '';
  @Input() hasHeaderStyle = false;
  constructor(
    private toastrService: ToastrService) {}

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;}

  ngOnChanges() {
    if (this.toasterMessage !== '' && this.popupToasterStyle !== '') {
      if(this.isToasterSuccess){
        this.toastrService.success(this.toasterMessage,"",{positionClass:this.popupToasterStyle});
      } else{
        this.toastrService.error(this.toasterMessage,"",{positionClass:this.popupToasterStyle});
      }
    }
  }

  onPrimaryEvent() {
    this.primaryButtonEvent.emit();
  }

  onSecondaryEvent() {
    this.secondaryButtonEvent.emit();
  }
}
