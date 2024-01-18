import { Component, Inject, ViewChild } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Message } from "primeng/api/message";
import { MessageService } from "primeng/api";
import { FileUploadService } from "../../services/file-upload.service";
import { UploadService }  from "../../services/upload.service";
import { MiscellaneousService, ErrorMessage, AdhocPeriodType } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { ActionsEnum, PermissionService, UserSubFeaturesEnum } from "../../services/permission.service";
import { FundService } from '../../services/funds.service';
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { ModuleList } from "src/app/common/constants";
import { InvestorService } from "src/app/services/investor.service";
import { HttpClient } from "@angular/common/http";
@Component({
  selector: "bulk-upload",
  templateUrl: "./bulk-upload.component.html",
  providers: [MessageService, FileUploadService],
  styleUrls: ["./bulk-upload.component.scss"],
})
export class BulkUploadComponent {
  uploadedFiles: any[] = [];
  messages: any[] = [];
  errormessages: any[] = [];
  progress: number;
  messageClass: string = "bulkMessage";
  msgTimeSpan: number;
  safeHtml: SafeHtml;
  loading: boolean;
  moduleDetails: any = {};
  masterModel: any = {};
  model: any = {};
  moduleName: string = "";
  @ViewChild("fileUploader") fileUploader: any = {};
  showClickMessage: boolean;
  TemplateFileName: string = "";
  value: number = 0;
  cancel: boolean = false;
  interval: any = 0;
  ProgressCancel: boolean = true;
  showCancelButton: boolean = true;
  FileProgresStatus: string = "Cancel File Progress";
  uploadResultobj: { [k: string]: any } = {};
  msgs: Message[] = [];
  strModuleType: string = "";
  strAPIURL: string = "";
  PorfolioCompanies: any = [];
  PortfolioCompanyId: number;
  FundsList: any = [];
  FundId: number;
  encryptedFundId: any;
  investorId: any;
  encryptInvestorId: any;
  fundDropDownDisabled: boolean = true;
  isFundModuleSelected: boolean = false;
  isConditionalDropDown: string = "common";
  IsValidFundName: boolean = true;
  IsValidInvestor: boolean = true;
  CompanyDisabled: boolean = true;
  IsValidCompany: boolean = false;
  EnableDownload: boolean = true;
  disableDownload: boolean = false;
  hideUnauthorized: boolean = true;
  showErrorPopUp: boolean = false;
  featureName: any;
  encryptedPortfolioCompanyID: any;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  defaultPlaceholder = "Browse"
  uploadFilePlaceholder = this.defaultPlaceholder;
  browseicon = true;
  files = [];
  investorList = [];
  popUpErrorMsg: any = "";
  portfolioCompData = {};
  fundData = {};
  investorData = {};
  adhocPeriod = { type: '' };
  yearRange: any;
  adhocPeriodTypes = [];
  adhocMonth: string = "";
  adhocSelectedMonth: string = "";
  adhocQuarter: string = "";
  adhocYear: string = "";
  adhocModelYear: string = "";
  yearOptions: any = [];
  isPeriod: boolean = false;
  isPeriodValidate: boolean = false;
  isQuarterValidate: boolean = false;
  isMonthValidate: boolean = false;
  isYearValidate: boolean = false;
  isLoading: boolean = false;
  allfiletypes: Array<string>=[];

  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  errorCount = 0;
  fundList=[];
  fundOfFund="Fund Beta";
  fofTemplateFileName="FundList_Import";
  fOFAliasName="FOF"
  myAppUrl: string;
  constructor(
    private messageService: MessageService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private miscService: MiscellaneousService,
    private fileUploadService: FileUploadService,
    private portfolioCompanyService: PortfolioCompanyService,
    private permissionService: PermissionService,
    private uploadService: UploadService,
    private _fundService: FundService,
    private toastrService: ToastrService,
    private _investorService: InvestorService,
    @Inject("BASE_URL") baseUrl: string
) 
  {
    this.myAppUrl = baseUrl;
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.adhocPeriodTypes = [
      { type: AdhocPeriodType.Monthly },
      { type: AdhocPeriodType.Quarterly },
      { type: AdhocPeriodType.Annual }
    ];
    this.yearOptions = this.miscService.bindYearList();
    this.yearRange = "2000:" + new Date().getFullYear();
  }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.getModuleList();
    this.getCompanies();
    this.getFundList();
    this.getInvestorDropdownList();
    localStorage.setItem("BulkUpload", "true");
  }
  fromQuarterYear(event: any) {
    this.isQuarterValidate = false;
    this.adhocQuarter = event.quarter + ' ' + event.year;
  }
  onSelectMonth(event) {
    this.isMonthValidate = false;
    let d = new Date(Date.parse(event));
    this.adhocSelectedMonth = `${d.getMonth() + 1}/${d.getFullYear()}`;
  }
  yearOptionsChange(event) {
    this.isYearValidate = false;
    this.adhocYear = event.value.value;
  }
  clearData() {
    this.adhocPeriod = { type: '' };
    this.adhocQuarter = "";
    this.adhocYear = "";
    this.adhocSelectedMonth = "";
    this.adhocMonth = "";
    this.adhocModelYear = "";
  }
  validateSelectedPeriod(event) {
    this.isPeriodValidate = false;
    if (event.value.type == AdhocPeriodType.Monthly) {
      this.adhocQuarter = "";
      this.adhocYear = "";
      this.adhocModelYear = "";
    }
    if (event.value.type == AdhocPeriodType.Quarterly) {
      this.adhocMonth = "";
      this.adhocYear = "";
      this.adhocModelYear = "";
      this.adhocSelectedMonth = "";
    }
    if (event.value.type == AdhocPeriodType.Annual) {
      this.adhocMonth = "";
      this.adhocSelectedMonth = "";
      this.adhocQuarter = "";
    }
  }
  getInvestorDropdownList() {
    this._investorService.getinvestorlist({}).subscribe((result: any) => {
      this.investorList = result;
    })
  }

  isExpand(item) {
      if (item?.isExpanded)
      item.isExpanded = false;
      else
          item.isExpanded = true;
    this.errormessages = this.errormessages.map(y => { y.sheetname != item.sheetname ? y.isExpanded = false : y.isExpanded; return y; });
  }

  getCompanies() {
    this.portfolioCompanyService.getPortfolioCompany().subscribe(
      (result: any) => {
        this.PorfolioCompanies = result;
      })
  }
  private uploadFiles(file: any) {
    this.loading = true
    let local = this;
    this.uploadResultobj = {};
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
    file.showCancelButton = true;
    this.ProgressCancel = false;
    this.safeHtml = "";
    let ModuleName = this.moduleName;
    let strAPIURL = this.strAPIURL;
    if (file.length === 0) {
      this.safeHtml = "Error :- No file selected. Please select a file.";
      this.messageClass = "errorMessage";
      this.ProgressCancel = true;
      return;
    }
    if (this.moduleName == "adhoc" && this.adhocPeriod.type == "") {
      this.isPeriodValidate = true;
      this.loading = false;
      this.ProgressCancel = true;
      return
    }
    if ((this.moduleName == "adhoc" && this.adhocPeriod.type == AdhocPeriodType.Monthly) && this.adhocSelectedMonth == "") {
      this.loading = false;
      this.ProgressCancel = true;
      this.isMonthValidate = this.adhocQuarter == "" ? true : false;
      return
    }
    if ((this.moduleName == "adhoc" && this.adhocPeriod.type == AdhocPeriodType.Quarterly) && this.adhocQuarter == "") {
      this.loading = false;
      this.ProgressCancel = true;
      this.isQuarterValidate = this.adhocQuarter == "" ? true : false;
      return
    }
    if ((this.moduleName == "adhoc" && this.adhocPeriod.type == AdhocPeriodType.Annual) && this.adhocYear == "") {
      this.loading = false;
      this.ProgressCancel = true;
      this.isYearValidate = this.adhocYear == "" ? true : false;
      return
    }
    try {
      const formData = new FormData();
      formData.append("ModuleName", ModuleName);
      formData.append(file.name, file);
      if (local.PortfolioCompanyId !== 0) {
        let encryptedPortfolioCompanyID = local.PorfolioCompanies.filter(
          (s) => s.portfolioCompanyID === local.PortfolioCompanyId
        )[0].encryptedPortfolioCompanyId;
        formData.append("PortfolioCompanyID", encryptedPortfolioCompanyID);
      }
      else if (local.FundId != 0)
        formData.append("FundId", local.encryptedFundId);
      else if (local.investorId != 0) {
        formData.append("InvestorId", local.encryptInvestorId);
        this.cancel = false;
      }
      if (this.moduleName == "adhoc") {
        if (this.adhocYear != "")
          formData.append("Year", this.adhocYear);
        if (this.adhocSelectedMonth != "")
          formData.append("Month", this.adhocSelectedMonth);
        if (this.adhocQuarter != "")
          formData.append("Quarter", this.adhocQuarter);
      }
      if(this.moduleName == "esg"){
        this.prepareFilesList(file);
      }
      if(this.moduleName?.toLocaleLowerCase() == this.fundOfFund?.toLocaleLowerCase()){
        this.prepareFoFFilesList(file);
      }
      if (!this.cancel && this.moduleName !="esg" && this.moduleName != this.fundOfFund) {
        this.cancel = true;
        this.FileProgresStatus = "File Processing...";
        this.fileUploadService.importBulkData(formData, strAPIURL).subscribe({
          next:(results) => {
            this.loading = false;
            let num = 0;
            this.errormessages = [];
            this.messageClass = "";
            let iterations = results["body"];
            for (let result of results["body"]) {
              try {
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

                  this.uploadedFiles.push(file);

                  this.uploadResultobj.messageClass = this.messageClass;
                  this.uploadResultobj.safeHtml = this.safeHtml;
                  this.messages.push(this.uploadResultobj);
                  this.files = [];
                  this.uploadFilePlaceholder = this.defaultPlaceholder;
                  this.browseicon = true;
                  this.toastrService.success("File uploaded successfully", "", { positionClass: "toast-center-center" });
                } else if (
                  result.code != null &&
                  result.code.trim().toLowerCase() == "info"
                ) {
                  this.messageClass = "infoMessage";
                  this.safeHtml = result.message;
                  this.uploadResultobj.messageClass = this.messageClass;
                  this.uploadResultobj.safeHtml = this.safeHtml;
                  this.messages.push(this.uploadResultobj);
                } else {
                  if (ModuleName != "adhoc") {
                    if ((result.message != null && result.message != "") || result?.excelStatuses.length > 0) {

                      if (num == 0 && (result.message == undefined || result.message == null || result.message == "")) {
                        result.message =
                          "One or more records in the file has invalid data or sheet(s) may be empty. Please upload the file again after correction.";
                      }
                      num = num + 1;
                      if (result?.excelStatuses != undefined && result?.excelStatuses.length > 0) {
                        result?.excelStatuses?.forEach(excelStatus => {
                          let errors = excelStatus;
                          let message = `${errors?.sheetName}`;
                          result.message =
                            (result?.message != null && result?.message != undefined)
                              ? `${result?.message} ${message}`
                              : message;
                          result.message = result?.message?.replace("null", "");
                          errors?.excelCodeStatus?.forEach(status => {
                            let statusMessage = `${status.cellCode != null ? status.cellCode : ''} -  ${status?.message}`;
                            let errMsgs = [];
                            let res = this.errormessages.find(x => x.sheetname != "" && x.sheetname.toString().toLowerCase() == errors.sheetName.toString().toLowerCase());
                            if (res != undefined) {
                              errMsgs = res.messages;
                              this.errormessages = this.errormessages.filter(x => x.sheetname.toString().toLowerCase() != errors.sheetName.toString().toLowerCase());
                            }
                            let errorRes = { sheetname: errors.sheetName, messages: [...errMsgs, { cellCode: status.cellCode, message: status?.message }], isExpanded: false };
                            this.errormessages.push(errorRes);
                            result.message = (result.message != null && result.message != undefined) ? `${result.message} ${statusMessage}` : statusMessage;
                          });
                        });
                      } else {
                        let msgs = result.message.toString().trim().split("<br/>");
                        msgs = msgs.filter(x => x != "");
                        let errorRes = { sheetname: results?.sheetName, messages: msgs, isExpanded: false };
                        this.errormessages.push(errorRes);
                      }

                      this.messageClass = "errorMessage";
                      this.safeHtml = result.message;
                      this.uploadResultobj.messageClass = this.messageClass;
                      this.uploadResultobj.safeHtml = this.safeHtml;
                      this.messages.push(this.uploadResultobj);
                      this.toastrService.error("Errors found in selected file", "", { positionClass: "toast-center-center" });
                    }
                  } else {
                    if (result != undefined && result != "") {
                      this.messageClass = "errorMessage";
                      let message = `<b>${result?.sheetName}:</b></br>`;
                      result.message =
                        (result?.message != null && result?.message != undefined)
                          ? `${result?.message} ${message}`
                          : message;
                      result.message = result?.message?.replace("null", "");
                      result?.excelCodeStatus.forEach(status => {
                        let statusMessage = `<b>${status.cellCode != null ? status.cellCode : ''}</b> -  ${status?.message}</br>`;
                        result.message = (result.message != null && result.message != undefined) ? `${result.message} ${statusMessage}` : statusMessage;
                        this.messageClass = status.code == 'success' ? 'success' : 'errorMessage';
                        let errMsgs = [];
                        let res = this.errormessages.find(x => x.sheetname != "" && x.sheetname.toString().toLowerCase() == result.sheetName.toString().toLowerCase());
                        if (res != undefined) {
                          errMsgs = res.messages;
                          this.errormessages = this.errormessages.filter(x => x.sheetname.toString().toLowerCase() != result.sheetName.toString().toLowerCase());
                        }
                        let errorRes = { sheetname: result.sheetName, messages: [...errMsgs, { cellCode: status.cellCode, message: status?.message }], isExpanded: false };
                        this.errormessages.push(errorRes);
                        if (this.messageClass == 'success' && !--iterations) {
                          this.files = [];
                          this.uploadFilePlaceholder = this.defaultPlaceholder;
                          this.browseicon = true;
                          this.toastrService.success("File uploaded successfully", "", { positionClass: "toast-center-center" });
                        }
                      });
                    }

                    this.uploadResultobj.messageClass = this.messageClass;
                    this.uploadResultobj.safeHtml = this.safeHtml;
                    this.messages.push(this.uploadResultobj);
                  }
                }
              } catch (e) {
                this.messageClass = "errorMessage";
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: "Please check the file",
                });
                this.value = 100;
                setInterval(() => {
                  this.ProgressCancel = true;
                }, 2000);
                this.toastrService.error("Errors found in selected file", "", { positionClass: "toast-center-center" });
              }
            }

            //errorCount
            let errorCount = 0;
            this.errormessages.forEach(element => {
              errorCount = errorCount + element.messages.length;
            });
            this.errorCount = errorCount;
          },
          error:(error) => {
            this.loading = false;
            if(this.moduleName != "esg"){
            this.toastrService.error("Errors found in selected file", "", { positionClass: "toast-center-center" });
            }this.ProgressCancel = false;
          }
      });
      }
    } catch (e) {
      this.loading = false;
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please check the file",
      });
      this.messageClass = "errorMessage";
    }
    
  }
  getBulkModules() {
    this.miscService.getBulkModules().subscribe({next:result => {
      if (result != null && result.length > 0) {
        this.masterModel.moduleList = result;
      }
    }, error:error => {

    }});
  }
  modulesLoading: boolean;
  getModuleList() {
    this.modulesLoading = true;
    let localModel = this.model;
    this.getBulkModules();
    if (
      this.model.moduleDetails != null &&
      this.model.moduleDetails.moduleId > 0
    ) {
      this.model.moduleDetails = this.masterModel.moduleList.filter(function (
        element: any,
        index: any
      ) {
        return element.moduleId == localModel.moduleDetails.moduleId;
      })[0];
    }
    this.modulesLoading = false;
  }

  getDropdownValue = (f: any) => {
    this.portfolioCompData = {};
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseicon = true;
    this.files = [];
    this.PortfolioCompanyId = 0;
    this.FundId = 0;
    this.investorId = 0;
    this.fundList=[];
    this.fundData = null;
    if (f.alias == '')
      this.hideUnauthorized = true;
    else
      this.hideUnauthorized = false;

    this.featureName = f.alias;
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
    this.CompanyDisabled = true;
    this.IsValidCompany = false;
    this.showClickMessage = true;
    this.isFundModuleSelected = false;
    this.isConditionalDropDown = "common";
    this.moduleName = f.moduleName.toString()?.trim()?.toLowerCase();
    switch (this.moduleName) {
      case ModuleList.User:
        this.TemplateFileName = "UserList_Import";
        this.strModuleType = "UserList";
        this.strAPIURL = "api/user/import/" + false;
        break
      case ModuleList.Firm:
        this.TemplateFileName = "FirmList_Import";
        this.strModuleType = "FirmList";
        this.strAPIURL = "api/firm/import";
        break
      case ModuleList.Deal:
        this.TemplateFileName = "DealList_Import";
        this.strModuleType = "DealList";
        this.strAPIURL = "api/deals/import";
        break
      case ModuleList.Fund:
        this.TemplateFileName = "FundList_Import";
        this.strModuleType = "FundList";
        this.strAPIURL = "api/fund/import";
        this.isFundModuleSelected = true;
        this.isConditionalDropDown = "fund";
        this.IsValidFundName = false;
        this.hideUnauthorized = false;
        break
      case ModuleList.Company:
        this.TemplateFileName = "PortfolioCompany_Import";
        this.strModuleType = "PortFolioCompany";
        this.strAPIURL = "api/portfolio-company/import";
        break
      case ModuleList.CompanyKpi:
        this.TemplateFileName = "CompanyKPI_Import";
        this.strModuleType = "CompanyKPI";
        this.strAPIURL = "api/bulkupload/import";
        this.CompanyDisabled = false;
        break
      case ModuleList.Financials:
        this.TemplateFileName = "Financials_Import";
        this.strModuleType = "Financials";
        this.strAPIURL = "api/bulkupload/import";
        this.CompanyDisabled = false;
        break
      case ModuleList.ImpactKpi:
        this.TemplateFileName = "ImpactKPI_Import";
        this.strModuleType = "ImpactKPI";
        this.strAPIURL = "api/bulkupload/import";
        this.CompanyDisabled = false;
        break
      case ModuleList.InvestmentKpi:
        this.TemplateFileName = "InvestmentKPI_Import";
        this.strModuleType = "InvestmentKPI";
        this.strAPIURL = "api/bulkupload/import";
        this.CompanyDisabled = false;
        break
      case ModuleList.MonthlyReport:
        this.TemplateFileName = "MonthlyReport_Import";
        this.strModuleType = "MonthlyReport";
        this.strAPIURL = "api/bulkupload/import";
        this.CompanyDisabled = false;
        break
      case ModuleList.OperationalKpi:
        this.TemplateFileName = "OperationalKPI_Import";
        this.strModuleType = "OperationalKPI";
        this.strAPIURL = "api/bulkupload/import";
        this.CompanyDisabled = false;
        break
      case ModuleList.ExchangeRates:
        this.TemplateFileName = "ExchangeRates_Import";
        this.strModuleType = "ExchangeRates";
        this.strAPIURL = "api/bulkupload/import";
        break
      case ModuleList.TradingRecords:
        this.TemplateFileName = "TradingRecords_Import";
        this.strModuleType = "TradingRecords";
        this.strAPIURL = "api/bulkupload/import";
        this.CompanyDisabled = false;
        break
      case ModuleList.CreditKpi:
        this.TemplateFileName = "CreditKPI_Import";
        this.strModuleType = "CreditKPI";
        this.strAPIURL = "api/bulkupload/import";
        this.CompanyDisabled = false;
        break
      case ModuleList.ValuationTable:
        this.TemplateFileName = "Valuation_Data";
        this.strModuleType = "ValuationData";
        this.strAPIURL = "investor/import";
        this.isConditionalDropDown = "investor";
        this.IsValidInvestor = false;
        this.hideUnauthorized = false;
        break
      case ModuleList.Adhoc:
        this.TemplateFileName = "Adhoc_Import";
        this.strModuleType = "Adhoc";
        this.CompanyDisabled = false;
        this.strAPIURL = "api/UnstructuredHistory/UploadUnstructuredFile";
        break
      case ModuleList.Investor:
        this.TemplateFileName = "Investor_Investment_Summary";
        this.strModuleType = "Investor_Investment_Summary";
        this.strAPIURL = "investor-funds/import";
        this.isConditionalDropDown = "investor";
        this.IsValidInvestor = false;
        this.hideUnauthorized = false;
        break;
      case ModuleList.ESG:
        this.TemplateFileName = "";
        this.strModuleType = "ESG";
        this.strAPIURL = "api/esg/upload/template";
        this.CompanyDisabled = false;
        break
        case ModuleList.FOF:
          this.TemplateFileName = this.fofTemplateFileName;
          this.strModuleType = this.fundOfFund;
          this.strAPIURL = "api/fof/import/template";
          this.isFundModuleSelected = true;
          this.isConditionalDropDown = this.fOFAliasName;
          this.IsValidFundName = false;
          this.hideUnauthorized = false;
          break
    }

    if (this.fileUploader !== undefined) {
      this.fileUploader.files = [];
    }
    this.safeHtml = "";
    this.value = 0;
    clearInterval(this.interval);
    this.ProgressCancel = true;
  };

  getFundList() {
    this._fundService.getFundData().subscribe({next:result => {
      if (result != null && result.length > 0) {
        this.FundsList = result;
      }
      else {
        this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
      }
    }, error:error => {
      this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
    }});
  }
  OnFundSelected = (event) => {
    this.FundId = event.fundID
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
    this.EnableDownload = true;
    this.ProgressCancel = true;
    this.IsValidFundName = false;
    this.encryptedFundId = this.FundsList.filter(
      (s) => s.fundID === this.FundId
    )[0].encryptedFundId;

    if (!this.encryptedFundId) {
      this.hideUnauthorized = false;
    }
    else {
      this.hideUnauthorized = true;
    }

  }
  OnInvestorSelected = (event) => {
    this.investorId = event.investorId;
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
    this.EnableDownload = true;
    this.ProgressCancel = true;
    this.IsValidInvestor = false;
    this.encryptInvestorId = this.investorList.filter(
      (s) => s.investorId === this.investorId
    )[0].encryptedInvestorId;

    if (!this.encryptInvestorId) {
      this.hideUnauthorized = false;
    }
    else {
      this.hideUnauthorized = true;
    }

  }

  CompanySelected(event) {
    this.PortfolioCompanyId = event.portfolioCompanyID
    this.deleteiconclick();
    this.EnableDownload = true;
    this.ProgressCancel = true;
    this.uploadedFiles = [];
    this.IsValidCompany = false;
    this.encryptedPortfolioCompanyID = this.PorfolioCompanies.filter(
      (s) => s.portfolioCompanyID === this.PortfolioCompanyId
    )[0].encryptedPortfolioCompanyId;
    this.hideUnauthorized = this.permissionService.checkUserPermission(this.subFeature[this.featureName], this.actions[this.actions.canImport], this.encryptedPortfolioCompanyID);
    this.isPeriod = this.strModuleType == "Adhoc" ? true : false;
    this.strModuleType == "Adhoc" ? this.clearData() : null;
  }

  onUpload() {
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
    if (!this.CompanyDisabled && this.PortfolioCompanyId == undefined) {
      this.IsValidCompany = true;
    }
    if (!this.IsValidCompany) {
      for (let file of this.files) {
        this.uploadFiles(file);
      }
    }
  }
  
  onSelect(files: any) {
    this.files = files;
    this.uploadedFiles = [];
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
    const validExcelExtensions = /\.(xlsx|xls)$/i;
    const errorMessages = [];
    if (!validExcelExtensions.test(files[0].name) && this.moduleName == "esg") {
      errorMessages.push("Please upload excel formats only");
    }
    const validZipExtensions = /\.(zip)$/i;
    if (!validZipExtensions.test(files[0].name) && this.moduleName.toLocaleLowerCase() == this.fundOfFund.toLocaleLowerCase()) {
      this.files = [];
      this.uploadFilePlaceholder = this.defaultPlaceholder;
      this.browseicon = true;
      this.toastrService.error("Please upload zip format file only", "", { positionClass: "toast-center-center" });
      return;
    }
    if (files[0].size > 20000000) {
      errorMessages.push("File size exceeds the 20mb limit");
    }
    if (errorMessages.length > 0) {
      this.messageClass = "errorMessage";
      this.errormessages = [
        {
          isExpanded: false,messages: errorMessages,
        },
      ];
      this.errorCount = errorMessages.length;
    }
    if (!this.errormessages.length) {
      this.ProgressCancel = true;
      this.value = 0;
      this.cancel = false;
      this.FileProgresStatus = "Cancel File Progress";
      this.uploadFilePlaceholder = files[0].name;
      this.browseicon = false;
    }
  }
  onCancel(event: any) {
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
    this.value = 0; 
    this.cancel = true;
    clearInterval(this.interval);
    this.ProgressCancel = true;
  }

  deleteiconclick() {
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseicon = true;
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
  }

  DownloadTemplate() {
    this.isLoading = true;
    this.messages = [];
    this.errormessages = [];
    this.messageClass = "";
    let res = Object.assign({ moduleType: this.strModuleType },
      this.isConditionalDropDown == "fund" ?
        {
          EncryptedPortfolioCompanyID: null,
          EncryptedFundId: this.encryptedFundId,
          EncryptedInvestorId: null
        } :
        this.isConditionalDropDown == "investor" ?
          {
            EncryptedPortfolioCompanyID: null,
            EncryptedFundId: null,
            EncryptedInvestorId: this.encryptInvestorId
          } :
          {
            EncryptedPortfolioCompanyID: this.encryptedPortfolioCompanyID,
            EncryptedFundId: null,
            EncryptedInvestorId: null
          });
    if (this.isConditionalDropDown == this.fOFAliasName) {
      this.downloadFOFTemplate();
    } else {
      this.fileUploadService
        .exportTemplates(res)
        .subscribe({
          next:(response) => {
            if (response.ok) {
              this.miscService.downloadExcelFile(response);
            } else {
              this.msgs = this.miscService.showAlertMessages(
                "error",
                "File is not downloaded."
              );
            }
            this.loading = false;
            this.isLoading = false;
          },
          error:(error) => {
            this.isLoading = false;
            const errorJson = JSON.parse(this.blobToString(error.error));
            this.loading = false;
            this.messageClass = "errorMessage";
            this.safeHtml = errorJson.message;

            if (this.isConditionalDropDown == "fund") {
              let msg = errorJson.message.toString().split("<br/>")
              let sheetName = errorJson.sheetName != undefined && errorJson.sheetName != null ? errorJson.sheetName.toString() : "Portfolio Company Level";
              let errorRes = { sheetname: sheetName, messages: msg, isExpanded: false };
              this.errormessages.push(errorRes);
              this.errorCount = 1;
            }
            this.uploadResultobj.messageClass = this.messageClass;
            this.uploadResultobj.safeHtml = this.safeHtml;
            this.messages.push(this.uploadResultobj);
          }
    });
    }
  }
  onFundChangeModel=(event:any)=>{
    this.errormessages=[];
    this.messageClass = "";
    this.hideUnauthorized = false;
    const unshiftFundList = event?.value || [];
    if(unshiftFundList.length==0){
      this.FundsList= this.FundsList.sort((a, b) => a.fundName.localeCompare(b.fundName));
    }
    unshiftFundList.forEach(selectedItem => {
      const index = this.FundsList.findIndex(option => option.fundID === selectedItem.fundID);
      if (index !== -1) {
        this.FundsList.splice(index, 1);
        this.FundsList.unshift(selectedItem);
      }
    });
    if (this.fundList.length > 0) {
      this.hideUnauthorized = true;
    }
  }
  downloadFOFTemplate() {
    this.isLoading = true;
    let fundIds = this.fundList.map(function (fund) {
      return fund.fundID;
    });
    let res = Object.assign({ moduleType: this.strModuleType, funds: fundIds });
    this.fileUploadService
      .foFExportTemplates(res)
      .subscribe({next:(response) => {
        this.miscService.downloadZIPFile(response);
        this.toastrService.success("File downloaded successfully", "", { positionClass: "toast-center-center" });
        this.isLoading = false;
      }, error:(error) => {
        this.messageClass = "errorMessage";
        const errorJson = JSON.parse(this.blobToString(error.error));
        const copyErrorJson = errorJson;
        let errorCount = 0;
        copyErrorJson.forEach(item => {
          let errorRes = { sheetname: item.sheetName, messages: [...item.excelCodeStatus], isExpanded: false };
          this.errormessages.push(errorRes);
          errorCount = errorCount + item.excelCodeStatus.length;
        });
        this.errorCount = errorCount;
        this.isLoading = false;
      }
    });
  }
  private blobToString(blob): string {
    const url = URL.createObjectURL(blob);
    let xmlRequest = new XMLHttpRequest();
    xmlRequest.open('GET', url, false);
    xmlRequest.send();
    URL.revokeObjectURL(url);
    return xmlRequest.response;
  }

  closeErrorPopup = () => {
    this.showErrorPopUp = false;
  }
  prepareFilesList(file: any) {
    this.esgUpload(file);
  }
  prepareFoFFilesList(file: any) {
    this.cancel = true;
    this.FileProgresStatus = "File Processing...";
    this.messageClass = "";
    this.messages = [];
    let funds = this.fundList?.map((s) => s.fundID)?.join(",");
    const formData = new FormData();
    formData.append("FundIds", funds);
    formData.append("fileName", file.name);
    formData.append("formFile", file);
    this.fileUploadService.importFoFBulkData(formData).subscribe({
      next: (results: any) => {
        this.clearResponse();
      },
      error: (err) => {
        this.isLoading = false;
        this.clearResponse();
      },
    });
    this.isLoading = false;
    this.uploadService.notifyUploadCompleted();
  }
  clearResponse()
  {
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseicon = true;
    this.loading = false;
    this.errormessages = [];
    this.messageClass = "";
  }
  setErrors()
  {
    this.messageClass = "errorMessage";
    this.uploadResultobj.messageClass = this.messageClass;
    this.uploadResultobj.safeHtml = this.safeHtml;
    this.messages.push(this.uploadResultobj);
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseicon = true;
    this.toastrService.error("Errors found in selected file", "", { positionClass: "toast-center-center" });
    this.loading = false;
  }
  esgUpload(file: any) {
    this.messages = [];
    this.messageClass = "";
    this.messages = [];
    const formData = new FormData();
    formData.append("fileSize", file.size);
    formData.append("fileName", file.name);
    formData.append("formFile", file);
    formData.append("encryptedPortfolioCompanyID", this.encryptedPortfolioCompanyID);
    formData.append("encryptedFundId", this.encryptedFundId);
    this.fileUploadService.UploadESG(formData).subscribe({
    next:(result: any) => {
      this.files = [];
      this.uploadFilePlaceholder = this.defaultPlaceholder;
     this.browseicon = true;
   }  , error:(err) => {
      const errorMsgs: any[] = (err.status == 400 && err?.error) || [];
      errorMsgs?.forEach(x => {
        this.messages.push({
          messageClass: "",
          safeHtml:x.message,
        });
        this.ProgressCancel = true
        
      });
    
    }}); 
    this.loading = false;
    this.uploadService.notifyUploadCompleted(); }
}
