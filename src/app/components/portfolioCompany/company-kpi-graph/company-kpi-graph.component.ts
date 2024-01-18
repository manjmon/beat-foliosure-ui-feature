import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalDigitEnum, MiscellaneousService, FinancialValueUnitsEnum, OrderTypesEnum, PeriodTypeQuarterEnum } from 'src/app/services/miscellaneous.service';
import { ActionsEnum, FeaturesEnum, KPIModulesEnum, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { ReportCategory, ReportService, ReportType } from 'src/app/services/report.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { KpiInfo } from 'src/app/common/constants';
@Component({
  selector: 'app-company-kpi-graph',
  templateUrl: './company-kpi-graph.component.html',
  styleUrls: ['./company-kpi-graph.component.scss']
})
export class CompanyKpiGraphComponent implements OnInit {

  isLoaded: boolean = false;
  id: any;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  companyKpiModuleCurrency: string;
  reportType: typeof ReportType = ReportType;
  reportCategory: typeof ReportCategory = ReportCategory;
  reportData: any = [];
  width: number = 0;
  reportModel: any = {
    sectorwiseOperationalKPIs: [],
    portfolioCompany: null,
    selectedReportTypes: [
      this.reportType.CompanyFinancialKPIReport,
      this.reportType.CompanyOperationalKPIGrowth,
    ],
    chartMetadetaList: [
      {
        chartName: "Financial KPI",
        chartType: "LineMarkers",
        colNameX: "Quarter",
        colNameY: "% Change In Revenue",
      },
      {
        chartName: "Financial KPI",
        chartType: "ColumnClustered",
        colNameX: "Quarter",
        colNameY: "Revenue",
      },
    ],
  };
  kpiInfo = "%";
  modelCompanyKpi: any = {};
  CompanyKPIOrginalData: any[] = [];
  CompanyKPIChartData: any[] = [];
  CompanyKPIChartCol: any = [];

  @Input() modelList: any;
  @Input() searchFilter: any;
  @Input() isValueUpdated: boolean = false;
  @Input() typeField: string;
  searchFilterCopy: any = null;
  companyKPIs: any;
  companyKPIList: any;
  selectedCompanyKPI: any;
  companyKpiChartData: any[];
  companyKpiValueUnit: any;
  yBarFields = [];
  yLineFields = [];
  chartData = [];
  xField = null;
  yShades=[];
  isNoData:boolean=false;
  constructor(
    private portfolioCompanyService: PortfolioCompanyService,
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private _avRoute: ActivatedRoute) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
  }
  ngOnInit() {
    this.modelCompanyKpi.periodType = PeriodTypeQuarterEnum.Last1Year;
    this.modelCompanyKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelCompanyKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.companyKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    };
  }

  ngOnChanges(changes: any): void {
    if (this.searchFilter != this.searchFilterCopy || this.isValueUpdated || this.typeField) {
      this.companyKpiModuleCurrency = this.modelList?.reportingCurrencyDetail != null ? this.modelList?.reportingCurrencyDetail?.currencyCode : 'NA';
      this.searchFilterCopy = this.searchFilter;
      this.isValueUpdated = false;
      this.modelCompanyKpi.periodType = this.searchFilter.periodType;
      this.companyKpiValueUnit = this.searchFilter.UnitType;
      this.getCompanyKPIs();
      this.isLoaded = true;
    }
  }
  onResized(event: any) {
    this.width = event?.newRect?.width;
  }
  getCompanyKPIs() {
    let KPIQueryModel = {
      portfolioCompanyIds: this.modelList.portfolioCompanyID?.toString(),
      kpiType: "Company"
    };
    this.miscService.GetCompanyOrInvestmentKPIList(KPIQueryModel).subscribe({
      next:(result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          this.companyKPIList = resp;
          if (this.selectedCompanyKPI == undefined || this.selectedCompanyKPI == null) {
            this.selectedCompanyKPI = resp[0];
          } else {
            this.selectedCompanyKPI = resp.filter((x) => x["kpiid"] == this.selectedCompanyKPI?.kpiid)[0];
          }
          this.setSymbol(this.selectedCompanyKPI);
          this.LoadGraph();
        }
      },
      error:(_error) => {
      }
  });
  }
  setSymbol(kpi:any)
  {
    switch(kpi.kpiInfo){
      case  KpiInfo.Currency:
        this.companyKpiModuleCurrency = this.modelList?.reportingCurrencyDetail != null ? this.modelList?.reportingCurrencyDetail?.currencyCode : 'NA';
        break;
      case  KpiInfo.Number:
        this.companyKpiModuleCurrency = KpiInfo.Number;
        break;
      case  KpiInfo.Percentage:
        this.companyKpiModuleCurrency = KpiInfo.Percentage;
        break;
      case  KpiInfo.Multiple:
        this.companyKpiModuleCurrency = KpiInfo.Multiple;
        break;
    }
  }
  OnCompanyKPIChange() {
    this.setSymbol(this.selectedCompanyKPI);
    this.LoadGraph();
  }
  LoadGraph() {
    this.isNoData=false;
    this.clearAll();
    let filter = {
      companyId: this.modelList.portfolioCompanyID.toString(),
      portfolioCompanyID: this.modelList.portfolioCompanyID.toString(),
      searchFilter: this.searchFilter,
      moduleId: KPIModulesEnum.Company,
      unit: this.companyKpiValueUnit == undefined ? FinancialValueUnitsEnum.Millions : this.companyKpiValueUnit.typeId,
      chartType: this.typeField,
      kpiId: this.selectedCompanyKPI?.kpiid
    };
    this.portfolioCompanyService
      .getChartsKpiData(filter)
      .subscribe({
        next: (result) => {
          if (result != undefined) {
            this.chartData = result?.data || [];
            this.yLineFields = result?.yLineFields || [];
            this.yBarFields = result?.yBarFields || [];
            this.xField = result?.xField;
            this.yShades=result?.yShades||[];
            this.isNoData=this.chartData.length>0?false:true;
          } else {
            this.isNoData=true;
            this.clearAll();
          }
        },
        error: (error) => {
        this.clearAll();
        }
      });
  }
  clearAll(): void {
    this.chartData = [];
    this.yLineFields = [];
    this.yBarFields = [];
    this.yShades = [];
  }
}
