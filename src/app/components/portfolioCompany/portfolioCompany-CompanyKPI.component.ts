import {Input, Component,  OnInit,  ViewChild, EventEmitter, AfterViewInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { MenuItem } from "primeng/api";
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { AccountService } from "../../services/account.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import {DecimalDigitEnum,ErrorMessage,ExportTypeEnum,FinancialValueUnitsEnum,MiscellaneousService,OrderTypesEnum,PeriodTypeQuarterEnum} from "../../services/miscellaneous.service";
import { ActionsEnum, FeaturesEnum, KPIModulesEnum, PermissionService, UserSubFeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { AuditService } from "src/app/services/audit.service";
import { Observable, Subject, Subscription } from 'rxjs';
import { Table } from "primeng/table";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { filter } from "rxjs/operators";
import { NumberDecimalConst,PeriodTypeFilterOptions } from "src/app/common/constants";
import { isNil } from "src/app/utils/utils";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { FinancialsSubTabs } from "../../common/constants"
@Component({
  selector: "portfolio-company-kpi",
  templateUrl: "./portfolioCompany-CompanyKPI.component.html",
  styleUrls: ["./portfolioCompany-CompanyKPI.component.scss"],
})
export class PortfolioCompanyKPIComponent implements OnInit,AfterViewInit {
  kpiModuleId=KPIModulesEnum.Company;
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('companyMenuTrigger') menuTrigger: MatMenuTrigger;
  NumberDecimalConst = NumberDecimalConst; 
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  dataTable: any;
  message: any;
  searchFilter:any=null;
  @ViewChild('dt') dt: Table | undefined;
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;  id: any;
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  companyKPIs: any[];
  @Input() model: any = {};
  items: MenuItem[];
  ddlModel: any = {
    companyKPIList: [],
    selectedCompanyKPI: "",
  };
  updateModel:any = {};
  msgTimeSpan: number;
  loading = false;
  confirmUpdate = false;
  companyKpiValueUnit: any;
  tableReload = false;
  exportCompanyKPILoading: boolean = false;
  CompanyKPIOrginalData: any[] = [];
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  ErrorNotation: boolean = false;
  infoUpdate: boolean = false;
  blankSpace: any = "&nbsp";
  isLoader: boolean = false;
  isToasterMessage = false;
  tableColumns = [];
  tableFrozenColumns = [];
  tableResult = [];
  tableResultClone = [];
  isToggleChecked:boolean=false;
  companyKpiFilterCols: any = [];
  auditLogList: any = [];
  isTaabo:boolean = false;
  getPCCompanyKPIValues: any;
  createCompanyKPILayOut: any;
  convertCompanyKPIValueUnits: any;
  isValueUpdated: boolean = false;
  tabValueTypeList: ITab[] = [];
  IsPageLoad: boolean = true;
  tabName: string = "";
  isMonthly: boolean = false;
  isQuarterly: boolean = false;
  isAnnually: boolean = false;
  filterOptions: any[] = [];
  valueTypeIc: string = FinancialsSubTabs.IC;
  @Input() pageConfigData =[{kpiConfigurationData:[],hasChart:false,kpiType:""}];
  subSectionFields=[];
  filterOptionsCopy: any[] = [
    { field: "Monthly", key: this.isMonthly },
    { field: "Quarterly", key: this.isQuarterly },
    { field: "Annual", key: this.isAnnually }
  ];
  companyKpiConfigData={kpiConfigurationData:[],hasChart:false,kpiType:""};
  defaultType:string="Monthly";
  constructor(
    private auditService: AuditService,
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private _avRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private permissionService:PermissionService
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }

    this.items = [];
    this.modelCompanyKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.modelCompanyKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelCompanyKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-1",
    };
    this.companyKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    };
  }

  sourceURL: any;
  ngOnInit() {
    this.IsPageLoad = true;
    this.companyKpiConfigData = this.pageConfigData.find(x =>x.kpiType=="CompanyKPIs");
    this.subSectionFields = this.companyKpiConfigData?.kpiConfigurationData;
    this.getValueTypeTabList();
    this.toastrService.overlayContainer = this.toastContainer;
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    this.getPortfolioCompanies(null);
    this.eventsSubscription = this.events?.subscribe((res) =>{
      this.searchFilter=res;
      this.getPortfolioCompanies(null);
    });
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }

  isNumberCheck(str: any) {
    return isNumeric(str);
  }

  getPortfolioCompanies(event:any) {
    this.isLoader = true;
    if (this.id != undefined) {
      this.loading = true;
      let searchFilter = this.searchFilter;
       if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "CompanywiseKPI.KPI",
        multiSortMeta: this.companywiseKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      let sortOrder =
        this.modelCompanyKpi.orderType.type == OrderTypesEnum.LatestOnRight
          ? [
              { field: "year", order: 1 },
              { field: "month", order: 1 },
            ]
          : [
              { field: "year", order: -1 },
              { field: "month", order: -1 },
            ];
      searchFilter = {
        sortOrder: sortOrder,
        periodType: this.modelCompanyKpi.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelCompanyKpi.startPeriod.getFullYear(),
            this.modelCompanyKpi.startPeriod.getMonth(),
            this.modelCompanyKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelCompanyKpi.endPeriod.getFullYear(),
            this.modelCompanyKpi.endPeriod.getMonth(),
            this.modelCompanyKpi.endPeriod.getDate()
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
    this.companyKpiSearchFilter = searchFilter;
    this.searchFilter = searchFilter;
      this.portfolioCompanyService
      .getCompanyKpiData({
        companyId: this.model.portfolioCompanyID.toString(),
        paginationFilter: event,
        searchFilter: this.searchFilter,
        valueType: this.tabValueTypeList.length == 0 ? "Actual" : this.tabName,
        isMonthly: this.isMonthly,
        isQuarterly: this.isQuarterly,
        isAnnually: this.isAnnually,
        isPageLoad: this.IsPageLoad,
        moduleId : KPIModulesEnum.Company,
        kpiConfigurationData:this.companyKpiConfigData.kpiConfigurationData
      })
        .subscribe(
          (result) => {
            this.loading = false;
            this.isToggleChecked=false;
            this.ErrorNotation=false;
            this.isLoader = false;
            this.tableReload = true;
            this.tableColumns = result?.headers || [];
            this.tableFrozenColumns = this.frozenCols;
            this.tableResult = result?.rows || [];
            this.auditLogList = result?.companyKpiAuditLog || [];
            this.tableResultClone = result?.rows || [];
            this.convertUnits()
            this.companyKpiFilterCols = [...this.tableFrozenColumns, ...this.tableColumns];
            this.IsPageLoad = false;
            if(result != null){
              this.isMonthly = result?.isMonthly; 
              this.isQuarterly = result?.isQuarterly;
              this.isAnnually  = result?.isAnnually;
              this.SetFilterOptionsKeys(result);
            }
          },
          (error) => {
            this.loading = false;
            this.isLoader = false;
            this.tableResult = [];
            this.tableResultClone = [];
            this.auditLogList = [];
            this.IsPageLoad = false;
          }
        );
    }
  }

  private SetFilterOptionsKeys(result: any) {
    this.filterOptions.forEach(element => {
      switch (element.field) {
        case "Monthly":
          element.key = result?.isMonthly;
          break;
        case "Quarterly":
          element.key = result?.isQuarterly;
          break;
        case "Annual":
          element.key = result?.isAnnually;
          break;
      }
    });
    this.setDefaultTypeTab();
  }

  convertUnits() {
    this.tableResult = [];
    let companyValueUnit = this.companyKpiValueUnit;
    let local = this;
    this.tableResultClone.forEach(function (
      value: any
    ) {
      const valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone["KPI Info"] != "%" && valueClone["KPI Info"] != "x" && valueClone["KPI Info"] != "#" &&
        valueClone["KPI Info"] != "Text" && valueClone["KPI Info"] != "" 
      ) {
        switch (Number(companyValueUnit.typeId)) {
          case FinancialValueUnitsEnum.Absolute:
            break;
          case FinancialValueUnitsEnum.Thousands:
            local.tableColumns.forEach((col: any, index: any) => {
              if(valueClone[col.field] != 0){
                valueClone[col.field] =
                !isNil(valueClone[col.field])?!isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field])))
                    ? (valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field]) / 1000
                    : valueClone[col.field]: valueClone[col.field];
              }
            });
            break;
          case FinancialValueUnitsEnum.Millions:
            local.tableColumns.forEach((col: any, index: any) => { 
              if(valueClone[col.field] != 0){
                valueClone[col.field] =
                !isNil(valueClone[col.field])?!isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field]))) 
                    ? (valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field]) / 1000000
                    : valueClone[col.field]:valueClone[col.field];
              }
            });
            break;
          case FinancialValueUnitsEnum.Billions:
            local.tableColumns.forEach((col: any, index: any) => {
              if(valueClone[col.field] != 0){
                valueClone[col.field] =
                !isNil(valueClone[col.field])?!isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field])))
                    ? (valueClone[col.field].indexOf(',') > -1?valueClone[col.field].replace(/,/g, ''):valueClone[col.field]) / 1000000000
                    : valueClone[col.field]: valueClone[col.field];
              }
            });
            break;
        }
      }
      local.tableResult.push(valueClone)
    });
  }
  

  globalFilter: string = "";

  /***************Company KPI*************[Start]******************/

  objCompanyKPIList: any = [];
  companyKPICols: any = [];
  modelCompanyKpi: any = {};
  portfolioCompanyCompanyKPIValuesList: any[];
  portfolioCompanyCompanyKPIValuesListClone: any[];
  companyValueUnitTable: FinancialValueUnitsEnum =
    FinancialValueUnitsEnum.Millions;
  companyKpiSearchFilter: any;
  expandedCompanyKPIs: any[] = [];
  totalCompanyCompanyKPIValuesRecords: number;
  companyPeriodErrorMessage: string = "";

  companywiseKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];


  /***************Company KPI*************[End]******************/

  exportCompanyKpiValues() {
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "CompanywiseKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1,
    };
    let filter = {
      currency: this.model.reportingCurrencyDetail?.currency,
      decimaPlace: this.modelCompanyKpi.decimalPlaces?.type,
      valueType: this.companyKpiValueUnit?.typeId,
    };
    this.exportCompanyKPILoading = true;
    this.portfolioCompanyService
      .exportCompanywiseKPIList({
        companyId: this.model.portfolioCompanyID?.toString(),
        portfolioCompanyID: this.model.portfolioCompanyID?.toString(),
        paginationFilter: event,
        searchFilter: this.companyKpiSearchFilter,
        kPIFilter: filter,
        moduleId : KPIModulesEnum.Company,
        Unit:this.companyKpiValueUnit.typeId
      })
      .subscribe(
        (response) => {
          this.exportCompanyKPILoading = false;
          this.miscService.downloadExcelFile(response);
        },
        (error) => {
          this.exportCompanyKPILoading = false;
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
      );
  }

  portfolioInfoSectionModel: any = {};
  handleChange(e) {
    this.ErrorNotation = !this.ErrorNotation;
  }
  printColumn(rowData: any, column: any) {
    let result = this.getFilterAuditValue(rowData,column);
      if (result.length > 0) {
        if(this.tabName.includes('Actual') || this.tabName.includes('Forecast'))
           return result[0].acutalAuditLog ? result[0].acutalAuditLog:false;
           else
           return result[0].budgetAuditLog ? result[0].budgetAuditLog:false;
      }
      else
        return false;
  }

  onAuditLog(rowData: any,field: any) {
    let attributeName = rowData.IsChild==undefined ? rowData.KPI:rowData.KPI.substring(1);
    if (this.ErrorNotation && this.printColumn(rowData,field) && !rowData.IsHeader)
      this.router.navigate(["/audit-logs"], {
        state: { data: { KPI: "Company KPIs", header: field.header,PortfolioCompanyID:this.model.portfolioCompanyID ,AttributeName:attributeName, Comments:this.tabName, currency: this.model?.reportingCurrencyDetail?.currencyCode, AttributeId:this.getValues(rowData, field)} },
      });
  }
  onColumnEditComplete(index:any, col:any, rowData:any) {
    let prevVal = this.updateModel.previousVal;
    rowData[col.field] = rowData[col.field] == "" && rowData["KPI Info"] == "Text"  ? undefined :rowData[col.field];
    let currVal = rowData[col.field];
      if(!this.confirmUpdate && currVal != prevVal) {
        this.updateModel.updatedVal = rowData[col.field];
        this.confirmUpdate = true;
    }
    else
      this.OnKpiUpdateCancel("");
  }
  onColumnEdit(event: any) {
    event.target.blur();
  }

  onEditInit(rowData: any,column: any) {
    if(!this.permissionService.checkUserPermission(this.subFeature.CompanyKPIs,ActionsEnum[ActionsEnum.canEdit],this.id)|| column.header == "KPI"){
      return;
    }
    let attributeName = rowData.IsChild==undefined ? rowData.KPI: rowData['originalKPI'];
    if(Number(this.companyKpiValueUnit.typeId) != FinancialValueUnitsEnum.Absolute && !this.ErrorNotation)
      this.infoUpdate = true;
    else if(!this.ErrorNotation && this.tableReload){
      this.updateModel.colName = column.field;
      this.updateModel.header = column.header;
      this.updateModel.unit = rowData['KPI Info'];
      this.updateModel.rowName = attributeName;
      this.updateModel.attributeId =  this.getValues(rowData, column);
      this.updateModel.kpiId = rowData.KpiId;
      this.updateModel.previousVal = rowData[column.field] == "" ? undefined : rowData[column.field];
      let objIndex = this.tableResult.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
      this.tableResult[objIndex][`${column.field} editable`] = true;
    }
  }
  getFilterAuditValue(rowdata: any, column: any){
    let auditList = this.auditLogList;
    let headers = column.field.split(' ');
    let result = [];
    if (headers?.length > 0 && auditList?.length > 0) {
      let periodHeader = null;
      let yearHeader = null;
      let monthValue = null;
      if(headers.length == 1){
        yearHeader = parseInt(headers[0]);
      } else{
        periodHeader = headers[0];
        yearHeader = parseInt(headers[1]);
        if(!periodHeader.toLowerCase().includes("q"))
        monthValue = this.miscService.getMonthNumber(periodHeader);
      }
      if (periodHeader == "Q1" || periodHeader == "Q2" || periodHeader == "Q3" || periodHeader == "Q4") {
        result = auditList.filter(x => x.quarter == periodHeader && x.year == yearHeader && x.companyKPIID == rowdata.ValuesKpiId);
      } 
      else if (monthValue != null) {
        result = auditList.filter(x => x.month == monthValue && x.year == yearHeader && x.companyKPIID == rowdata.ValuesKpiId);
      }
      else {
        result = auditList.filter(x => x.month == null && x.year == yearHeader && (x.Quarter == null || x.Quarter == '') && x.companyKPIID == rowdata.ValuesKpiId);
      }
    }
    return result;
  }
  getValues(rowdata: any, column: any) {
      let result = this.getFilterAuditValue(rowdata,column);
      if (result.length > 0) {
        return result[0].pcCompanyKPIMonthlyValueID;
      }
      else
        return 0;
  }

  CloseInfo(){
    this.infoUpdate = false;
  }

  OnKpiUpdate(kpidata:any){
    this.isValueUpdated = false;
    let comment = "actual";
    if(this.tabName.includes('Budget')){
      comment = "budget";
    }else if(this.tabName.includes('Actual')){
      comment = "actual";
    }
    else if(this.tabName.includes('Forecast')){
      comment = "forecast";
    }
    let datauditmodellog = {
      Description:"Manual",
      AttributeID: this.updateModel.attributeId,
      AttributeName: "Company KPIs",
      NewValue: ((this.updateModel.updatedVal == null  || this.updateModel.updatedVal==undefined) ? null : this.updateModel.updatedVal.toString()),
      MonthAndYear: this.updateModel.colName,
      fieldName: this.updateModel.rowName,
      portfolioCompanyId: this.model.portfolioCompanyID.toString(),
      comments: comment,
      KpiId: this.updateModel.kpiId,
      ModuleId : KPIModulesEnum.Company
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
            this.getPortfolioCompanies(null);
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

  OnKpiUpdateCancel(event:any){
    let objIndex = this.tableResult.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.tableResult[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearcellEdit();
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
      if (!ex.test(event.target.value)) {
        if (!Number.isInteger(Number(event.target.value) )) {
          event.target.value = parseFloat(event.target.value).toFixed(6);
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
  successToaster() {
    this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
  }
  kpiTable_GlobalFilter(event) {
    this.companyKpiValueUnit = event?.UnitType == undefined ? {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    } : event?.UnitType;
    this.searchFilter = event;
    this.getPortfolioCompanies(null);
    this.menuTrigger.closeMenu();
  }
  onConvertValueUnits(event:any)
  {
    
    this.companyKpiValueUnit=event;
    this.convertUnits();
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

  onChangePeriodOption(type){
    this.filterOptions.forEach((x) => (x.key = false));
    if(type?.field == "Monthly"){
      type.key = this.isMonthly = true;
      this.isQuarterly = false;
      this.isAnnually = false;
    } else if(type?.field == "Quarterly"){
      this.isMonthly = false;
      type.key = this.isQuarterly = true;
      this.isAnnually = false;
    } else{
      this.isMonthly = false;
      this.isQuarterly = false;
      if(type!=undefined)
        type.key = this.isAnnually = true;
    }
    this.setDefaultTypeTab();
    this.getPortfolioCompanies(null);
  }

  selectValueTab(tab: ITab) {
    this.tabValueTypeList.forEach((tab) => (tab.active = false));
    tab.active = true;
    this.tabName = tab.name;
    this.setPeriodsOptions(this.subSectionFields);
    this.getPortfolioCompanies(null);
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
    let periodOptions = this.filterOptionsCopy;
    let activeTabData = pageConfigTabs.find(x => x.aliasName == this.tabName);
    this.filterOptions = periodOptions.filter(item => activeTabData?.chartValue?.some(otherItem => otherItem === item.field));
    let periodType = this.filterOptions.find(x => x.key);
    if(periodType == undefined){
      for(const element of periodOptions){
        element.key = false;
      }
      if(this.filterOptions.length > 0)
      {
        this.filterOptions[0].key = true;
        periodType = this.filterOptions[0];
      }
    }
    this.onChangePeriodOption(periodType);
  }
  setDefaultTypeTab = () => {
    switch (true) {
      case this.isMonthly:
        this.defaultType = PeriodTypeFilterOptions.Monthly;
        break;
      case this.isQuarterly:
        this.defaultType = PeriodTypeFilterOptions.Quarterly;
        break;
        case this.isAnnually:
        this.defaultType = PeriodTypeFilterOptions.Annual;
        break;
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
