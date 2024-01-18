import { MasterKpiService } from './../../../services/master-kpi.service';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { LazyLoadEvent } from "primeng/api";
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
import { ActionsEnum, FeaturesEnum,  UserSubFeaturesEnum , PermissionService} from "src/app/services/permission.service";
import { Observable, Subject, Subscription } from 'rxjs';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { AuditService } from "src/app/services/audit.service";
import { Table } from 'primeng/table';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { filter } from 'rxjs/operators';
import { NumberDecimalConst } from "src/app/common/constants";
@Component({
  selector: 'app-master-kpi',
  templateUrl: './master-kpi.component.html',
  styleUrls: ['./master-kpi.component.scss']
})
export class MasterKpiComponent implements OnInit,AfterViewInit {
  NumberDecimalConst = NumberDecimalConst;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  @Input() searchFilter:any=null;
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  @Input() modelList:any;
  dataTable: any;
  message: any;
  id: any;
  masterKPIs: any[];
  model: any = {};
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
  unitOfCurrency :string = FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions];
  auditToggle: boolean = false;
  @ViewChild('dt') dt: Table | undefined;
  updateModel: any = {};
  confirmUpdate = false;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  infoUpdate: boolean = false;
  ErrorNotation: boolean = false;
  isToasterMessage = false;
  ModuleName:string = "";
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('masterMenuTrigger') menuTrigger: MatMenuTrigger;
  ModuleCurrency: string;
  @Input() kpiName:string;
  exportMasterKPILoading: boolean = false;
  constructor(
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private _avRoute: ActivatedRoute,
    private masterKpiService:MasterKpiService,
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
  ngOnInit() {
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    this.getPortfolioCompanies();
    this.eventsSubscription = this.events?.subscribe((res) =>{
      this.searchFilter=res;
      this.getPortfolioCompanies();
    });
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }
  isNumberCheck(str: any) {
    return isNumeric(str);
  }
  getPortfolioCompanies() {
    this.getModuleName();
    this.isLoader = true;
    if (this.id != undefined) {
      this.loading = true;

      this.portfolioCompanyService
        .getPortfolioCompanyById({ Value: this.id })
        .subscribe(
          (result) => {
            let resp = result["body"];
            if (resp != null && result.code == "OK") {
              this.model = resp.companyDetails;
              this.portfolioInfoSectionModel.encryptedPortfolioCompanyId = this.model.encryptedPortfolioCompanyId;
              this.portfolioInfoSectionModel.portfolioCompanyID = this.model.portfolioCompanyID;
              this.getPortfolioCompanyMasterKPIValues(null, this.searchFilter);
            } else {
              if (resp.status != null && resp.status.message != "") {
                this.message = this.miscService.showAlertMessages(
                  "error",
                  resp.status.message
                );
              }
            }
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        );
    }
  }
  loadFinancialKPILazy(event: LazyLoadEvent) {
    this.getPortfolioCompanyMasterKPIValues(event, this.searchFilter);
  }
  convertMasterKPIValueUnits() {
    this.unitOfCurrency = this.masterKpiValueUnit.unitType;
    let financialValueUnitTable = this.masterKpiValueUnit;
    let portfolioCompanyMasterKPIValuesListlocal = [];
    this.portfolioCompanyMasterKPIValuesList = [];
    this.portfolioCompanyMasterKPIValuesListClone?.forEach(function (
      value: any
    ) {
      let valueClone = JSON.parse(JSON.stringify(value));
      if (
        valueClone.kpiInfo != "%" &&
        valueClone.kpiInfo != "x" &&
        valueClone.kpiInfo != "#" &&
        valueClone.kpiInfo != "Text" &&
        valueClone.kpiInfo != "" &&
        valueClone.kpiValue != "" &&
        valueClone.kpiValue != undefined &&
        valueClone.kpiValue != null &&
        valueClone.kpiValue != 0
      ) {
        let valueClone = JSON.parse(JSON.stringify(value));
        let val = valueClone.kpiValue;
        val = val == undefined ? "0" : val;
        val = val.toString().replace(",","");
        switch (Number(financialValueUnitTable.typeId)) {
          case FinancialValueUnitsEnum.Absolute:
            break;
          case FinancialValueUnitsEnum.Thousands:
            valueClone.kpiValue =
              !isNaN(parseFloat(valueClone.kpiValue)) &&
                !isNaN(parseFloat(valueClone.kpiValue)) && isNumeric(val)
                ? valueClone.kpiValue / 1000
                : valueClone.kpiValue;
            break;
          case FinancialValueUnitsEnum.Millions:
            valueClone.kpiValue =
              !isNaN(parseFloat(valueClone.kpiValue)) &&
                !isNaN(parseFloat(valueClone.kpiValue)) && isNumeric(val)
                ? valueClone.kpiValue / 1000000
                : valueClone.kpiValue;
            break;
          case FinancialValueUnitsEnum.Billions:
            valueClone.kpiValue =
              !isNaN(parseFloat(valueClone.kpiValue)) &&
                !isNaN(parseFloat(valueClone.kpiValue)) && isNumeric(val)
                ? valueClone.kpiValue / 1000000000
                : valueClone.kpiValue;
            break;
        }
      }
      portfolioCompanyMasterKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyMasterKPIValuesList = portfolioCompanyMasterKPIValuesListlocal;
    this.createMasterKPILayOut(
      this.portfolioCompanyMasterKPIValuesList
    );
    this.portfolioCompanyMasterKPIValuesList?.forEach(function (item) {
      item.fullMonth = item.quarterMonth + " " + item.year;
    });
  }
  getPortfolioCompanyMasterKPIValues(event: any, searchFilter: any) {
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
    this.financialKpiSearchFilter = searchFilter;
    this.masterKpiService
      .getMasterKPIValues({
        portfolioCompanyID: this.model.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
        moduleID:this.modelList.moduleId
      })
      .subscribe(
        (result) => {
          let resp = result;
          if (resp != null) {
            this.portfolioCompanyMasterKPIValuesList = resp.pcMasterKPIValueModels;

            this.portfolioCompanyMasterKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyMasterKPIValuesList)
            );
            this.convertMasterKPIValueUnits();

            this.expandedMasterKPIs = [];
            if (this.portfolioCompanyMasterKPIValuesList.length > 0) {
              this.expandedMasterKPIs.push(
                this.portfolioCompanyMasterKPIValuesList[0]
              );
            }
            this.totalMasterKPIValuesRecords = resp.pcMasterKPIValueModels.length;

          } else {
            this.portfolioCompanyMasterKPIValuesList = [];
            this.totalMasterKPIValuesRecords = 0;
            this.createMasterKPILayOut(
              this.portfolioCompanyMasterKPIValuesList
            );
          }
          this.tableReload = true;
          this.isLoader = false;
          if (this.isToasterMessage) {
            this.successToaster();
          }
          
        },
        (error) => {
          
          this.tableReload = true;
          this.isLoader = false;
        }
      );
  }
  createMasterKPILayOut(kpiModel: any) 
  {
    this.objMasterKPIList = [];
    this.objMasterKPIList.cols = [];
    this.objMasterKPIList.Results = [];
    let local = this;
    kpiModel.forEach(function (data: any) {
      let objKPI: any = {};
      let quarter = data.quarterMonth;
      if (local.objMasterKPIList.cols.length == 0) {
        local.objMasterKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      let kpiIndex = -1;
      local.objMasterKPIList.Results.every(function (
        elem: any,
        index: any
      ) {
        let kpiId = data.masterKpiID;
        let kpiName = data.kpi;
        let kpiNameWithInfo = data.kpi;
        if (data.kpiInfo != null && data.kpiInfo != "") {
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
      let list = local.objMasterKPIList.cols.filter(function (val: any) {
        return val.field == quarter + " " + data.year;
      });
      if (list == null || list.length == 0) {
        local.objMasterKPIList.cols.push({
          field: quarter + " " + data.year,
          header: quarter + " " + data.year,
        });
      }
      if (kpiIndex >= 0) {
        local.objMasterKPIList.Results[kpiIndex][
          quarter + " " + data.year
        ] =
          data.kpiInfo != "%"
            ? data.kpiValue
            : data.kpiValue === null
              ? data.kpiValue
              : data.kpiValue;
        local.objMasterKPIList.Results[kpiIndex][quarter + " " + data.year + " " + "auditlog"] = data.auditLog;
        local.objMasterKPIList.Results[kpiIndex][quarter + " " + data.year + " " + "AttributeID"] = data.pcMasterKpiValueID;
        local.objMasterKPIList.Results[kpiIndex][quarter + " " + data.year + " " + "editable"] = false;
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
        local.objMasterKPIList.Results.push(objKPI);
      }
    });

    this.objMasterKPIList.cols.splice(0, 1);
    this.masterKPICols.push.apply(this.masterKPICols, this.frozenCols);
    this.masterKPICols.push.apply(
      this.masterKPICols,
      this.objMasterKPIList.cols
    );
  }

  handleChange(e) {
    this.auditToggle = !this.auditToggle;
  }

  printColumn(rowData: any, field: any) {

    let result = rowData[field.header + " auditlog"];
    if (result !== undefined && result !== null) {
      return result;
    } else {
      let col = field.header.replace("(Actual)", "").trim();
      return rowData[col + " auditlog"];
    }
  }

  onAuditLog(rowData: any,field: any) {
  if (this.auditToggle && this.printColumn(rowData,field))
      this.router.navigate(["/audit-logs"], {
        state: { data: { KPI: this.ModuleName,AttributeName:rowData.KPI, header: field.header, ModuleId: this.modelList.moduleId, AttributeId: rowData[field.header + " AttributeID"],PortfolioCompanyID:this.model.portfolioCompanyID} },
      });
  }

  getModuleName(){//@Todo to fetch from backend
    if(this.modelList?.moduleId==1){
      this.ModuleName = "Trading Records";
      this.ModuleCurrency = this.modelList.reportingCurrencyDetail.currencyCode;
    }
    else if(this.modelList?.moduleId==2){
      this.ModuleName = "Credit KPI";
      this.ModuleCurrency = this.modelList.reportingCurrencyDetail.currencyCode;
    }
  }

  onColumnEditComplete(index: any, col: any, rowData: any) {
    let prevVal = this.updateModel.previousVal;
    let currVal = rowData[col.field];
    if (!this.confirmUpdate && currVal != prevVal) {
      this.updateModel.updatedVal = (rowData?.KpiInfo =="Text" || currVal == '') ?currVal :rowData[col.field]?.toString().indexOf(".") !== -1 ? rowData[col.field] : rowData[col.field];
      this.confirmUpdate = true;
    }
   else
     this.OnKpiUpdateCancel("");
  }

  OnKpiUpdateCancel(event: any) {
    let objIndex = this.objMasterKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objMasterKPIList.Results[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearCellEdit();
  }

  clearCellEdit() {
    let objIndex = this.objMasterKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    if(this.updateModel.colName!=undefined)
      this.objMasterKPIList.Results[objIndex][`${this.updateModel.colName} editable`] = false;
    this.confirmUpdate = false;
    this.updateModel = {};
  }

  validateNumber(event: any) {
    if (event.which != 15) {
      let ex: RegExp = new RegExp(/^-*\d*(?:[.,]\d{1,2})?$/);
      if (!ex.test(event.target.value)) {
        if (!Number.isInteger(Number(event.target.value))) {
          event.target.value = parseFloat(event.target.value).toFixed(2);
        }
      }
    }
  }
  validateMaxLength(event: any) {
    if (event.target.value.length == 28) return false;
    return true;
  }
  successToaster() {
    this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
  }

  onColumnEdit(event: any) {
    event.target.blur();
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
      this.updateModel.unit = rowData['KPIWithInfo'];
      this.updateModel.rowName = rowData.KPI;
      this.updateModel.attributeId = rowData[`${column.field} AttributeID`];
      this.updateModel.kpiId = rowData.KpiId;
      this.updateModel.previousVal = rowData[column.field];
      let objIndex = this.objMasterKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
      this.objMasterKPIList.Results[objIndex][`${column.field} editable`] = true;
    }
  }

  CloseInfo() {
    this.infoUpdate = false;
  }

  OnKpiUpdate() {
    let comment = "actual";
    let columName = this.updateModel.colName;
    if (columName !=undefined && this.updateModel?.colName?.includes('Budget')) {
      comment = "budget";
      columName = this.updateModel.colName.split('(Budget)')[1].trim();
    }
    if (this.updateModel.updatedVal !="" && columName !=undefined && this.updateModel?.unit?.includes("%")) {
      this.updateModel.updatedVal = parseFloat(this.updateModel?.updatedVal).toFixed(2);
    }
    let dataAuditModelLog = {
      Description:"Manual",
      AttributeName:"MasterKpis",
      AttributeID: this.updateModel.attributeId,
      ModuleId : this.modelList.moduleId,
      MonthAndYear: columName,
      fieldName: this.updateModel.rowName,
      comments: comment,
      KpiId:this.updateModel.kpiId,
      OldValue: ((this.updateModel.updatedVal == null || this.updateModel.updatedVal == '' || this.updateModel.updatedVal == undefined) ? null : this.updateModel.updatedVal.toString()),
      portfolioCompanyId: this.model.portfolioCompanyID,
    };
    this.auditService
      .UpdateKPIData(dataAuditModelLog)
      .subscribe(
        (result) => {
          if (result.code != "InternalServerError") {
            this.isToasterMessage = true;
            this.isLoader = true;
            this.getPortfolioCompanyMasterKPIValues(null, this.searchFilter);
            this.confirmUpdate = false;
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
  onConvertValueUnits(event:any)
  {
    this.masterKpiValueUnit=event;
    this.convertMasterKPIValueUnits();
  }
  kpiTable_GlobalFilter(event) {
    this.masterKpiValueUnit=event?.UnitType==undefined?{
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    }:event?.UnitType;
    this.searchFilter = event;
    this.getPortfolioCompanyMasterKPIValues(null, this.searchFilter);
    this.menuTrigger.closeMenu();
  }
  exportMasterKpiValues() {
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
      decimaPlace: this.modelMasterKpi.decimalPlaces.type,
      valueType: this.masterKpiValueUnit.typeId
    };
    this.exportMasterKPILoading = true;
    this.portfolioCompanyService
      .exportMasterKPIList({
        CompanyName: this.model.companyName,
        portfolioCompanyID: this.model.portfolioCompanyID.toString(),
        paginationFilter: event,
        searchFilter: this.financialKpiSearchFilter,
        kPIFilter: filter,
        moduleID:this.modelList?.moduleId
      })
      .subscribe(
        (response) => {
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

  convertToMillions() {
    if(this.masterKpiValueUnit.unitType == FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions]){
      this.unitOfCurrency = this.masterKpiValueUnit.unitType;
      let portfolioCompanyMasterKPIValuesListlocal = [];
      this.portfolioCompanyMasterKPIValuesList = [];
    this.portfolioCompanyMasterKPIValuesListClone.forEach(function (
      value: any
    ) {
      let valueClone = JSON.parse(JSON.stringify(value));
      let val = valueClone.kpiValue;
      val = val == undefined ? "0" : val;
      val = val.toString().replace(",","");
      if (
        valueClone.kpiInfo != "%" &&
        valueClone.kpiInfo != "x" &&
        valueClone.kpiInfo != "#" &&
        valueClone.kpiInfo != "Text" &&
        valueClone.kpiInfo != "" &&
        valueClone.kpiValue != "" &&
        valueClone.kpiValue != null &&
        valueClone.kpiValue != 0
      ) {
        valueClone.kpiValue =
        !isNaN(parseFloat(valueClone.kpiValue)) &&
          !isNaN(parseFloat(valueClone.kpiValue)) && isNumeric(val)
          ? valueClone.kpiValue / 1000000
          : valueClone.kpiValue;
      }
      portfolioCompanyMasterKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyMasterKPIValuesList = portfolioCompanyMasterKPIValuesListlocal;
    this.createMasterKPILayOut(
      this.portfolioCompanyMasterKPIValuesList
    );
    this.portfolioCompanyMasterKPIValuesList.forEach(function (item) {
      item.fullMonth = item.quarterMonth + " " + item.year;
    });
    } else if(this.masterKpiValueUnit.unitType == FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute]){
      this.clearCellEdit();
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
