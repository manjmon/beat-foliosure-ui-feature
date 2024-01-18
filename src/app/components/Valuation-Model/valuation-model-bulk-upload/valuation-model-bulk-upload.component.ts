import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { ValuationModelService } from "../../../services/valuation-model.service";
import { ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-valuation-model-bulk-upload',
  templateUrl: './valuation-model-bulk-upload.component.html',
  styleUrls: ['./valuation-model-bulk-upload.component.scss']
})
export class ValuationModelBulkUploadComponent implements OnInit {
  @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
  defaultPlaceholder = "Browse";
  uploadFilePlaceholder = this.defaultPlaceholder;
  browseicon = true;
  ProgressCancel: boolean = true;
  filterObj: any = {};
  loading: boolean = false;
  @Input() valuationCategoryId: number;
  @Input() fundDetails: any;
  @Input() companyDetails: any;
  @Input() QuarterAndYear: any;
  @Input() valueType: number = 0;
  @Input() onUploadFunction: (args: any) => Promise<boolean>;
  @ViewChild('dt') dt: Table | undefined;
  files = [];
  messages: any = [];

  constructor(private _valuationService: ValuationModelService, private miscService: MiscellaneousService,
    private toastrService: ToastrService, protected changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    this.filterObj.fundId = this.fundDetails.fundId;
    this.filterObj.fundName = this.fundDetails.fundName;
    this.filterObj.companyId = this.companyDetails.companyId;
    this.filterObj.companyName = this.companyDetails.companyName;
    this.filterObj.companyCurrency = this.companyDetails.companyCurrency;
    this.filterObj.currencyId = this.companyDetails.currencyId;
    this.filterObj.quarter = this.QuarterAndYear.quarter;
    this.filterObj.year = this.QuarterAndYear.year;
    this.filterObj.ValuationTypeId = this.valueType
  }

  onReset(): void {
    if (this.files.length > 0) this.deleteIconClick();
    this.changeDetectorRef.detectChanges();
  }
  onSelect(files: any) {
    this.files = files;
    this.messages = [];
    if (files[0].size > 20000000) {
      this.messages.push({
        messageClass: "errorMessage",
        safeHtml: "File size is greater than 20 MB."
      });
    } else {
      this.ProgressCancel = true;
      this.uploadFilePlaceholder = files[0].name;
      this.browseicon = false;
    }
  }
  deleteIconClick() {
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.loading = false;
    this.browseicon = true;
    this.messages = [];
  }
  getSampleTemplate() {
    this.loading = true;
    this._valuationService.downloadValuationTemplate(this.filterObj).subscribe({
      next:(response) => {
        if (response.ok) {
          this.miscService.downloadExcelFile(response);
        } else {
          this.toastrService.error("File is not downloaded.", "", { positionClass: "toast-center-center" });
        }
        this.loading = false;
      },
      error:(error) => {
        this.toastrService.error("Fail to download, please try again later.", "", { positionClass: "toast-center-center" });
        this.loading = false;
      }
  });
  };

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

  private uploadFiles(file: any) {
    const formData = new FormData();
    formData.append("ValuationTypeId", this.filterObj.ValuationTypeId);
    formData.append("fundId", this.filterObj.fundId);
    formData.append("fundId", this.filterObj.fundId);
    formData.append("fundName", this.filterObj.fundName);
    formData.append("companyId", this.filterObj.companyId);
    formData.append("companyName", this.filterObj.companyName);
    formData.append("companyCurrency", this.filterObj.companyCurrency);
    formData.append("currencyId", this.filterObj.currencyId);
    formData.append("quarter", this.filterObj.quarter);
    formData.append("year", this.filterObj.year);
    formData.append("fileName", file.name);
    formData.append("formFile", file);

    this.messages = [];

    this._valuationService.importValuationBulkData(formData)
      .subscribe({
        next:(result: any) => {
          this.loading = false;
          this.toastrService.success("File uploaded successfully", "", { positionClass: "toast-center-center" });
          this.onClosePopUpClick.emit(true);
          localStorage.removeItem("tempEquityValueData");

        }, error:(err) => {
          const errorMsgs: any[] = (err.status == 400 && err?.error) || [];
          errorMsgs?.forEach(msg => {
            this.messages.push({
              messageClass: "",
              safeHtml: msg
            });
          });
          if (!errorMsgs.length) {
            this.toastrService.error("Failed to upload the file", "", { positionClass: "toast-center-center" });
          }
          this.loading = false;
        }});
  }

  encodeWhiteSpaces = (str) => {
    return str.split('').map(function (c) { return c === ' ' ? '&nbsp;' : c }).join('');
  }

  onClose() {
    this.onClosePopUpClick.emit();
  }
}
