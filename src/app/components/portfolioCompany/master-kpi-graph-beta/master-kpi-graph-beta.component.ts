import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalDigitEnum, FinancialValueUnitsEnum, MiscellaneousService, OrderTypesEnum, PeriodTypeQuarterEnum } from 'src/app/services/miscellaneous.service';
import { KPIModulesEnum } from 'src/app/services/permission.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { KpiInfo } from 'src/app/common/constants';
@Component({
  selector: 'app-master-kpi-graph-beta',
  templateUrl: './master-kpi-graph-beta.component.html',
  styleUrls: ['./master-kpi-graph-beta.component.scss']
})
export class MasterKpiGraphBetaComponent implements OnInit {
  id: any;
  width: number = 0;
  modelKpi: any = {};
  @Input() modelList: any;
  ddlModel: any = {
    KPIList: []
  };
  @Input() isValueUpdated: boolean = false;
  moduleCurrency: string;
  yBarFields = [];
  yLineFields = [];
  chartData = [];
  xField = null;
  @Input() searchFilter: any;
  @Input() typeField: string;
  masterKpiValueUnit: any;
  searchFilterCopy: any = null;
  isLoaded: boolean = false;
  selectedKPI: any;
  yShades=[];
  isNoData:boolean=false;
  constructor(
    private miscService: MiscellaneousService,
    private portfolioCompanyService: PortfolioCompanyService,
    private _avRoute: ActivatedRoute) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
  }
  ngOnInit(): void {
    this.modelKpi.periodType = PeriodTypeQuarterEnum.Last1Year;
    this.modelKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
    this.modelKpi.decimalPlaces = {
      type: DecimalDigitEnum.Zero,
      value: "1.0-0",
    };
    this.masterKpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    };
  }
  setSymbol(kpi:any)
  {
    switch(kpi?.kpiInfo){
      case  KpiInfo.Currency:
        this.moduleCurrency = this.modelList?.reportingCurrencyDetail != null ? this.modelList?.reportingCurrencyDetail?.currencyCode : 'NA';
        break;
      case  KpiInfo.Number:
        this.moduleCurrency = KpiInfo.Number;
        break;
      case  KpiInfo.Percentage:
        this.moduleCurrency = KpiInfo.Percentage;
        break;
      case  KpiInfo.Multiple:
        this.moduleCurrency = KpiInfo.Multiple;
        break;
        default:
          break
    }
  }
  getKPIs() {
    let KPIQueryModel = {
      portfolioCompanyIds: this.modelList.portfolioCompanyID.toString(),
      moduleId: (this.modelList.moduleId==KPIModulesEnum.Operational)?0:this.modelList.moduleId,
      kpiType: this.getKpiTypes()
    };
    this.miscService.getKPIListByPCIdsKPIType(KPIQueryModel).subscribe({
      next: (result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          this.ddlModel.KPIList = resp;
          if (this.selectedKPI == undefined || this.selectedKPI == null) {
            this.selectedKPI = resp[0];
          } else {
            this.selectedKPI = resp.filter((x) => x["kpiid"] == this.selectedKPI?.kpiid)[0];
          }
          this.setSymbol(this.selectedKPI);
          this.loadGraph();
        }
      },
      error: (_error) => {
      }
    });
  }

  OnKPIChange() {
    this.setSymbol(this.selectedKPI);
    this.loadGraph();
  }

  onResized(event: any) {
    this.width = event?.newRect?.width;
  }
  ngOnChanges(changes: any): void {
    if (this.searchFilter != this.searchFilterCopy || this.typeField ||this.isValueUpdated) {
      this.moduleCurrency = this.modelList?.reportingCurrencyDetail != null ? this.modelList?.reportingCurrencyDetail?.currencyCode : 'NA';
      this.searchFilterCopy = this.searchFilter;
      this.modelKpi.periodType = this.searchFilter?.periodType;
      this.masterKpiValueUnit = this.searchFilter?.UnitType;
      this.getKPIs();
    }
  }
  createFilter() {
    return {
      companyId: this.modelList.portfolioCompanyID.toString(),
      portfolioCompanyID: this.modelList.portfolioCompanyID.toString(),
      searchFilter: this.searchFilter,
      moduleId: this.modelList.moduleId,
      unit: this.masterKpiValueUnit == undefined ? FinancialValueUnitsEnum.Millions : this.masterKpiValueUnit.typeId,
      chartType: this.typeField,
      kpiId: this.selectedKPI?.kpiid
    };
  }
  loadGraph() {
    this.isNoData=false;
    this.clearAll();
    this.isLoaded = true;
    let filter = this.createFilter();
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
          this.isLoaded = false;
        },
        error: (error) => {
          this.clearAll();
          this.isLoaded = false;
        }
      });
  }
  clearAll(): void {
    this.chartData = [];
    this.yLineFields = [];
    this.yBarFields = [];
    this.yShades = [];
  }
  getKpiTypes(): string {
    const kpiTypes = new Map([
      [KPIModulesEnum.TradingRecords, "MasterKpis"],
      [KPIModulesEnum.Operational, "Operational"],
      [KPIModulesEnum.Investment, "Investment"],
      [KPIModulesEnum.CreditKPI, "MasterKpis"],
      [KPIModulesEnum.Company, "Company"]
    ]);
    return kpiTypes.get(Number(this.modelList.moduleId));
  }
}
