import { Component, OnInit,  ViewChild } from "@angular/core";
import { AuditService } from "src/app/services/audit.service";
import { DataAuditModel } from "src/app/services/DataAuditModel";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import * as moment from "moment";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { KPIModulesEnum } from "src/app/services/permission.service";
import { KpiConstants, DataAnalyticsConstants, GlobalConstants } from "src/app/common/constants";

@Component({
  selector: "app-view-pc-aduitlogs",
  templateUrl: "./view-pc-aduitlogs.component.html",
  styleUrls: ["./view-pc-aduitlogs.component.scss"]
})
export class ViewPCAduitlogsComponent implements OnInit {
  constructor(
    private aduitservice: AuditService,
    private miscService: MiscellaneousService,
    private toastrService: ToastrService,
  ) {}
  public KPI: string = "...";
  public docTableHeaders = [];
  public documents = [];
  dataAuditModel: DataAuditModel;
  datauditmodellog: DataAuditLogValueModel;
  ShowRestoreDialog: boolean = false;
  eventdata: any = {};
  data: any = {};
  isLoader: boolean = true;
  isMasterKpiData :boolean = false;
  numberWithCommas(x) {
    if (String(x).match(/^[-+]?\d*\.?\d+$/)) {
      x = parseFloat(x).toLocaleString("en-us", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return x;
  }
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.isLoader=true;
    if (history.state.data !== undefined) {
      this.data = history.state.data;
      sessionStorage.setItem("data", JSON.stringify(this.data));
    } else {
      this.data = JSON.parse(sessionStorage.getItem("data"));
    }
    this.isMasterKpiData = this.data.ModuleId!=undefined;
    if (this.data !== null) {
      this.KPI = this.data.KPI + " - " + this.data.AttributeName + " - " + this.data.header;
      this.dataAuditModel = {
        FieldName: this.data.AttributeName,
        AttributName: this.data.KPI,
        MonthAndYear: this.data.header,
        PortfolioCompanyID: this.data.PortfolioCompanyID,
        AttributeId: this.data.AttributeId,
        Comments : this.data.Comments,
        Attributid:this.data.AttributeId,
        ModuleId : this.data.ModuleId
      };
      let that = this;
      this.docTableHeaders = [
        {
          field: "activityoccursin",
          header: "Activity occurs in",
          sort: false,
          valueCustomClass: "auditcell",
          headerWidthClass: "auditheader",
          valueWidthClass: "",
        },
        {
          field: "newvalue",
          header: "New Value",
          sort: false,
          valueCustomClass: "auditcell",
          headerWidthClass: "auditheader",
          valueWidthClass: "",
        },
        {
          field: "oldvalue",
          header: "Old Value",
          sort: false,
          valueCustomClass: "auditcell",
          headerWidthClass: "auditheader",
          valueWidthClass: "",
        },
        {
          field: "activityon",
          header: "Activity on",
          sort: false,
          valueCustomClass: "auditcell",
          headerWidthClass: "auditheader",
          valueWidthClass: "",
        },
        {
          field: "activityby",
          header: "Activity by",
          sort: false,
          valueCustomClass: "auditcell",
          headerWidthClass: "auditheader",
          valueWidthClass: "",
        },
        {
          field: "modofchange",
          header: "Mode of Change",
          sort: false,
          valueCustomClass: "auditcell ActionItem",
          headerWidthClass: "auditheader",
          valueWidthClass: "",
        },
      ];
      if(!this.isMasterKpiData)
        this.GetAuditlog(that);
      else
      {
        if(this.data.ModuleId == KPIModulesEnum.TradingRecords || this.data.ModuleId == KPIModulesEnum.CreditKPI)
        {
          this.GetMasterAuditlog(that);
        }
        else{
          this.GetFinancialAuditlog();
        }
      }

    }
  }

  private GetAuditlog(that: this) {
    this.aduitservice.getDataLog(this.dataAuditModel).subscribe((result) => {
      that.documents = result.body?.map((s: { fieldName: any; newValue: string; oldValue: string; createdOn: string | number | Date; createdBy: any; description: any; attributeID: any; monthAndYear: any; newCurrencyType: any; oldCurrencyType: any; portfolioCompanyId: any; comments: any; }) => {
        return {
          activityoccursin: s.fieldName,
          newvalue: (this.data.KPI == KpiConstants.INVESTMENT_KPI && s.newCurrencyType =="Text" && s.newValue != null) ?s.newValue : (s.newValue != null && s.newValue !=""? this.numberWithCommas(s.newValue) =='NaN' ?s.newValue:this.numberWithCommas(s.newValue):"NA"),
          oldvalue: (this.data.KPI == KpiConstants.INVESTMENT_KPI && s.newCurrencyType =="Text" && s.oldValue != null) ?s.oldValue :(s.oldValue != null && s.oldValue !="" ? (this.numberWithCommas(s.oldValue) == 'NaN' ?s.oldValue :this.numberWithCommas(s.oldValue)): "NA"),
          activityon: moment(new Date(s.createdOn)).format("D-MMM-YYYY,HH:mm"),
          activityby: s.createdBy,
          modofchange: (s.description != null) ? s.description : "File upload",
          attributeID: s.attributeID,
          monthAndYear: s.monthAndYear,
          newCurrencyType: s.newCurrencyType,
          oldCurrencyType: s.oldCurrencyType,
          fieldName: s.fieldName,
          portfolioCompanyId: s.portfolioCompanyId,
          comments: s.comments
        };
      });
      this.isLoader = false;
    });
  }
  private GetMasterAuditlog(that: this) {
    this.aduitservice.getMasterKpiAuditLog(this.dataAuditModel).subscribe((result) => {
      that.documents = result.map((s) => { 
        return {
          activityoccursin: s.fieldName,
          newvalue: (s.moduleId == KPIModulesEnum.TradingRecords && s.newCurrency == 'Text' && s.newValue != null) ? s.newValue : (s.newValue != null  && s.newValue !=""? (this.numberWithCommas(s.newValue) == 'NaN' ? s.newValue :this.numberWithCommas(s.newValue)): "NA"),
          oldvalue: (s.moduleId == KPIModulesEnum.TradingRecords && s.newCurrency == 'Text' && s.oldValue != null) ? s.oldValue :(s.oldValue != null  && s.oldValue !=""? (this.numberWithCommas(s.oldValue) == 'NaN' ?s.oldValue :this.numberWithCommas(s.oldValue)): "NA"),
          activityon: moment(new Date(s.createdOn)).format("D-MMM-YYYY,HH:mm"),
          activityby: s.createdBy,
          modofchange: s.auditType,
          attributeID: s.attributeId,
          monthAndYear: s.monthAndYear,
          newCurrency: s.newCurrency,
          oldCurrency: s.oldCurrency,
          fieldName: s.fieldName,
          portfolioCompanyId: s.portfolioCompanyId,
          comments: s.comments
        };
      });
      this.isLoader = false;
    });
  }
  getFinancialModel(){
    return{
      PortfolioCompanyID: this.data.PortfolioCompanyID,
      AttributeId: this.data.AttributeId,
      ValueType : this.data.Comments,
      ModuleId : this.data.ModuleId,
      MappingId:this.data.MappingId
    };
  }
   GetFinancialAuditlog() {
 
    this.aduitservice.geFinancialKpiAuditLog(this.getFinancialModel()).subscribe({next:(result) => {
      if(result?.length > 0)
      {
        this.documents = result.map((s) => { 
          return {
            activityoccursin: s.fieldName,
            newvalue: (s.newCurrency == 'Text' && s.newValue != null) ? s.newValue : (s.newValue != null  && s.newValue !=""? (this.numberWithCommas(s.newValue) == 'NaN' ? s.newValue :this.numberWithCommas(s.newValue)): "NA"),
            oldvalue: (s.newCurrency == 'Text' && s.oldValue != null) ? s.oldValue :(s.oldValue != null  && s.oldValue !=""? (this.numberWithCommas(s.oldValue) == 'NaN' ?s.oldValue :this.numberWithCommas(s.oldValue)): "NA"),
            activityon: moment(new Date(s.createdOn)).format("D-MMM-YYYY,HH:mm"),
            activityby: s.createdBy,
            modofchange: s.auditType,
            attributeID: s.attributeId,
            monthAndYear: s.monthAndYear,
            newCurrency: s.newCurrency,
            oldCurrency: s.oldCurrency,
            fieldName: s.fieldName,
            portfolioCompanyId: s.portfolioCompanyId,
            comments: s.comments
          };
        });
        this.isLoader = false;
      }
      this.isLoader = false;
    },error:error => {
      this.isLoader = false;
    }});
  }

  DownloadAudit() {
    this.aduitservice
      .ExportDataLog(this.dataAuditModel)
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  DownloadMasterAudit() {
    if(this.data.ModuleId ==  KPIModulesEnum.TradingRecords || this.data.ModuleId == KPIModulesEnum.CreditKPI)
    {
      this.aduitservice
      .exportMasterKpiAuditLog(this.dataAuditModel)
      .subscribe((response) => this.miscService.downloadExcelFile(response));
    }
    else{
      this.DownloadFinancialAuditAudit();
    }
  }
  DownloadFinancialAuditAudit() {
    this.aduitservice
      .exportFinancialKpiAuditLog(this.getFinancialModel())
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }
  restoreFinancialData()
  {
    let model={
      AttributeId :this.datauditmodellog.AttributeID, 
      KpiValue:this.datauditmodellog.OldValue,
      PortfolioCompanyId:this.datauditmodellog.portfolioCompanyId, 
      ModuleId:this.data.ModuleId,
      MappingId:this.data.MappingId,
      ValueType:this.data.Comments
     };
    this.aduitservice
    .revertFinancialKpiData(model)
    .subscribe({next:(result) => {
      this.GetFinancialAuditlog();
      this.toastrService.success(GlobalConstants.RevertSuccess, "", { positionClass: "toast-center-center" });
    },
    error:(error) => {
      this.toastrService.error(GlobalConstants.SomethingWentWrong, "", { positionClass: "toast-center-center" });
  }});
  }
  RowItemClicked(event: any) {
    this.ShowRestoreDialog = true;
    this.eventdata = event;
  }
  CancelEvent() {
    this.ShowRestoreDialog = false;
  }
  RestoreEvent() {
    this.ShowRestoreDialog = false;
    this.datauditmodellog = {
      AttributeID: this.eventdata.attributeID,
      AttributeName: this.data.KPI,
      OldValue: this.eventdata.oldvalue,
      MonthAndYear: this.eventdata.monthAndYear,
      newCurrencyType: this.eventdata.newCurrencyType,
      oldCurrencyType: this.eventdata.oldCurrencyType,
      fieldName: this.eventdata.fieldName,
      portfolioCompanyId: this.eventdata.portfolioCompanyId,
      comments: this.eventdata.comments,
      description:GlobalConstants.Manual
    };
    let that = this;
    if (!this.isMasterKpiData) {
      if(this.data?.KPI == DataAnalyticsConstants.Operational_KPIs){
        this.aduitservice
        .RevertKpiData(this.datauditmodellog)
        .subscribe((result) => {
          this.GetAuditlog(that);
          this.toastrService.success(GlobalConstants.RevertSuccess, "", { positionClass: "toast-center-center" });
        });
      }else{
        this.aduitservice
        .UpdateKPIData(this.datauditmodellog)
        .subscribe((result) => {
          this.GetAuditlog(that);
          this.toastrService.success(GlobalConstants.RevertSuccess, "", { positionClass: "toast-center-center" });
        });
      }
    } else {
      if(this.data.ModuleId == KPIModulesEnum.TradingRecords || this.data.ModuleId == KPIModulesEnum.CreditKPI)
      {
        this.aduitservice
        .revertMasterKpiData({AttributeId :this.datauditmodellog.AttributeID, Value:this.datauditmodellog.OldValue,PortfolioCompanyID:this.datauditmodellog.portfolioCompanyId, ModuleId:this.data.ModuleId })
        .subscribe({next:(result) => {
          this.GetMasterAuditlog(that);
          this.toastrService.success(GlobalConstants.RevertSuccess, "", { positionClass: "toast-center-center" });
        },
        error:(error) => {
          this.toastrService.error(GlobalConstants.SomethingWentWrong, "", { positionClass: "toast-center-center" });
      }});
      }
      else{
        this.restoreFinancialData();
      }

    }
  }
}
interface DataAuditLogValueModel {
  AttributeID: number;
  AttributeName: string;
  OldValue: string;
  MonthAndYear: string;
  newCurrencyType: string;
  oldCurrencyType: string;
  fieldName: string;
  portfolioCompanyId: number;
  comments: string;
  description: string;
}
