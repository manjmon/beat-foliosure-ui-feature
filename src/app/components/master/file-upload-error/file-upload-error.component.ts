
import { Component, OnInit, Input, Inject, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FileStatusService } from 'src/app/services/file-status.service';
import { Router } from '@angular/router';
import { TruncateFilePipe } from 'src/app/pipes/truncate-file.pipe';
import { SafeHtml } from '@angular/platform-browser';
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model"
import { FeaturesEnum } from 'src/app/services/permission.service';
import { FileUploadStatus} from 'src/app/common/constants';
import { FileStatus } from 'src/app/common/enums';

@Component({
  selector: "app-file-upload-error",
  templateUrl: "./file-upload-error.component.html",
  styleUrls: ["./file-upload-error.component.scss"],
  providers: [TruncateFilePipe],
})
export class FileUploadErrorComponent implements OnInit,AfterViewInit{
  tabList:  any[] = [];
  @Input() isOpensideNavfield: boolean;
  appUrl: string = "";
  uploadedFileList: any;
  @Input() message = "";
  @Input() header = "";
  @Input() loading = false;
  @Input() height = "66vh";
  @ViewChild('filedivul') _filedivul: ElementRef;
  errorList: any = [];
  data: any = {};
  TotalErrors: any;
  TotalErrorsCopy: any;
  errormessages: any[] = [];
  errormessagesFOF: any[] = [];
  errorId: number;
  errorIdFOF: number;
  messageClass: string = FileUploadStatus.FileUploadBulkMessage;
  totalRecords: number;
  isLoading: boolean = true;
  blockedTable: boolean = false;
  uploadedFileArray: any = [];
  public cashflows: any;
  windowHeight = 0;
  globalFilter: string = "";
  totalError: number = 0;
  fileId: string = "";
  totaltabRecords: number = 0;
  safeHtml: SafeHtml;
  messages = [];
  filterText:string = "";
  uploadResultobj: { [k: string]: any } = {};
  tabName: string = FileUploadStatus.FOF;
  totalZipFiles: any = [];
  ConstantsFund = FileUploadStatus.FOF;
  ConstantESG = FileUploadStatus.ESG;
  fileStatus = FileStatus;
  statusToIcon = {
    1: FileUploadStatus.FileUploadProcessImage,
    2: FileUploadStatus.FileUploadProcessImage,
    3: FileUploadStatus.FileUploadSuccessImage,
    4: FileUploadStatus.FileUploadErrorCountImage,
    5: FileUploadStatus.FileUploadFailedImage,
  };
  statusToText = {
    1: FileUploadStatus.UploadinProgress,
    2: FileUploadStatus.UploadinProgress,
    3: FileUploadStatus.UploadSuccessful,
    4: FileUploadStatus.UploadFailed,
    5: FileUploadStatus.UploadCancelled,
  };
  constructor(
    @Inject("BASE_URL") baseUrl: string,
    private _fileStatusService: FileStatusService,
    private router: Router,
    private el: ElementRef
  ) {
    this.appUrl = baseUrl;
    localStorage.setItem(FileUploadStatus.FileUploadHeaderName, "");
  }
  ngOnInit(): void {
    this.getTabList();
    this.getAllFileError();
  }
  paginationFilterClone: any = {};
  hasValue(val: any) {
    return val !== null && val !== undefined;
  }
  hasErrorMessage(element: any) {
    return this.hasValue(element.errorMessage) && element.errorMessage !== "";
  }
  setErrorCountAndSheetName(element: any) {
    if (element.fileList?.length > 0) {
      const errorCount = element.fileList.reduce((count, file) => {
        const isSheetNameNull = file?.ExcelStatus?.length > 0 && file.ExcelStatus[0]?.SheetName == null;
        return isSheetNameNull ? count : count + file.ErrorCount;
      }, 0);
      element.SheetName = errorCount === 0 ? null : element.SheetName;
      element.ErrorCount = errorCount;
    }
  }
  getErrorListFOF() {
    if (this.hasValue(this.data) && this.hasValue(this.data.featureId) ) {
      if (this.data.featureId == FeaturesEnum.Fund ) {
        this.setPannelFOFIfDataAvailable(this.data);
      } else{
        this.setPannelFOFIfDataNotAvailable();
      }
    }
    else {
      this.setPannelFOFIfDataNotAvailable();
    }
  }
  setPannelFOFIfDataNotAvailable() {
    if (this.totalZipFiles?.length > 0) {
      this.totalZipFiles.forEach((element, index) => {
        element.SheetName = element?.errorMessage == ""? null : '';
        element.fileList = this.hasErrorMessage(element) ? JSON.parse(element.errorMessage) : null;
        element.isExpanded = index === 0? true : false;
        this.setErrorCountAndSheetName(element);
      });
      const firstFile = this.totalZipFiles[0];
      this.errorIdFOF = firstFile?.uploadStatus;
      if (firstFile?.fileList?.length > 0) {
        this.showErrorPanelFOF(firstFile.fileList, firstFile.fileList[0]);
      }
    }
  }
  setPannelFOFIfDataAvailable(data: any) {
    this.totalZipFiles.forEach(element => {
      element.SheetName = element.errorMessage == ""? null : '';
      element.fileList = this.hasErrorMessage(element) ? JSON.parse(element.errorMessage) : null;
      element.isExpanded = element.fileId == data.fileId;
      if (element.isExpanded) {
        this.errorIdFOF = element.uploadStatus;
        if (this.hasErrorMessage(element) && element?.fileList?.length > 0) {
          this.setErrorCountAndSheetName(element);
          this.showErrorPanelFOF(element.fileList, element.fileList[0]);
        }
      } else if (this.hasErrorMessage(element)) {
        this.setErrorCountAndSheetName(element);
      }
    });
  }
  getAllFileError() {
    this.isLoading = true;
    this._fileStatusService.getAllFileErrorStatus().subscribe(
      (result) => {
        let resp = result;
        if (result != null) {
          if (resp.data.length > 0) {
            this.TotalErrors = resp.data.filter(
              (x) => x.featureId == FeaturesEnum.EsgModel
            );
            this.TotalErrorsCopy=this.TotalErrors;
            this.totalZipFiles = resp.data.filter(
              (x) => x.featureId == FeaturesEnum.Fund
            );
            if (history.state.data !== undefined) {
              this.data = history.state.data;
            }
            if (this.hasValue(this.data) && this.hasValue(this.data.featureId) ){
              this.tabList?.forEach((row) => (row.active = false));
              if (this.data.featureId == FeaturesEnum.Fund) {
                this.tabList[0].active = true;
                this.tabName = FileUploadStatus.FOF;
              } else {
                this.tabList[1].active = true;
                this.tabName = FileUploadStatus.ESG;
              }
            }
            if(this.tabName == FileUploadStatus.FOF)
              this.getErrorListFOF();
            else
              this.getErrorListESG();
          }
        }
        this.isLoading = false;
      },
      (error) => {
        this.blockedTable = false;
        this.isLoading = false;
      }
    );
  }

