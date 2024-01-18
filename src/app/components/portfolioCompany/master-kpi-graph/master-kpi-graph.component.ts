import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiscellaneousService, PeriodTypeQuarterEnum } from 'src/app/services/miscellaneous.service';
import { ActionsEnum, FeaturesEnum, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { ReportService, ReportType } from 'src/app/services/report.service';
import { AppSettingService } from '../../../services/appsettings.service';
import {AppConfig} from "../../../common/models";

@Component({
  selector: 'app-master-kpi-graph',
  templateUrl: './master-kpi-graph.component.html',
  styleUrls: ['./master-kpi-graph.component.scss']
})
export class MasterKpiGraphComponent implements OnInit {

  id: any;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  reportType: typeof ReportType = ReportType;
  kpiUnit:any;
  reportData: any = [];
  width:number = 0;
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

  modelKpi: any = {};
  KPIOrginalData: any[] = [];
  KPIChartData: any[] = [];
  KPIChartCol: any = [];
  GraphHeaders:any= [];
  @Input() modelList :any;
  ddlModel: any = {
    KPIList: [],
    selectedKPI: "",
  };

  appConfig : AppConfig;
  moduleCurrency: string;

  constructor(
    private miscService: MiscellaneousService,
    private reportService: ReportService,
    private _avRoute: ActivatedRoute,
    private appSettingService : AppSettingService) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.appConfig = this.appSettingService.getConfig();
  }
  ngOnInit(): void {
    this.modelKpi.periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.getKPIs();
    this.moduleCurrency = this.modelList?.reportingCurrencyDetail?.currencyCode;
    if(this.modelList.moduleId==1)//@Todo dynamic from backend
      this.GraphHeaders.push('Actual');
    else if(this.modelList.moduleId==2){
      this.GraphHeaders.push('Actual');
      this.GraphHeaders.push('Budget');
    }
  }

  getKPIs(){
     let local = this;
     let KPIQueryModel = {
       portfolioCompanyIds: this.modelList?.portfolioCompanyID.toString(),
       moduleId : this.modelList?.moduleId,
       kpiType: "MasterKpis"
     };
     this.miscService.getKPIListByPCIdsKPIType(KPIQueryModel).subscribe(
       (result) => {
         let resp = result["body"];
         if (resp != null && result.code == "OK") {
           this.ddlModel.KPIList = resp;
           this.ddlModel.selectedKPI = resp[0];
           if(this.ddlModel && this.ddlModel?.selectedKPI)
              this.kpiUnit= this.ddlModel?.selectedKPI["kpiInfo"];
           local.getKPIReport();
         }
       }
     );
  }

  getKPIReport() {
    let objQueryModel = JSON.parse(JSON.stringify(this.reportModel));
    let objKPIModel: any[] = [];
    let local = this;

    this.ddlModel.KPIList.forEach((item) => {
      objKPIModel.push(
        item.kpiid
      );
    });

    objQueryModel.selectedReportTypes = [this.reportType.MasterKPIReport];
    objQueryModel["MasterKpiIds"] = objKPIModel;
    objQueryModel["Filter"] = this.modelKpi.periodType?.type;
    objQueryModel["ModuleId"] = this.modelList?.moduleId;
    let company: object = {
      PortfolioCompanyID: this.modelList?.portfolioCompanyID
    }
    objQueryModel.PortfolioCompany = company;
    this.KPIOrginalData = [];
    this.KPIChartCol = [];
   
    this.reportService.getReportData(objQueryModel).subscribe(
      (result) => {
        let resp = result["body"];
        if (resp != null && result.code == "OK") {
          
          local.KPIOrginalData = resp[0].Results;
          local.KPIChartCol = resp[0].Columns;
          local.OnKPIChange();
          if (this.KPIChartData.length == 0) {
            let shouldSkip = false;
            if (this.ddlModel.KPIList.length > 0) {
              this.ddlModel.KPIList.forEach(element => {
                if (shouldSkip) {
                  return;
                }
                this.ddlModel.selectedKPI = element;
                this.KPIChartData = this.KPIOrginalData.filter(
                  (x) => x["KPIId"] == element?.kpiid
                );
                if (this.KPIChartData.length > 0) {
                  shouldSkip = true;
                  return;
                }
              });
            }
          }
        }
      }
    );
  }

  OnKPIChange() {
    this.KPIChartData = [];
    this.KPIChartData = this.KPIOrginalData.filter(
      (x) => x["KPIId"] == this.ddlModel.selectedKPI.kpiid
    );
    if(this.KPIChartData.length>0){
      this.kpiUnit= this.ddlModel.selectedKPI["kpiInfo"];
    }   

    if(this.modelList?.moduleId == 1){
      this.KPIChartData.forEach(element => {
        if (element.Info == "$" ){
          element.Actual =
          !isNaN(parseFloat(element.Actual)) &&
            !isNaN(parseFloat(element.Actual))
            ? element.Actual / 1000000
            : element.Actual;
        }

      });
    }
  }

  onResized(event: any) {
    this.width = event?.newRect?.width;
  }

}
