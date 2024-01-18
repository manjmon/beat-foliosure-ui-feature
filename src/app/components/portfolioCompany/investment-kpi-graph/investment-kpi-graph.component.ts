import { DoCheck, Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DecimalDigitEnum, MiscellaneousService, OrderTypesEnum, PeriodTypeQuarterEnum, FinancialValueUnitsEnum } from 'src/app/services/miscellaneous.service';
import { ActionsEnum, FeaturesEnum, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { ReportService, ReportType } from 'src/app/services/report.service';
import { AppSettingService } from '../../../services/appsettings.service';
import { AppConfig } from "../../../common/models";
import { CommonPCConstants, KpiInfo } from 'src/app/common/constants';
import { isNil } from "src/app/utils/utils";
@Component({
  selector: 'app-investment-kpi-graph',
  templateUrl: './investment-kpi-graph.component.html',
  styleUrls: ['./investment-kpi-graph.component.scss']
})
export class InvestmentKpiGraphComponent implements OnChanges, DoCheck {

  id: any;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  modelInvestmentKpi: any = {};
  investmentKPIs: any[];
  InvestmentKPIChartData: any[] = [];
  InvestmentKPIChartCol: any = [];
  InvestmentKPIUnit: string = "";
  InvestmentKPIOrginalData: any[] = [];
  @Input() modelList: any;
  @Input() model:any;
  isLoaded: boolean = false;
  ddlmodelList: any = {
    operationalKPIList: [],
    selectedOperationalKPI: "",
    financialKPIList: [],
    selectedFinancialKPI: "",
    investmentKPIList: [],
    selectedInvestmentKPI: {
      displayName: '',
      kpiid: 0
    },
    companyKPIList: [],
    selectedCompanyKPI: ""
  };
  width: number = 0;
  reportType: typeof ReportType = ReportType;
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
  appConfig: AppConfig;
 investKpiModuleCurrency:string;
 @Input() searchFilter: any = null;
 searchFilterCopy: any = null;
 loading: boolean = false;
 @Input() isValueUpdated:boolean=false;
 @Input() investmentKpiValueUnit: any;
  constructor(
    private miscService: MiscellaneousService,
    private reportService: ReportService,
    private _avRoute: ActivatedRoute,
    private appSettingService: AppSettingService) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.appConfig = this.appSettingService.getConfig();   
  }
  ngOnInit() {
    this.getInvestmentKPIs();
  }
  ngOnChanges(changes: any): void {
    if(this.searchFilter != this.searchFilterCopy || this.isValueUpdated){
      this.searchFilterCopy = this.searchFilter;
      this.isValueUpdated = false;
      this.getInvestmentKPIs();
      this.modelInvestmentKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
      this.modelInvestmentKpi.decimalPlaces = {
        type: DecimalDigitEnum.Zero,
        value: "1.1-1",
      };
      this.investmentKPIs = this.ddlmodelList.investmentKPIList;
      this.getInvestmentKPIReport();
      this.isLoaded = true;
    }
  }
  getInvestmentKPIs() {
    let KPIQueryModel = {
      portfolioCompanyIds: this.modelList?.portfolioCompanyID?.toString(),
      kpiType: "Investment",
    };
    this.miscService.GetCompanyOrInvestmentKPIList(KPIQueryModel).subscribe(
      (result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          this.investmentKPIs = resp;
          let investmentKPIs = this.investmentKPIs;
          this.ddlmodelList.investmentKPIList = investmentKPIs;
          this.ddlmodelList.selectedInvestmentKPI = this.ddlmodelList.selectedInvestmentKPI != this.ddlmodelList.investmentKPIList[0] && this.ddlmodelList.selectedInvestmentKPI.displayName!=""?
          this.ddlmodelList.selectedInvestmentKPI : investmentKPIs[0];
        }
      },
    );
  }

  ngDoCheck() {
    if (this.ddlmodelList != undefined && this.ddlmodelList.investmentKPIList?.length > 0 && !this.isLoaded) {
      this.modelInvestmentKpi.periodType = {
        type: PeriodTypeQuarterEnum.Last1Year,
      };
      this.modelInvestmentKpi.orderType = { type: OrderTypesEnum.LatestOnRight };
      this.modelInvestmentKpi.decimalPlaces = {
        type: DecimalDigitEnum.Zero,
        value: "1.1-1",
      };
      this.investmentKPIs = this.ddlmodelList.investmentKPIList;
      this.getInvestmentKPIReport();
      this.isLoaded = true;
    }

  }

  onResized(event: any) {
    this.width = event?.newRect?.width;
  }

  convertUnits(value) {
    switch (Number(this.investmentKpiValueUnit.typeId)) {
      case FinancialValueUnitsEnum.Absolute:
        break;
      case FinancialValueUnitsEnum.Thousands:
        if(value != 0){
          value =
          !isNil(value) ? !isNaN(parseFloat((value.indexOf(',') > -1 ? value.replace(/,/g, '') : value)))
            ? (value.indexOf(',') > -1 ? value.replace(/,/g, '') : value) / 1000
            : value : value;
        }
        break;
      case FinancialValueUnitsEnum.Millions:
        if(value != 0){
          value =
          !isNil(value) ? !isNaN(parseFloat((value.indexOf(',') > -1 ? value.replace(/,/g, '') : value)))
            ? (value.indexOf(',') > -1 ? value.replace(/,/g, '') : value) / 1000000
            : value : value;
        }
        break;
      case FinancialValueUnitsEnum.Billions:
        if(value != 0){
          value =
          !isNil(value) ? !isNaN(parseFloat((value.indexOf(',') > -1 ? value.replace(/,/g, '') : value)))
            ? (value.indexOf(',') > -1 ? value.replace(/,/g, '') : value) / 1000000000
            : value : value;
        }
        break;
    }
    return value;
}

  OnInvestmentKPIChange() {
    this.InvestmentKPIChartData = this.InvestmentKPIOrginalData.filter(
      (x) => x["KPIId"] == this.ddlmodelList.selectedInvestmentKPI?.kpiid
    );
    if (this.InvestmentKPIChartData.length > 0) {
      this.InvestmentKPIUnit = this.ddlmodelList.selectedInvestmentKPI["kpiInfo"];
    }
    
    this.InvestmentKPIChartData.forEach(element => {
      switch(element.Info){
        case  KpiInfo.Currency:
          if(window.location.host == CommonPCConstants.ExeterHost)
          {
            this.investKpiModuleCurrency= this.modelList?.reportingCurrencyCode!=null?this.modelList?.reportingCurrencyCode?.currencyCode:'NA';
          }
          else
          {
            this.investKpiModuleCurrency= this.modelList?.fundReportingCurrency!=null?this.modelList?.fundReportingCurrency?.currencyCode:'NA';
          }
          element["Actual Value"] = this.convertUnits(element["Actual Value"] );
          break;
        case  KpiInfo.Number:
          this.investKpiModuleCurrency = KpiInfo.Number;
          break;
        case  KpiInfo.Percentage:
          element["% Change In Actual Value"] = undefined;
          this.investKpiModuleCurrency = KpiInfo.Percentage;
          break;
        case  KpiInfo.Multiple:
          element["% Change In Actual Value"] = undefined;
          this.investKpiModuleCurrency = KpiInfo.Multiple;
          break;
      }
    });
  }

  getInvestmentKPIReport() {
    this.loading = true;
    this.InvestmentKPIUnit = this.InvestmentKPIUnit == "" ? 
    this.ddlmodelList.investmentKPIList[0]["kpiInfo"] : this.InvestmentKPIUnit;
    this.ddlmodelList.selectedInvestmentKPI = this.ddlmodelList.selectedInvestmentKPI != this.ddlmodelList.investmentKPIList[0]?
    this.ddlmodelList.selectedInvestmentKPI : this.ddlmodelList.investmentKPIList[0];
    let objQueryModel = JSON.parse(JSON.stringify(this.reportModel));
    let objInvestmentKPIModel: any[] = [];
    let local = this;

    this.ddlmodelList.investmentKPIList.forEach((item) => {
      objInvestmentKPIModel.push({
        InvestmentKPIID: item.kpiid,
        KPI: item.itemName,
        KPIInfo: item.kpiInfo,
      });
    });

    objQueryModel.selectedReportTypes = [this.reportType.InvestmentKPIReport];
    objQueryModel["InvestmentKPI"] = objInvestmentKPIModel;
    objQueryModel["Filter"] = this.modelInvestmentKpi.periodType?.type;
    let company: object = {
      PortfolioCompanyID: this.modelList?.portfolioCompanyID
    }
    objQueryModel.PortfolioCompany = company;
    this.InvestmentKPIOrginalData = [];
    this.InvestmentKPIChartCol = [];
    objQueryModel.searchFilter = this.searchFilter;
    this.reportService.getReportData(objQueryModel).subscribe({
      next:(result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          local.InvestmentKPIOrginalData = resp[0].Results;
          local.InvestmentKPIChartCol = resp[0].Columns;
          local.OnInvestmentKPIChange();
          if (this.InvestmentKPIChartData.length == 0) {
            let shouldSkip = false;
            if (this.ddlmodelList.investmentKPIList.length > 0) {
              this.ddlmodelList.investmentKPIList.forEach(element => {
                if (shouldSkip) {
                  return;
                }
                this.ddlmodelList.selectedInvestmentKPI = element;
                this.InvestmentKPIChartData = this.InvestmentKPIOrginalData.filter(
                  (x) => x["KPIId"] == element?.kpiid
                );
                if (this.InvestmentKPIChartData.length > 0) {
                  shouldSkip = true;
                  return;
                }
              });
            }
          }
          this.loading = false;
        }
      },
      error:(error) => {
        this.loading = false;
      }
  });
  }
}