  errorArr: any = {
    fileName: "",
    test: [],
  };


  setActive(errorflow: any) {
    if (errorflow.isExpanded) errorflow.isExpanded = false;
    else errorflow.isExpanded = true;
  }
  setHeaderName(cashflow: any) {
    localStorage.setItem(FileUploadStatus.FileUploadHeaderName, cashflow?.fund?.fundName);
  }
  ngAfterViewInit() {
    this.windowHeight = window.innerHeight - 0;
    this.getAllFileError();
  }
  
  scrollToSelectedItem(data: any) {
    const escapedFileName = data.fileId;
    const selectedItem = this._filedivul.nativeElement.querySelector(`[file-id="${escapedFileName}"]`);
    if (selectedItem) {
      selectedItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.windowHeight = window.innerHeight - 0;
  }
  showErrorPanelFOF(allFiles: any, file: any) {
    allFiles.forEach(element => element.isActive = false);
    file.isActive = true;
    this.errormessagesFOF = file?.ExcelStatus?.filter(result => result?.ExcelCodeStatus?.length > 0)
      .map((result, index) => ({
        sheetname: result.SheetName,
        messages: result?.ExcelCodeStatus?.map(status => ({
          cellCode: status.CellCode,
          message: status?.Message,
        })),
        isExpanded: index === 0 ? true : false,
      })) || [];
    const result = file?.ExcelStatus[0];
    this.messageClass = FileUploadStatus.errorMessage;
    this.safeHtml = result?.message;
    this.uploadResultobj = { messageClass: this.messageClass, safeHtml: this.safeHtml };
  }
  showErrorPanel(file: any) {
    this.TotalErrors?.forEach((element) => {
      element.isActive = false;
    });
    file.isActive = true;
    this.fileId = file.fileId;
    this.errorId = file.uploadStatus;
    this.errormessages = [];
    for (let result of file.errorList) {
      let errors = {
        sheetname: result.sheetName,
        messages: [],
      };
      let messageList = [];
      if (result?.errors != undefined && result?.errors.length > 0) {
        result?.errors?.forEach((status) => {
          messageList.push({
            cellCode: status.cellCode,
            message: status?.error,
          });
        });
        errors.messages = messageList;

        errors.messages = messageList;
        this.errormessages.push(errors);
        this.errormessages[0].isExpanded = true;
      }
      this.messageClass = FileUploadStatus.errorMessage;
      this.safeHtml = result.message;
      this.uploadResultobj.messageClass = this.messageClass;
      this.uploadResultobj.safeHtml = this.safeHtml;
    }
  }
  isExpandFOF(item) {
    if (this.totalZipFiles?.length > 0) {
      this.totalZipFiles.forEach((element) => {
        if (element.fileId == item.fileId && !item.isExpanded) {
          element.isExpanded = true;
          this.errorIdFOF = element.uploadStatus;
          if (item?.fileList?.length > 0 && this.hasErrorMessage(item)) {
            this.showErrorPanelFOF(element.fileList, item.fileList[0]);
          }
        } else {
          element.isExpanded = false;
        }
      });
    } else {
      this.totalZipFiles?.forEach((row) => (row.isExpanded = false));
    }
  }
  isExpand(item) {
    let value = item.isExpanded;
    this.errormessagesFOF?.forEach((row) => (row.isExpanded = false));
    item.isExpanded = value?false:true;
  }
  getTabList() {
    this.tabList = [
      { name: FileUploadStatus.FOF, active: true },
      { name: FileUploadStatus.ESG, active: false },
    ];
}

  getFileStatusErrorIcon(status: number) {
    return this.statusToIcon[status];
  }
  getFileStatusText(status: number) {
    return this.statusToText[status];
  }

  redirectFileUploadError() {
    this.router.navigate([FileUploadStatus.FileUploadFileuploadStatus]);
  }
  onTabClick(tab: ITab) {
    if (tab != null || tab != undefined) {
      this.tabName = tab.name;
      if(this.data != null || this.data != undefined)
        history.replaceState({ data: null }, '');
      this.tabList?.forEach((row) => (row.active = false));
      tab.active = true;
      this.getAllFileError();
    }
  }
  filterItem(){
    if(this.filterText) 
    {
      this.TotalErrors = this.TotalErrorsCopy.filter(
        searchText => (searchText.fileName.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1)
      );
    }
    else{
      this.TotalErrors = this.TotalErrorsCopy;
    }
  }
  getErrorListESG() {
    if (this.hasValue(this.data) && this.hasValue(this.data.featureId)) {
      if (this.data.featureId == FeaturesEnum.EsgModel) {
        this.setPannelESGIfDataAvailable(this.data);
      }
    }
    else {
      this.setPannelESGIfDataNotAvailable();
    }
  }
  setPannelESGIfDataNotAvailable() {
    if (this.TotalErrors?.length > 0) {
      this.showErrorPanel(this.TotalErrors[0]);
    }
  }
  setPannelESGIfDataAvailable(data: any) {
    if (this.TotalErrors?.length > 0) {
      this?.TotalErrors?.forEach(element => {
        element.isActive = false;
        element.isExpanded = element.fileId == data.fileId;
        if (element.isExpanded) {
          this.showErrorPanel(element);
          this.scrollToSelectedItem(element);
        }
      });
    }
  }
  
}


