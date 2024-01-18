import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { EsgService } from "../../../services/esg.services";
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { PeriodTypeFilterOptions, KpiInfo } from "src/app/common/constants"
import { KPIModulesEnum } from 'src/app/services/permission.service';
import { FinancialValueUnitsEnum } from 'src/app/services/miscellaneous.service';

@Component({
  selector: 'app-esg-chart',
  templateUrl: './esg-chart.component.html',
  styleUrls: ['./esg-chart.component.scss']
})
export class EsgChartComponent implements OnChanges {

  @Input() selectedSubpageData: any;
  @Input() selectedCompany: any;
  ifNoDataAvailable: boolean = false;
  width: number = 0;
  ddlModel: any = {
    KPIList: []
  };
  esgKpiListname: any;
  kpiName: any;
  yBarFields = [];
  @Output() valueChange = new EventEmitter();
  @Input() modelList: any;
  @Input() disableApply: boolean;
  @Input() typeField: string;
  @Input() companyDetails: any;
  moduleCurrency: string;
  yLineFields = [];
  isLoaded: boolean = false;
  yShades = [];
  subscriptions: any = [];
  kpiData: any;
  selected: any;
  selectedCompanyKPI: any;
  sortCompanylineItem: any;
  xField = null;
  KPIChartData: any[];
  KpiTableData: any[];
  companyKPIList: any[];
  searchFilter: any = null;
  constructor(private _esgService: EsgService,
    private portfolioCompanyService: PortfolioCompanyService,
  ) {
    this.subscriptions.push(this._esgService.getQueryFilter().subscribe(data => {
      if(!data){
        this.searchFilter = data;
        this.getEsgData();
      }      
    }));
    this.subscriptions.push(this._esgService.getEsgDataUpdatedFlag().subscribe(data => {
      if(data){
        this.getEsgData();
      }      
    }));
  }

  ngOnChanges(_changes: any): void {
    if (_changes["typeField"]) {
      this.getEsgData();
      this.valueChanged({ field: this.typeField });
    }
    
    if (_changes["selectedSubpageData"]) {
      if (!(this.selectedSubpageData?.subPageId)) {
        this.companyKPIList = [];
        this.KPIChartData = [];
        this.hiddingDivision();
        return;
      }
      this.selectedCompanyKPI = null;
      this.companyKPIList = this.selectedSubpageData?.esgKpiList.filter(x => x.kpiInfo != 'Text' && !x.isHeader).sort((firstItem, secondItem) => {
        if (firstItem.kpiName < secondItem.kpiName) return -1;
        if (firstItem.kpiName > secondItem.kpiName) return 1;
      });
      this.hiddingDivision();
      this.getCompanykpi();

      this.setSymbol(this.selectedCompanyKPI);
    }
  }
  valueChanged(type) {
    this.valueChange.emit(type);
  }
  onResized(event: any) {
    this.width = event?.newRect?.width;
  }
  hiddingDivision() {
    if (!(this.companyKPIList.length)) {
      this.ifNoDataAvailable = true;
    }
    else {
      this.ifNoDataAvailable = false;
    }
  }
  getCompanykpi() {
    if (this.selectedCompanyKPI == undefined || this.selectedCompanyKPI == null) {
      this.selectedCompanyKPI = this.companyKPIList[0];

    }
    this.getCompanyKpiValueByEsgModuleId();
    this.setSymbol(this.selectedCompanyKPI);
    this.getEsgData();
  }

  getCompanyKpiValueByEsgModuleId(searchfilter?: any) {    
    let requestBody = this.applyFilterBody(searchfilter);   
    this._esgService.getCompanyKpiValueByEsgModuleId(requestBody).subscribe({
      next: (_res => {
        this.KpiTableData = _res['esgKpiList'] || [];
        if (this.KpiTableData.length > 0) {
          let selectedKPIData = this.KpiTableData.map(x => x.kpiData).flat();
          this.QuaterlyAndAnnual(selectedKPIData);
        }

      })
    });

  }

  applyFilterBody(searchFilter: any) {
    let filterbody = {
      CompanyId: this.selectedCompany?.portfolioCompanyID.toString(),
      portfolioCompanyID: this.selectedCompany?.portfolioCompanyID.toString(),
      SubPageModuleId: this.selectedSubpageData?.subPageId,
      moduleId: KPIModulesEnum.ESG,
      kpiId: this.selectedCompanyKPI?.kpiId,
      unit: FinancialValueUnitsEnum.Thousands,      
      ChartType: this.typeField
    };
    if (!searchFilter) {
      let sortOrder =
        [
          { field: "year", order: 1 },
          { field: "quarter", order: 1 },
        ]
        ;
      filterbody["searchFilter"] = {
        sortOrder: sortOrder,
        periodType: "1 YR (Last 1 year)",
      };
      return filterbody;

    } else {
      filterbody["searchFilter"] = searchFilter;
      filterbody["unit"] = searchFilter.UnitType.typeId;     
      };
      return filterbody;
  }

  setSymbol(kpi: any) {
    switch (kpi?.kpiInfo) {
      case KpiInfo.Currency:
        this.moduleCurrency = this.companyDetails?.reportingCurrencyDetail != null ? this.companyDetails?.reportingCurrencyDetail?.currencyCode : 'NA';
        break;
      case KpiInfo.Number:
        this.moduleCurrency = KpiInfo.Number;
        break;
      case KpiInfo.Percentage:
        this.moduleCurrency = KpiInfo.Percentage;
        break;
      case KpiInfo.Multiple:
        this.moduleCurrency = KpiInfo.Multiple;
        break;
    }
  }

  OnCompanyKPIChange() {
    if (this.KpiTableData.length > 0) {
      let selectedKPIData = this.KpiTableData.find(x => x.kpiId == this.selectedCompanyKPI?.kpiId);
      this.QuaterlyAndAnnual(selectedKPIData?.kpiData || []);
    }
    this.getCompanykpi();
  }

  QuaterlyAndAnnual(kpiValues: any[]) {
    let isAnnualData : boolean = kpiValues.every(x => x.quarter == null);
    this.typeField = isAnnualData ?  PeriodTypeFilterOptions.Annual : PeriodTypeFilterOptions.Quarterly;  
    this.valueChanged({ field: this.typeField });
  }

  // A function to change the key of an object in an array
  changeKey(originalKey, newKey, arr) {
    // Use map method to create a new array with modified objects
    return arr.map(obj => {
      // Use spread operator to copy the object
      let newObj = { ...obj };
      // Assign the value of the original key to the new key
      newObj[newKey] = newObj[originalKey];
      // Delete the original key
      delete newObj[originalKey];
      // Return the modified object
      return newObj;
    });
  }


  getEsgData() {
    this.isLoaded = true;
    let filter = this.applyFilterBody(this.searchFilter);   
    this.portfolioCompanyService.getChartsKpiData(filter
    ).subscribe({
      next: ((result) => {
        this.KPIChartData = result?.data || [];
        this.KPIChartData = this.KPIChartData.map(obj => {
          if (obj.hasOwnProperty('Actual')) {
            obj.Values = obj.Actual;
            delete obj.Actual;
          }
          return obj;
        });
        this.KPIChartData = this.changeKey('% Change In Actual Value', '% Change In Value', this.KPIChartData)
        this.yLineFields = ["% Change In Value"];
        this.yBarFields = result?.yBarFields.map(item => item === "Actual" ? "Values" : '') || [];
        this.xField = result?.xField;
        this.yShades = ['#2A26A6'];
        this.ifNoDataAvailable = false;
        this.isLoaded = false;
      })
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}