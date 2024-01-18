import { Component, Input, OnInit, ElementRef, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output,AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { isNumeric } from '@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric';
import { filter } from 'rxjs/operators';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { DecimalDigitEnum, ErrorMessage, ExportTypeEnum, FinancialValueUnitsEnum, OrderTypesEnum, PeriodTypeQuarterEnum ,MiscellaneousService} from 'src/app/services/miscellaneous.service';
import { ActionsEnum, FeaturesEnum, PermissionService, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { WorkflowInvestmentService } from 'src/app/services/WorkflowInvestmentService';
import { NumberDecimalConst, WorkflowConstants } from "src/app/common/constants";

@Component({
  selector: 'app-workflow-investment-kpi',
  templateUrl: './workflow-investment-kpi.component.html',
  styleUrls: ['./workflow-investment-kpi.component.scss']
})
export class WorkflowInvestmentKpiComponent implements OnInit, OnChanges, AfterViewInit {  
  WorkflowConstants = WorkflowConstants
  isOpenUpload: boolean = false;
  showInvestment: boolean = false; 
  @Input() dataInformation = [];
  @Input() CompanyInformation: any;
  mappingId: number = 0;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  globalFilter: string = "";
  feature: typeof FeaturesEnum = FeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  @Input() searchFilter: any = null;
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  dataTable: any;
  message: any;
  id: any;
  investmentKPIs: any[];
  @ViewChild('dt') dt: Table | undefined;
  @Input() model: any;
  @Input() workflowDetails: any = null;
  sectionData:any =null;
  msgTimeSpan: number;
  loading = false;
  blockedProfitabilityTable: boolean = false;
  portfolioProfitabilityList: any = [];
  portfolioCompanyProfitabilityClone: any[] = [];

  expandedOperationalKPIs: any[] = [];
  pagerLength: any;
  financialReport_AsOfDate: any;
  operationalReport_AsOfDate: any;
  profitabilityValueUnit: any;
  investmentKpiValueUnit: any;
  exportLoading: boolean = false;
  exportInvestmentKPILoading: boolean = false;

  InvestmentKPIOrginalData: any[] = [];
  InvestmentKPIChartData: any[] = [];
  InvestmentKPIChartCol: any = [];
  InvestmentKPIUnit: string = "";
  draftName: string = "";
  reportingCurrency:string = "NA";
  toggleStatus:any="";
  workFlowRequestId: number = 0;
  workflowMappingId: number = 0;
  IsValidUser = false;
  statusId = -1;

  confirmUpdate = false;
  tableReload = false;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  infoUpdate: boolean = false;
  isLoader: boolean = false;
  isToasterMessage = false;
  updateModel: any = {};  
  currentModelRef: any;
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  objInvestmentKPIList: any = [];
  investmentKPICols: any = [];
  modelInvestmentKpi: any = {};
  tradingRecordsKpiValueUnit: any;
  portfolioCompanyInvestmentKPIValuesList: any[];
  portfolioCompanyInvestmentKPIValuesListClone: any[];
  financialKpiSearchFilter: any;
  expandedInvestmentKPIs: any[] = [];
  totalCompanyInvestmentKPIValuesRecords: number;
  financialPeriodErrorMessage: string = "";
  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  NumberDecimalConst = NumberDecimalConst

  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('investmentMenuTrigger') menuTrigger: MatMenuTrigger;
  isMarkedForReview:boolean = true;
  showAddCommentPopup = false;
  disableAddCommentDoneBtn = true;
  comment = "";
  commentListOriginal:any;
  commentsList = [];
  commentDesc: any; 
  isOpenCommentsPopup: boolean = false;
  disableCloseButton: boolean = true;
  disableUpdateButton:boolean = true;
  workflowConstants = WorkflowConstants;
  unitOfCurrency=FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions];
  @Output() onStatusChanges: EventEmitter<any> = new EventEmitter();
  @ViewChild("myInput") private _inputElement: ElementRef;
  constructor(
    private workflowCompanyService: WorkflowCompanyService,
    private toastrService: ToastrService,
    private portfolioCompanyService: PortfolioCompanyService,
    private _avRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private miscService: MiscellaneousService,
    private router: Router,
    private workflowinvestmentservice: WorkflowInvestmentService) {    
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.modelInvestmentKpi.periodType = {
      type: PeriodTypeQuarterEnum.Last1Year,
    };
    this.modelInvestmentKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelInvestmentKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.investmentKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    };
  }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;  
    let draftData=localStorage.getItem("currentWorkflow") != "" ? JSON.parse(localStorage.getItem("currentWorkflow")):null;
    this.workFlowRequestId = draftData?.WorkflowRequestId;
    this.draftName = draftData?.DraftName;    
    this.setCompanyInfo()
  } 
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['workflowDetails']){
      this.setCompanyInfo();
     }
    if (this.dataInformation.length > 0 && (this.model != null || this.id !=null)) {
      this.getMappedData();
      this.getPortfolioCompanies();
    }
   if(this.model == null){
  this.getCurrency();
   }
    
    if (this.dataInformation.length > 0 && this.model == null) {
      this.getMappedData();
    }
  }
  getPortfolioCompanyById(requestId: number) {
    this.workflowCompanyService.getCompanyWorkFlowDraft(requestId, this.id).subscribe((result: any) => {
      this.model = result.data;
      this.getPortfolioCompanies();
    }, _error => {
      this.isLoader = false;
    })
  }
  getCurrency(){
    this.workflowCompanyService.getCompanyWorkFlowDraft(this.workflowDetails.workflowRequestId, this.id).subscribe((result: any) =>{
      if(result?.body?.companyDetails?.reportingCurrencyDetail?.currencyCode!=null)
    {
      this.reportingCurrency = result?.body?.companyDetails?.reportingCurrencyDetail?.currencyCode;
    }
    })
  }
  getWorkflowAllDetails()
  {
    this.workflowCompanyService.getWorkflowAllDetails(this.workFlowRequestId).subscribe((result: any) => {
     this.workflowDetails = result;
     this.setCompanyInfo();
    }, _error => {
      this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
    });

  }
  investmentSubmitReview() {
    this.showAddCommentPopup = true;
  }

  closePopup(isUploaded: any) {
    this.isOpenUpload = false;
    if (isUploaded){
      this.sectionData.isEdited = isUploaded;
      this.workflowCompanyService.UpdateWorkflowMappingStatus(this.mappingId).subscribe((_result: any) => {
        this.sectionData.statusId = this.sectionData.statusId == -1 ? 1:  this.sectionData.statusId ;
       }, _error => {
         this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
       });
       this.sectionData.isMarkedForReview = false;
     
    }
      this.getPortfolioCompanies();
  }

  setCompanyInfo()
  {
    this.sectionData = this.workflowDetails.workflowSectionLevels.find(x=>x.subFeatureId==this.subFeature.InvestmentKPIs);
    this.setToggleStatus();
    let subfeatureModel= this.dataInformation.find(x=>x.subFeatureId==this.subFeature.InvestmentKPIs);
    this.workFlowRequestId = subfeatureModel.workflowRequestId;
    this.workflowMappingId = subfeatureModel.workflowMappingId;
    this.isMarkedForReview = subfeatureModel.isMarkedForReview;
    this.IsValidUser = subfeatureModel.isValidUser;
    this.statusId = subfeatureModel.statusId;
  }
 
  
  getMappedData() {
    let mappedData = this.dataInformation.find(x => x.subFeatureId == this.subFeature.InvestmentKPIs);
    if (mappedData != undefined || mappedData != null) {
      this.showInvestment = true;
      this.mappingId = mappedData.workflowMappingId;
    }
    else {
      this.showInvestment = false;
      this.mappingId = 0;
    }
  }
  ngAfterViewInit() {
    if (this.uiuxMenu != undefined) {
      (this.uiuxMenu as any).closed = this.uiuxMenu.closed
      this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  configureMenuClose(old: MatMenu['close']): MatMenu['close'] {
    const upd = new EventEmitter();
    feed(upd.pipe(
      filter(event => {
        if (event === 'click') {
          return false;
        }
        return true;
      }),
    ), old);
    return upd;
  }
  isNumberCheck(str: any) {
    return isNumeric(str);
  }

  getPortfolioCompanies() {
    this.isLoader = false;
    if (this.id != undefined && !this.workflowMappingId) {
      this.getPortfolioCompanyInvestmentKPIValues(null, this.searchFilter);
    }
  }

  OnInvestmentKPIChange() {
    this.InvestmentKPIChartData = [];
    if (this.InvestmentKPIChartData.length > 0) {
      this.InvestmentKPIUnit = this.InvestmentKPIChartData[0]["Info"];
    }
  }
  convertInvestmentKPIValueUnits() {
    let financialValueUnitTable = this.investmentKpiValueUnit;
    let portfolioCompanyInvestmentKPIValuesListlocal = [];
    this.portfolioCompanyInvestmentKPIValuesList = [];
    this.unitOfCurrency = this.investmentKpiValueUnit.unitType;

    this.portfolioCompanyInvestmentKPIValuesListClone.forEach(function (
      value: any
    ) {
      let valueClone = JSON.parse(JSON.stringify(value));
      if (
        valueClone.kpiInfo != "%" &&
        valueClone.kpiInfo != "x" &&
        valueClone.kpiInfo != "#" &&
        valueClone.kpiInfo != "" &&
        valueClone.kpiInfo != "Text" &&
        valueClone.kpiActualValue != "" &&
        valueClone.kpiActualValue != null
      ) {
        let val = valueClone.kpiValue;
        val = val == undefined ? "0" : val;
        val = val.toString().replace(",","");
        switch (Number(financialValueUnitTable.typeId)) {
          case FinancialValueUnitsEnum.Absolute:
            break;
          case FinancialValueUnitsEnum.Thousands:
            if(valueClone.kpiActualValue!=0){
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
                !isNaN(parseFloat(valueClone.kpiActualValue)) && isNumeric(val)
                ? valueClone.kpiActualValue / 1000
                : valueClone.kpiActualValue;
            }
            break;
          case FinancialValueUnitsEnum.Millions:
            if(valueClone.kpiActualValue!=0){
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
                !isNaN(parseFloat(valueClone.kpiActualValue)) && isNumeric(val)
                ? valueClone.kpiActualValue / 1000000
                : valueClone.kpiActualValue;
            }
            break;
          case FinancialValueUnitsEnum.Billions:
            if(valueClone.kpiActualValue!=0){
            valueClone.kpiActualValue =
              !isNaN(parseFloat(valueClone.kpiActualValue)) &&
                !isNaN(parseFloat(valueClone.kpiActualValue)) && isNumeric(val)
                ? valueClone.kpiActualValue / 1000000000
                : valueClone.kpiActualValue;
            }
            break;
        }
      }
      portfolioCompanyInvestmentKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyInvestmentKPIValuesList = portfolioCompanyInvestmentKPIValuesListlocal;
    this.createInvestmentKPILayOut(
      this.portfolioCompanyInvestmentKPIValuesList
    );
    this.portfolioCompanyInvestmentKPIValuesList.forEach(function (item) {
      item.fullMonth = item.quarter + " " + item.year;
    });
  }
  getPortfolioCompanyInvestmentKPIValues(event: any, searchFilter: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "FinancialKPI.KPI",
        multiSortMeta: this.financialKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      let sortOrder =
        this.modelInvestmentKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
            { field: "year", order: 1 },
            { field: "quarter", order: 1 },
          ]
          : [
            { field: "year", order: -1 },
            { field: "quarter", order: -1 },
          ];
      searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelInvestmentKpi.periodType.type,
      };

      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelInvestmentKpi.startPeriod.getFullYear(),
            this.modelInvestmentKpi.startPeriod.getMonth(),
            this.modelInvestmentKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelInvestmentKpi.endPeriod.getFullYear(),
            this.modelInvestmentKpi.endPeriod.getMonth(),
            this.modelInvestmentKpi.endPeriod.getDate()
          )
        );
      }
    } else {
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            searchFilter.startPeriod.getFullYear(),
            searchFilter.startPeriod.getMonth(),
            searchFilter.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            searchFilter.endPeriod.getFullYear(),
            searchFilter.endPeriod.getMonth(),
            searchFilter.endPeriod.getDate()
          )
        );
      }
    }
    this.financialKpiSearchFilter = searchFilter;
    this.isLoader = true;


    this.workflowinvestmentservice
      .getWorkflowInvestmentKPIValues({
        portfolioCompanyID: this.model?.portfolioCompanyID!,
        encryptedPortfolioCompanyId : this.id,
        paginationFilter: event,
        searchFilter: searchFilter,
        workflowRequestId:this.workFlowRequestId,
        workflowMappingId:this.workflowMappingId
      })
      .subscribe(
        (result) => {
          let resp = result;  
          if (resp != null&&resp.pcInvestmentKPIQuarterlyValueList.length>0) {
            this.portfolioCompanyInvestmentKPIValuesList =
              resp.pcInvestmentKPIQuarterlyValueList;

            this.portfolioCompanyInvestmentKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyInvestmentKPIValuesList)
            );
            this.convertInvestmentKPIValueUnits();

            this.expandedInvestmentKPIs = [];
            if (this.portfolioCompanyInvestmentKPIValuesList.length > 0) {
              this.expandedInvestmentKPIs.push(
                this.portfolioCompanyInvestmentKPIValuesList[0]
              );
            }
            this.totalCompanyInvestmentKPIValuesRecords =
              resp.totalRecords;

          } else {

            this.portfolioCompanyInvestmentKPIValuesList = [];
            this.totalCompanyInvestmentKPIValuesRecords = 0;
            this.createInvestmentKPILayOut(
              this.portfolioCompanyInvestmentKPIValuesList
            );
          }
          this.tableReload = true;
          this.isLoader = false;
          if (this.isToasterMessage) {
            this.successToaster();
          }
        },
        (_error) => {
          this.tableReload = true;
          this.isLoader = false;
        }
      );
  }
  createInvestmentKPILayOut(kpiModel: any) {
    this.objInvestmentKPIList = [];
    this.objInvestmentKPIList.cols = [];
    this.objInvestmentKPIList.Results = [];
    let local = this;

    kpiModel.forEach(function (data: any) {
      let objKPI: any = {};
      let quarter = data.quarter;
      if (local.objInvestmentKPIList.cols.length == 0) {
        local.objInvestmentKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      let kpiIndex = -1;
      local.objInvestmentKPIList.Results.every(function (
        elem: any,
        index: any
      ) {
        let kpiId = data.investmentKPIID;
        let kpiName = data.investmentKPI.kpi;
        let kpiNameWithInfo = data.investmentKPI.kpi;
        if (data.kpiInfo != null && data.kpiInfo != "") {
          kpiName = kpiName;
          kpiNameWithInfo = kpiName + " (" + data.kpiInfo + ")";
        }
        if (elem.KpiId === kpiId && elem.KPIWithInfo === kpiNameWithInfo) {
          kpiIndex = index;
          return false;
        }
        return true;
      });

      if (kpiIndex == -1) {
        if (data.kpiInfo != null && data.kpiInfo != "") {
          objKPI["KPI"] = data.investmentKPI.kpi;
          objKPI["KPIWithInfo"] =
            data.investmentKPI.kpi + " (" + data.kpiInfo + ")";
        } else {
          objKPI["KPI"] = data.investmentKPI.kpi;
          objKPI["KPIWithInfo"] = data.investmentKPI.kpi;
        }
        objKPI["KpiId"] = data.investmentKPI.investmentKPIId;
        objKPI["KpiInfo"] = data.kpiInfo;
        if (data.parentKPIID === null || data.parentKPIID === 0) {
          objKPI["IsChild"] = false;
        }
        else
          objKPI["IsChild"] = true;
      }
      let list = local.objInvestmentKPIList.cols.filter(function (val: any) {
        return val.field == quarter + " " + data.year;
      });
      if (list == null || list.length == 0) {
        local.objInvestmentKPIList.cols.push({
          field: quarter + " " + data.year,
          header: quarter + " " + data.year,
          year : data.year,
          quarter : data.quarter
        });
        local.objInvestmentKPIList.cols.sort(function(a, b) {
          const keyA = a.quarter,
            keyB = b.quarter;
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        }).sort(function(a, b) {
          const keyA = a.year,
            keyB =b.year;
          // Compare the 2 dates
          if (keyA < keyB) return -1;
          if (keyA > keyB) return 1;
          return 0;
        });

      }
      if (kpiIndex >= 0) {
        local.objInvestmentKPIList.Results[kpiIndex][
          quarter + " " + data.year
        ] =
          data.kpiInfo != "%"
            ? data.kpiActualValue
            : data.kpiActualValue === null
              ? data.kpiActualValue
              : data.kpiActualValue;
        local.objInvestmentKPIList.Results[kpiIndex][
          quarter + " " + data.year + " " + "auditlog"
        ] = data.auditLog;
        local.objInvestmentKPIList.Results[kpiIndex]["" + quarter + " " + data.year + " " + "AttributeID"] = data.pcInvestmentKPIQuarterlyValueID;
        local.objInvestmentKPIList.Results[kpiIndex]["" + quarter + " " + data.year + " " + "editable"] = false;
      } else {
        if (data.parentKPIID === null || data.parentKPIID === 0) {
          objKPI["IsChild"] = false;
        }
        else
          objKPI["IsChild"] = true;
        objKPI[quarter + " " + data.year] =
          data.kpiInfo != "%"
            ? data.kpiActualValue
            : data.kpiActualValue === null
              ? data.kpiActualValue
              : data.kpiActualValue;
        objKPI[quarter + " " + data.year + " " + "auditlog"] = data.auditLog;
        objKPI["" + quarter + " " + data.year + " " + "AttributeID"] = data.pcInvestmentKPIQuarterlyValueID;
        objKPI["" + quarter + " " + data.year + " " + "editable"] = false;
        local.objInvestmentKPIList.Results.push(objKPI);

      }
    });

   this.objInvestmentKPIList.cols.splice(0, 1);
    this.investmentKPICols.push.apply(this.investmentKPICols, this.frozenCols);
    this.investmentKPICols.push.apply(
      this.investmentKPICols,
      this.objInvestmentKPIList.cols
    );   
  }
  portfolioInfoSectionModel: any = {};

  printColumn(rowData: any, field: any) {
    let result = rowData[field.header + " auditlog"];
    if (result !== undefined && result !== null) {
      return result;
    } else {
      let col = field.header.replace("(Actual)", "").trim();
      result = rowData[col + " auditlog"];
      return result;
    }
  }

  CloseInfo() {
    this.infoUpdate = false;
  }
  validateNumber(event: any) {
    if (event.which != 15) {
      let ex: RegExp = new RegExp(/^-*\d*(?:[.,]\d{1,10})?$/);
      if (!ex.test(event.target.value)) {
        if (!Number.isInteger(Number(event.target.value))) {
          event.target.value = parseFloat(event.target.value).toFixed(2);
        }
      }
    }
  }
  validateMaxLength(event: any) {
    if (event.target.value.length == 15) return false;
    return true;
  }

  successToaster() {
    this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
  }

  onConvertValueUnits(event: any) {
    this.investmentKpiValueUnit = event;
    this.convertInvestmentKPIValueUnits();
  }
  kpiTable_GlobalFilter(event) {
    this.searchFilter = event;
    this.getPortfolioCompanies();
    this.menuTrigger.closeMenu();
  }

  onEditInit(rowData: any, column: any) {
    if(!this.permissionService.checkUserPermission(this.subFeature.InvestmentKPIs,ActionsEnum[ActionsEnum.canEdit],this.id)){
      return;
    }
    if (Number(this.investmentKpiValueUnit.typeId) != FinancialValueUnitsEnum.Absolute)
      this.infoUpdate = true;
    else if (this.tableReload) {
      this.updateModel.colName = column.field;
      this.updateModel.header = column.header;
      this.updateModel.unit = rowData['KPIWithInfo'];
      this.updateModel.rowName = rowData.KPI;
      this.updateModel.attributeId = rowData[`${column.field} AttributeID`];
      this.updateModel.kpiId = rowData.KpiId;
      this.updateModel.previousVal = rowData[column.field];
      let objIndex = this.objInvestmentKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
      this.objInvestmentKPIList.Results[objIndex][`${column.field} editable`] = true;
    }
  }
  onColumnEditComplete(_index: any, col: any, rowData: any) { 
    let prevVal = (this.updateModel.previousVal == undefined ? "" : this.updateModel.previousVal);
    let currVal = (rowData[col.field] == undefined ? "" : rowData[col.field]);
    if (!this.confirmUpdate && currVal !== prevVal) {
      this.updateModel.updatedVal = rowData[col.field];
      this.confirmUpdate = true;
    }
    else
      this.OnKpiUpdateCancel("");
  }
  downloadInvestmentExcel(){
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "Investment.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1
    };
    let filter = {
      currency: this.model?.reportingCurrencyDetail?.currencyCode,
      decimaPlace: this.model?.decimalPlaces?.type,
      valueType: this.investmentKpiValueUnit.typeId
    };
    this.exportInvestmentKPILoading = true;
    this.portfolioCompanyService
      .exportInvestmentKPIData({
        portfolioCompanyID: this.model?.portfolioCompanyID!,
        encryptedPortfolioCompanyId : this.id,
        paginationFilter: event,
        draftName: this.draftName + "_Draft",
        kPIFilter: filter,
        searchFilter: this.financialKpiSearchFilter,
        workflowMappingId:this.mappingId,
        workflowRequestId:this.workFlowRequestId,
        moduleID:1,
        unitOfCurrency: this.unitOfCurrency 
      })
      .subscribe(
        (response) => {
          this.exportInvestmentKPILoading = false;
          this.miscService.downloadExcelFile(response);
        },
        (error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
          this.exportInvestmentKPILoading = false;
        }
      );
  }

  onColumnEdit(event: any) {
    event.target.blur();
  }

  OnKpiUpdateCancel(_event: any) {
    let objIndex = this.objInvestmentKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objInvestmentKPIList.Results[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearcellEdit();
  }

  clearcellEdit() {
    let objIndex = this.objInvestmentKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objInvestmentKPIList.Results[objIndex][`${this.updateModel.colName} editable`] = false;
    this.confirmUpdate = false;
    this.updateModel = {};
  }

  OnKpiUpdate(_kpidata: any) {
    let comment = "actual";
    let columName = this.updateModel.colName;
    let updatedModalValue = this.updateModel.updatedVal;
    if (this.updateModel.colName.includes('Budget')) {
      comment = "budget";
      columName = this.updateModel.colName.split('(Budget)')[1].trim();
    }
    let datauditmodellog = {
      Description:"Manual",
      AttributeID: this.updateModel.attributeId,
      AttributeName: "Investment KPIs",
      OldValue: ((updatedModalValue === null || updatedModalValue === '' || updatedModalValue === undefined) ? null : updatedModalValue.toString()),
      MonthAndYear: columName,
      fieldName: this.updateModel.rowName,
      portfolioCompanyId: this.model?.portfolioCompanyID!,
      encryptedPortfolioCompanyId : this.id,
      comments: comment, 
      workFlowMappingId : this.mappingId
    };
    this.workflowCompanyService
      .updateWorkflowKpiValue(datauditmodellog)
      .subscribe(
        (result) => {
          if (result.value.code != "InternalServerError") {
            this.isToasterMessage = true;
            this.isLoader = true;
            this.getPortfolioCompanyInvestmentKPIValues(null, this.searchFilter);
            this.confirmUpdate = false;
            this.updateModel = {};
            if(!this.sectionData.isEdited){
              this.sectionData.isEdited = true;
              this.workflowCompanyService.UpdateWorkflowMappingStatus(this.mappingId).subscribe((_result: any) => {
                this.sectionData.statusId = this.sectionData.statusId == -1 ? 1:  this.sectionData.statusId ;
               }, _error => {
                 this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
               });
            }
            this.sectionData.isMarkedForReview = false;
          }
          else {
            this.OnKpiUpdateCancel("");
            this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
          }
        },
        (_error) => {
          this.OnKpiUpdateCancel("");
          this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
        });
  }

  showCommentPopup(isOpen:boolean)
  {
    this.comment = "";
    if(!isOpen)
    this.showAddCommentPopup = true;   
   
  }

  resetAddCommentPopup() {
    this.comment = "";
    this.disableAddCommentDoneBtn = true;
    this.showAddCommentPopup = false;
    this.setToggleStatus();
  }

  OnInputAddComment(comment) {
    this.comment = comment;
    if (comment.length > 0) {
      this.disableAddCommentDoneBtn = false;
    } else {
      this.disableAddCommentDoneBtn = true;
    }
  }
  setToggleStatus()
  {
    if(!this.workflowDetails?.isEnd && !this.workflowDetails?.isStart)
      this.toggleStatus = this.sectionData.isRework?'Rework':this.sectionData.isApprove?'Approve':'';
    if(this.workflowDetails?.isEnd)
      this.toggleStatus = this.sectionData.isRework?'Reject':this.sectionData.isApprove?'Publish':''; 
  }
  SaveComment() {

    this.workflowCompanyService.addWorkflowComment({ comments: this.comment, workflowMappingId: this.mappingId }).subscribe((_res: any) => {
      this.comment ="";
     if(this.workflowDetails.isStart)
        this.setIsMarked();
     else if(this.toggleStatus =='Approve' || this.toggleStatus =='Publish')
        this.setPublish();
     else if(this.toggleStatus =='Rework'|| this.toggleStatus =='Reject')
        this.setReject();
    }, _error => {
      this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center" });
    });
  }

  setReject()
  {
    let request = {
      IsRework:true,
      IsApprove:false,
      IsMarked:false,
      WorkflowMappingId:this.mappingId
    };
    this.updateWorkflowRequest(request);
  }
  setPublish()
  {
    let request = {
      IsRework:false,
      IsApprove:true,
      IsMarked:false,
      WorkflowMappingId:this.mappingId
    };
    this.updateWorkflowRequest(request);
  }
  setIsMarked()
  {
    let request = {
      IsRework:false,
      IsApprove:false,
      IsMarked:true,
      WorkflowMappingId:this.mappingId
    };
    this.updateWorkflowRequest(request);
  }
 
  updateWorkflowRequest(request:any)
  {
    this.workflowCompanyService.updateWorkflowRequest(request).subscribe((_res: any) => {
      let message = this.toggleStatus == 'Approve' ? this.workflowConstants.MarkedForApprovalMessage : this.toggleStatus == 'Publish' ? this.workflowConstants.MarkedForPublishMessage : this.toggleStatus == 'Rework' ? this.workflowConstants.MarkedForReworkMessage : this.toggleStatus == 'Reject' ? this.workflowConstants.MarkedForRejectMessage : this.workflowConstants.MarkedForReviewMessage;
      this.toastrService.success(message, "", { positionClass: "toast-center-center" });
      this.resetAddCommentPopup();
      this.onStatusChanges.emit(true);
      this.router.navigate(['/workflow/company-draft', this.id]);
    }, _error => {
      this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center" });
    });
  }

  getComments() {
    this.isLoader = true;
    this.workflowCompanyService.getWorkflowComments(this.mappingId).subscribe((result: any) => {
      this.commentListOriginal =JSON.stringify(result);
      this.commentsList = result;
      this.isLoader = false;
    }, _error => {
      this.isLoader = false;
    });
    this.resetAddCommentPopup();
  }

  closeCommentPopup() {
    this.isOpenCommentsPopup = false;
  }
  openCommentsPopUp() {
    this.getComments();
    this.isOpenCommentsPopup = true;
  }
 
  editComment(comment: any) {
    comment.isEditable = true;
  }
  closeComment(comment: any) {
    comment.isEditable = false;
  }
  updateComment(comment: any) {
    comment.comments = this.commentDesc;
    this.workflowCompanyService.addWorkflowComment(comment).subscribe((_res: any) => {
      this.toastrService.success("Comment updated successfully", "", { positionClass: "toast-center-center" });
      this.disableUpdateButton = false;
      this.commentDesc = "";
      this.getComments();
    }, _error => {
      this.toastrService.error("Something went wrong", "", { positionClass: "toast-center-center" });
    });
  }
  onInputUpdateComment(comment: any, value: string) {
    this.commentDesc = value;
    comment.comments = this.commentDesc;
    if (this.commentDesc.length > 0 && (this.commentListOriginal !== JSON.stringify(this.commentsList))) {
      this.disableUpdateButton = false;
    } else {
      this.disableUpdateButton = true;
    }
  } 

}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}
