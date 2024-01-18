import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { MenuItem } from "primeng/api";
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { AccountService } from "../../../services/account.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { DecimalDigitEnum, ErrorMessage, ExportTypeEnum, FinancialValueUnitsEnum, MiscellaneousService, OrderTypesEnum, PeriodTypeQuarterEnum } from "../../../services/miscellaneous.service";
import { ActionsEnum, FeaturesEnum, KPIModulesEnum, PermissionService, UserSubFeaturesEnum } from "../../../services/permission.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { AuditService } from "src/app/services/audit.service";
import { Subscription, Observable, Subject} from 'rxjs';
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { filter } from "rxjs/operators";
import { Table } from "primeng/table";
import { CommonPCConstants, NumberDecimalConst } from "src/app/common/constants";
import { isNil } from "src/app/utils/utils";

@Component({
  selector: "portfolio-operational-kpi",
  templateUrl: "./portfolioCompany-detail.operational-KPI.html"
})
export class PortfolioOperationalKPIComponent implements OnInit, AfterViewInit {
  isTaabo:boolean = false;
  kpiModuleId = KPIModulesEnum.Operational;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  dataTable: any;
  message: any;
  id: any;
  searchFilter: any = null;
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
  blockedCompanyOperationalKPIValuesTable: boolean = false;
  portfolioCompanyOperationalKPIValuesDataTableList: any[];
  totalCompanyOperationalKPIValuesRecords: number;
  portfolioCompanyOperationalKPIValuesList: any[];
  portfolioCompanyOperationalKPIValuesListCol: any[];
  portfolioCompanyOperationalKPIValuesListClone: any[];
  isloadevent = false;
  exportCompanyKPILoading: boolean = false;
  CompanyKPIOrginalData: any[] = [];
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  ErrorNotation: boolean = false;
  infoUpdate: boolean = false;
  isLoader: boolean = false;
  isToasterMessage = false;
  search: string = "";
  operationalKPIFilterCols: any = [];
  companyKpiValueUnit: any;
  auditLogList: any = [];
  @ViewChild('dt') dt: Table | undefined;
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('operationalMenuTrigger') menuTrigger: MatMenuTrigger;
  NumberDecimalConst = NumberDecimalConst;
  tableColumns = [];
  tableFrozenColumns = [];
  tableResult = [];
  tableResultClone = [];
  isToggleChecked:boolean=false;
  isExeter:boolean = false;
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
    private permissionService: PermissionService
  ) {
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
  sourceURL: any;
  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.getPortfolioCompanyOperationalKPIValues(null);
    this.checkHost();
  }
  checkHost()
  {
    if(window.location.host == CommonPCConstants.TaaboHost)
    {
      this.isTaabo = true;
    }
    if(window.location.host == CommonPCConstants.ExeterHost)
    {
      this.isExeter = true;
    }
  }
  isNumberCheck(str: any) {
    return isNumeric(str);
  }
  exportOperationalKpiValues(event:any) {
    this.exportCompanyKPILoading = true;
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
    this.portfolioCompanyService
      .exportPCOperationalKPIList({
        PortfolioCompanyID: this.model?.portfolioCompanyID?.toString(),
        CompanyName:this.model.companyName.toString(),
        UnitTypeId:this.operationalKpiValueUnit?.typeId,
        unitType:this.operationalKpiValueUnit?.unitType,
        currency:this.model?.reportingCurrencyDetail?.currencyCode,
        paginationFilter: event,
        searchFilter: this.searchFilter,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
          this.exportCompanyKPILoading = false;
        },
        (error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
          this.exportCompanyKPILoading = false;
        }
      );
  }
  getPortfolioCompanyOperationalKPIValues(event: any) {
    this.isLoader = true;
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
    this.portfolioCompanyService
      .getPCOperationalKPIValues({
        PortfolioCompanyID: this.model?.portfolioCompanyID?.toString(),
        paginationFilter: event,
        searchFilter: this.searchFilter,
      })
      .subscribe(
        (result) => {
          this.isToggleChecked=false;
          this.ErrorNotation=false;
          this.isLoader = false;
          this.tableReload = true;
          this.tableColumns = result?.headers || [];
          this.tableFrozenColumns = this.frozenCols;
          this.tableResult = result?.rows || [];
          this.auditLogList = result?.operationalKpiAuditLog || [];
          this.tableResultClone = result?.rows || [];
          this.convertUnits()
          this.operationalKPIFilterCols = [...this.tableFrozenColumns, ...this.tableColumns];
        }, (error) => {
          this.isLoader = false;
          this.tableResult = [];
          this.tableResultClone = [];
          this.auditLogList = [];
        });

  }
  globalFilter: string = "";
  objCompanyKPIList: any = [];
  companyKPICols: any = [];
  modelOperationalKpi: any = {};
  portfolioCompanyCompanyKPIValuesList: any[];
  portfolioCompanyCompanyKPIValuesListClone: any[];
  companyValueUnitTable: FinancialValueUnitsEnum =
    FinancialValueUnitsEnum.Absolute;
  companyKpiSearchFilter: any;
  expandedCompanyKPIs: any[] = [];
  totalCompanyCompanyKPIValuesRecords: number;
  companyPeriodErrorMessage: string = "";

  companywiseKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  convertUnits() {
    this.tableResult = [];
    let companyValueUnit = this.operationalKpiValueUnit;
    let local = this;
    this.tableResultClone.forEach(function (
      value: any
    ) {
      const valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone["KPI Info"] != "%" && valueClone["KPI Info"] != "x" && valueClone["KPI Info"] != "#" &&
        valueClone["KPI Info"] != "Text" && valueClone["KPI Info"] != "" && valueClone.KPIValue != ""
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
  handleChange(e) {
    this.ErrorNotation = !this.ErrorNotation;
  }
  printColumn(rowData: any, field: any) {
    let auditList = this.auditLogList;
    let quarterData = field.field.split(' ');
    let result = auditList.filter(x => x.quarter == quarterData[0] && x.year == parseInt(quarterData[1]) && x.sectorId == parseInt(rowData.ValuesKpiId) && x.acutalAuditLog);
    if (result.length > 0) {
      return true;
    }
    else
      return false;
  }
  onAuditLog(rowData: any, field: any) {
    if (this.ErrorNotation && this.printColumn(rowData, field))
      this.router.navigate(["/audit-logs"], {
        state: { data: { KPI: "Operational KPIs", header: field.header, PortfolioCompanyID: this.model.portfolioCompanyID.toString(), AttributeName: rowData.KPI,AttributeId:this.getValues(rowData, field) } },
      });
  }
  onColumnEditComplete(index: any, col: any, rowData: any) {
    let prevVal = this.updateModel.previousVal;
    let currVal = rowData[col.field];
    if (!this.confirmUpdate  && currVal != prevVal) {
      this.updateModel.updatedVal = rowData[col.field];
      this.confirmUpdate = true;
    }
    else
      this.OnKpiUpdateCancel("");
  }
  onColumnEdit(event: any) {
    event.target.blur();
  }

  onEditInit(rowData: any, column: any) {
    if (!this.permissionService.checkUserPermission(this.subFeature.OperationalKPIs, ActionsEnum[ActionsEnum.canEdit], this.id)|| rowData?.IsFormula) {
      return;
    }
    if (Number(this.operationalKpiValueUnit.typeId) != FinancialValueUnitsEnum.Absolute && !this.ErrorNotation)
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
  CloseInfo() {
    this.infoUpdate = false;
  }
  OnKpiUpdate(kpidata: any) {
    let comment = "actual";
    let columName = this.updateModel.colName;
    if (this.updateModel.colName.includes('Budget')) {
      comment = "budget";
      columName = this.updateModel.colName.split('(Budget)')[1]?.trim();
    }
    let datauditmodellog = {
      Description: "Manual",
      AttributeID: this.updateModel.attributeId,
      AttributeName: "Operational KPIs",
      OldValue: ((this.updateModel.updatedVal == null  || this.updateModel.updatedVal == undefined) ? null : this.updateModel.updatedVal.toString()),
      MonthAndYear: columName,
      fieldName: this.updateModel.rowName,
      portfolioCompanyId: this.model.portfolioCompanyID.toString(),
      comments: comment,
      KpiId: this.updateModel.kpiId,
    };
    this.auditService
      .UpdateKPIData(datauditmodellog)
      .subscribe(
        (result) => {
          if (result.code != "InternalServerError") {
            this.isToasterMessage = true;
            this.tableReload = true;
            this.getPortfolioCompanyOperationalKPIValues(null);
            this.confirmUpdate = false;
            this.updateModel = {};
            this.successToaster();
          }
          else {
            this.OnKpiUpdateCancel("");
            this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
          }
        },
        (error) => {
          this.OnKpiUpdateCancel("");
          this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
        });
  }

  OnKpiUpdateCancel(event: any) {
    let objIndex = this.tableResult.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.tableResult[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearCellEdit();
  }

  clearCellEdit() {
    let objIndex = this.tableResult.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.tableResult[objIndex][`${this.updateModel.colName} editable`] = false;
    this.confirmUpdate = false;
    this.updateModel = {};
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
  onConvertValueUnits(event: any) {
    this.operationalKpiValueUnit = event;
    this.convertUnits();
  }
  compare = (objectA, objectB) => {
    return JSON.stringify(objectA) === JSON.stringify(objectB);
  }
  kpiTable_GlobalFilter(event) {   
    this.operationalKpiValueUnit=event?.UnitType==undefined?{
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    }:event?.UnitType;
    this.searchFilter = event;
    this.getPortfolioCompanyOperationalKPIValues(null);
    this.menuTrigger.closeMenu();
  }
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}
