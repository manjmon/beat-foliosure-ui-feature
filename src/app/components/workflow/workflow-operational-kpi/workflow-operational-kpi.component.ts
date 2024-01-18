import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { UserSubFeaturesEnum, ActionsEnum, FeaturesEnum, PermissionService } from 'src/app/services/permission.service';
import { DecimalDigitEnum, ExportTypeEnum, ErrorMessage, FinancialValueUnitsEnum, OrderTypesEnum, PeriodTypeQuarterEnum,MiscellaneousService } from "../../../services/miscellaneous.service";
import { MenuItem } from "primeng/api";
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { ToastrService } from 'ngx-toastr';
import { Table } from "primeng/table";
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { isNil } from "src/app/utils/utils";
import { NumberDecimalConst, WorkflowConstants } from "src/app/common/constants";

@Component({
  selector: 'app-workflow-operational-kpi',
  templateUrl: './workflow-operational-kpi.component.html',
  styleUrls: ['./workflow-operational-kpi.component.scss', '../workflow-company-kpi/workflow-company-kpi.component.scss']
})
export class WorkflowOperationalKpiComponent implements OnInit, OnChanges {
  @Output() onStatusChanges: EventEmitter<any> = new EventEmitter();
  isOpenUpload: boolean = false;
  showOperational: boolean = false;
  @Input() dataInformation = [];
  @Input() searchFilter: any = null;
  mappingId: number = 0;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  dataTable: any;
  message: any;
  reportingCurrency:string = "NA"
  id: any;
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  operationalKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  companyKPIs: any[];
  @Input() model;
  @Input() workflowDetails: any = null;
  items: MenuItem[];
  ddlModel: any = {
    companyKPIList: [],
    selectedCompanyKPI: "",
  };
  updateModel: any = {};
  msgTimeSpan: number;
  loading = false;
  confirmUpdate = false;
  operationalKpiValueUnit: any;
  tableReload = false;
  portfolioCompanyOperationalKPIValuesDataTableList = [];
  totalCompanyOperationalKPIValuesRecords: number;
  portfolioCompanyOperationalKPIValuesList: any[];
  portfolioCompanyOperationalKPIValuesListCol: any[];
  portfolioCompanyOperationalKPIValuesListClone: any[];
  isloadevent = false;
  exportCompanyKPILoading: boolean = false;
  exportOperationalKPILoading: boolean = false;
  CompanyKPIOrginalData: any[] = [];
  ErrorNotation: boolean = false;
  workFlowRequestId: number = 0;
  infoUpdate: boolean = false;
  isLoader: boolean = false;
  isToasterMessage = false;
  financialKpiSearchFilter: any;
  search: string = "";
  draftName: string = "";
  operationalKPICols: any = [];
  companyKpiValueUnit: any;
  auditLogList: any = [];
  @ViewChild('dt') dt: Table | undefined;
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('operationalMenuTrigger') menuTrigger: MatMenuTrigger;
  globalFilter: string = "";
  objCompanyKPIList: any = [];
  companyKPICols: any = [];
  modelOperationalKpi: any = {};
  portfolioCompanyCompanyKPIValuesList: any[];
  portfolioCompanyCompanyKPIValuesListClone: any[];
  companyValueUnitTable: FinancialValueUnitsEnum =
  FinancialValueUnitsEnum.Millions;
  companyKpiSearchFilter: any;
  expandedCompanyKPIs: any[] = [];
  totalCompanyCompanyKPIValuesRecords: number;
  companyPeriodErrorMessage: string = "";
  NumberDecimalConst = NumberDecimalConst;
  workflowConstants = WorkflowConstants;
  companywiseKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  sectionData:any =null;
  toggleStatus:any="";
  showAddCommentPopup = false;
  comment = "";
  commentListOriginal: any;
  commentsList = [];
  commentDesc: any;
  disableAddCommentDoneBtn = true;
  unitOfCurrency=FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions];
  operationalKPIFilterCols: any = [];
  tableFrozenColumns = [];
  isOpenCommentsPopup: boolean = false;
  disableCloseButton: boolean = true;
  disableUpdateButton:boolean = true;
  constructor(
    private workflowCompanyService: WorkflowCompanyService, 
    private _avRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private permissionService: PermissionService,
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private router: Router) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.items = [];
    this.modelOperationalKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.modelOperationalKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelOperationalKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.operationalKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    };
  }

  ngOnInit() {
    let draftData=localStorage.getItem("currentWorkflow") != "" ? JSON.parse(localStorage.getItem("currentWorkflow")):null;
    this.workFlowRequestId = draftData?.WorkflowRequestId;
    this.draftName = draftData?.DraftName; 
    this.setCompanyInfo()
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (this.dataInformation.length > 0 && (this.model != null || this.id != null)) {
      this.getMappedData();
      this.getPortfolioCompanyOperationalKPIValues(null);
    }
    if(this.model == null){
      this.getCurrency();
    }

    if (changes['workflowDetails']) {
      this.setCompanyInfo();
    }

    if (this.dataInformation.length > 0 && this.model == null) {
      this.getMappedData();
    }
  }
