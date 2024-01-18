import { Component, OnInit, ViewChild ,Input, AfterViewInit, EventEmitter} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MenuItem } from "primeng/api";
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
import { Observable, Subject, Subscription } from 'rxjs';
import { Table } from "primeng/table";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { filter } from "rxjs/operators";
import { NumberDecimalConst } from "src/app/common/constants";
@Component({
  selector: "portfolio-impact-kpi",
  templateUrl: "./portfolioCompany-ImpactKPI.component.html",
})
export class PortfolioCompanyImpactKPIComponent implements OnInit,AfterViewInit {
  kpiModuleId=KPIModulesEnum.Impact;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  dataTable: any;
  message: any;
  id: any;
  @ViewChild('dt') dt: Table | undefined;  
  searchFilter:any=null;
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  reportData: any = [];
  model: any = {};
  ddlModel: any = {
    operationalKPIList: [],
    selectedOperationalKPI: "",
    financialKPIList: [],
    selectedFinancialKPI: "",
    investmentKPIList: [],
    selectedInvestmentKPI: "",
    companyKPIList: [],
    selectedCompanyKPI: "",
  };
  headquarterLocation: any;
  msgTimeSpan: number;
  loading = false;
  blockedProfitabilityTable: boolean = false;
  portfolioProfitabilityList: any = [];
  portfolioCompanyProfitabilityClone: any[] = [];
  totalProfitabilityRecords: number = 0;
  portfolioCompanyOperationalKPIValuesList: any[];
  portfolioCompanyOperationalKPIValuesDataTable: any[];
  portfolioCompanyOperationalKPIValuesListCol: any[];
  totalCompanyOperationalKPIValuesRecords: number;
  blockedCompanyOperationalKPIValuesTable: boolean = false;
  expandedOperationalKPIs: any[] = [];
  pagerLength: any;
  financialReport_AsOfDate: any;
  operationalReport_AsOfDate: any;
  impactKpiValueUnit: any;
  exportItems: MenuItem[];
  exportLoading: boolean = false;

  exportImpactKPILoading: boolean = false;

  ErrorNotation: boolean = false;

  confirmUpdate = false;
  tableReload = false;
  NumberDecimalConst = NumberDecimalConst;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  infoUpdate: boolean = false;
  isLoader: boolean = false;
  isToasterMessage = false;
  updateModel: any = {};
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('impactMenuTrigger') menuTrigger: MatMenuTrigger; 
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

