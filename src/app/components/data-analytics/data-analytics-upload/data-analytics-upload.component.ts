import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { DataAnalyticsConstants } from "src/app/common/constants";
import { DataAnalyticsService } from "src/app/services/data-analytics.service";
@Component({
  selector: 'app-data-analytics-upload',
  templateUrl: './data-analytics-upload.component.html',
  styleUrls: ['./data-analytics-upload.component.scss']
})
export class DataAnalyticsUploadComponent implements OnInit {
  @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
  @Output() onInputChanges: EventEmitter<any> = new EventEmitter();
  browseicon = true;
  defaultPlaceholder = "Browse"
  uploadFilePlaceholder = this.defaultPlaceholder;
  ProgressCancel: boolean = true;
  FileProgresStatus: string = DataAnalyticsConstants.CancelFileProgress;
  @ViewChild("fileUploader") fileUploader: any = {};
  messageClass: string = "bulkMessage";
  safeHtml: any;
  errorUploadDetails=[];
  uploadedFiles: any[] = [];
  value: number = 0;
  toastContainer: ToastContainerDirective;
  files = [];
  constructor(
    private toastrService: ToastrService,
    private dataAnalyticsService: DataAnalyticsService
  ) {
   // will do
  }
  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }

  onUpload() {
    const formData = new FormData();
    Array.from(this.files).forEach((file:any,index) => {
      formData.append('files[]', file);
    });
    this.dataAnalyticsService.uploadAnalyticsFiles(formData).subscribe({
      next: (result) => {
        if(result != null && result.code == "ok" && result.uploadedFiles && result.uploadedFiles.length>0){
          this.onInputChanges.emit(result.uploadedFiles);
          this.toastrService.success(result.message,"",{positionClass:"toast-center-center"});
        }else{
          this.toastrService.error(result.message,"",{positionClass:"toast-center-center"});
        }
      },
    });
  }
  onClose()
  {
    this.onClosePopUpClick.emit(false);
  }
  onSelect(files: any) {
    this.files = [];
    this.uploadedFiles = [];
    this.errorUploadDetails=[];
    Array.from(files).forEach((file:any,index) => {
      if (file.size/DataAnalyticsConstants.KiloByteSize/DataAnalyticsConstants.KiloByteSize > DataAnalyticsConstants.MaxFileSize) {
        this.messageClass = "errorMessage";
        this.safeHtml = DataAnalyticsConstants.FileSize;
        this.files = [];
        this.toastrService.error(DataAnalyticsConstants.FileSize,"",{positionClass:"toast-center-center"});
      } 
      if(file.size/DataAnalyticsConstants.KiloByteSize/DataAnalyticsConstants.KiloByteSize < DataAnalyticsConstants.MaxFileSize && index ==files.length-1) {
        this.ProgressCancel = true;
        this.value = 0;
        this.files = files;
        this.FileProgresStatus = DataAnalyticsConstants.CancelFileProgress;
        this.uploadFilePlaceholder = files[0].name;
        this.browseicon = false;
      }
     });
  }
  deleteIconClick() {
    this.errorUploadDetails=[];
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseicon = true;
    this.safeHtml = "";
  }
}
