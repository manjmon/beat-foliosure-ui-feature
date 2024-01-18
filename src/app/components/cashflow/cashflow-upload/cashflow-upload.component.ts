import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { Message } from "primeng/api/message";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { FeaturesEnum } from "src/app/services/permission.service";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { CashflowService } from "src/app/services/cashflow.service";
import { AccountService } from "src/app/services/account.service";
import { FileUploadService } from "src/app/services/file-upload.service";
import { FundService } from "src/app/services/funds.service";
import { FundCashflowConstants } from "src/app/common/constants";

@Component({
  selector: 'app-cashflow-upload',
  templateUrl: './cashflow-upload.component.html',
  styleUrls: ['./cashflow-upload.component.scss']
})
export class CashflowUploadComponent implements OnInit {
  @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
  browseicon = true;
  defaultPlaceholder = "Browse"
  uploadFilePlaceholder = this.defaultPlaceholder;
  feature: typeof FeaturesEnum = FeaturesEnum;
  progress: number;
  message: string;
  msgTimeSpan: number;
  fileUploadSubscription: any;
  cashflowData: any = [];
  cashflowCalculationData: any = [];
  currentQuarter: string = "";
  realizeData: any = [];
  unRealizeData: any = [];
  cashflowFileId: any;
  showUploadSection: boolean = true;
  msgs: Message[] = [];
  loading: boolean;
  totalRecords: number;
  cancel: boolean = false;
  enableSaveButton: any = true;
  interval: any = 0;
  ProgressCancel: boolean = true;
  showCancelButton: boolean = true;
  FileProgresStatus: string = "Cancel File Progress";
  @ViewChild("fileUploader") fileUploader: any = {};
  messageClass: string = "bulkMessage";
  safeHtml: SafeHtml;
  errorUploadDetails=[];
  uploadedFiles: any[] = [];
  value: number = 0;
  fundList: any[] = [];
  selectedFund: any;
  isOverwriteHoldings: boolean = false;
  fundHoldingUpdateDetails: any;
  fundName: any;
  frozenCols: any = [
    { field: "Date", header: "Date" },
    { field: "Transaction Type", header: "Transaction Type" },
  ];
  frozenRows: any = [];
  fundData: any = {};
  realizedColIndex = 0;
  unrealizedColIndex = 0;
  fundsLoading: boolean;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  cashFlowCalculatedFundData:any={};
  files = [];
  isPageConfig="";
  constructor(
    private _avRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private miscService: MiscellaneousService,
    private cashflowService: CashflowService,
    private accountService: AccountService,
    private fileUploadService: FileUploadService,
    private fundService: FundService,
    private toastrService: ToastrService
  ) {
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    if (this._avRoute.snapshot.params["id"]) {
      this.cashflowFileId = this._avRoute.snapshot.params["id"];
      this.showUploadSection = false;
    }
  }

