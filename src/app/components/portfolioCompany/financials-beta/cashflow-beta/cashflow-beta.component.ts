import { Component, Input,EventEmitter,Output,ViewChild,OnChanges } from '@angular/core';
import { KPIModulesEnum } from 'src/app/services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import {  MiscellaneousService,PeriodType } from 'src/app/services/miscellaneous.service';
import { CashflowBetaService } from 'src/app/services/cashflow-beta.service';
import { Table } from 'primeng/table';
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { NumberDecimalConst } from "src/app/common/constants";

@Component({
  selector: 'app-cashflow-beta',
  templateUrl: './cashflow-beta.component.html',
  styleUrls: ['./cashflow-beta.component.scss']
})
export class CashflowBetaComponent implements OnChanges {
  @Input() isDownload:boolean = false;
  NumberDecimalConst = NumberDecimalConst;
  cashflowSearchFilter: any;
  kpiModuleId = KPIModulesEnum.CashFlow;
  @Input() tabName:string =null;
  @Input() model;
  @Input() selectedCurrency = "";
  @Input() valueType="";
  @Input() periodType:number = 0;
  @Input() isErrorLog:boolean = false;
  subtabName: string = "Actual";
  portfolioCompanyID: any;
  currencyCode = "";
  id: any;
  isexport: boolean = false;
  isLoader: boolean = false;
  currencyRateSource = "";
  @Output() isDownloading: EventEmitter<any> = new EventEmitter();
  @Output() changeOptionType: EventEmitter<any> = new EventEmitter();
  cashflowValuesMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  frozenHeader: any = [{ field: "Kpi", header: "KPI" }];
  tableColumns = [];
  tableFrozenColumns = [];
  tableResult = [];
  tableResultClone = [];
  @ViewChild("dt") dt: Table | undefined;
  @Input() isFilter:boolean = false;
  @Output() onChangeValueType: EventEmitter<any> = new EventEmitter();
  auditLogList:any=[];
  isPageLoad:boolean = true;
  constructor(private _avRoute: ActivatedRoute,
    private miscService: MiscellaneousService,
    private router: Router,
    private cashflowBetaService: CashflowBetaService) { 
      if (this._avRoute.snapshot.params["id"]) {
        this.id = this._avRoute.snapshot.params["id"];
      }
    }
    ngOnChanges(changes:any){ 
      if(changes["valueType"] || changes["periodType"] || changes["isFilter"])
      {
        this.isPageLoad = this.isPageLoad ? true:false;
        this.getCashflowData();
      }
      if (changes["isDownload"] && this.isDownload) {
        this.isexport=true;
        this.exportCashflowData();
      }
    }
    getCashflowData() {
      let periodType =
        this.model.periodType != undefined ? this.model.periodType.type : null;
      let searchFilter = {
        sortOrder: null,
        periodType: periodType,
        startPeriod:
          this.model.startPeriod != undefined ? this.model.startPeriod[0] : null,
        endPeriod:
          this.model.startPeriod != undefined ? this.model.startPeriod[1] : null,
      };
      this.getCashflowValues(
        null,
        searchFilter,
        this.model.portfolioCompany.portfolioCompanyID,
        this.currencyCode
      );
      this.cashflowSearchFilter = searchFilter;
    }
    getCashflowValues(
      event: any,
      searchFilter: any,
      companyId: any,
      currencyCode: any
    ) {
      this.isLoader = true;
      if (event == null) {
        event = {
          first: 0,
          rows: 1000,
          globalFilter: null,
          sortField: "displayOrder",
          multiSortMeta: this.cashflowValuesMultiSortMeta,
          sortOrder: -1,
        };
      }
      if (searchFilter == null) {
        searchFilter = {
          sortOrder: null,
          periodType: this.model.periodType.type,
        };
        if (searchFilter.periodType == "Date Range") {
          searchFilter.startPeriod = new Date(
            Date.UTC(
              this.model.startPeriod.getFullYear(),
              this.model.startPeriod.getMonth(),
              this.model.startPeriod.getDate()
            )
          );
          searchFilter.endPeriod = new Date(
            Date.UTC(
              this.model.endPeriod.getFullYear(),
              this.model.endPeriod.getMonth(),
              this.model.endPeriod.getDate()
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
      let model = this.getDataModel(event, searchFilter);
      this.cashflowBetaService.getPCCashFlowValues(model).subscribe({
        next:(result) => {
          if (result?.rows?.length > 0) {
            this.setValueType(result.isMonthly,result.isQuarterly,result.isAnnually);
            this.isLoader = false;
            this.isPageLoad = false;
            this.tableColumns = result?.headers || [];
            this.tableResult = result?.rows || [];
            this.auditLogList = result?.financialKpiAuditlog|| [];
            this.tableFrozenColumns = this.frozenHeader;
          } else {
            this.resetTable();
            this.isLoader = false;
          }
        },
        error:(error) => {
          this.resetTable();
          this.isLoader = false;
        }
    });
    }
    resetTable() {
      this.isLoader = false;
      this.tableResult = [];
      this.tableResultClone = [];
      this.tableFrozenColumns = [];
      this.auditLogList=[];
    }
    setValueType(isMonthly:boolean,isQuarterly:boolean,isAnnually:boolean)
  {
    let valueTypes: any = {
      isMonthly:isMonthly,
      isQuarterly:isQuarterly,
      isAnnually:isAnnually
    };
    this.onChangeValueType.emit(valueTypes);
  }
    getDataModel(event: any, searchFilter: any) {
      let model = {
        CompanyId: this.model.portfolioCompany.portfolioCompanyID,
        paginationFilter: event,
        searchFilter: searchFilter,
        segmentType: null,
        currencyCode: this.model?.currencyCode?.currencyCode,
        reportingCurrencyCode: this.model.portfolioCompany.companyCurrency,
        currencyRateSource: this.currencyRateSource,
        valueType: this.valueType,
        isMonthly: this.periodType == PeriodType.Monthly ? true:false,
        isQuarterly: this.periodType == PeriodType.Quarterly ? true:false,
        isAnnually: this.periodType == PeriodType.Annually ? true:false,
        PeriodType: this.periodType,
        ModuleId: 9,
        Kpis:null,
        isPageLoad:this.isPageLoad
      };
      return model;
    }
    isNumberCheck(str: any) {
      return isNumeric(str);
    }
    exportCashflowData() {
      this.isDownloading.emit(true);
      let event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: "displayOrder",
        multiSortMeta: this.cashflowValuesMultiSortMeta,
        sortOrder: -1,
      };
      this.cashflowBetaService
        .exportCompanyCashflow({
          currency: this.model.portfolioCompany.companyCurrency,
          currencyCode: this.model?.currencyCode?.currencyCode,
          reportingCurrencyCode: this.model.portfolioCompany.companyCurrency,
          CompanyId: this.model.portfolioCompany.portfolioCompanyID,
          paginationFilter: event,
          segmentType: null,
          searchFilter: this.cashflowSearchFilter,
          currencyRateSource : this.currencyRateSource,
          valueType:this.valueType,
          isMonthly: this.periodType == PeriodType.Monthly ? true:false,
          isQuarterly: this.periodType == PeriodType.Quarterly ? true:false,
          isAnnually: this.periodType == PeriodType.Annually ? true:false,
          ModuleId: 9,
          Kpis:null,
          isPageLoad:this.isPageLoad
        })
        .subscribe(
          (response) => {
            this.miscService.downloadExcelFile(response);
            this.isDownloading.emit(false);
          },
          (error) => {
            this.isDownloading.emit(false);
          }
        );
    }
    getFilterAuditValue(rowdata: any, column: any) {
      let calccolumn = "Calc"+" "+column.field;
      if(rowdata[calccolumn] !=undefined && rowdata[calccolumn])
      {
        return [];
      }
      else{
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
    }
    filterAuditValue(yearHeader: any, monthValue: any, auditList: any, periodHeader: any, rowdata: any) {
      let result = [];
      if (periodHeader == "Q1" || periodHeader == "Q2" || periodHeader == "Q3" || periodHeader == "Q4")
        result = auditList.filter(x => x.quarter == periodHeader && x.year == yearHeader && x.mappingId == rowdata.MappingId && x.kpiValueId > 0);
      else if (monthValue != null && monthValue > 0)
        result = auditList.filter(x => x.month == monthValue && x.year == yearHeader && x.mappingId == rowdata.MappingId && x.kpiValueId > 0);
      else
        result = auditList.filter(x => (x.month == null || x.month == 0) && x.year == yearHeader && (x.Quarter == null || x.Quarter == '') && x.mappingId == rowdata.MappingId && x.kpiValueId > 0);
      return result
    }
    printColumn(rowData: any, column: any) {
      let result = this.getFilterAuditValue(rowData, column);
      if (result.length > 0) 
        return result[0].acutalAuditLog ? result[0].acutalAuditLog : false;
      else
        return false;
    }
    printCalcColumn(rowData: any, column: any) {
      let calccolumn = "Calc"+" "+column.field;
      if(rowData[calccolumn] !=undefined && rowData[calccolumn])
      {
        return true;
      }
        return false;
    }
    onAuditLog(rowData: any,field: any) {
      if (this.isErrorLog && this.printColumn(rowData,field) && !rowData.IsHeader && !this.printCalcColumn(rowData,field))
      {
        let attributeName = rowData.Kpi;
        let colData = this.getValues(rowData, field);
        this.router.navigate(["/audit-logs"], {
          state: { data: { KPI: this.tabName, header: field.header,PortfolioCompanyID:this.model.portfolioCompany.portfolioCompanyID ,AttributeName:attributeName,ModuleId: KPIModulesEnum.CashFlow, Comments:this.valueType, currency: this.model.portfolioCompany.companyCurrency, AttributeId:colData?.kpiValueId,MappingId:colData?.mappingId
        } },
        });
      }
    }
    getValues(rowdata: any, column: any) {
      let result = this.getFilterAuditValue(rowdata,column);
      if (result.length > 0) {
        return result[0];
      }
      else  
      return null;
  }
}
