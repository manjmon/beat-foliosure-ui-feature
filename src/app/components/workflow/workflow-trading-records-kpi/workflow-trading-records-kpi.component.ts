import { Component, Input, OnInit, ElementRef, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { isNumeric } from '@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric';
import { filter } from 'rxjs/operators';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { DecimalDigitEnum, ErrorMessage, ExportTypeEnum, FinancialValueUnitsEnum, OrderTypesEnum, PeriodTypeQuarterEnum,MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { ActionsEnum, FeaturesEnum, PermissionService, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { WorkflowTradingRecordsService } from 'src/app/services/workflow-trading-records.service';
import { NumberDecimalConst, WorkflowConstants } from "src/app/common/constants";

@Component({
  selector: 'app-workflow-tradingrecords-kpi',
  templateUrl: './workflow-trading-records-kpi.component.html',
  styleUrls: ['./workflow-trading-records-kpi.component.scss']
})
export class WorkflowTradingRecordsKpiComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() dataInformation = [];
  @Input() CompanyInformation: any;
  @Input() searchFilter: any = null;
  @Input() events: Observable<void>;

  WorkflowConstants = WorkflowConstants
  isOpenUpload: boolean = false;
  showTradingRecords: boolean = false;
  mappingId: number = 0;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  globalFilter: string = "";
  feature: typeof FeaturesEnum = FeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;

  private eventsSubscription: Subscription;

  dataTable: any;
  message: any;
  id: any;
  tradingRecordsKPIs: any[];
  @ViewChild('dt') dt: Table | undefined;
  @Input() model: any;
  @Input() workflowDetails: any = null;
 
  sectionData: any = null;
  msgTimeSpan: number;
  loading = false;
  blockedProfitabilityTable: boolean = false;
  portfolioProfitabilityList: any = [];
  portfolioCompanyProfitabilityClone: any[] = [];

  pagerLength: any;
  financialReport_AsOfDate: any;
  operationalReport_AsOfDate: any;
  profitabilityValueUnit: any;
  tradingRecordsKpiValueUnit: any;
  exportLoading: boolean = false;
  exportInvestmentKPILoading: boolean = false;
  exportCompanyKPILoading: boolean = false;
  tradingRecordKPIChartData: any[] = [];
  tradingRecordKPIUnit: string = "";
  draftName: string = "";
  toggleStatus: any = "";
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
  objtradingRecordsKPIList: any = [];
  tradingRecordsKPICols: any = [];
  modelTradingRecordsKPI: any = {};
  portfolioCompanyTradingRecordsKPIValuesList: any[];
  portfolioCompanyTradingRecordsKPIValuesListClone: any[];
  financialKpiSearchFilter: any;
  expandedTradingRecordsKPIs: any[] = [];
  totalCompanyTradingRecordsKPIValuesRecords: number;
  financialPeriodErrorMessage: string = "";
  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  NumberDecimalConst = NumberDecimalConst

  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('investmentMenuTrigger') menuTrigger: MatMenuTrigger;
  isMarkedForReview: boolean = true;
  showAddCommentPopup = false;
  disableAddCommentDoneBtn = true;
  comment = "";
  commentListOriginal: any;
  reportingCurrency:string = "NA";
  commentsList = [];
  commentDesc: any;
  isOpenCommentsPopup: boolean = false;
  disableCloseButton: boolean = true;
  disableUpdateButton: boolean = true;
  workflowConstants = WorkflowConstants;
  unitOfCurrency = FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions];
  @Output() onStatusChanges: EventEmitter<any> = new EventEmitter();
  @ViewChild("myInput") private _inputElement: ElementRef;
  objMasterKPIList: any = [];
  masterKPICols: any = [];
  exportMasterKPILoading: boolean = false;
  constructor(
    private workflowCompanyService: WorkflowCompanyService,
    private toastrService: ToastrService,
    private _avRoute: ActivatedRoute,
    private permissionService: PermissionService,
    private miscService: MiscellaneousService,
    private router: Router,
    private portfolioCompanyService: PortfolioCompanyService,
    private workflowTradingRecordsservice: WorkflowTradingRecordsService) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.modelTradingRecordsKPI.periodType = {
      type: PeriodTypeQuarterEnum.Last1Year,
    };
    this.modelTradingRecordsKPI.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelTradingRecordsKPI.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.tradingRecordsKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    };
  }

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
    // this.getWorkflowAllDetails()
      let draftData=localStorage.getItem("currentWorkflow") != "" ? JSON.parse(localStorage.getItem("currentWorkflow")):null;
      this.workFlowRequestId = draftData?.WorkflowRequestId;
      this.draftName = draftData?.DraftName;
      this.setCompanyInfo()
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.dataInformation.length > 0 && (this.model != null || this.id != null)) {
      this.getMappedData();
      this.getPortfolioCompanies();
    }
    if(this.model == null)
    {
      this.getCurrency();
    }

    if (changes['workflowDetails']) {
      this.setCompanyInfo();
    }

    if (this.dataInformation.length > 0 && this.model == null) {
      this.getMappedData();
    }
  }

  ngAfterViewInit() {
    if (this.uiuxMenu != undefined) {
      (this.uiuxMenu as any).closed = this.uiuxMenu.closed
      this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  getCurrency(){
    this.workflowCompanyService.getCompanyWorkFlowDraft(this.workflowDetails.workflowRequestId, this.id).subscribe((result: any)=>{
      if(result?.body?.companyDetails?.reportingCurrencyDetail?.currencyCode!=null)
      {
        this.reportingCurrency = result?.body?.companyDetails?.reportingCurrencyDetail?.currencyCode;
      }
    })
  }

  getPortfolioCompanyById(requestId: number) {
    this.workflowCompanyService.getCompanyWorkFlowDraft(requestId, this.id).subscribe((result: any) => {

      this.model = result.data;
      this.getPortfolioCompanies();
    }, _error => {
      this.isLoader = false;
    })
  }

  getWorkflowAllDetails() {
    this.workflowCompanyService.getWorkflowAllDetails(this.workFlowRequestId).subscribe((result: any) => {
      this.workflowDetails = result;
      this.setCompanyInfo();
    }, _error => {
      this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
    });
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
    this.sectionData = this.workflowDetails.workflowSectionLevels.find(x=>x.subFeatureId==this.subFeature.TradingRecords);
    this.setToggleStatus();
    let subfeatureModel= this.dataInformation.find(x=>x.subFeatureId==this.subFeature.TradingRecords);
    this.workFlowRequestId = subfeatureModel.workflowRequestId;
    this.workflowMappingId = subfeatureModel.workflowMappingId;
    this.isMarkedForReview = subfeatureModel.isMarkedForReview;
    this.IsValidUser = subfeatureModel.isValidUser;
    this.statusId = subfeatureModel.statusId;
  }

  getMappedData() {
    let mappedData = this.dataInformation.find(x => x.subFeatureId == this.subFeature.TradingRecords);
    if (mappedData != undefined || mappedData != null) {
      this.showTradingRecords = true;
      this.mappingId = mappedData.workflowMappingId;
    }
    else {
      this.showTradingRecords = false;
      this.mappingId = 0;
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
    if (this.id != undefined) {
      this.getPortfolioCompanyTradingRecordsKPIValues(null, this.searchFilter);
    }
  }

  OnTradingRecordsKPIChange() {
    this.tradingRecordKPIChartData = [];
    if (this.tradingRecordKPIChartData.length > 0) {
      this.tradingRecordKPIUnit = this.tradingRecordKPIChartData[0]["Info"];
    }
  }
  convertTradingRecordsKPIValueUnits() {
    let financialValueUnitTable = this.tradingRecordsKpiValueUnit;
    let portfolioCompanyTradingRecordsKPIValuesListlocal = [];
    this.portfolioCompanyTradingRecordsKPIValuesList = [];
    this.unitOfCurrency = this.tradingRecordsKpiValueUnit.unitType;

    this.portfolioCompanyTradingRecordsKPIValuesListClone.forEach(function (
      value: any
    ) {
      let valueClone = JSON.parse(JSON.stringify(value));
      if (
        valueClone.kpiInfo != "%" &&
        valueClone.kpiInfo != "x" &&
        valueClone.kpiInfo != "#" &&
        valueClone.kpiInfo != "" &&
        valueClone.kpiInfo != "Text" &&
        valueClone.kpiValue != "" &&
        valueClone.kpiValue != null
      ) {
        let val = valueClone.kpiValue;
        val = val == undefined ? "0" : val;
        val = val.toString().replace(",","");
        switch (Number(financialValueUnitTable.typeId)) {
          case FinancialValueUnitsEnum.Absolute:
            break;
          case FinancialValueUnitsEnum.Thousands:
            if(valueClone.kpiValue!=0){
            valueClone.kpiValue =
              !isNaN(parseFloat(valueClone.kpiValue)) &&
                !isNaN(parseFloat(valueClone.kpiValue)) && isNumeric(val)
                ? valueClone.kpiValue / 1000
                : valueClone.kpiValue;
            }
            break;
          case FinancialValueUnitsEnum.Millions:
            if(valueClone.kpiValue!=0){
            valueClone.kpiValue =
              !isNaN(parseFloat(valueClone.kpiValue)) &&
                !isNaN(parseFloat(valueClone.kpiValue)) && isNumeric(val)
                ? valueClone.kpiValue / 1000000
                : valueClone.kpiValue;
            }
            break;
          case FinancialValueUnitsEnum.Billions:
            if(valueClone.kpiValue!=0){
            valueClone.kpiValue =
              !isNaN(parseFloat(valueClone.kpiValue)) &&
                !isNaN(parseFloat(valueClone.kpiValue)) && isNumeric(val)
                ? valueClone.kpiValue / 1000000000
                : valueClone.kpiValue;
            }
            break;
        }
      }
      portfolioCompanyTradingRecordsKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyTradingRecordsKPIValuesList = portfolioCompanyTradingRecordsKPIValuesListlocal;
    this.createMasterKPILayOut(this.portfolioCompanyTradingRecordsKPIValuesList);
    this.portfolioCompanyTradingRecordsKPIValuesList.forEach(function (item) {
      item.fullMonth = item.quarter + " " + item.year;
    });
  }

  getPortfolioCompanyTradingRecordsKPIValues(event: any, searchFilter: any) {
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
        this.modelTradingRecordsKPI.orderType.type == OrderTypesEnum.LatestOnRight
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
        periodType: this.modelTradingRecordsKPI.periodType.type,
      };

      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelTradingRecordsKPI.startPeriod.getFullYear(),
            this.modelTradingRecordsKPI.startPeriod.getMonth(),
            this.modelTradingRecordsKPI.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelTradingRecordsKPI.endPeriod.getFullYear(),
            this.modelTradingRecordsKPI.endPeriod.getMonth(),
            this.modelTradingRecordsKPI.endPeriod.getDate()
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


    this.workflowTradingRecordsservice
      .getWorkflowTradingRecordsKPIValues({
        portfolioCompanyID: this.model?.portfolioCompanyID!,
        encryptedPortfolioCompanyId : this.id,
        paginationFilter: event,
        searchFilter: searchFilter,
        workflowMappingId:this.mappingId,
        workflowRequestMappingId:this.mappingId,
        moduleID:1
      })
      .subscribe(
        (result) => {
          let resp = result;
          if (resp != null&&resp.pcMasterKPIDraftValueModels.length>0) {
            this.portfolioCompanyTradingRecordsKPIValuesList =
              resp.pcMasterKPIDraftValueModels;

            this.portfolioCompanyTradingRecordsKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyTradingRecordsKPIValuesList)
            );
            this.convertTradingRecordsKPIValueUnits();

            this.expandedTradingRecordsKPIs = [];
            if (this.portfolioCompanyTradingRecordsKPIValuesList.length > 0) {
              this.expandedTradingRecordsKPIs.push(
                this.portfolioCompanyTradingRecordsKPIValuesList[0]
              );
            }
            this.totalCompanyTradingRecordsKPIValuesRecords =
              resp.totalRecords;

          } else {

            this.portfolioCompanyTradingRecordsKPIValuesList = [];
            this.totalCompanyTradingRecordsKPIValuesRecords = 0;
            this.createMasterKPILayOut(this.portfolioCompanyTradingRecordsKPIValuesList);
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
    this.tradingRecordsKpiValueUnit = event;
    this.convertTradingRecordsKPIValueUnits();
  }
  kpiTable_GlobalFilter(event) {
    this.searchFilter = event;
    this.getPortfolioCompanies();
    this.menuTrigger.closeMenu();
  }

  onEditInit(rowData: any, column: any) {
    if(!this.sectionData.isActionButtons){
     return;
    }
    if(!this.permissionService.checkUserPermission(this.subFeature.TradingRecords,ActionsEnum[ActionsEnum.canEdit],this.id)){
      return;
    }
    if (Number(this.tradingRecordsKpiValueUnit.typeId) != FinancialValueUnitsEnum.Absolute)
      this.infoUpdate = true;
    else if (this.tableReload) {
      this.updateModel.colName = column.field;
      this.updateModel.header = column.header;
      this.updateModel.unit = rowData['KPIWithInfo'];
      this.updateModel.rowName = rowData.KPI;
      this.updateModel.attributeId = rowData[`${column.field} AttributeID`];
      this.updateModel.kpiId = rowData.KpiId;
      this.updateModel.previousVal = rowData[column.field];
      let objIndex = this.objtradingRecordsKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
      this.objtradingRecordsKPIList.Results[objIndex][`${column.field} editable`] = true;
    }
  }

  onColumnEditComplete(_index: any, col: any, rowData: any) { 
    let prevVal = (this.updateModel.previousVal == undefined ? "" : this.updateModel.previousVal);
    let currVal = (rowData[col.field] == undefined ? "" : rowData[col.field]);
    if (!this.confirmUpdate && currVal != prevVal) {
      this.updateModel.updatedVal = rowData[col.field];
      this.confirmUpdate = true;
    }
    else
      this.OnKpiUpdateCancel("");
  }
  downloadxml(){
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "MasterKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1
    };
    let filter = {
      currency: this.model?.reportingCurrencyDetail?.currencyCode,
      decimaPlace: this.model?.decimalPlaces?.type,
      valueType: this.tradingRecordsKpiValueUnit.typeId
    };
    this.exportMasterKPILoading = true;
    this.exportCompanyKPILoading = true;
    this.portfolioCompanyService
      .exportMasterKPIListdraft({
        portfolioCompanyID: this.model?.portfolioCompanyID!,
        encryptedPortfolioCompanyId : this.id,
        paginationFilter: event,
        draftName: this.draftName,
        kPIFilter: filter,
        searchFilter: this.financialKpiSearchFilter,
        workflowMappingId:this.mappingId,
        workflowRequestMappingId:this.mappingId,
        workFlowRequestId: this.workFlowRequestId,
        moduleID:1
      })
      .subscribe(
        (response) => {
          this.exportCompanyKPILoading = false;
          this.miscService.downloadExcelFile(response);
          this.exportMasterKPILoading = false;
        },
        (error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
          this.exportMasterKPILoading = false;
        }
      );
  }
  onColumnEdit(event: any) {
    event.target.blur();
  }

  OnKpiUpdateCancel(_event: any) {
    let objIndex = this.objtradingRecordsKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objtradingRecordsKPIList.Results[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearcellEdit();
  }

  clearcellEdit() {
    let objIndex = this.objtradingRecordsKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objtradingRecordsKPIList.Results[objIndex][`${this.updateModel.colName} editable`] = false;
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
      AttributeName: "TradingRecords",
      KpiId: this.updateModel.kpiId,
      OldValue: ((updatedModalValue == null || updatedModalValue == '' || updatedModalValue == undefined) ? null : updatedModalValue.toString()),
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
            this.getPortfolioCompanyTradingRecordsKPIValues(null, this.searchFilter);
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

  onClickMarkForReview =() => {
    this.showAddCommentPopup = true;
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

  createMasterKPILayOut(kpiModel: any) 
  {
    this.objtradingRecordsKPIList = [];
    this.objtradingRecordsKPIList.cols = [];
    this.objtradingRecordsKPIList.Results = [];
    let local = this;
    kpiModel.forEach(function (data: any) {
      let objKPI: any = {};
      let quarter = data.quarterMonth;
      if (local.objtradingRecordsKPIList.cols.length == 0) {
        local.objtradingRecordsKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      let kpiIndex = -1;
      local.objtradingRecordsKPIList.Results.every(function (
        elem: any,
        index: any
      ) {
        let kpiId = data.masterKpiID;
        let kpiName = data.kpi;
        let kpiNameWithInfo = data.kpi;
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
          objKPI["KPI"] = data.kpi;
          objKPI["KPIWithInfo"] =
            data.kpi + " (" + data.kpiInfo + ")";
        } else {
          objKPI["KPI"] = data.kpi;
          objKPI["KPIWithInfo"] = data.kpi;
        }
        objKPI["KpiId"] = data.masterKpiID;
        objKPI["KpiInfo"] = data.kpiInfo;
        if (data.parentKPIID === null || data.parentKPIID === 0) {
          objKPI["IsChild"] = false;
        }
        else
          objKPI["IsChild"] = true;
      }
      let list = local.objtradingRecordsKPIList.cols.filter(function (val: any) {
        return val.field == quarter + " " + data.year;
      });
      if (list == null || list.length == 0) {
        local.objtradingRecordsKPIList.cols.push({
          field: quarter + " " + data.year,
          header: quarter + " " + data.year,
        });
      }
      if (kpiIndex >= 0) {
        local.objtradingRecordsKPIList.Results[kpiIndex][
          quarter + " " + data.year
        ] =
          data.kpiInfo != "%"
            ? data.kpiValue
            : data.kpiValue === null
              ? data.kpiValue
              : data.kpiValue;
        local.objtradingRecordsKPIList.Results[kpiIndex][quarter + " " + data.year + " " + "auditlog"] = data.auditLog;
        local.objtradingRecordsKPIList.Results[kpiIndex][quarter + " " + data.year + " " + "AttributeID"] = data.pcMasterKpiValueID;
        local.objtradingRecordsKPIList.Results[kpiIndex][quarter + " " + data.year + " " + "editable"] = false;
      } else {
        if (data.parentKPIID === null || data.parentKPIID === 0) {
          objKPI["IsChild"] = false;
        }
        else
          objKPI["IsChild"] = true;
        objKPI[quarter + " " + data.year] =
          data.kpiInfo != "%"
            ? data.kpiValue
            : data.kpiValue === null
              ? data.kpiValue
              : data.kpiValue;
        objKPI[quarter + " " + data.year + " " + "auditlog"] = data.auditLog;
        objKPI["" + quarter + " " + data.year + " " + "AttributeID"] = data.pcMasterKpiValueID;
        objKPI["" + quarter + " " + data.year + " " + "editable"] = false;
        objKPI["isHeader"] = data.isHeader;
        objKPI["isBoldKPI"] = data.isBoldKPI;
        local.objtradingRecordsKPIList.Results.push(objKPI);
      }
    });

    this.objtradingRecordsKPIList.cols.splice(0, 1);
    this.masterKPICols.push.apply(this.masterKPICols, this.frozenCols);
    this.masterKPICols.push.apply(
      this.masterKPICols,
      this.objtradingRecordsKPIList.cols
    );
  }


}

function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}
