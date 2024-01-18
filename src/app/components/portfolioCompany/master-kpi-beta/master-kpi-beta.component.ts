import { MasterKpiService } from './../../../services/master-kpi.service';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { AccountService } from "src/app/services/account.service";
import {
  DecimalDigitEnum,
  ExportTypeEnum,
  FinancialValueUnitsEnum,
  MiscellaneousService,
  OrderTypesEnum,
  PeriodTypeQuarterEnum,
  ErrorMessage
} from "src/app/services/miscellaneous.service";
import { ActionsEnum, FeaturesEnum, UserSubFeaturesEnum, PermissionService, KPIModulesEnum } from "src/app/services/permission.service";
import { Observable, Subject, Subscription } from 'rxjs';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { AuditService } from "src/app/services/audit.service";
import { Table } from 'primeng/table';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { filter } from 'rxjs/operators';
import { NumberDecimalConst, FinancialsSubTabs, KpiTypes, PeriodTypeFilterOptions, PeriodType } from "src/app/common/constants";
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { isNil } from 'src/app/utils/utils';
@Component({
  selector: 'app-master-kpi-beta',
  templateUrl: './master-kpi-beta.component.html',
  styleUrls: ['./master-kpi-beta.component.scss']
})
export class MasterKpiBetaComponent implements OnInit, AfterViewInit {
  NumberDecimalConst = NumberDecimalConst;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  searchFilter: any = null;
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  @Input() modelList: any;
  dataTable: any;
  message: any;
  id: any;
  masterKPIs: any[];
  msgTimeSpan: number;
  loading = false;
  masterKpiValueUnit: any;
  modalOption: NgbModalOptions = {};
  currentModelRef: any;
  globalFilter: string = "";
  tableReload = false;
  isLoader: boolean = false;
  portfolioInfoSectionModel: any = {};
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  objMasterKPIList: any = [];
  masterKPICols: any = [];
  modelMasterKpi: any = {};
  portfolioCompanyMasterKPIValuesList: any[];
  portfolioCompanyMasterKPIValuesListClone: any[];
  financialKpiSearchFilter: any;
  expandedMasterKPIs: any[] = [];
  totalMasterKPIValuesRecords: number;
  financialPeriodErrorMessage: string = "";
  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  unitOfCurrency: string = FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions];
  auditToggle: boolean = false;
  @ViewChild('dt') dt: Table | undefined;
  updateModel: any = {};
  confirmUpdate = false;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  infoUpdate: boolean = false;
  ErrorNotation: boolean = false;
  isToasterMessage = false;
  ModuleName: string = "";
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('masterMenuTrigger') menuTrigger: MatMenuTrigger;
  ModuleCurrency: string;
  @Input() kpiName: string;
  exportMasterKPILoading: boolean = false;
  isValueUpdated: boolean = false;
  tabValueTypeList: ITab[] = [];
  IsPageLoad: boolean = true;
  tabName: string = "";
  isMonthly: boolean = true;
  isQuarterly: boolean = false;
  isAnnually: boolean = false;
  filterOptions: any[] = [];
  tableColumns = [];
  tableFrozenColumns = [];
  tableResult = [];
  tableResultClone = [];
  kpiFilterCols: any = [];
  auditLogList: any = [];
  isToggleChecked:boolean=false;
  @Input() pageConfigData =[{kpiConfigurationData:[],hasChart:false,kpiType:""}];
  subSectionFields=[];
  pageConfigResponse={kpiConfigurationData:[],hasChart:false,kpiType:""};
  defaultType:string="Monthly";
  
  constructor(
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private _avRoute: ActivatedRoute,
    private masterKpiService: MasterKpiService,
    private router: Router,
    private toastrService: ToastrService,
    private permissionService: PermissionService,
    private auditService: AuditService,
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }

    this.modelMasterKpi.periodType = {
      type: PeriodTypeQuarterEnum.Last1Year,
    };
    this.modelMasterKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelMasterKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };

    this.masterKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    };
  }
  sourceURL: any;
  ngAfterViewInit() {
    if (this.uiuxMenu != undefined) {
      (this.uiuxMenu as any).closed = this.uiuxMenu.closed
      this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  configureMenuClose(old: MatMenu['closed']): MatMenu['closed'] {
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
  ngOnInit() {
    this.pageConfigResponse = this.pageConfigData.find(x =>x.kpiType==KpiTypes.TradingRecordsBeta.type);
    this.subSectionFields = this.pageConfigResponse?.kpiConfigurationData;
    this.getValueTypeTabList();
    this.getPortfolioCompanyMasterKPIValues(null);
    this.eventsSubscription = this.events?.subscribe((res) => {
      this.searchFilter = res;
      this.getPortfolioCompanyMasterKPIValues(null);
    });
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }
  isNumberCheck(str: any) {
    return isNumeric(str);
  }
  getBetaMasterKPIValues(searchFilter:any,event:any){
    this.financialKpiSearchFilter = searchFilter;
    this.masterKpiService
      .getBetaMasterKPIValues({
        portfolioCompanyID: this.modelList?.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
        valueType: this.tabValueTypeList.length == 0 ? "Actual" : this.tabName,
        isMonthly: this.isMonthly,
        isQuarterly: this.isQuarterly,
        isAnnually: this.isAnnually,
        isPageLoad: this.IsPageLoad,
        moduleID: this.modelList?.moduleId,
        companyId: this.modelList?.portfolioCompanyID?.toString(),
        kpiConfigurationData:this.pageConfigResponse?.kpiConfigurationData
      })
      .subscribe({
        next: (result) => {
          if (result != null) {
            this.loading = false;
            this.ErrorNotation = false;
            this.isLoader = false;
            this.tableReload = true;
            this.tableColumns = result?.headers || [];
            this.tableFrozenColumns = this.frozenCols;
            this.tableResult = result?.rows || [];
            this.auditLogList = result?.companyKpiAuditLog || [];
            this.tableResultClone = result?.rows || [];
            this.convertUnits();
            this.kpiFilterCols = [...this.tableFrozenColumns, ...this.tableColumns];
            this.IsPageLoad = false;
            if(result != null){
              this.isMonthly = result?.isMonthly; 
              this.isQuarterly = result?.isQuarterly;
              this.isAnnually  = result?.isAnnually;
              this.SetFilterOptionsKeys(result);
            }
          } else {
            this.clearData();
          }
        },
        error: (error) => {
          this.clearData();
        }
      });
  }

  private SetFilterOptionsKeys(result: any) {
    this.filterOptions?.forEach(element => {
      switch (element.field) {
        case PeriodTypeFilterOptions.Monthly:
          element.key = result?.isMonthly;
          break;
        case PeriodTypeFilterOptions.Quarterly:
          element.key = result?.isQuarterly;
          break;
        case PeriodTypeFilterOptions.Annual:
          element.key = result?.isAnnually;
          break;
      }
    });
    this.setDefaultTypeTab();
  }

  getPortfolioCompanyMasterKPIValues(event: any) {
    this.isLoader = true;
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
    let searchFilter = this.searchFilter;
    if (searchFilter == null) {
      let sortOrder =
        this.modelMasterKpi.orderType.type == OrderTypesEnum.LatestOnRight
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
        periodType: this.modelMasterKpi.periodType.type,
      };

      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelMasterKpi.startPeriod.getFullYear(),
            this.modelMasterKpi.startPeriod.getMonth(),
            this.modelMasterKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelMasterKpi.endPeriod.getFullYear(),
            this.modelMasterKpi.endPeriod.getMonth(),
            this.modelMasterKpi.endPeriod.getDate()
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
   this.getBetaMasterKPIValues(searchFilter,event)
  }
  clearData() {
    this.loading = false;
    this.isLoader = false;
    this.tableColumns = [];
    this.tableResult = [];
    this.tableResultClone = [];
    this.auditLogList = [];
    this.IsPageLoad = false;
  }
  convertUnits() {
    this.tableResult = [];
    let local = this;
    let masterValueUnit = this.masterKpiValueUnit;
    this.tableResultClone.forEach(function (
      value: any
    ) {
      let valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone["KPI Info"] != "%" && valueClone["KPI Info"] != "x" && valueClone["KPI Info"] != "#" &&
        valueClone["KPI Info"] != "Text" && valueClone["KPI Info"] != ""
      ) {
        switch (Number(masterValueUnit.typeId)) {
          case FinancialValueUnitsEnum.Absolute:
            break;
          case FinancialValueUnitsEnum.Thousands:
            valueClone = local.conversionValue(valueClone, local, 1000);
            break;
          case FinancialValueUnitsEnum.Millions:
            valueClone = local.conversionValue(valueClone, local, 1000000);
            break;
          case FinancialValueUnitsEnum.Billions:
            valueClone = local.conversionValue(valueClone, local, 1000000000);
            break;
        }
      }
      local.tableResult.push(valueClone)
    });
  }
   conversionValue(valueClone: any, local: any, value: any) {
    local.tableColumns.forEach((col: any, index: any) => {
      if (valueClone[col.field] != 0) {
        valueClone[col.field] =
          !isNil(valueClone[col.field]) ? !isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1 ? valueClone[col.field].replace(/,/g, '') : valueClone[col.field])))
            ? (valueClone[col.field].indexOf(',') > -1 ? valueClone[col.field].replace(/,/g, '') : valueClone[col.field]) / value
            : valueClone[col.field] : valueClone[col.field];
      }
    });
    return valueClone;
  }
  kpiTable_GlobalFilter(event) {
    this.masterKpiValueUnit = event?.UnitType == undefined ? {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    } : event?.UnitType;
    this.searchFilter = event;
    this.getPortfolioCompanyMasterKPIValues(null);
    this.menuTrigger.closeMenu();
  }

  //#region New Code
  onChangePeriodOption(type) {
    this.filterOptions.forEach((x) => (x.key = false));
    if (type?.field == "Monthly") {
      type.key = this.isMonthly = true;
      this.isQuarterly = false;
      this.isAnnually = false;
    } else if (type?.field == "Quarterly") {
      this.isMonthly = false;
      type.key = this.isQuarterly = true;
      this.isAnnually = false;
    } else {
      this.isMonthly = false;
      this.isQuarterly = false;
      if(type!=undefined)
        type.key = this.isAnnually = true;
    }
    this.setDefaultTypeTab();
    this.getPortfolioCompanyMasterKPIValues(null);
  }
  setDefaultTypeTab=()=>{
    if (this.isMonthly)
      this.defaultType =PeriodTypeFilterOptions.Monthly;
    else if (this.isQuarterly)
      this.defaultType = PeriodTypeFilterOptions.Quarterly;
    else
      this.defaultType = PeriodTypeFilterOptions.Annual;
  }
  selectValueTab(tab: ITab) {
    this.tabValueTypeList.forEach((tab) => (tab.active = false));
    tab.active = true;
    this.tabName = tab.name;
    this.setPeriodsOptions(this.subSectionFields);
    this.getPortfolioCompanyMasterKPIValues(null);
  }
  getValueTypeTabList() {
    this.portfolioCompanyService.getfinancialsvalueTypes().subscribe((x) => {
      let tabList = x.body?.financialTypesModelList;
      let pageConfigTabs = this.subSectionFields;
      tabList = tabList?.filter((item: any) => pageConfigTabs?.some((otherItem: any) => item.name === otherItem.aliasName && otherItem.chartValue.length > 0));
      if(tabList != undefined && tabList.length > 0){
        this.tabValueTypeList = tabList;
        this.tabValueTypeList[0].active = true;
        this.tabName = this.tabValueTypeList[0].name;
        this.setPeriodsOptions(pageConfigTabs);
      }
    });
  }
  private setPeriodsOptions(pageConfigTabs: any[]) {
    let periodOptions = PeriodType.filterOptions;

    let activeTabData = pageConfigTabs?.find(x => x.aliasName == this.tabName);
    this.filterOptions = periodOptions?.filter(item => activeTabData?.chartValue?.some(otherItem => otherItem === item.field));
    let periodType = this.filterOptions.find(x => x.key);
    if(periodType == undefined && this.filterOptions.length > 0){
      for(const element of periodOptions){
        element.key = false;
      }
      this.filterOptions[0].key = true;
      periodType = this.filterOptions[0];
    }
    this.onChangePeriodOption(periodType);
  }
  onAuditLog(rowData: any,field: any) {
    let attributeName = rowData.IsChild==undefined ? rowData.KPI:rowData.KPI.substring(1);
    if (this.ErrorNotation && this.printColumn(rowData,field) && !rowData.IsHeader)
      this.router.navigate(["/audit-logs"], {
        state: { data: { KPI: "Trading Records", header: field.header,PortfolioCompanyID:this.modelList.portfolioCompanyID ,AttributeName:attributeName,ModuleId: this.modelList.moduleId, Comments:this.tabName, currency: this.modelList?.reportingCurrencyDetail?.currencyCode, AttributeId:this.getValues(rowData, field)} },
      });
  }
  onEditInit(rowData: any, column: any) {
    if((this.kpiName=="TradingRecords" && !this.permissionService.checkUserPermission(this.subFeature.TradingRecords,ActionsEnum[ActionsEnum.canEdit],this.id))
     || (this.kpiName=="CreditKpi" && !this.permissionService.checkUserPermission(this.subFeature.CreditKPI,ActionsEnum[ActionsEnum.canEdit],this.id))
     || rowData.isHeader)
    {
       return;
    }
     if (Number(this.masterKpiValueUnit.typeId) != FinancialValueUnitsEnum.Absolute && !this.ErrorNotation)
       this.infoUpdate = true;
     else if (!this.ErrorNotation && this.tableReload) {
       this.updateModel.colName = column.field;
       this.updateModel.header = column.header;
       this.updateModel.unit = rowData['KPI Info'];
       this.updateModel.rowName = rowData.KPI;
       this.updateModel.attributeId = this.getValues(rowData, column);
       this.updateModel.kpiId = rowData.KpiId;
       this.updateModel.previousVal = rowData[column.field];
       let objIndex = this.tableResult.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
       this.tableResult[objIndex][`${column.field} editable`] = true;
     }
   }

   CloseInfo(){
    this.infoUpdate = false;
  }

  getValues(rowdata: any, column: any) {
    let result = this.getFilterAuditValue(rowdata,column);
    if (result.length > 0) {
      return result[0].pcCompanyKPIMonthlyValueID;
    }
    else
      return 0;
}

  getFilterAuditValue(rowdata: any, column: any) {
    let headers = column.field.split(' ');
    let auditList = this.auditLogList;
    let periodHeader = null;
    let yearHeader = null;
    let monthValue = null;
    if (headers?.length > 0 && auditList?.length > 0) {
      if (headers.length == 1)
        yearHeader = parseInt(headers[0]);
      else {
        periodHeader = headers[0];
        yearHeader = parseInt(headers[1]);
        if (!periodHeader.toLowerCase().includes("q"))
          monthValue = this.miscService.getMonthNumber(periodHeader);
      }
    }
    return this.filterAuditValue(yearHeader, monthValue, auditList, periodHeader, rowdata);
  }
  filterAuditValue(yearHeader: any, monthValue: any, auditList: any, periodHeader: any, rowdata: any) {
    let result = [];
    if (periodHeader == "Q1" || periodHeader == "Q2" || periodHeader == "Q3" || periodHeader == "Q4")
      result = auditList.filter(x => x.quarter == periodHeader && x.year == yearHeader && x.companyKPIID == rowdata.ValuesKpiId);
    else if (monthValue != null)
      result = auditList.filter(x => x.month == monthValue && x.year == yearHeader && x.companyKPIID == rowdata.ValuesKpiId);
    else
      result = auditList.filter(x => x.month == null && x.year == yearHeader && (x.Quarter == null || x.Quarter == '') && x.companyKPIID == rowdata.ValuesKpiId);
    return result
  }

