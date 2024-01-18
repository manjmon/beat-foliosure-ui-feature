import { Component, OnInit, ViewChild, Input, EventEmitter, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerService } from "ngx-spinner";
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { AccountService } from "../../services/account.service";
import {
  DecimalDigitEnum,
  ErrorMessage,
  ExportTypeEnum,
  FinancialValueUnitsEnum,
  MiscellaneousService,
  OrderTypesEnum,
  PeriodTypeQuarterEnum,
} from "../../services/miscellaneous.service";
import { ActionsEnum, FeaturesEnum, KPIModulesEnum, PermissionService, UserSubFeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { AuditService } from "src/app/services/audit.service";
import { Table } from "primeng/table";
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from "rxjs/operators";
import { CommonPCConstants, NumberDecimalConst } from "src/app/common/constants";
import { isNil } from "src/app/utils/utils";
@Component({
  selector: "portfolio-investment-kpi",
  templateUrl: "./portfolioCompany-InvestmentKPI.component.html",
})
export class PortfolioCompanyInvestmentKPIComponent implements OnInit, AfterViewInit {
  kpiModuleId = KPIModulesEnum.Investment;
  globalFilter: string = "";
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
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
  @Input() model: any = {};
  NumberDecimalConst = NumberDecimalConst
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
  ErrorNotation: boolean = false;
  checked: boolean = false;
  confirmUpdate = false;
  tableReload = false;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  infoUpdate: boolean = false;
  isLoader: boolean = false;
  isToasterMessage = false;
  updateModel: any = {};
  unitOfCurrency = FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions];
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('investmentMenuTrigger') menuTrigger: MatMenuTrigger;
  tableColumns = [];
  tableFrozenColumns = [];
  tableResult = [];
  tableResultClone = [];
  isToggleChecked: boolean = false;
  auditLogList = [];
  investmentKPIFilterCols = [];
  isExeter:boolean = false;
  @Input() ddlModel:any=[]
  isValueUpdated = false;
  constructor(
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private _avRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router,
    private toastrService: ToastrService,
    private auditService: AuditService,
    private permissionService: PermissionService,
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.pagerLength = this.miscService.getSmallPagerLength();

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
  sourceURL: any;
  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    this.getPortfolioCompanyInvestmentKPIValues(null, this.searchFilter);
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    if(window.location.host == CommonPCConstants.ExeterHost)
		{
		  this.isExeter = true;
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
  exportInvestmentKpiValues() {
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "InvestmentKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1,
    };
    let filter = {
      currency: this.model?.fundReportingCurrency?.currencyCode,
      decimaPlace: this.modelInvestmentKpi.decimalPlaces.type,
      valueType: this.investmentKpiValueUnit.typeId,
    };
    this.exportInvestmentKPILoading = true;
    this.portfolioCompanyService
      .exportInvestmentKPIList({
        portfolioCompanyID: this.model.portfolioCompanyID?.toString(),
        paginationFilter: event,
        searchFilter: this.financialKpiSearchFilter,
        kPIFilter: filter,
        CompanyName:this.model.companyName?.toString(),
        UnitTypeId:this.investmentKpiValueUnit?.typeId,
        unitType:this.investmentKpiValueUnit?.unitType,
        currency:this.model.reportingCurrencyDetail?.currencyCode,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
          this.exportInvestmentKPILoading = false;
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

  OnInvestmentKPIChange() {
    this.InvestmentKPIChartData = [];

    if (this.InvestmentKPIChartData.length > 0) {
      this.InvestmentKPIUnit = this.InvestmentKPIChartData[0]["Info"];
    }
  }

  modalOption: NgbModalOptions = {};
  currentModelRef: any;
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  objInvestmentKPIList: any = [];
  investmentKPICols: any = [];
  modelInvestmentKpi: any = {};
  financialKpiSearchFilter: any;

  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  getPortfolioCompanyInvestmentKPIValues(event: any, searchFilter: any) {
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
    this.portfolioCompanyService.getPCInvestmentKPIValues({
      portfolioCompanyID: this.model.portfolioCompanyID,
      paginationFilter: event,
      searchFilter: searchFilter,
    })
      .subscribe(
        (result) => {
          this.isToggleChecked = false;
          this.ErrorNotation = false;
          this.tableReload = true;
          this.tableColumns = result?.headers || [];
          this.tableFrozenColumns = this.frozenCols;
          this.tableResult = result?.rows || [];
          this.auditLogList = result?.kpiAuditLog || [];
          this.tableResultClone = result?.rows || [];
          this.convertUnits();
          this.investmentKPIFilterCols = [...this.tableFrozenColumns, ...this.tableColumns];
          this.isLoader = false;
        }, (error) => {
          this.isLoader = false;
          this.tableResult = [];
          this.tableResultClone = [];
          this.auditLogList = [];
        });
  }
  convertUnits() {
    this.tableResult = [];
    let companyValueUnit = this.investmentKpiValueUnit;
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
                !isNil(valueClone[col.field]) ? !isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1 ? valueClone[col.field].replace(/,/g, '') : valueClone[col.field])))
                  ? (valueClone[col.field].indexOf(',') > -1 ? valueClone[col.field].replace(/,/g, '') : valueClone[col.field]) / 1000
                  : valueClone[col.field] : valueClone[col.field];
              }
            });
            break;
          case FinancialValueUnitsEnum.Millions:
            local.tableColumns.forEach((col: any, index: any) => {
              if(valueClone[col.field] != 0){
                valueClone[col.field] =
                !isNil(valueClone[col.field]) ? !isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1 ? valueClone[col.field].replace(/,/g, '') : valueClone[col.field])))
                  ? (valueClone[col.field].indexOf(',') > -1 ? valueClone[col.field].replace(/,/g, '') : valueClone[col.field]) / 1000000
                  : valueClone[col.field] : valueClone[col.field];
              }
            });
            break;
          case FinancialValueUnitsEnum.Billions:
            local.tableColumns.forEach((col: any, index: any) => {
              if(valueClone[col.field] != 0){
                valueClone[col.field] =
                !isNil(valueClone[col.field]) ? !isNaN(parseFloat((valueClone[col.field].indexOf(',') > -1 ? valueClone[col.field].replace(/,/g, '') : valueClone[col.field])))
                  ? (valueClone[col.field].indexOf(',') > -1 ? valueClone[col.field].replace(/,/g, '') : valueClone[col.field]) / 1000000000
                  : valueClone[col.field] : valueClone[col.field];
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
    let result = auditList.filter(x => x.quarter == quarterData[0] && x.year == parseInt(quarterData[1]) && x.kpiId == parseInt(rowData.ValuesKpiId) && x.acutalAuditLog);
    if (result.length > 0) {
      return true;
    }
    else
      return false;
  }
  onAuditLog(rowData: any, field: any) {
    if (this.ErrorNotation && this.printColumn(rowData, field))
      this.router.navigate(["/audit-logs"], {
        state: { data: { KPI: "Investment KPIs", header: field.header, PortfolioCompanyID: this.model.portfolioCompanyID.toString(), AttributeName: rowData.KPI,AttributeId:this.getValues(rowData, field) } },
      });
  }
  onColumnEditComplete(index: any, col: any, rowData: any) {
    let prevVal = this.updateModel.previousVal;
    let currVal = rowData[col.field];
    if (!this.confirmUpdate && currVal != prevVal) {
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
    if (!this.permissionService.checkUserPermission(this.subFeature.OperationalKPIs, ActionsEnum[ActionsEnum.canEdit], this.id) || rowData?.IsFormula) {
      return;
    }
    if (Number(this.investmentKpiValueUnit.typeId) != FinancialValueUnitsEnum.Absolute && !this.ErrorNotation)
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
    let quarterData = column.field?.split(' ');
    let result = auditList.filter(x => x.quarter == quarterData[0] && x.year == parseInt(quarterData[1]) && x.kpiId == rowdata.ValuesKpiId);
    if (result.length > 0) {
      return result[0].valuesIdentityId;
    }
    else
      return 0;
  }
  CloseInfo() {
    this.infoUpdate = false;
  }
  OnKpiUpdate(kpidata: any) {
    this.isValueUpdated = false;
    let comment = "actual";
    let columName = this.updateModel.colName;
    if (this.updateModel.colName.includes('Budget')) {
      comment = "budget";
      columName = this.updateModel.colName.split('(Budget)')[1].trim();
    }
    let datauditmodellog = {
      Description: "Manual",
      AttributeID: this.updateModel.attributeId,
      AttributeName: "Investment KPIs",
      OldValue: ((this.updateModel.updatedVal == null || this.updateModel.updatedVal == undefined) ? null : this.updateModel.updatedVal.toString()),
      MonthAndYear: columName,
      fieldName: this.updateModel.rowName,
      portfolioCompanyId: this.model.portfolioCompanyID.toString(),
      comments: comment,
      KpiId: this.updateModel.kpiId
    };
    this.auditService
      .UpdateKPIData(datauditmodellog)
      .subscribe(
        (result) => {
          if (result.code != "InternalServerError") {
            this.isValueUpdated = true;
            this.isToasterMessage = true;
            this.tableReload = true;
            this.getPortfolioCompanyInvestmentKPIValues(null, this.searchFilter);
            this.confirmUpdate = false;
            this.updateModel = {};
            this.successToaster();
          }
          else {
            this.isValueUpdated = false;
            this.OnKpiUpdateCancel("");
            this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
          }
        },
        (error) => {
          this.isValueUpdated = false;
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
  onConvertValueUnits(event: any) {
    this.investmentKpiValueUnit = event;
  }
  kpiTable_GlobalFilter(event) {
    this.investmentKpiValueUnit = event?.UnitType == undefined ? {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    } : event?.UnitType;
    this.searchFilter = event;
    this.getPortfolioCompanyInvestmentKPIValues(null, this.searchFilter);
    this.menuTrigger.closeMenu();
    this.checked = false;
  }
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}
