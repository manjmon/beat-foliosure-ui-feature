import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { DataAnalyticsConstants } from "src/app/common/constants";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable,  throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Component({
  selector: 'app-common-upload',
  templateUrl: './common-upload.component.html',
  styleUrls: ['../../data-analytics/data-analytics-upload/data-analytics-upload.component.scss','./common-upload.component.scss']
})
export class CommonUploadComponent implements OnInit {
  @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
  @Output() onInputChanges: EventEmitter<any> = new EventEmitter();
  browseIcon = true;
  @Input() apiUrl = "";
  title: string = "Excel plugin upload";
  header = "Upload latest excel plugin";
  defaultPlaceholder = "Browse";
  descriptionFiles = "Acceptable file format is Zip file";
  acceptFiles = ".zip"
  uploadFilePlaceholder = this.defaultPlaceholder;
  progressCancel: boolean = true;
  fileProgressStatus: string = DataAnalyticsConstants.CancelFileProgress;
  @ViewChild("fileUploader") fileUploader: any = {};
  messageClass: string = "bulkMessage";
  safeHtml: any;
  errorUploadDetails = [];
  uploadedFiles: any[] = [];
  value: number = 0;
  toastContainer: ToastContainerDirective;
  files = [];
  hostURL: string;
  options = {}
  constructor(
    private toastService: ToastrService, private httpClient: HttpClient, @Inject("BASE_URL") baseUrl: string
  ) {
    this.hostURL = baseUrl;
    this.options = {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
      })
    }
  }
  ngOnInit() {
    this.toastService.overlayContainer = this.toastContainer;
  }

  onUpload() {
    this.apiUrl = "api/excel-plugin/upload";
    const formData = new FormData();
    Array.from(this.files).forEach((file: any, index) => {
      formData.append('file', file);
    });
    this._post(formData, this.apiUrl).subscribe({
      next: (result) => {
        if (result != null && result.code == "ok") {
          this.toastService.success(result.message, "", { positionClass: "toast-center-center" });
          this.onClose();
        } else {
          this.toastService.error(result.message, "", { positionClass: "toast-center-center" });
          this.deleteIconClick();
        }
      },
    });
  }
  onClose() {
    this.onClosePopUpClick.emit(false);
  }
  _post(_data: any, _getUrl: string): Observable<any> {
    return this.httpClient.post<any>(this.hostURL + _getUrl, _data)
      .pipe(
        map((response) => response),
        catchError((error) => this.errorHandler(error))
      );
  }
  errorHandler(error: any) {
    return throwError(() => error);
  }
  onSelect(files: any) {
    this.files = [];
    this.uploadedFiles = [];
    this.errorUploadDetails = [];
    Array.from(files).forEach((file: any, index) => {
      if (file.size / DataAnalyticsConstants.KiloByteSize / DataAnalyticsConstants.KiloByteSize > DataAnalyticsConstants.MaxFileSize) {
        this.messageClass = "errorMessage";
        this.safeHtml = DataAnalyticsConstants.FileSize;
        this.files = [];
        this.toastService.error(DataAnalyticsConstants.FileSize, "", { positionClass: "toast-center-center" });
      }
      if (file.size / DataAnalyticsConstants.KiloByteSize / DataAnalyticsConstants.KiloByteSize < DataAnalyticsConstants.MaxFileSize && index == files.length - 1) {
        this.progressCancel = true;
        this.value = 0;
        this.files = files;
        this.fileProgressStatus = DataAnalyticsConstants.CancelFileProgress;
        this.uploadFilePlaceholder = files[0].name;
        this.browseIcon = false;
      }

    });
  }
  deleteIconClick() {
    this.errorUploadDetails = [];
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseIcon = true;
    this.safeHtml = "";
  }
}
