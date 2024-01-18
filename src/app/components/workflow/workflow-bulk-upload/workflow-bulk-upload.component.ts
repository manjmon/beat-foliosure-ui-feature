import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { secureRandom } from 'src/app/common/constants';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';

@Component({
  selector: 'app-workflow-bulk-upload',
  templateUrl: './workflow-bulk-upload.component.html',
  styleUrls: ['./workflow-bulk-upload.component.scss']
})
export class WorkflowBulkUploadComponent{
  @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
  @Input() kpiType: string = "";
  isUploaded:boolean = false;
  defaultPlaceholder = "Browse"
  uploadFilePlaceholder = this.defaultPlaceholder;
  browseicon = true;
  files = [];
  uploadedFiles: any[] = [];
  messages: any[] = [];
  progress: number;
  uploadResultobj: { [k: string]: any } = {};
  FileProgresStatus: string = "Cancel File Progress";
  @ViewChild("fileUploader") fileUploader: any = {};
  value: number = 0;
  cancel: boolean = false;
  ProgressCancel: boolean = true;
  submitted = false;
  safeHtml: SafeHtml;
  msgTimeSpan: number;
  id: any;
  messageClass: string = "bulkMessage";
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  loading = false;
  @Input() strModuleType = "";
  interval: any = 0;
  TemplateFileName: string = "";
  strAPIURL: string = "";
  @Input() moduleName: string = "";
  encryptedPortfolioCompanyID:string = "";
  @Input() workflowMappingId:number=0;
  constructor(private sanitizer: DomSanitizer,  private _avRoute: ActivatedRoute,
    private miscService: MiscellaneousService, private toastrService: ToastrService, private fileUploadService: FileUploadService, protected changeDetectorRef: ChangeDetectorRef) { 
      if (this._avRoute.snapshot.params["id"]) {
        this.encryptedPortfolioCompanyID = this._avRoute.snapshot.params["id"];
      }
    }
  onReset(): void {
    this.submitted = false;
    if (this.files.length > 0) this.deleteIconClick();
    this.changeDetectorRef.detectChanges();
  }
  onSelect(files: any) {
    this.files = files;
    this.uploadedFiles = [];
    this.messages = [];
    if (files[0].size > 20000000) {
      this.uploadResultobj.messageClass = "errorMessage";
      this.uploadResultobj.safeHtml = "File size is greater than 20 MB.";
      this.messages.push(this.uploadResultobj);
      this.fileUploader.files = [];
    } else {
      this.ProgressCancel = true;
      this.value = 0;
      this.cancel = false;
      this.FileProgresStatus = "Cancel File Progress";
      this.uploadFilePlaceholder = files[0].name;
      this.browseicon = false;
    }
  }
  deleteIconClick() {
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseicon = true;
    this.messages = [];
  }
  downloadTemplate() {
    this.loading = true;
    this.fileUploadService
      .exportTemplates({ moduleType: this.strModuleType, EncryptedPortfolioCompanyID: this.encryptedPortfolioCompanyID })
      .subscribe(
        (response) => {
          if (response.ok) {
            this.miscService.downloadExcelFile(response);
          } else {
            this.toastrService.error("File is not downloaded.", "", { positionClass: "toast-center-center" });
          }
          this.loading = false;
        },
        (error) => {
          this.toastrService.error("Something went wrong. Please check the query and try again.", "", { positionClass: "toast-center-center" });
          this.loading = false;
        }
      );
  }
  private uploadFiles(file: any) {
    this.uploadResultobj = {};
    this.messages = [];
    file.showCancelButton = true;
    this.ProgressCancel = false;
    this.safeHtml = "";
    let strAPIURL = "api/bulkupload/import";
    if (file.length === 0) {
      this.safeHtml = "Error :- No file selected. Please select a file.";
      this.messageClass = "errorMessage";
      this.ProgressCancel = true;
      return;
    }

    this.interval = setInterval(() => {
      this.value = this.value + Math.floor(secureRandom(10)) + 1;
      if (this.value >= 90) {
        this.value = 90;
      }

      try {
        const formData = new FormData();
        formData.append("ModuleName", this.moduleName);
        formData.append(file.name, file);
        formData.append("PortfolioCompanyID", this.encryptedPortfolioCompanyID);
        formData.append("IsDraft", "true");
        formData.append("WorkflowRequestId", this.workflowMappingId.toString());
        if (!this.cancel) {
          this.cancel = true;
          this.FileProgresStatus = "File Processing...";
          this.fileUploadService.importBulkData(formData, strAPIURL).subscribe(
            (results) => {
            
              this.submitted = false;
              this.loading = false;
              let num = 0;
              for (let result of results["body"]) {
                try {
                  this.value = 100;
                  this.uploadResultobj = {};
                  clearInterval(this.interval);
                  setInterval(() => {
                    this.ProgressCancel = true;
                  }, 2000);
                  if (
                    result.code != null &&
                    result.code.trim().toLowerCase() == "ok"
                  ) {
                    this.messageClass = "bulkMessage";
                    this.safeHtml = result.message;
                    this.isUploaded = true;
                    this.uploadedFiles.push(file);
                    this.uploadResultobj.messageClass = this.messageClass;
                    this.uploadResultobj.safeHtml = this.safeHtml;
                    this.messages.push(this.uploadResultobj);
                    this.files = [];
                    this.uploadFilePlaceholder = this.defaultPlaceholder;
                    this.browseicon = true;
                  } else if (
                    result.code != null &&
                    result.code.trim().toLowerCase() == "info"
                  ) {
                    this.messageClass = "infoMessage";
                    this.safeHtml =  result.message;
                    this.uploadResultobj.messageClass = this.messageClass;
                    this.uploadResultobj.safeHtml = this.safeHtml;
                    this.messages.push(this.uploadResultobj);
                  } else {
                    if (result.message != null && result.message != "") {
                      if (num == 0) {
                        result.message =
                          "<b>Errors : -</b>  <i>One or more records in the file has invalid data or sheet(s) may be empty. Please upload the file again after correction.</i > <br/>" +
                          result.message;
                      }
                      num = num + 1;

                      this.messageClass = "errorMessage";
                      this.safeHtml =  result.message;
                      this.uploadResultobj.messageClass = this.messageClass;
                      this.uploadResultobj.safeHtml = this.safeHtml;
                      this.messages.push(this.uploadResultobj);
                    }
                  }
                } catch (e) {
                  this.messageClass = "errorMessage";
                  this.toastrService.error("Please check the file", "", { positionClass: "toast-center-center" });
                  this.value = 100;
                  setInterval(() => {
                    this.ProgressCancel = true;
                  }, 2000);
                }
              }
            },
            (error) => {
              this.ProgressCancel = false;
              this.loading = false;
              this.submitted = false;
            }
          );
        }
      } catch (e) {
        this.toastrService.error("Please check the file", "", { positionClass: "toast-center-center" });
        this.messageClass = "errorMessage";
        this.loading = false;
        this.submitted = false;
      }
    }, 2000);
  }
  onUpload() {
    for (let file of this.files) {
      this.uploadFiles(file);
    }
  }
  saveFile() {
    if (this.files.length > 0) {
      this.loading = true;
      this.onUpload();
    }
    else
      return;
  }
  onClose()
  {
    this.onClosePopUpClick.emit(this.isUploaded);
  }

}