  checkIfValidDate(date: any) {
    return moment(date, "MM/DD/YYYY", true).isValid();
  }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.getFundList();
    this.getPageConfigFile();
  }
  onUpload() {
    for (let file of this.files) {
      this.uploadCashflow(file);
    }
  }

  saveDataFlag() {
    this.loading = true;
    if (!this.isOverwriteHoldings) {
      this.fundHoldingUpdateDetails.cashflowCalculationDetails = this.fundHoldingUpdateDetails.cashflowCalculationDetails?.filter(
        function (item: any) {
          return (
            item.existingFundHoldingId == 0 &&
            item.dealId != null &&
            item.dealId > 0
          );
        }
      );
      this.fundHoldingUpdateDetails.cashFlowCalculatedFundData=this.cashFlowCalculatedFundData;
    } else {
      this.fundHoldingUpdateDetails.cashflowCalculationDetails = this.fundHoldingUpdateDetails.cashflowCalculationDetails.filter(
        function (item: any) {
          return item.dealId != null && item.dealId > 0;
        }
      );
      this.fundHoldingUpdateDetails.cashFlowCalculatedFundData=this.cashFlowCalculatedFundData;
    }
    this.cashflowService
      .saveCashflowData(this.fundHoldingUpdateDetails)
      .subscribe({
        next:(data) => {
          if (data.code == "OK") {
            this.enableSaveButton = true;
            this.displayUpdateConfirmationDialog = false;
            this.toastrService.success(data.message,"",{positionClass:"toast-center-center"});
            this.onClose();
          } else {
            this.toastrService.error(data.message,"",{positionClass:"toast-center-center"});
          }
          this.loading = false;
        },
        error:(error) => {
          this.toastrService.error(error,"",{positionClass:"toast-center-center"});
          this.loading = false;
        }
  });
  }
  uploadCashflow(file: any) {
    this.value = 1;
    file.showCancelButton = true;
    this.ProgressCancel = false;
    this.safeHtml = "";
    this.cancel = false;
    if (file.length === 0) {
      this.safeHtml = "Error :- No file selected. Please select a file.";
      this.messageClass = "errorMessage";
      this.ProgressCancel = true;
      return;
    }
    if (!this.selectedFund) {
      this.toastrService.error("Please select a fund","",{positionClass:"toast-center-center"});
      this.ProgressCancel = true;
      return;
    }
      try {
       this.uploadCashflowPartial(file);
      } catch (e) {
        this.toastrService.error("Please see the error list","",{positionClass:"toast-center-center"});
        this.messageClass = "errorMessage";
      }
  }
  uploadCashflowPartial(file: any){
    if (!this.cancel) {
      const formData = new FormData();
      formData.append(file.name, file);
      formData.append("fundId", this.selectedFund.fundID);
      this.cancel = true;
      this.FileProgresStatus = "File Processing...";
      this.fileUploadService.importCashflowDetails(formData).subscribe({
        next:(result) => {
          try {
            this.value = 100;
            this.ProgressCancel = true;
            clearInterval(this.interval);
            this.importCashflowDetailsPartial(result,file);
          } catch (e) {
            this.messageClass = "errorMessage";
            this.enableSaveButton = true;
            this.cashflowFileId = undefined;
            this.toastrService.error("Please see the error list","",{positionClass:"toast-center-center"});
            this.value = 100;
            this.ProgressCancel = true;
          }
        },
        error:(error) => {
          this.value = 0;
          this.ProgressCancel = true;
          this.toastrService.error("Cashflow file not uploaded","",{positionClass:"toast-center-center"});
        }
    });
    }
  }
  importCashflowDetailsPartial(result:any,file:any){
    let resp = result["body"];
    if (resp != null) {
      if (resp.validationStatus.isValid) {
        let res = result.body;
        this.messageClass = "bulkMessage";
        this.uploadedFiles.push(file);
        if (result.code == "OK") {
          this.enableSaveButton = null;
          this.cashflowFileId = res.encryptedCashflowFileID;
          this.showUploadSection = true;
          let quarterDetails = res.cashflowCalculationDetails.filter(
            function (item: any) {
              return item.quarter != null;
            }
          );
          if (quarterDetails.length > 0) {
            this.currentQuarter =
              quarterDetails[0].quarter +
              " " +
              quarterDetails[0].quarterYear;
          }
          this.cashflowCalculationData = res.cashflowCalculationDetails.filter(
            function (item: any) {
              return item.existingFundHoldingId > 0;
            }
          );
          this.fundHoldingUpdateDetails = {
            encryptedCashflowFileID: res.encryptedCashflowFileID,
            fund: res.fund,
            cashflowCalculationDetails: JSON.parse(
              JSON.stringify(res.cashflowCalculationDetails)
            ),
          };
          this.getUploadedDataCalculate(resp);
          this.openConfirmationModal();
        }
        this.value = 100;
        this.ProgressCancel = true;
      } else {
        this.messageClass = "errorMessage";
        this.enableSaveButton = true;
        this.cashflowFileId = undefined;
        this.errorUploadDetails =  resp?.validationStatus?.errorUploadDetails;
        this.toastrService.error("Please see the error list","",{positionClass:"toast-center-center"});
        this.value = 100;
        this.ProgressCancel = true;
      }
    } else {
      this.messageClass = "errorMessage";
      this.enableSaveButton = true;
      this.cashflowFileId = undefined;
      this.toastrService.error("Please see the error list","",{positionClass:"toast-center-center"});
      this.value = 100;
      this.ProgressCancel = true;
    }
  }
  getFundList() {
    this.fundsLoading = true;
    this.fundService.getFundNamesList({}).subscribe({
      next:(result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          this.fundList = resp.fundList;
        }
        this.fundsLoading = false;
      },
      error:(error) => {
        this.fundsLoading = false;
      }
  });
  }
  getPageConfigFile() {
    this.cashflowService.getCashFlowUploadValidate().subscribe({
      next:(result) => {
      this.isPageConfig=result?.sheet==null?"":result?.sheet;
      },
      error:(error) => {
        this.isPageConfig="";
      }
  });
  }
  displayUpdateConfirmationDialog: boolean = false;
  openConfirmationModal() {
    let dealsToUpdate = this.fundHoldingUpdateDetails?.cashflowCalculationDetails.filter(
      function (item: any) {
        return item.dealId != null && item.dealId > 0;
      }
    );
    if (dealsToUpdate.length > 0 && this.cashflowCalculationData.length > 0) {
      this.displayUpdateConfirmationDialog = true;
    } else {
      this.saveDataFlag();
    }
  }

  onFundChange(event: any) {
    this.cashflowData = [];
    this.fundName = "";
    this.onCancel(event);
    this.enableSaveButton = true;
    this.errorUploadDetails=[];
  }
  onCancel(event: any) {
    this.value = 0;
    this.cancel = true;
    this.ProgressCancel = true;
  }

  DownloadTemplate() {
    this.fileUploadService
      .exportTemplates({ moduleType: "CashFlow", EncryptedFundId:this.selectedFund?.fundID==undefined?"0":this.selectedFund?.fundID.toString() })
      .subscribe({
        next:(response) => {
          if (response.ok) {
            this.miscService.downloadExcelFile(response);
          } else {
            this.toastrService.error("File is not downloaded.","",{positionClass:"toast-center-center"});
          }
          this.loading = false;
        },
        error:(error) => {
          this.toastrService.error("Something went wrong. Please check the query and try again.","",{positionClass:"toast-center-center"});
          this.loading = false;
        }
  });
  }
  onClose()
  {
    this.onClosePopUpClick.emit(true);
  }
  onSelect(files: any) {
    this.files = files;
    this.uploadedFiles = [];
    this.errorUploadDetails=[];
    if (files[0].size > 20000000) {
      this.messageClass = "errorMessage";
      this.safeHtml = "File size is greater than 20 MB.";
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
    this.errorUploadDetails=[];
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseicon = true;
    this.safeHtml = "";
  }
  getUploadedDataCalculate(resp: any) {
    let local = this;
    let objCashFlowRealizeList: any = [];
    objCashFlowRealizeList.Results = [];
    let expenseTotal = 0;
    if (resp != null) {
        this.cashflowData = resp.cashflowDateWiseSummary;

        this.cashflowData.forEach(function(data: any, index: any) {
            let objCashFlowRealize: any = {};
            let objCashFlowUnRealize: any = {};

            objCashFlowRealize[FundCashflowConstants.Date] = objCashFlowUnRealize[
                FundCashflowConstants.Date
            ] = local.miscService.formatDate(data.transactionDate);
            objCashFlowRealize[FundCashflowConstants.TransactionType] = data.transactionType;

            data.cashFlowCompanyList.forEach(function(comp: any) {
                if (comp.isRealizedValue) {
                    objCashFlowRealize[comp.portfolioCompanyName] =
                        comp.transactionValue;
                    let list = objCashFlowRealizeList.cols.filter(function(
                        val: any
                    ) {
                        return val.field == comp.portfolioCompanyName;
                    });
                    if (list == null || list.length == 0) {
                        objCashFlowRealizeList.cols.push({
                            field: comp.portfolioCompanyName,
                            header: comp.portfolioCompanyName,
                        });
                    }
                }

                if (!comp.isRealizedValue) {
                    let blankHeader = null;
                    if (objCashFlowRealizeList.cols.length > 0) {
                        blankHeader = objCashFlowRealizeList.cols.filter(function(
                            colValue: any
                        ) {
                            return colValue.field == "";
                        });
                    }
                    if (blankHeader == null || blankHeader.length == 0) {
                        objCashFlowRealizeList.cols.push({
                            field: "",
                            header: ""
                        });
                    }
                    objCashFlowRealize[comp.portfolioCompanyName + " "] = comp.transactionValue;
                    let list = objCashFlowRealizeList.cols.filter(function(
                        val: any
                    ) {
                        return val.field == comp.portfolioCompanyName + " ";
                    });
                    if (list == null || list.length == 0) {
                        objCashFlowRealizeList.cols.push({
                            field: comp.portfolioCompanyName + " ",
                            header: comp.portfolioCompanyName + " ",
                        });
                    }
                }
            });

            objCashFlowRealize["Total Realized"] = data.totalRealizeValue;
            objCashFlowRealize["Total Unrealized"] = data.totalUnrealizeValue;
            objCashFlowRealize["Total"] = data.totalRealizeUnrealizeValue;
            objCashFlowRealize["Total Fees / Expenses"] = data.totalFundFees;
            if (data.totalFundFees != null) {
                let val = data.totalFundFees < 0 ? (data.totalFundFees) * (-1) : data.totalFundFees;
                expenseTotal = expenseTotal + parseFloat(val);
            }
            objCashFlowRealize["Total Less Fund Expenses/Fees"] =
                data.totalRealizeUnrealizeAndFundFeesValue;

            objCashFlowRealizeList.Results.push(objCashFlowRealize);
        });

        let separatorIndex = -1;
        objCashFlowRealizeList.cols.forEach(function(val: any, i: any) {
            if (val.field == "") {
                separatorIndex = i;
            }
        });
        if (separatorIndex == -1) {
            objCashFlowRealizeList.cols.splice(
                objCashFlowRealizeList.cols.length,
                0, {
                    field: "Total Realized",
                    header: "Total Realized"
                }
            );
        } else if (separatorIndex > 1) {
            objCashFlowRealizeList.cols.splice(separatorIndex, 0, {
                field: "Total Realized",
                header: "Total Realized",
            });
        }
        if (separatorIndex > -1) {
            objCashFlowRealizeList.cols.push({
                field: "Total Unrealized",
                header: "Total Unrealized",
            });
        }
        objCashFlowRealizeList.cols.push({
            field: "",
            header: ""
        });
        objCashFlowRealizeList.cols.push({
            field: "Total",
            header: "Total"
        });
        objCashFlowRealizeList.cols.push({
            field: "Total Fees / Expenses",
            header: "Total Fees / Expenses",
        });
        objCashFlowRealizeList.cols.push({
            field: "Total Less Fund Expenses/Fees",
            header: "Total Less Fund Expenses/Fees",
        });

        let calulationModel = resp.cashflowCalculationDetails;
        let objCashFlowCapitalInvested: any = {};
        let objCashFlowRealized: any = {};
        let objCashFlowUnrealized: any = {};
        let objCashFlowTotal: any = {};
        let objCashFlowIRR: any = {};
        let objCashFlowMultiple: any = {};

        calulationModel.forEach(function(value: any) {
            objCashFlowCapitalInvested[FundCashflowConstants.Date] = FundCashflowConstants.CapitalInvested;

            if (value.isRealizedValue) {
                objCashFlowCapitalInvested[value.portfolioCompanyName] =
                    value.capitalInvested;
            } else {
                objCashFlowCapitalInvested[value.portfolioCompanyName + " "] =
                    value.capitalInvested;
            }

            objCashFlowRealized[FundCashflowConstants.Date] = "Realized Value";

            if (value.isRealizedValue) {
                objCashFlowRealized[value.portfolioCompanyName] =
                    value.realizedValue;
            } else {
                objCashFlowRealized[value.portfolioCompanyName + " "] =
                    value.realizedValue;
            }

            objCashFlowUnrealized[FundCashflowConstants.Date] = "Unrealized Value";

            if (value.isRealizedValue) {
                objCashFlowUnrealized[value.portfolioCompanyName] =
                    value.unrealizedValue;
            } else {
                objCashFlowUnrealized[value.portfolioCompanyName + " "] =
                    value.unrealizedValue;
            }

            objCashFlowTotal[FundCashflowConstants.Date] = "Total Value";

            if (value.isRealizedValue) {
                objCashFlowTotal[value.portfolioCompanyName] = value.totalValue;
            } else {
                objCashFlowTotal[value.portfolioCompanyName + " "] =
                    value.totalValue;
            }

            objCashFlowIRR[FundCashflowConstants.Date] = FundCashflowConstants.IRR;

            if (value.isRealizedValue) {
                objCashFlowIRR[value.portfolioCompanyName] =
                    local.miscService.formatFloatNumber(value.irr) + "%";
            } else {
                objCashFlowIRR[value.portfolioCompanyName + " "] =
                    local.miscService.formatFloatNumber(value.irr) + "%";
            }

            objCashFlowMultiple[FundCashflowConstants.Date] = FundCashflowConstants.TVPI;

            if (value.isRealizedValue) {
                objCashFlowMultiple[value.portfolioCompanyName] = value.multiple;
            } else {
                objCashFlowMultiple[value.portfolioCompanyName + " "] =
                    value.multiple;
            }
        });

        let totalCalulationModel = resp.totalCalculationDetails;

        objCashFlowRealized["Total Realized"] = 0;

        objCashFlowRealized["Total Unrealized"] = 0;

        objCashFlowUnrealized["Total Realized"] = 0;

        objCashFlowUnrealized["Total Unrealized"] = 0;

        objCashFlowTotal["Total Realized"] = 0;

        objCashFlowTotal["Total Unrealized"] = 0;

        objCashFlowIRR["Total Realized"] = 0;

        objCashFlowIRR["Total Unrealized"] = 0;

        objCashFlowMultiple["Total Realized"] = 0;

        objCashFlowMultiple["Total Unrealized"] = 0;

        objCashFlowRealizeList.Results.push(objCashFlowCapitalInvested);
        objCashFlowRealizeList.Results.push(objCashFlowRealized);
        objCashFlowRealizeList.Results.push(objCashFlowUnrealized);
        objCashFlowRealizeList.Results.push(objCashFlowTotal);
        objCashFlowRealizeList.Results.push(objCashFlowIRR);
        objCashFlowRealizeList.Results.push(objCashFlowMultiple);

        objCashFlowRealizeList.Results.forEach(function(result: any) {
            if (
                result.Date == FundCashflowConstants.CapitalInvested ||
                result.Date == "Realized Value" ||
                result.Date == "Unrealized Value" ||
                result.Date == "Total Value" ||
                result.Date == FundCashflowConstants.IRR ||
                result.Date == FundCashflowConstants.TVPI
            ) {
                totalCalulationModel.forEach(function(totalData: any) {
                    if (result.Date == FundCashflowConstants.CapitalInvested) {
                        if (totalData.calculationType == "Realize") {
                            result["Total Realized"] = totalData.totalCapitalInvested;
                        } else if (totalData.calculationType == "Unrealize") {
                            result["Total Unrealized"] = totalData.totalCapitalInvested;
                        } else if (
                            totalData.calculationType == "TotalRealizeUnrealize"
                        ) {
                            result["Total"] = totalData.totalCapitalInvested;
                        } else if (
                            totalData.calculationType == "TotalLessFundExpensesFees"
                        ) {
                            result["Total Less Fund Expenses/Fees"] =
                                totalData.totalCapitalInvested;
                        }
                    }
                    if (result.Date == "Realized Value") {
                        if (totalData.calculationType == "Realize") {
                            result["Total Realized"] = totalData.totalRealizedValue;
                        } else if (totalData.calculationType == "Unrealize") {
                            result["Total Unrealized"] = totalData.totalRealizedValue;
                        } else if (
                            totalData.calculationType == "TotalRealizeUnrealize"
                        ) {
                            result["Total"] = totalData.totalRealizedValue;
                        } else if (
                            totalData.calculationType == "TotalLessFundExpensesFees"
                        ) {
                            result["Total Less Fund Expenses/Fees"] =
                                totalData.totalRealizedValue;
                        }
                    }
                    if (result.Date == "Unrealized Value") {
                        if (totalData.calculationType == "Realize") {
                            result["Total Realized"] = totalData.totalUnrealizedValue;
                        } else if (totalData.calculationType == "Unrealize") {
                            result["Total Unrealized"] = totalData.totalUnrealizedValue;
                        } else if (
                            totalData.calculationType == "TotalRealizeUnrealize"
                        ) {
                            result["Total"] = totalData.totalUnrealizedValue;
                        } else if (
                            totalData.calculationType == "TotalLessFundExpensesFees"
                        ) {
                            result["Total Less Fund Expenses/Fees"] =
                                totalData.totalUnrealizedValue;
                        }
                    }
                    if (result.Date == "Total Value") {
                        if (totalData.calculationType == "Realize") {
                            result["Total Realized"] = totalData.totalofTotalValue;
                        } else if (totalData.calculationType == "Unrealize") {
                            result["Total Unrealized"] = totalData.totalofTotalValue;
                        } else if (
                            totalData.calculationType == "TotalRealizeUnrealize"
                        ) {
                            result["Total"] = totalData.totalofTotalValue;
                        } else if (
                            totalData.calculationType == "TotalLessFundExpensesFees"
                        ) {
                            result["Total Less Fund Expenses/Fees"] =
                                totalData.totalofTotalValue;
                        }
                    }
                    if (result.Date == FundCashflowConstants.IRR) {
                        if (totalData.calculationType == "Realize") {
                            result["Total Realized"] = (totalData.totalIRR * 100)
                        } else if (totalData.calculationType == "Unrealize") {
                            result["Total Unrealized"] = (totalData.totalIRR * 100)
                        } else if (
                            totalData.calculationType == "TotalRealizeUnrealize"
                        ) {
                            result["Total"] = (totalData.totalIRR * 100)
                        } else if (
                            totalData.calculationType == "TotalLessFundExpensesFees"
                        ) {
                            result["Total Less Fund Expenses/Fees"] = (totalData.totalIRR * 100)
                        }
                    }
                    if (result.Date == FundCashflowConstants.TVPI) {
                        if (totalData.calculationType == "Realize") {
                            result["Total Realized"] = totalData.totalMultiple;
                        } else if (totalData.calculationType == "Unrealize") {
                            result["Total Unrealized"] = totalData.totalMultiple;
                        } else if (
                            totalData.calculationType == "TotalRealizeUnrealize"
                        ) {
                            result["Total"] = totalData.totalMultiple;
                        } else if (
                            totalData.calculationType == "TotalLessFundExpensesFees"
                        ) {
                            result["Total Less Fund Expenses/Fees"] =
                                totalData.totalMultiple;
                        }
                    }
                });
            }
        });

        if (objCashFlowRealizeList.Results.length == 0) {
            objCashFlowRealizeList.cols = [];
        }

        objCashFlowRealizeList.cols.filter(function(v: any, k: any) {
            if (v.field == "Total Realized") {
                local.realizedColIndex = k;
            }
            if (v.field == "Total Unrealized") {
                local.unrealizedColIndex = k;
            }
        });
        this.realizeData = objCashFlowRealizeList;
        this.getFundData(this.realizeData.Results, expenseTotal);
    }
}
  getFundData(cashflowData: any , expenseTotal) {
    let capitalInvested = 0;
    let totalValue = 0;
    let nettvpi = 0;
    let grossIRR = 0;
    let netIRR = 0;
    cashflowData.forEach(function (val: any) {
      if (val.Date == FundCashflowConstants.CapitalInvested) {
        capitalInvested = val.Total < 0 ? val.Total* -1 : val.Total;
      }
      if (val.Date == FundCashflowConstants.TotalValue) {
        totalValue = val.Total < 0 ? val.Total* -1 : val.Total;
      }
      if (val.Date == FundCashflowConstants.TVPI) {        
        nettvpi = totalValue/(expenseTotal + capitalInvested);
      }
      if (val.Date == FundCashflowConstants.IRR) {
        grossIRR = val.Total;
        netIRR = val["Total Less Fund Expenses/Fees"];
      }
    });
    this.cashFlowCalculatedFundData = {
      grossIrr: grossIRR,
      netIrr: netIRR,
      netTvpi: nettvpi,
      year: 0,
      quarter: '',
      fundId: this.selectedFund.fundID,
      createdBy:0
    };
  }
  
}
