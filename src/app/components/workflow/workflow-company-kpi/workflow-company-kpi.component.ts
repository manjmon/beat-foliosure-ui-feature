import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, EventEmitter, Output } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { isNumeric } from '@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric';
import { filter } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { AuditService } from 'src/app/services/audit.service';
import { DecimalDigitEnum, ErrorMessage, ExportTypeEnum, FinancialValueUnitsEnum, MiscellaneousService, OrderTypesEnum, PeriodTypeQuarterEnum } from 'src/app/services/miscellaneous.service';
import { ActionsEnum, FeaturesEnum, PermissionService, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { WorkflowCompanyService } from 'src/app/services/workflow-company.service';

@Component({
  selector: 'app-workflow-company-kpi',
  templateUrl: './workflow-company-kpi.component.html',
  styleUrls: ['./workflow-company-kpi.component.scss']
})
export class WorkflowCompanyKpiComponent implements OnInit, OnChanges {
  isOpenUpload: boolean = false;
  showCompany: boolean = false;
  @Input() dataInformation = [];
  @Input() model:any;
  mappingId: number = 0;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;

  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('companyMenuTrigger') menuTrigger: MatMenuTrigger;
  feature: typeof FeaturesEnum = FeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  exportType: typeof ExportTypeEnum = ExportTypeEnum;
  dataTable: any;
  message: any;
  searchFilter: any = null;
  @ViewChild('dt') dt: Table | undefined;
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>; id: any;
  frozenCols: any = [{ field: "KPI", header: "KPI" }];
  financialKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  companyKPIs: any[];
  items: MenuItem[];
  ddlModel: any = {
    companyKPIList: [],
    selectedCompanyKPI: "",
  };
  updateModel: any = {};
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
  isLoader: boolean = false;
  isToasterMessage = false;
  globalFilter: string = "";
  objCompanyKPIList: any = [];
  companyKPICols: any = [];
  modelCompanyKpi: any = {};
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
  sourceURL: any;
  @Output() onStatusChanges: EventEmitter<any> = new EventEmitter();
  constructor(private auditService: AuditService,
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private workflowCompanyService:WorkflowCompanyService,
    private toastrService: ToastrService,
    private _avRoute: ActivatedRoute,
    private router: Router,
    private permissionService: PermissionService) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.items = [];
    this.modelCompanyKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.modelCompanyKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelCompanyKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.companyKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    };
  }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataInformation.length > 0 && this.model != null) {
      this.getMappedData();
      this.getPortfolioCompanies();
    }
    if(this.dataInformation.length > 0 && this.model == null)
    {
      this.getMappedData();
      let mappedData = this.dataInformation.find(x => x.subFeatureId == this.subFeature.StaticDataBusinessDesciptionInvestmentProfessional);
      if (mappedData == undefined) {
        this.getPortfolioCompanyById(0);
      }
    }
  }
  getPortfolioCompanyById(requestId:number)
  {
    this.workflowCompanyService.getCompanyWorkFlowDraft(requestId, this.id).subscribe((result: any) => {
      this.model = result.data; 
      this.getPortfolioCompanies();
    }, error => {
      this.isLoader = false;
    })
  }
  closePopup(isUploaded: boolean) {
    this.isOpenUpload = false;
    if (isUploaded)
      this.getPortfolioCompanies();
  }
  getMappedData() {
    let mappedData = this.dataInformation.find(x => x.subFeatureId == this.subFeature.CompanyKPIs);
    if (mappedData != undefined || mappedData != null) {
      this.showCompany = true;
      this.mappingId = mappedData.workflowMappingId;
    }
    else {
      this.showCompany = false;
      this.mappingId = 0;
    }
  }
  isNumberCheck(str: any) {
    return isNumeric(str);
  }

  getPortfolioCompanies() {
    this.isLoader = true;
    if (this.id != undefined) {
      this.getPCCompanyKPIValues(null, this.searchFilter);
    }
  }

 
  convertCompanyKPIValueUnits() {
    let companyValueUnitTable = this.companyKpiValueUnit;
    let portfolioCompanyKPIValuesListlocal = [];
    this.portfolioCompanyCompanyKPIValuesList = [];
    this.portfolioCompanyCompanyKPIValuesListClone.forEach(function (
      value: any
    ) {
      let childPCCompanyKPIMonthlyValueListLocal = [];
      let valueClone = JSON.parse(JSON.stringify(value));
      if (valueClone.pcCompanyKPIMonthlyValueModel != null) {
        if (
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "%" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "x" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "#" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiInfo != "" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue != "" &&
          valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue != null
        ) {
          switch (Number(companyValueUnitTable.typeId)) {
            case FinancialValueUnitsEnum.Absolute:
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                let childValueClone = JSON.parse(JSON.stringify(childValue));
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;

              break;
            case FinancialValueUnitsEnum.Thousands:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                let childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
            case FinancialValueUnitsEnum.Millions:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                let childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
            case FinancialValueUnitsEnum.Billions:
              if (
                valueClone.pcCompanyKPIMonthlyValueModel != null &&
                valueClone.pcCompanyKPIMonthlyValueModel.length != 0
              )
                valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue =
                  valueClone.pcCompanyKPIMonthlyValueModel.kpiActualValue /
                  1000000000;
              valueClone.childPCCompanyKPIMonthlyValueList.forEach(function (
                childValue: any
              ) {
                let childValueClone = JSON.parse(JSON.stringify(childValue));
                childValueClone.kpiActualValue =
                  childValueClone.kpiActualValue / 1000000000;
                childPCCompanyKPIMonthlyValueListLocal.push(childValueClone);
              });
              valueClone.childPCCompanyKPIMonthlyValueList = childPCCompanyKPIMonthlyValueListLocal;
              break;
          }
        }
      }
      portfolioCompanyKPIValuesListlocal.push(valueClone);
    });

    this.portfolioCompanyCompanyKPIValuesList = portfolioCompanyKPIValuesListlocal;
    this.createCompanyKPILayOut(this.portfolioCompanyCompanyKPIValuesList);
    this.portfolioCompanyCompanyKPIValuesList.forEach(function (item) {
      item.fullMonth =
        item.pcCompanyKPIMonthlyValueModel.month +
        " " +
        item.pcCompanyKPIMonthlyValueModel.year;
    });
  }
  getPCCompanyKPIValues(event: any, searchFilter: any) {
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
    this.workflowCompanyService
      .getPCCompanyKPIValues({
        EncryptedPortfolioCompanyId: this.id,
        paginationFilter: event,
        searchFilter: searchFilter,
      })
      .subscribe(
        (result) => {
          this.loading = false;
          if (result.length>0) {
            this.portfolioCompanyCompanyKPIValuesList = result;
            this.portfolioCompanyCompanyKPIValuesListClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyCompanyKPIValuesList)
            );
            this.convertCompanyKPIValueUnits();

            this.expandedCompanyKPIs = [];
            if (this.portfolioCompanyCompanyKPIValuesList.length > 0) {
              this.expandedCompanyKPIs.push(
                this.portfolioCompanyCompanyKPIValuesList[0]
              );
            }
            this.totalCompanyCompanyKPIValuesRecords = result.totalRecords;
          } else {
            this.portfolioCompanyCompanyKPIValuesList = [];
            this.totalCompanyCompanyKPIValuesRecords = 0;
            this.createCompanyKPILayOut(
              this.portfolioCompanyCompanyKPIValuesList
            );
          }
          this.tableReload = true;
          this.isLoader = false;
          if (this.isToasterMessage) {
            this.successToaster();
          }

        },
        (error) => {
          this.loading = false;
          this.tableReload = true;
          this.isLoader = false;
        }
      );
  }
  createCompanyKPILayOut(kpiModel: any) {
    this.objCompanyKPIList = [];
    this.objCompanyKPIList.cols = [];
    this.objCompanyKPIList.Results = [];

    let local = this;

    if (this.model.portfolioCompanyID != 2) {
      kpiModel.forEach(function (ele: any) {
        if (ele.pcCompanyKPIMonthlyValueModel.portfolioCompanyID != 2) {
          ele.pcCompanyKPIMonthlyValueModel.segmentType = "";
        }
      });
    }
    let noSegmentKPIModel = kpiModel.filter(function (data: any) {
      return (
        data.pcCompanyKPIMonthlyValueModel.segmentType == "" ||
        data.pcCompanyKPIMonthlyValueModel.segmentType == undefined
      );
    });

    this.createColumnForCompanyKPI(noSegmentKPIModel);

    noSegmentKPIModel.forEach(function (data: any) {
      let objKPI: any = {};
      let parent = data.pcCompanyKPIMonthlyValueModel;
      let child = data.childPCCompanyKPIMonthlyValueList;
      let dataKPIInfo =
        parent.kpiInfo === "$"
          ? local.model.reportingCurrencyDetail.currencyCode
          : parent.kpiInfo;

      if (parent.kpi != "") {
        let month = local.miscService.getMonthName(parent.month);

        let kpiIndex = -1;
        local.objCompanyKPIList.Results.every(function (elem: any, index: any) {
          let kpiName = parent.kpi;
          let kpiNameWithInfo = parent.kpi;
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            kpiName = kpiName;
            kpiNameWithInfo = kpiName + " (" + dataKPIInfo + ")";
          }
          if (elem.KPI === kpiName && elem.KPIWithInfo === kpiNameWithInfo) {
            kpiIndex = index;
            return false;
          }
          return true;
        });

        if (kpiIndex == -1) {
          if (parent.kpiInfo != null && parent.kpiInfo != "") {
            objKPI["KPI"] = parent.kpi;
            objKPI["KPIWithInfo"] = parent.kpi + " (" + dataKPIInfo + ")";
          } else {
            objKPI["KPI"] = parent.kpi;
            objKPI["KPIWithInfo"] = parent.kpi;
          }
          objKPI["KpiId"] = parent.companyKPIID;
          objKPI["KpiInfo"] = parent.kpiInfo;
        }
        if (month != undefined) {
          let list = local.objCompanyKPIList.cols.filter(function (val: any) {
            return val.field == month + " " + parent.year;
          });
          if (list == null || list.length == 0) {
            local.objCompanyKPIList.cols.push({
              field: month + " " + parent.year,
              header: month + " " + parent.year
            });
          }

          if (kpiIndex >= 0) {
            local.objCompanyKPIList.Results[kpiIndex][
              month + " " + parent.year
            ] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue != null
                  ? parent.kpiActualValue / 100
                  : parent.kpiActualValue;

            local.objCompanyKPIList.Results[kpiIndex]["" + month + " " + parent.year + " " + "auditlog"] = parent.acutalAuditLog;
            local.objCompanyKPIList.Results[kpiIndex]["" + month + " " + parent.year + " " + "AttributeID"] = parent.pcCompanyKPIMonthlyValueID;
            local.objCompanyKPIList.Results[kpiIndex]["" + month + " " + parent.year + " " + "editable"] = false;
            local.objCompanyKPIList.Results[kpiIndex]["(Budget) " + month + " " + parent.year] = parent.kpiInfo != "%"
              ? parent.kpiBudgetValue
              : parent.kpiBudgetValue != null
                ? parent.kpiBudgetValue / 100
                : parent.kpiBudgetValue;

            local.objCompanyKPIList.Results[kpiIndex]["(Budget) " + month + " " + parent.year + " " + "AttributeID"] = parent.pcCompanyKPIMonthlyValueID;
            local.objCompanyKPIList.Results[kpiIndex]["(Budget) " + month + " " + parent.year + " " + "editable"] = false;
            if (parent.kpiBudgetValue !== null) {
              local.objCompanyKPIList.Results[kpiIndex]["(Budget) " + month + " " + parent.year + " " + "auditlog"] = parent.budgetAuditLog;
            }
          } else {
            objKPI[month + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiActualValue
                : parent.kpiActualValue != null
                  ? parent.kpiActualValue / 100
                  : parent.kpiActualValue;
            objKPI[month + " " + parent.year + " " + "auditlog"] = parent.acutalAuditLog;
            objKPI[month + " " + parent.year + " " + "AttributeID"] = parent.pcCompanyKPIMonthlyValueID;
            objKPI[month + " " + parent.year + " " + "editable"] = false;

            objKPI["(Budget) " + month + " " + parent.year] =
              parent.kpiInfo != "%"
                ? parent.kpiBudgetValue
                : parent.kpiBudgetValue != null
                  ? parent.kpiBudgetValue / 100
                  : parent.kpiBudgetValue;
            objKPI["(Budget) " + month + " " + parent.year + " " + "AttributeID"] = parent.pcCompanyKPIMonthlyValueID;
            objKPI["(Budget) " + month + " " + parent.year + " " + "editable"] = false;
            if (parent.kpiBudgetValue !== null) {
              objKPI["(Budget) " + month + " " + parent.year + " " + "auditlog"] = parent.budgetAuditLog;
            }
            local.objCompanyKPIList.Results.push(objKPI);
          }
        } else {
          if (objKPI.KPI != undefined && objKPI.KPI != "") {
            local.objCompanyKPIList.Results.push(objKPI);
          }
        }
      }

      if (child.length > 0) {
        let childCounter = 1;
        child.forEach(function (childData: any) {
          let month = local.miscService.getMonthName(childData.month);
          objKPI = {};
          let childKpiIndex = -1;
          let childDataKpiInfo =
            childData.kpiInfo === "$"
              ? local.model.reportingCurrencyDetail.currencyCode
              : childData.kpiInfo;
          local.objCompanyKPIList.Results.every(function (
            elem: any,
            index: any
          ) {
            let kpiName = childData.kpi;
            let kpiNameWithInfo = childData.kpi;
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              kpiName = "-" + kpiName;
              kpiNameWithInfo = kpiName + " (" + childDataKpiInfo + ")";
            } else {
              kpiName = "-" + kpiName;
              kpiNameWithInfo = "-" + kpiName;
            }
            if (elem.KPI === kpiName && elem.KPIWithInfo === kpiNameWithInfo) {
              childKpiIndex = index;
              return false;
            }
            return true;
          });
          let index = local.objCompanyKPIList.Results.findIndex(x => x.KpiId === childData.companyKPIID);
          childKpiIndex = index;

          if (childKpiIndex == -1) {
            if (childData.kpiInfo != null && childData.kpiInfo != "") {
              objKPI["KPI"] = "-" + childData.kpi;
              objKPI["IsChild"] = true;
              objKPI["KPIWithInfo"] =
                "-" + childData.kpi + " (" + childDataKpiInfo + ")";
              objKPI["originalKPI"] = childData.kpi;
            } else {
              objKPI["KPI"] = "-" + childData.kpi;
              objKPI["IsChild"] = true;
              objKPI["originalKPI"] = childData.kpi;
              objKPI["KPIWithInfo"] = "-" + childData.kpi;
            }
            objKPI["ParentKPI"] = childData.parentKPIID;
            objKPI["KpiId"] = childData.companyKPIID;
            objKPI["KpiInfo"] = childData.kpiInfo;
          }
          let list = local.objCompanyKPIList.cols.filter(function (val: any) {
            return val.field == month + " " + childData.year;
          });
          if (list == null || list.length == 0) {
            local.objCompanyKPIList.cols.push({
              field: month + " " + childData.year,
              header: month + " " + childData.year
            });
          }

          if (childKpiIndex >= 0) {
            local.objCompanyKPIList.Results[childKpiIndex][
              month + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue != null
                  ? childData.kpiActualValue / 100
                  : childData.kpiActualValue;
            local.objCompanyKPIList.Results[childKpiIndex][
              "(Budget) " + month + " " + childData.year
            ] =
              childData.kpiInfo != "%"
                ? childData.kpiBudgetValue
                : childData.kpiBudgetValue != null
                  ? childData.kpiBudgetValue / 100
                  : childData.kpiBudgetValue;
            local.objCompanyKPIList.Results[childKpiIndex]["" + month + " " + childData.year + " " + "auditlog"] = childData.acutalAuditLog;
            local.objCompanyKPIList.Results[childKpiIndex]["" + month + " " + childData.year + " " + "editable"] = false;
            local.objCompanyKPIList.Results[childKpiIndex]["" + month + " " + childData.year + " " + "AttributeID"] = childData.pcCompanyKPIMonthlyValueID;

            local.objCompanyKPIList.Results[childKpiIndex]["(Budget) " + month + " " + childData.year + " " + "AttributeID"] = childData.pcCompanyKPIMonthlyValueID;
            local.objCompanyKPIList.Results[childKpiIndex]["(Budget) " + month + " " + childData.year + " " + "editable"] = false;
            if (childData.kpiBudgetValue !== null) {
              local.objCompanyKPIList.Results[childKpiIndex]["(Budget) " + month + " " + childData.year + " " + "auditlog"] = childData.budgetAuditLog;
            }
          } else {
            objKPI[month + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiActualValue
                : childData.kpiActualValue != null
                  ? childData.kpiActualValue / 100
                  : childData.kpiActualValue;
            objKPI["(Budget) " + month + " " + childData.year] =
              childData.kpiInfo != "%"
                ? childData.kpiBudgetValue
                : childData.kpiBudgetValue != null
                  ? childData.kpiBudgetValue / 100
                  : childData.kpiBudgetValue;

            objKPI["" + month + " " + childData.year + " " + "auditlog"] = childData.acutalAuditLog;
            objKPI["" + month + " " + childData.year + " " + "editable"] = false;
            objKPI["" + month + " " + childData.year + " " + "AttributeID"] = childData.pcCompanyKPIMonthlyValueID;

            objKPI["(Budget) " + month + " " + childData.year + " " + "AttributeID"] = childData.pcCompanyKPIMonthlyValueID;
            objKPI["(Budget) " + month + " " + childData.year + " " + "editable"] = false;
            if (childData.kpiBudgetValue !== null) {
              objKPI["(Budget) " + month + " " + childData.year + " " + "auditlog"] = childData.budgetAuditLog;
            }
            objKPI["IsChild"] = true;

            local.objCompanyKPIList.Results.push(objKPI);
          }
        });
      }
    });

    local.objCompanyKPIList.cols = local.objCompanyKPIList.cols.filter(
      (x) => x.header.split(" ")[0] !== "(Budget)"
    );

    noSegmentKPIModel.forEach(function (data: any) {
      let parent = data.pcCompanyKPIMonthlyValueModel;
      let month = local.miscService.getMonthName(parent.month);
      let list = local.objCompanyKPIList.cols.filter(function (val: any) {
        return val.field == "(Budget) " + month + " " + parent.year;
      });
      if (list == null || list.length == 0) {
        local.objCompanyKPIList.cols.push({
          field: "(Budget) " + month + " " + parent.year,
          header: "(Budget) " + month + " " + parent.year
        });
      }
    });

    this.objCompanyKPIList.cols.splice(0, 1);
    this.companyKPICols.push.apply(this.companyKPICols, this.frozenCols);
    this.companyKPICols.push.apply(
      this.companyKPICols,
      this.objCompanyKPIList.cols
    );
  }

  createColumnForCompanyKPI(kpiModel: any) {
    let local = this;

    kpiModel.forEach(function (data: any) {
      let parent = data.pcCompanyKPIMonthlyValueModel;
      let month = local.miscService.getMonthName(parent.month);
      if (local.objCompanyKPIList.cols.length == 0) {
        local.objCompanyKPIList.cols.push({ field: "KPI", header: "KPI", editable: false });
      }
      if (month != undefined) {
        let list = local.objCompanyKPIList.cols.filter(function (val: any) {
          return val.field == month + " " + parent.year;
        });
        if (list == null || list.length == 0) {
          local.objCompanyKPIList.cols.push({
            field: month + " " + parent.year,
            header: "(Actual) " + month + " " + parent.year
          });
          local.objCompanyKPIList.cols.push({
            field: "(Budget) " + month + " " + parent.year,
            header: "(Budget) " + month + " " + parent.year
          });
        }
      }
    });
  }
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
      currency: this.model.reportingCurrencyDetail.currency,
      decimaPlace: this.modelCompanyKpi.decimalPlaces.type,
      valueType: this.companyKpiValueUnit.typeId,
    };
    this.exportCompanyKPILoading = true;
    this.portfolioCompanyService
      .exportCompanywiseKPIList({
        portfolioCompanyDetail: this.model,
        portfolioCompanyID: this.model.portfolioCompanyID.toString(),
        paginationFilter: event,
        searchFilter: this.companyKpiSearchFilter,
        kPIFilter: filter,
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



  onColumnEditComplete(index: any, col: any, rowData: any) {
    let prevVal = (this.updateModel.previousVal == undefined ? "" : this.updateModel.previousVal);
    let currVal = (rowData[col.field] == undefined ? "" : rowData[col.field]);
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
    if (!this.permissionService.checkUserPermission(this.subFeature.CompanyKPIs, ActionsEnum[ActionsEnum.canEdit], this.id)) {
      return;
    }
    let attributeName = rowData.IsChild == undefined ? rowData.KPI : rowData['originalKPI'];
    if (Number(this.companyKpiValueUnit.typeId) != FinancialValueUnitsEnum.Absolute && !this.ErrorNotation)
      this.infoUpdate = true;
    else if (!this.ErrorNotation && this.tableReload) {
      this.updateModel.colName = column.field;
      this.updateModel.header = column.header;
      this.updateModel.unit = rowData['KPIWithInfo'];
      this.updateModel.rowName = attributeName;
      this.updateModel.attributeId = rowData[`${column.field} AttributeID`];
      this.updateModel.kpiId = rowData.KpiId;
      this.updateModel.previousVal = rowData[column.field];
      let objIndex = this.objCompanyKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
      this.objCompanyKPIList.Results[objIndex][`${column.field} editable`] = true;
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
      this.updateModel.updatedVal = this.updateModel.updatedVal.toFixed(2);
    }
    let datauditmodellog = {
      Description: "Manual",
      AttributeID: this.updateModel.attributeId,
      AttributeName: "Company KPIs",
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
            this.getPCCompanyKPIValues(null, this.searchFilter);
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
    let objIndex = this.objCompanyKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objCompanyKPIList.Results[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearcellEdit();
  }

  clearcellEdit() {
    let objIndex = this.objCompanyKPIList.Results.findIndex((obj => obj.KpiId == this.updateModel.kpiId));
    this.objCompanyKPIList.Results[objIndex][`${this.updateModel.colName} editable`] = false;
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
  validateMaxLength(event: any): boolean {
    if (event.target.value.length == 15) return false;
    return true;
  }
  successToaster() {
    this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
  }
  kpiTable_GlobalFilter(event) {
    this.searchFilter = event;
    this.getPortfolioCompanies();
    this.menuTrigger.closeMenu();
  }
  onConvertValueUnits(event: any) {
    this.companyKpiValueUnit = event;
    this.convertCompanyKPIValueUnits();
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
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}