getCurrency(){
  this.workflowCompanyService.getCompanyWorkFlowDraft(this.workflowDetails.workflowRequestId, this.id).subscribe((result: any)=>{ 
    if(result?.body?.companyDetails?.reportingCurrencyDetail?.currencyCode!=null)
    {
      this.reportingCurrency = result?.body?.companyDetails?.reportingCurrencyDetail?.currencyCode;
    }
     });
}
  getPortfolioCompanyById(requestId:number)
  {
    this.workflowCompanyService.getCompanyWorkFlowDraft(requestId, this.id).subscribe((result: any) => {
      this.model = result.data; 
      this.getPortfolioCompanyOperationalKPIValues(null);
    }, error => {
      this.isLoader = false;
    })
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
  
  closePopup(isUploaded: any) {
    this.isOpenUpload = false;
    if (isUploaded){
      this.sectionData.isEdited = isUploaded;
      this.workflowCompanyService.UpdateWorkflowMappingStatus(this.mappingId).subscribe((_result: any) => {
        this.sectionData.statusId = this.sectionData.statusId == -1 ? 1:  this.sectionData.statusId ;
        this.onStatusChanges.emit(true);
       }, _error => {
         this.toastrService.error("Error occured", "", { positionClass: "toast-center-center" });
       });
     
    }

    this.getPortfolioCompanyOperationalKPIValues(null);
  }
  validateMaxLength(event: any){
    if (event.target.value.length == 15) return false;
    return true;
  }

  setCompanyInfo(){
    this.sectionData = this.workflowDetails.workflowSectionLevels.find(x=>x.subFeatureId==this.subFeature.OperationalKPIs);
    this.setToggleStatus();
  }
  onEditInit(rowData: any, column: any){
    if(!this.sectionData.isActionButtons){
      return;
     }
     if(!this.permissionService.checkUserPermission(this.subFeature.OperationalKPIs,ActionsEnum[ActionsEnum.canEdit],this.id)){
      return;
     }
     if(Number(this.operationalKpiValueUnit?.typeId) != FinancialValueUnitsEnum.Absolute){
     this.infoUpdate = true;
     }
     else if(this.tableReload){
      this.updateModel.colName = column.field;
      this.updateModel.header = column.header;
      this.updateModel.unit = rowData['KPI Info'];
      this.updateModel.rowName = rowData.KPI;
      this.updateModel.attributeId = this.getValues(rowData, column);
      this.updateModel.kpiId = rowData.KpiId;
      this.updateModel.previousVal = rowData[column.field]
      let objIndex = this.portfolioCompanyOperationalKPIValuesDataTableList.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
      this.portfolioCompanyOperationalKPIValuesDataTableList[objIndex][`${column.field} editable`] = true;
     }
  }

  successToaster() {
    this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
  }
  onColumnEditComplete(_index: any, col: any, rowData: any){
    let prevVal = (this.updateModel.previousVal == undefined ? "" : this.updateModel.previousVal);
    let currVal = (rowData[col.field] == undefined ? "" : rowData[col.field]);
    if (!this.confirmUpdate && currVal != prevVal) {
      this.updateModel.updatedVal = rowData[col.field];
      this.confirmUpdate = true;
    }
    else{
    this.OnKpiUpdateCancel("");
    }
  }
  onColumnEdit(event: any){
  event.target.blur();
  }
  OnKpiUpdateCancel(_event: any){
    let objIndex = this.portfolioCompanyOperationalKPIValuesDataTableList?.findIndex((obj => obj.KpiId == this.updateModel?.kpiId));
    this.portfolioCompanyOperationalKPIValuesDataTableList[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearcellEdit();
  }
  clearcellEdit(){
    let objIndex = this.portfolioCompanyOperationalKPIValuesDataTableList.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.portfolioCompanyOperationalKPIValuesDataTableList[objIndex][`${this.updateModel.colName} editable`] = false;
    this.confirmUpdate = false;
    this.updateModel = {};
  }
  OnKpiUpdate(_kpidata: any){
    let comment = "actual";
    let columName = this.updateModel.colName;
    let updatedModalValue = this.updateModel.updatedVal;
    if(this.updateModel.colName.includes('Budget')){
      comment = "Budget"
      columName = this.updateModel.colName.split('(Budget)')[1].trim();
    }
    if(this.updateModel.rowName.includes("%")){
      updatedModalValue = updatedModalValue.toFixed(2);
    }
    let datauditmodellog = {
    Descripiton: "Manual",
    AttributeId: this.updateModel.attributeId,
    AttributeName: "Operational KPIs",
    KpiId: this.updateModel.kpiId,
    OldValue:((updatedModalValue == null || updatedModalValue == '' || updatedModalValue == undefined)? null: updatedModalValue.toString()),
    MonthandYear: columName,
    fieldName: this.updateModel.rowName,
    portfolioCompanyId: this.model?.portfolioCompanyId!,
    encryptedPortfolioCompanyId: this.id,
    comments: comment,
    workFlowMappingId: this.mappingId
    };
   this.workflowCompanyService.updateWorkflowKpiValue(datauditmodellog)
   .subscribe(
    (result) =>{
      if(result.value.code != "InternalServerError"){
        this.isToasterMessage = true;
        this.isLoader = true;
        this. getPortfolioCompanyOperationalKPIValues(null)
        this.confirmUpdate = false;
        this.updateModel = {};
        if(!this.sectionData.isEdited){
          this.sectionData.isEdited = true;
          this.workflowCompanyService.UpdateWorkflowMappingStatus(this.mappingId).subscribe((_result: any) =>{
          this.sectionData.statusId = this.sectionData.statusId == -1 ? 1: this.sectionData.statusId ;
        }, _error =>{
          this.toastrService.error("Error occured","",{positionClass: "toast-center-center"});
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
  CloseInfo(){
    this.infoUpdate = false;
  }

  getMappedData() {
    let mappedData = this.dataInformation.find(x => x.subFeatureId == this.subFeature.OperationalKPIs);
    if (mappedData != undefined || mappedData != null) {
      this.showOperational = true;
      this.mappingId = mappedData.workflowMappingId;
    }
    else {
      this.showOperational = false;
      this.mappingId = 0;
    }
  }
  exportOperationalKpiValues(event: any){
    this.exportOperationalKPILoading = true;
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: "year-quarter",
        multiSortMeta: this.operationalKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (this.searchFilter == null) {
      let sortOrder =
        this.modelOperationalKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
            { field: "year", order: 1 },
            { field: "quarter", order: 1 },
          ]
          : [
            { field: "year", order: -1 },
            { field: "quarter", order: -1 },
          ];
      this.searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelOperationalKpi.periodType.type,
      };
      if (this.searchFilter.periodType == "Date Range") {
        this.searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelOperationalKpi.startPeriod.getFullYear(),
            this.modelOperationalKpi.startPeriod.getMonth(),
            this.modelOperationalKpi.startPeriod.getDate()
          )
        );
        this.searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelOperationalKpi.endPeriod.getFullYear(),
            this.modelOperationalKpi.endPeriod.getMonth(),
            this.modelOperationalKpi.endPeriod.getDate()
          )
        );
      }
    } else {
      if (this.searchFilter.periodType == "Date Range") {
        this.searchFilter.startPeriod = new Date(
          Date.UTC(
            this.searchFilter.startPeriod.getFullYear(),
            this.searchFilter.startPeriod.getMonth(),
            this.searchFilter.startPeriod.getDate()
          )
        );
        this.searchFilter.endPeriod = new Date(
          Date.UTC(
            this.searchFilter.endPeriod.getFullYear(),
            this.searchFilter.endPeriod.getMonth(),
            this.searchFilter.endPeriod.getDate()
          )
        );
      }
    }
   this.exportOperationalKPILoading = true;
    this.portfolioCompanyService
      .exportOperationalKPIListdraft({
        portfolioCompanyID: this.model?.portfolioCompanyID!,
        encryptedPortfolioCompanyId : this.id,
        paginationFilter: event,
        draftName: this.draftName + "_Draft",
        searchFilter: this.searchFilter,
        workflowMappingId:this.mappingId,
        workFlowRequestId: this.workFlowRequestId,
        unitOfCurrency: this.operationalKpiValueUnit.unitType,
        moduleID:1
      })
      .subscribe(
        (response) => {
          this.exportCompanyKPILoading = false;
          this.miscService.downloadExcelFile(response);
          this.exportOperationalKPILoading = false;
        },
        (error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
          this.exportOperationalKPILoading = false;
        }
      );
  }
  getEventObject() {
    return {
      first: 0,
      rows: 10,
      globalFilter: null,
      sortField: "year-quarter",
      multiSortMeta: this.operationalKPIMultiSortMeta,
      sortOrder: -1,
    };
  }

  setSearchFilter() {
    let sortOrder =
      this.modelOperationalKpi.orderType.type == OrderTypesEnum.LatestOnRight
        ? [
          { field: "year", order: 1 },
          { field: "quarter", order: 1 },
        ]
        : [
          { field: "year", order: -1 },
          { field: "quarter", order: -1 },
        ];
    this.searchFilter = {
      sortOrder: sortOrder,
      periodType: this.modelOperationalKpi.periodType.type,
    };
    if (this.searchFilter.periodType == "Date Range") {
      this.searchFilter.startPeriod = new Date(
        Date.UTC(
          this.modelOperationalKpi.startPeriod.getFullYear(),
          this.modelOperationalKpi.startPeriod.getMonth(),
          this.modelOperationalKpi.startPeriod.getDate()
        )
      );
      this.searchFilter.endPeriod = new Date(
        Date.UTC(
          this.modelOperationalKpi.endPeriod.getFullYear(),
          this.modelOperationalKpi.endPeriod.getMonth(),
          this.modelOperationalKpi.endPeriod.getDate()
        )
      );
    }
  }

  getPortfolioCompanyOperationalKPIValues(event: any) {
    this.isLoader = true;
    if (event == null) {
      event = this.getEventObject();
    }
    if (this.searchFilter == null) {
      this.setSearchFilter();
    } else {
      if (this.searchFilter.periodType == "Date Range") {
        this.searchFilter.startPeriod = new Date(
          Date.UTC(
            this.searchFilter.startPeriod.getFullYear(),
            this.searchFilter.startPeriod.getMonth(),
            this.searchFilter.startPeriod.getDate()
          )
        );
        this.searchFilter.endPeriod = new Date(
          Date.UTC(
            this.searchFilter.endPeriod.getFullYear(),
            this.searchFilter.endPeriod.getMonth(),
            this.searchFilter.endPeriod.getDate()
          )
        );
      }
    }
    this.workflowCompanyService
      .getPortfolioCompanyOperationalKpiValues({
        PortfolioCompanyID: this.model?.portfolioCompanyID?.toString(),
        encryptedPortfolioCompanyId: this.id,
        paginationFilter: event,
        searchFilter: this.searchFilter,
        workflowMappingId: this.mappingId
      })
      .subscribe(
        (result) => {
          this.tableFrozenColumns = this.frozenCols;
          this.portfolioCompanyOperationalKPIValuesListCol = result?.headers || [];
          this.portfolioCompanyOperationalKPIValuesDataTableList = result?.rows || [];
          this.portfolioCompanyOperationalKPIValuesListClone = result?.rows || [];
          this.operationalKPICols = [...this.tableFrozenColumns, ...this.portfolioCompanyOperationalKPIValuesListCol];
          this.auditLogList = result?.operationalKpiAuditLog || [];
          this.convertOperationalKPIValueUnits();
          this.tableReload = true;
          this.isLoader = false;
          if(this.isToasterMessage){
            this.successToaster();
          }
        },
        (error) => {
          this.auditLogList = [];
          this.tableReload = true;
          this.isLoader = false;
          this.portfolioCompanyOperationalKPIValuesListCol = [];
          this.portfolioCompanyOperationalKPIValuesDataTableList = [];
          this.portfolioCompanyOperationalKPIValuesListClone = [];
        }
      );
  }
  getValues(rowdata: any, column: any) {
    let auditList = this.auditLogList;
    let quarterData = column.field.split(' ');
    let result = auditList.filter(x => x.quarter == quarterData[0] && x.year == parseInt(quarterData[1]) && x.sectorId == rowdata.ValuesKpiId);
    if (result.length > 0) {
      return result[0].operationalValuedId;
    }
    else
      return 0;
  }
  validateNumber(event: any){
  if(event.which !=15){
    let ex: RegExp = new RegExp(/^-*\d*(?:[.,]\d{1,10})?$/);
    if (!ex.test(event.target.value)) {
      if (!Number.isInteger(Number(event.target.value))) {
        event.target.value = parseFloat(event.target.value).toFixed(2);
      }
    }
  }
  }
  onConvertValueUnits(event: any) {
    this.operationalKpiValueUnit = event;
    this.convertOperationalKPIValueUnits();
  }

  convertOperationalKPIValueUnits() {
    this.portfolioCompanyOperationalKPIValuesDataTableList = [];
    let portfolioCompanyOperationalKPIValuesListlocal = [];
    let companyValueUnit = this.operationalKpiValueUnit;
    let local = this;
    this.portfolioCompanyOperationalKPIValuesListClone.forEach(function(
      value: any
      ){
        const valueClone = JSON.parse(JSON.stringify(value));
        if (
          valueClone["KPI Info"] != "%" && 
          valueClone["KPI Info"] != "x" && 
          valueClone["KPI Info"] != "#" &&
          valueClone["KPI Info"] != "Text" && 
          valueClone["KPI Info"] != "" && 
          valueClone.KPIValue != ""
      ){
          switch (Number(companyValueUnit.typeId)) {
          case FinancialValueUnitsEnum.Absolute:
            break;
          case FinancialValueUnitsEnum.Thousands:
            local.portfolioCompanyOperationalKPIValuesListCol.forEach((col: any, index: any) => {
              if(valueClone[col.field] !="0"){
              valueClone[col.field] =
              !isNil(valueClone[col.field])?!isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field])))
                  ? (valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field]) / 1000
                  : valueClone[col.field]: valueClone[col.field];
              }
            });
            break;
          case FinancialValueUnitsEnum.Millions:
            local.portfolioCompanyOperationalKPIValuesListCol.forEach((col: any, index: any) => { 
              if(valueClone[col.field] !="0"){
              valueClone[col.field] =
              !isNil(valueClone[col.field])?!isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field]))) 
                  ? (valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field]) / 1000000
                  : valueClone[col.field]:valueClone[col.field];
              }
            });
            break;
          case FinancialValueUnitsEnum.Billions:
            local.portfolioCompanyOperationalKPIValuesListCol.forEach((col: any, index: any) => {
              if(valueClone[col.field] !="0"){
              valueClone[col.field] =
              !isNil(valueClone[col.field])?!isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field])))
                  ? (valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field]) / 1000000000
                  : valueClone[col.field]: valueClone[col.field];
              }
            });
            break;
        }
      }
      local.portfolioCompanyOperationalKPIValuesDataTableList.push(valueClone)
    });
  }


  kpiTable_GlobalFilter(event) {
    this.searchFilter = event;
    this.getPortfolioCompanyOperationalKPIValues(null);
    this.menuTrigger.closeMenu();
  }

  printColumn(rowData: any, field: any) {
    let key = field.header+"-" + rowData.KpiId
    let result = rowData[key]
    if (result !== undefined && result !== null) {
      return result;
    } else {
      return false;
    }
  }

  isNumberCheck(str: any) {
    return isNumeric(str);
  }

  setToggleStatus()
  {
    if(!this.workflowDetails?.isEnd && !this.workflowDetails?.isStart)
      this.toggleStatus = this.sectionData.isRework?'Rework':this.sectionData.isApprove?'Approve':'';
    if(this.workflowDetails?.isEnd)
      this.toggleStatus = this.sectionData.isRework?'Reject':this.sectionData.isApprove?'Publish':''; 
  }

  companySubmitReview(){
    this.showAddCommentPopup = true;
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

  showCommentPopup(isOpen:boolean)
  {
    this.comment = "";
    if(!isOpen)
    this.showAddCommentPopup = true;
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