onColumnEditComplete(index:any, col:any, rowData:any,event) {
  let prevVal = this.updateModel.previousVal;
  rowData[col.field] = event != undefined ? event.target.value ?? undefined : rowData[col.field];
  rowData[col.field] = rowData[col.field] == ""  ? undefined :rowData[col.field];
  let currVal = rowData[col.field];
    if(!this.confirmUpdate && currVal != prevVal) {
      this.updateModel.updatedVal = rowData[col.field];
      this.confirmUpdate = true;
  }
  else
    this.OnKpiUpdateCancel("");
}
getTabName(){
  switch(this.tabName){
    case FinancialsSubTabs.Actual:
      return "actual";
    case FinancialsSubTabs.Budget:
      return "budget";
    case FinancialsSubTabs.Forecast:
      return "forecast";
    case FinancialsSubTabs.IC:
      return "ic";
  }
}
OnKpiUpdate(kpidata:any){
  this.isValueUpdated = false;
  let comment = this.getTabName();
  let datauditmodellog = {
    Description:"Manual",
    AttributeID: this.updateModel.attributeId,
    AttributeName: "MasterKpis",
    NewValue: ((this.updateModel.updatedVal == null  || this.updateModel.updatedVal==undefined) ? null : this.updateModel.updatedVal.toString()),
    MonthAndYear: this.updateModel.colName,
    fieldName: this.updateModel.rowName,
    portfolioCompanyId: this.modelList.portfolioCompanyID.toString(),
    comments: comment,
    KpiId: this.updateModel.kpiId,
    ModuleId : KPIModulesEnum.TradingRecords
  };
  this.auditService
    .UpdateKPI(datauditmodellog)
    .subscribe(
      (result) =>
      {
        if(result.code!="InternalServerError"){
          this.isToasterMessage = true;
          this.isValueUpdated = true;
          this.isLoader=true;
          this.getPortfolioCompanyMasterKPIValues(null);
           this.confirmUpdate = false;
           this.updateModel = {};
           this.successToaster();
        }
        else{
           this.OnKpiUpdateCancel("");
           this.isValueUpdated = false;
           this.toastrService.error(ErrorMessage.SomethingWentWrong,"",{positionClass:"toast-center-center"});
        }
      },
      (error) => {
        this.OnKpiUpdateCancel("");
        this.isValueUpdated = false;
        this.toastrService.error(ErrorMessage.SomethingWentWrong,"",{positionClass:"toast-center-center"});
      });
}