    this.modelImpactKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.modelImpactKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelImpactKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };

    this.impactKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
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

  portfolioCompanyCommentaryDetails: any;
  getPortfolioCompanies() {
    this.isLoader = true;
    if (this.id != undefined) {
      this.loading = true;

      this.portfolioCompanyService
        .getPortfolioCompanyById({ Value: this.id })
        .subscribe(
          (result) => {
            let resp = result["body"];

            if (resp != null && result.code == "OK") {
              this.model = resp;
              this.portfolioCompanyCommentaryDetails =
                result.body.commentaryData;

              this.portfolioInfoSectionModel.encryptedPortfolioCompanyId = this.model.encryptedPortfolioCompanyId;
              this.portfolioInfoSectionModel.portfolioCompanyID = this.model.portfolioCompanyID;

              this.getPortfolioCompanyImpactKPIValues(null,  this.searchFilter);
            } else {
              if (resp?.status != null && resp?.status?.message != "") {
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

  globalFilter: string = "";

  /***************Impact KPI*************[Start]******************/

  objImpactKPIList: any = [];
  impactKPICols: any = [];
  modelImpactKpi: any = {};
  portfolioCompanyImpactKPIValuesList: any[];
  portfolioCompanyImpactKPIValuesListClone: any[];
  impactValueUnitTable: FinancialValueUnitsEnum =
    FinancialValueUnitsEnum.Absolute;
  impactKpiSearchFilter: any;
  expandedImpactKPIs: any[] = [];
  totalCompanyImpactKPIValuesRecords: number;

  impactKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];

  convertImpactKPIValueUnits() {
    let impactValueUnitTable = this.impactKpiValueUnit;
    let portfolioCompanyImpactKPIValuesListlocal = [];
    this.portfolioCompanyImpactKPIValuesList = [];
    this.portfolioCompanyImpactKPIValuesListClone?.forEach(function (
      value: any
    ) {
      let childPCImpactKPIQuarterlyValueModelListLocal = [];
      let valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone.pcImpactKPIQuarterlyValueModel != null) {
        if (
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "%" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "x" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "#" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiInfo != "" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue != "" &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue != undefined &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue != null &&
          valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue != 0 
        ) {
          switch (Number(impactValueUnitTable.typeId)) {
            case FinancialValueUnitsEnum.Absolute:
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  let childValueClone = JSON.parse(JSON.stringify(childValue));
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;

              break;
            case FinancialValueUnitsEnum.Thousands:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  let childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
            case FinancialValueUnitsEnum.Millions:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  let childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
            case FinancialValueUnitsEnum.Billions:
              if (
                valueClone.pcImpactKPIQuarterlyValueModel != null &&
                valueClone.pcImpactKPIQuarterlyValueModel.length != 0
              )
                valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue =
                  valueClone.pcImpactKPIQuarterlyValueModel.kpiActualValue /
                  1000000000;
              valueClone.childPCImpactKPIQuarterlyValueModelList.forEach(
                function (childValue: any) {
                  let childValueClone = JSON.parse(JSON.stringify(childValue));
                  childValueClone.kpiActualValue =
                    childValueClone.kpiActualValue / 1000000000;
                  childPCImpactKPIQuarterlyValueModelListLocal.push(
                    childValueClone
                  );
                }
              );
              valueClone.childPCImpactKPIQuarterlyValueModelList = childPCImpactKPIQuarterlyValueModelListLocal;
              break;
          }
        }
      }
      portfolioCompanyImpactKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyImpactKPIValuesList = portfolioCompanyImpactKPIValuesListlocal;
    this.createImpactKPILayOut(this.portfolioCompanyImpactKPIValuesList);
    this.portfolioCompanyImpactKPIValuesList.forEach(function (item) {
      item.fullMonth =
        item?.pcImpactKPIQuarterlyValueModel?.quarter +
        " " +
        item.pcImpactKPIQuarterlyValueModel?.year;
    });
  }

  getPortfolioCompanyImpactKPIValues(event: any, searchFilter: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "ImpactKPI.KPI",
        multiSortMeta: this.impactKPIMultiSortMeta,
        sortOrder: -1,
      };
    }
    if (searchFilter == null) {
      let sortOrder =
        this.modelImpactKpi.orderType.type == OrderTypesEnum.LatestOnRight
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
        periodType: this.modelImpactKpi.periodType.type,
      };
      if (searchFilter.periodType == "Date Range") {
        searchFilter.startPeriod = new Date(
          Date.UTC(
            this.modelImpactKpi.startPeriod.getFullYear(),
            this.modelImpactKpi.startPeriod.getMonth(),
            this.modelImpactKpi.startPeriod.getDate()
          )
        );
        searchFilter.endPeriod = new Date(
          Date.UTC(
            this.modelImpactKpi.endPeriod.getFullYear(),
            this.modelImpactKpi.endPeriod.getMonth(),
            this.modelImpactKpi.endPeriod.getDate()
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
    this.impactKpiSearchFilter = searchFilter;
    this.portfolioCompanyService
      .getPortfolioCompanyImpactKPIValues({
        portfolioCompanyID: this.model.companyDetails?.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
      })
      .subscribe(
        (result) => {
          let resp = result;
          if (resp != null && resp.code == "OK") {
            this.portfolioCompanyImpactKPIValuesList = resp.body;
            this.portfolioCompanyImpactKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyImpactKPIValuesList)
            );
            this.convertImpactKPIValueUnits();

            this.expandedImpactKPIs = [];
            if (this.portfolioCompanyImpactKPIValuesList.length > 0) {
              this.expandedImpactKPIs.push(
                this.portfolioCompanyImpactKPIValuesList[0]
              );
            }
            this.totalCompanyImpactKPIValuesRecords = resp.body?.totalRecords;
            
          } else {
            
            this.portfolioCompanyImpactKPIValuesList = [];
            this.totalCompanyImpactKPIValuesRecords = 0;
            this.createImpactKPILayOut(
              this.portfolioCompanyImpactKPIValuesList
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
  createImpactKPILayOut(kpiModel: any) {
    this.objImpactKPIList = [];
    this.objImpactKPIList.cols = [];
    this.objImpactKPIList.Results = [];
    let local = this;

    this.createColumnForImpactKPI(kpiModel);
    kpiModel.forEach(function (data: any) {
      let objKPI: any = {};
      let parent = data.pcImpactKpiQuarterlyValueModel;
      let child = data.childPCImpactKPIQuarterlyValueModelList;

      if (parent?.impactKPI.kpi != "") {
        let quarter = parent?.quarter;

        let kpiIndex = -1;
        local.objImpactKPIList.Results.every(function (elem: any, index: any) {
          let kpiName = parent.impactKPI.kpi;
          let kpiId = parent.impactKPI.impactKPIId;
          let kpiNameWithInfo = parent.impactKPI.kpi;
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            kpiName = kpiName;
            kpiNameWithInfo = kpiName + " (" + parent.kpiInfo + ")";
          }
          if (elem.KpiId === kpiId && elem.KPIWithInfo === kpiNameWithInfo) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          if (parent?.kpiInfo != null && parent.kpiInfo != "") {
            objKPI["KPI"] = parent.impactKPI.kpi;
            objKPI["KPIWithInfo"] =
              parent.impactKPI.kpi + " (" + parent.kpiInfo + ")";
          } else {
            objKPI["KPI"] = parent?.impactKPI.kpi;
            objKPI["KPIWithInfo"] = parent?.impactKPI.kpi;
          }
          objKPI["KpiId"] = parent?.impactKPI.impactKPIId;
          objKPI["KpiInfo"] = parent?.kpiInfo;
          objKPI["IsParent"] = parent?.impactKPI.isParent;

        }
        if (quarter != undefined) {
          let list = local.objImpactKPIList.cols.filter(function (val: any) {
            return val.field == quarter + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objImpactKPIList.cols.push({
              field: quarter + " " + parent.year,
              header: quarter + " " + parent.year,
            });
          }

          if (kpiIndex >= 0) {
            local.objImpactKPIList.Results[kpiIndex][
              quarter + " " + parent.year
            ] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue / 100;

            local.objImpactKPIList.Results[kpiIndex][
              quarter + " " + parent.year + " " + "auditlog"
            ] = parent.auditLog;

            local.objImpactKPIList.Results[kpiIndex]["" + quarter + " " + data.pcImpactKPIQuarterlyValueModel?.year + " " + "AttributeID"] = data.pcImpactKPIQuarterlyValueModel?.pcImpactKPIQuarterlyValueID;
            local.objImpactKPIList.Results[kpiIndex]["" + quarter + " " + data.pcImpactKPIQuarterlyValueModel?.year + " " + "editable"] = false;
          } else {
            objKPI[quarter + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue / 100;

            objKPI[quarter + " " + parent.year + " " + "auditlog"] =
              parent.auditLog;

              objKPI["" + quarter + " " + data.pcImpactKPIQuarterlyValueModel?.year + " " + "AttributeID"] = data.pcImpactKPIQuarterlyValueModel?.pcImpactKPIQuarterlyValueID;
              objKPI["" + quarter + " " + data.pcImpactKPIQuarterlyValueModel?.year + " " + "editable"] = false;
            local.objImpactKPIList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objImpactKPIList.Results.push(objKPI);
          }
        }
      }

      if (child.length > 0) {
        let childCounter = 1;
        child.forEach(function (childData: any) {
          let quarter = childData.quarter;
          objKPI = {};
          let childKpiIndex = -1;
          let parentKPIIndex = -1;
          local.objImpactKPIList.Results.every(function (
            elem: any,
            index: any
          ) {
            let kpiName = childData.impactKPI.kpi;
            let kpiId = childData.impactKPI.impactKPIId;
            let kpiNameWithInfo = childData.impactKPI.kpi;
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              kpiNameWithInfo =
                "-" + kpiNameWithInfo + " (" + childData.kpiInfo + ")";
            } else {
              kpiNameWithInfo = "-" + kpiNameWithInfo;
            }
            if (
              elem.KpiId == kpiId &&
              elem.ParentKPI == childData.impactKPI.parentId &&
              elem.KPIWithInfo == kpiNameWithInfo
            ) {
              childKpiIndex = index;
              return false;
            }

            return true;
          });

          if (childKpiIndex == -1) {
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              objKPI["KPI"] = "-" + childData.impactKPI.kpi;
              objKPI["KPIWithInfo"] =
                "-" +
                childData.impactKPI.kpi +
                " (" +
                childData.kpiInfo +
                ")";
              objKPI["originalKPI"] = childData.impactKPI.kpi;
            } else {
              objKPI["KPI"] = "-" + childData.impactKPI.kpi;
              objKPI["originalKPI"] = childData.impactKPI.kpi;
              objKPI["KPIWithInfo"] = "-" + childData.impactKPI.kpi;
            }
            objKPI["ParentKPI"] = childData.impactKPI.parentId;
            objKPI["KpiInfo"] = childData.kpiInfo;
            objKPI["KpiId"] = childData.impactKPIID;
            objKPI["IsParent"] = childData.impactKPI.isParent;
          }
          let list = local.objImpactKPIList.cols.filter(function (val: any) {
            return val.field == quarter + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objImpactKPIList.cols.push({
              field: quarter + " " + childData.year,
              header: quarter + " " + childData.year,
            });
          }

          if (childKpiIndex >= 0) {
            local.objImpactKPIList.Results[childKpiIndex][
              quarter + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue / 100;
            local.objImpactKPIList.Results[childKpiIndex][
              quarter + " " + childData.year + " " + "auditlog"
            ] = childData.auditLog;

            local.objImpactKPIList.Results[childKpiIndex]["" + quarter + " " + childData.year + " " + "AttributeID"] = childData.pcImpactKPIQuarterlyValueID;
            local.objImpactKPIList.Results[childKpiIndex]["" + quarter + " " + childData.year + " " + "editable"] = false;
          } else {
            objKPI[quarter + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue / 100;

            objKPI[quarter + " " + childData.year + " " + "auditlog"] =
              childData.auditLog;
            objKPI["" + quarter + " " + childData.year + " " + "AttributeID"] = childData.pcImpactKPIQuarterlyValueID;
            objKPI["" + quarter + " " + childData.year + " " + "editable"] = false;
            local.objImpactKPIList.Results.forEach(function (
              elem: any,
              index: any
            ) {
              if (objKPI.ParentKPI == elem.KpiId) {
                parentKPIIndex = index;
              }
            });
            if (parentKPIIndex > -1) {
              local.objImpactKPIList.Results.splice(
                parentKPIIndex + childCounter,
                0,
                objKPI
              );
              childCounter++;
            } else {
              local.objImpactKPIList.Results.push(objKPI);
            }
          }
        });
      }
    });

    this.objImpactKPIList.cols.splice(0, 1);
    this.objImpactKPIList.cols.sort(this.sortByQuarterYear);
    this.impactKPICols.push.apply(this.impactKPICols, this.frozenCols);
    this.impactKPICols.push.apply(
      this.impactKPICols,
      this.objImpactKPIList.cols
    );
  }
  sortByQuarterYear(lhs: any, rhs: any) {
    let quarterToMonthMap = {
      Q1: 0,
      Q2: 3,
      Q3: 6,
      Q4: 9,
    };
    let lhsQuarterYear = lhs.field.split(" ");
    let rhsQuarterYear = rhs.field.split(" ");
    let lMonth = quarterToMonthMap[lhsQuarterYear[0]];
    let rMonth = quarterToMonthMap[rhsQuarterYear[0]];
    let lhsDate = new Date(lhsQuarterYear[1], lMonth);
    let rhsDate = new Date(rhsQuarterYear[1], rMonth);
    return lhsDate.getTime() - rhsDate.getTime();
  }

  createColumnForImpactKPI(kpiModel: any) {
    let local = this;
    kpiModel.forEach(function (data: any) {
      let parent = data.pcImpactKPIQuarterlyValueModel;
      let quarter = parent?.quarter;
      if (local.objImpactKPIList.cols.length == 0) {
        local.objImpactKPIList.cols.push({ field: "KPI", header: "KPI" });
      }
      if (quarter != undefined) {
        let list = local.objImpactKPIList.cols.filter(function (val: any) {
          return val.field == quarter + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objImpactKPIList.cols.push({
            field: quarter + " " + parent.year,
            header: quarter + " " + parent.year,
          });
        }
      }
    });
  }

  exportImpactKpiValues() {
    let event = {
      first: 0,
      rows: 1000,
      globalFilter: null,
      sortField: "ImpactKPI.KPI",
      multiSortMeta: this.financialKPIMultiSortMeta,
      sortOrder: -1,
    };
    let filter = {
      currency: this.model.reportingCurrencyDetail?.currency,
      decimaPlace: this.modelImpactKpi?.decimalPlaces?.type,
      valueType: this.impactKpiValueUnit?.typeId,
    };
    this.exportImpactKPILoading = true;
    this.portfolioCompanyService
      .exportImpactKPIList({
        portfolioCompanyDetail: { companyName: this.model.companyName },
        portfolioCompanyID: this.model.portfolioCompanyID?.toString(),
        paginationFilter: event,
        searchFilter: this.impactKpiSearchFilter,
        kPIFilter: filter,
      })
      .subscribe(
        (response) => {
          this.miscService.downloadExcelFile(response);
          this.exportImpactKPILoading = false;
        },
        (error) => {
          this.exportImpactKPILoading = false;
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
  printColumn(rowData: any, field: any) {
    if (rowData["IsParent"]) return false;
    let result = rowData[field.header + " auditlog"];
    if (result !== undefined && result !== null) {
      return result;
    } else {
      let col = field.header.replace("(Actual)", "").trim();
      result = rowData[col + " auditlog"];
      return result;
    }
  }
  onAuditLog(rowData: any, field: any) {
    if (this.ErrorNotation && this.printColumn(rowData, field))
      this.router.navigate(["/audit-logs"], {
        state: {
          data: {
            KPI: "Impact KPI",
            header: field.header,
            PortfolioCompanyID: this.model.portfolioCompanyID,
            AttributeName: rowData.KPI.startsWith("-") ? rowData.KPI.substring(1) : rowData.KPI,
            AttributeId:rowData[`${field.field} AttributeID`]
          },
        },
      });
  }
  onEditInit(rowData: any, column: any) {
    if(!this.permissionService.checkUserPermission(this.subFeature.ImpactKPIs,ActionsEnum[ActionsEnum.canEdit],this.id)){
      return;
    }
    if (Number(this.impactKpiValueUnit.typeId) != FinancialValueUnitsEnum.Absolute && !this.ErrorNotation)
      this.infoUpdate = true;
    else if (!this.ErrorNotation && this.tableReload) {
      this.updateModel.colName = column.field;
      this.updateModel.header = column.header;
      this.updateModel.unit = rowData['KPIWithInfo'];
      this.updateModel.rowName = rowData.ParentKPI === undefined ? rowData.KPI : rowData.originalKPI;
      this.updateModel.attributeId = rowData[`${column.field} AttributeID`];
      this.updateModel.kpiId = rowData.KpiId;
      this.updateModel.previousVal = rowData[column.field];
      let objIndex = this.objImpactKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
      this.objImpactKPIList.Results[objIndex][`${column.field} editable`] = true;
    }
  }

  CloseInfo() {
    this.infoUpdate = false;
  }

  OnKpiUpdate(kpidata: any) {
    let comment = "actual";
    let columName = this.updateModel.colName;
    if (this.updateModel.colName.includes('Budget')) {
      comment = "budget";
      columName = this.updateModel.colName.split('(Budget)')[1].trim();
    }
    if (this.updateModel.unit.includes("%")) {
      this.updateModel.updatedVal *= 100;
      this.updateModel.updatedVal = this.updateModel.updatedVal.toFixed(2);
    }
    let datauditmodellog = {
      Description:"Manual",
      AttributeID: this.updateModel.attributeId,
      AttributeName: "Impact KPI",
      OldValue: ((this.updateModel.updatedVal == null || this.updateModel.updatedVal == '' || this.updateModel.updatedVal == undefined) ? null : this.updateModel.updatedVal.toString()),
      MonthAndYear: columName,
      fieldName: this.updateModel.rowName,
      portfolioCompanyId: this.model.portfolioCompanyID,
      comments: comment,
    };
    this.auditService
      .UpdateKPIData(datauditmodellog)
      .subscribe(
        (result) => {
          if (result.code != "InternalServerError") {
            this.isToasterMessage = true;
            this.isLoader = true;
            this.getPortfolioCompanyImpactKPIValues(null, this.searchFilter);
            this.confirmUpdate = false;
            this.updateModel = {};
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
    let objIndex = this.objImpactKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objImpactKPIList.Results[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearcellEdit();
  }

  clearcellEdit() {
    let objIndex = this.objImpactKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objImpactKPIList.Results[objIndex][`${this.updateModel.colName} editable`] = false;
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
    if (event.target.value.length == 15) return false;
    return true;
  }

  successToaster() {
    this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
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
  onConvertValueUnits(event:any)
  {
    this.impactKpiValueUnit=event;
    this.convertImpactKPIValueUnits();
  }
  kpiTable_GlobalFilter(event) {
    this.searchFilter = event;
    this.getPortfolioCompanies();
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
