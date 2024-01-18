import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, Subscription } from 'rxjs';
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Table } from 'primeng/table';
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { NumberDecimalConst, FinancialsSubTabs, KpiTypes, PeriodTypeFilterOptions, PeriodType, DataAnalyticsConstants, GlobalConstants } from "src/app/common/constants";
import { isNil } from 'src/app/utils/utils';
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { ActionsEnum, FeaturesEnum, UserSubFeaturesEnum, PermissionService, KPIModulesEnum  } from "src/app/services/permission.service";
import {
  DecimalDigitEnum,
  FinancialValueUnitsEnum,
  MiscellaneousService,
  OrderTypesEnum,
  PeriodTypeQuarterEnum,
  ErrorMessage
} from "src/app/services/miscellaneous.service";
import { filter } from 'rxjs/operators';
import { AuditService } from "src/app/services/audit.service";
@Component({
    selector: 'app-operational-kpi-beta',
    templateUrl: './operational-kpi-beta.component.html',
    styleUrls: ['./operational-kpi-beta.component.scss']
})
export class OperationalKpiBetaComponent implements OnInit, AfterViewInit {
  NumberDecimalConst = NumberDecimalConst;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
    modelOperationalKpi: any = {};
    @Input() searchFilter: any = null;
    private eventsSubscription: Subscription;
    @Input() events: Observable<void>;
    @Input() modelList: any;
    dataTable: any;
    message: any;
    id: any;
    msgTimeSpan: number;
    loading = false;
    operationalKpiValueUnit: any;
    modalOption: NgbModalOptions = {};
    currentModelRef: any;
    globalFilter: string = "";
    tableReload = false;
    isLoader: boolean = false;
    portfolioInfoSectionModel: any = {};
    frozenCols: any = [{ field: "KPI", header: "KPI" }];
    operationalKpiSearchFilter: any;
    financialPeriodErrorMessage: string = "";
    unitOfCurrency: string = FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions];
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
    @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
    ModuleCurrency: string;
    @Input() kpiName: string;
    exportOperationalKPILoading: boolean = false;
    isValueUpdated: boolean = false;
    tabValueTypeList: ITab[] = [];
    IsPageLoad: boolean = true;
    tabName: string = "";
    isMonthly: boolean = true;
    isQuarterly: boolean = false;
    isAnnually: boolean = false;
    filterOptions : any[] = [];
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
        private _avRoute: ActivatedRoute,
        private portfolioCompanyService: PortfolioCompanyService,
        private miscService: MiscellaneousService,
        private toastrService: ToastrService,
        private permissionService: PermissionService,
        private auditService: AuditService,
        private router: Router,
    ) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }
        this.modelOperationalKpi.periodType = {
          type: PeriodTypeQuarterEnum.Last1Year,
        };
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
      this.pageConfigResponse = this.pageConfigData.find(x =>x.kpiType==KpiTypes.OperationalBeta.type);
      this.subSectionFields = this.pageConfigResponse?.kpiConfigurationData;
      this.getValueTypeTabList();
      if(this.filterOptions.length > 0)
        this.filterOptions[0].key=true;
      this.eventsSubscription = this.events?.subscribe((res) => {
        this.searchFilter = res;
        this.getPortfolioCompanyOperationalKPIValues(null);
      });
      this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    }

    selectValueTab(tab: ITab) {
      this.tabValueTypeList.forEach((tab) => (tab.active = false));
      tab.active = true;
      this.tabName = tab.name;
      this.setPeriodsOptions(this.subSectionFields);
      this.getPortfolioCompanyOperationalKPIValues(null);
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

    successToaster() {
      this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
    }

    isNumberCheck(str: any) {
      return isNumeric(str);
    }

    getPortfolioCompanyOperationalKPIValues(event: any) {
        this.isLoader = true;
        if (event == null) {
          event = GlobalConstants.KpiFillter;
        }
        let searchFilter = this.searchFilter;
        if (searchFilter == null) {
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
          searchFilter = {
            sortOrder: sortOrder,
            periodType: this.modelOperationalKpi.periodType.type,
          };
    
          if (searchFilter.periodType == "Date Range") {
            searchFilter.startPeriod = new Date(
              Date.UTC(
                this.modelOperationalKpi.startPeriod.getFullYear(),
                this.modelOperationalKpi.startPeriod.getMonth(),
                this.modelOperationalKpi.startPeriod.getDate()
              )
            );
            searchFilter.endPeriod = new Date(
              Date.UTC(
                this.modelOperationalKpi.endPeriod.getFullYear(),
                this.modelOperationalKpi.endPeriod.getMonth(),
                this.modelOperationalKpi.endPeriod.getDate()
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
       this.getBetaOperationalKPIValues(searchFilter,event)
      }

      getBetaOperationalKPIValues(searchFilter:any,event:any){
        this.operationalKpiSearchFilter = searchFilter;
        this.portfolioCompanyService.getOperationalKpiData({
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
            kpiConfigurationData:this.pageConfigResponse.kpiConfigurationData
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

      kpiTable_GlobalFilter(event) {
        this.operationalKpiValueUnit = event?.UnitType == undefined ? {
          typeId: FinancialValueUnitsEnum.Millions,
          unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
        } : event?.UnitType;
        this.searchFilter = event;
        this.getPortfolioCompanyOperationalKPIValues(null);
        this.menuTrigger?.closeMenu();
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

      getValueTypeTabList() {
        this.portfolioCompanyService.getfinancialsvalueTypes().subscribe((x) => {
          let tabList = x.body?.financialTypesModelList;
          let pageConfigTabs = this.subSectionFields;
          tabList = tabList?.filter((item: any) => pageConfigTabs?.some((otherItem: any) => item.name === otherItem.aliasName && otherItem.chartValue.length > 0));
          tabList = tabList?.filter(x => x.name != "IC");
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
        this.filterOptions = periodOptions?.filter(item => activeTabData.chartValue.some(otherItem => otherItem === item.field));
        let periodType = this.filterOptions.find(x => x.key);
        if(periodType == undefined){
          for(const element of periodOptions){
            element.key = false;
          }
          this.filterOptions[0].key = true;
          periodType = this.filterOptions[0];
        }
        this.onChangePeriodOption(periodType);
      }

      onChangePeriodOption(type) {
        this.filterOptions.forEach((x) => (x.key = false));
        if (type.field == PeriodTypeFilterOptions.Monthly) {
          type.key = this.isMonthly = true;
          this.isQuarterly = false;
          this.isAnnually = false;
          this.SetPeriodFilterOptions(PeriodTypeFilterOptions.Monthly);
        } else if (type.field == PeriodTypeFilterOptions.Quarterly ) {
          this.isMonthly = false;
          type.key = this.isQuarterly = true;
          this.isAnnually = false;
          this.SetPeriodFilterOptions(PeriodTypeFilterOptions.Quarterly);
        } else {
          this.isMonthly = false;
          this.isQuarterly = false;
          type.key = this.isAnnually = true;
          this.SetPeriodFilterOptions(PeriodTypeFilterOptions.Annual);
        }
        this.setDefaultTypeTab();
        this.getPortfolioCompanyOperationalKPIValues(null);
      }

  private SetPeriodFilterOptions(periodType: string) {
    PeriodType.filterOptions.forEach(x => {
      if (x.field !== periodType)
        x.key = false;
      else
        x.key = true;
    });
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
        let masterValueUnit = this.operationalKpiValueUnit;
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

      handleChange(e) {
        this.ErrorNotation = e.checked;
        this.isToggleChecked = this.ErrorNotation;
      }

      printColumn(rowData: any, column: any) {
        if(this.isToggleChecked ){
          let result = this.getFilterAuditValue(rowData, column);
          if (result.length > 0) 
            return result[0].acutalAuditLog ? result[0].acutalAuditLog : false;
          else
            return false;
        }
        return false;
      }
      getFilterAuditValue(rowdata: any, column: any) {
        let headers = column?.field?.split(' ');
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
          result = auditList?.filter(x => x.quarter == periodHeader && x.year == yearHeader && x.kpiId == rowdata.KpiId);
        else if (monthValue != null)
          result = auditList?.filter(x => x.month == monthValue && x.year == yearHeader && x.kpiId == rowdata.KpiId);
        else
          result = auditList?.filter(x => x.month == null && x.year == yearHeader && (x.Quarter == null || x.Quarter == '') && x.kpiId == rowdata.KpiId);
        return result
      }
      onEditInit(rowData: any,column: any) {
        if(!this.permissionService.checkUserPermission(this.subFeature.OperationalKPIs,ActionsEnum[ActionsEnum.canEdit],this.id)|| column.header == "KPI"){
          return;
        }
        let attributeName = rowData?.IsChild==undefined ? rowData?.KPI: rowData['originalKPI'];
        if(Number(this.operationalKpiValueUnit?.typeId) != FinancialValueUnitsEnum.Absolute && !this.ErrorNotation)
          this.infoUpdate = true;
        else if(!this.ErrorNotation && this.tableReload){
          this.updateModel.colName = column.field;
          this.updateModel.header = column.header;
          this.updateModel.unit = rowData['KPI Info'];
          this.updateModel.rowName = attributeName;
          this.updateModel.attributeId = this.getValues(rowData, column);
          this.updateModel.kpiId = rowData.KpiId;
          this.updateModel.previousVal = rowData[column.field] == "" ? undefined : rowData[column.field];
          let objIndex = this.tableResult.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
          this.tableResult[objIndex][`${column.field} editable`] = true;
        }
      }

      onColumnEditComplete(index: any, col: any, rowData: any,event) {
        let prevVal = this.updateModel.previousVal;
        rowData[col.field] = event.target.value !== "" ? event.target.value : null;
        let currVal = rowData[col.field];
        if (!this.confirmUpdate && currVal != prevVal) {
          this.updateModel.updatedVal = rowData[col.field] === "" ? undefined : rowData[col.field];
          this.confirmUpdate = true;
        }
       else
         this.OnKpiUpdateCancel("");
      }
    
      OnKpiUpdateCancel(event: any) {
        let objIndex = this.tableResult?.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
        this.tableResult[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
        this.clearCellEdit();
      }
    
      clearCellEdit() {
        let objIndex = this.tableResult?.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
        if(this.updateModel.colName!=undefined)
          this.tableResult[objIndex][`${this.updateModel.colName} editable`] = false;
        this.confirmUpdate = false;
        this.updateModel = {};
      }

      validateNumber(event: any,KpiInfo:string) {
        if (event.which != 15) {
          let ex: RegExp = new RegExp(/^-*\d*(?:[.,]\d{1,5})?$/);
          if (ex.test(event.target.value) === false) {
            if (!Number.isInteger(Number(event.target.value) )) {
              event.target.value = parseFloat(event.target.value).toFixed(5);
            }
          }
        }
      }
      validateMaxLength(event:any): boolean {
        if (!Number.isInteger(Number(event.target.value))) {
          if (event.target.value.length == 21) return false;
        }else{
          if (event.target.value.length == 16) return false;
        }
        return true;
      }
    
      onColumnEdit(event: any) {
        event.target.blur();
      }
      CloseInfo() {
        this.infoUpdate = false;
      }

      OnKpiUpdate() {
        this.isValueUpdated = false;
        let comment = this.tabValueTypeList.length == 0 ? GlobalConstants.Actual: this.tabName;
        let columName = this.updateModel.colName;

        let dataAuditModelLog = {
          Description:GlobalConstants.Manual,
          AttributeName:DataAnalyticsConstants.Operational_KPIs,
          AttributeID: this.updateModel.attributeId,
          ModuleId : this.modelList?.moduleId,
          MonthAndYear: columName,
          fieldName: this.updateModel?.rowName,
          comments: comment,
          KpiId:this.updateModel.kpiId,
          NewValue: ((this.updateModel.updatedVal == null || this.updateModel.updatedVal == undefined) ? null : this.updateModel.updatedVal.toString()),
          portfolioCompanyId: this.modelList?.portfolioCompanyID,
          NewCurrencyType :this.updateModel.unit,
          valueType: this.tabValueTypeList.length == 0 ? GlobalConstants.Actual: this.tabName,
        };
        this.auditService
          .UpdateKPI(dataAuditModelLog)
          .subscribe(
            (result) => {
              if (result.code != "InternalServerError") {
                this.isToasterMessage = true;
                this.isLoader = true;
                this.getBetaOperationalKPIValues(this.searchFilter, null);
                this.confirmUpdate = false;
                this.isValueUpdated = true;
                this.successToaster();
              }
              else {
                this.OnKpiUpdateCancel("");
                this.isValueUpdated = false;
                this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
              }
            },
            (error) => {
              this.OnKpiUpdateCancel("");
              this.isValueUpdated = false;
              this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
            });
      }
      onAuditLog(rowData: any,field: any) {
        if (this.isToggleChecked && !rowData?.IsHeader && !rowData.IsFormula && this.printColumn(rowData,field))
            this.router.navigate(["/audit-logs"], {
              state: { data: { KPI: DataAnalyticsConstants.Operational_KPIs, header: field.header,PortfolioCompanyID:this.modelList.portfolioCompanyID ,AttributeName:rowData.KPI, Comments:this.tabName, currency: this.modelList?.reportingCurrencyDetail?.currencyCode, AttributeId:this.getValues(rowData, field)}},
            });
      }
      getValues(rowdata: any, column: any) {
        let result = this.getFilterAuditValue(rowdata,column);
        if (result.length > 0) {
          return result[0].kpiValuesId;
        }
        else
          return 0;
    }
    setDefaultTypeTab=()=>{
      if (this.isMonthly)
        this.defaultType =PeriodTypeFilterOptions.Monthly;
      else if (this.isQuarterly)
        this.defaultType = PeriodTypeFilterOptions.Quarterly;
      else
        this.defaultType = PeriodTypeFilterOptions.Annual;
    }

    exportOperationalKpiValues() {
      let paginationFilter = GlobalConstants.KpiFillter;
      let filter = this.GetFilter();
      this.exportOperationalKPILoading = true;
      this.portfolioCompanyService.exportOperationalKPIList(this.GetExportParameters(filter, paginationFilter)).subscribe(this.GetExportCallback());
    }
    
    GetFilter() {
      return {
        currency: this.modelList.reportingCurrencyDetail.currency,
        decimaPlace: this.modelOperationalKpi.decimalPlaces.type,
        valueType: this.operationalKpiValueUnit.typeId
      };
    }
    
    GetExportParameters(filter, paginationFilter) {
      return {
        companyId: this.modelList?.portfolioCompanyID?.toString(),
        portfolioCompanyID: this.modelList?.portfolioCompanyID?.toString(),
        paginationFilter: paginationFilter,
        searchFilter: this.operationalKpiSearchFilter,
        kPIFilter: filter,
        moduleId : KPIModulesEnum.Operational,
        Unit:this.operationalKpiValueUnit.typeId,
        kpiConfigurationData:this.pageConfigResponse.kpiConfigurationData
      };
    }
    
    GetExportCallback() {
      return {
        next:(response) => {
          this.exportOperationalKPILoading = false;
          this.miscService.downloadExcelFile(response);
        },
        error() {
          this.exportOperationalKPILoading = false;
          this.toastrService?.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
        }
      };
    }
}

function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}