successToaster() {
  this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
}

OnKpiUpdateCancel(event:any){
  let objIndex = this.tableResult.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
  this.tableResult[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
  this.clearcellEdit();
}

onColumnEdit(event: any) {
  event.target.blur();
}
clearcellEdit(){
  let objIndex = this.tableResult.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
  this.tableResult[objIndex][`${this.updateModel.colName} editable`] = false;
  this.confirmUpdate = false;
  this.updateModel = {};
}
validateNumber(event: any,KpiInfo:string) {
  if (event.which != 15) {
    let ex: RegExp = new RegExp(/^-*\d*(?:[.,]\d{1,6})?$/);
    if (ex.test(event.target.value) === false) {
      if (event != undefined && (event.target as HTMLInputElement).value.includes(".")) {
        event.target.value = parseFloat(event.target.value).toFixed(6);
      }
    }
  }
}
validateMaxLength(event:any): boolean {
  if (event != null && (event.target as HTMLInputElement).value.includes(".")) {
    if (event.target.value.length == 21) return false;
  }else{
    if (event.target.value.length == 16) return false;
  }
  return true;
}
exportMasterKpiValues() {
  let event = {
    first: 0,
    rows: 1000,
    globalFilter: null,
    sortField: "FinancialKPI.KPI",
    multiSortMeta: this.financialKPIMultiSortMeta,
    sortOrder: -1,
  };
  let filter = {
    currency: this.modelList?.reportingCurrencyDetail?.currency,
    decimaPlace: this.modelMasterKpi?.decimalPlaces?.type,
    valueType: this.masterKpiValueUnit?.typeId,
  };
  this.exportMasterKPILoading = true;
  this.portfolioCompanyService
    .exportTradingRecordsList({
      companyId: this.modelList?.portfolioCompanyID?.toString(),
      portfolioCompanyID: this.modelList?.portfolioCompanyID?.toString(),
      paginationFilter: event,
      searchFilter: this.financialKpiSearchFilter,
      kPIFilter: filter,
      moduleId : this.modelList?.moduleId,
      Unit:this.masterKpiValueUnit.typeId
    })
    .subscribe(
      (response) => {
        this.exportMasterKPILoading = false;
        this.miscService.downloadExcelFile(response);
      },
      (error) => {
        this.exportMasterKPILoading = false;
        this.message = this.miscService.showAlertMessages(
          "error",
          ErrorMessage.SomethingWentWrong
        );
      }
    );
}
handleChange(e) {
  this.ErrorNotation = e.checked;
}
printColumn(rowData: any, column: any) {
  let result = this.getFilterAuditValue(rowData, column);
  if (result.length > 0) 
    return result[0].acutalAuditLog ? result[0].acutalAuditLog : false;
  else
    return false;
}
  //#endregion New Code
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}
