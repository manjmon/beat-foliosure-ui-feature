import { Component, Input, DoCheck } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PeriodTypeQuarterEnum } from 'src/app/services/miscellaneous.service';
import { ActionsEnum, FeaturesEnum, UserSubFeaturesEnum } from 'src/app/services/permission.service';
import { ReportCategory, ReportService, ReportType } from 'src/app/services/report.service';


@Component({
  selector: 'app-operational-kpi-graph',
  templateUrl: './operational-kpi-graph.component.html',
  styleUrls: ['./operational-kpi-graph.component.scss']
})
export class OperationalKpiGraphComponent implements DoCheck {

  id: any;
  isLoaded:boolean = false;
  financialReport_AsOfDate: any;
  operationalReport_AsOfDate: any;
  feature: typeof FeaturesEnum = FeaturesEnum;
  subFeature: typeof UserSubFeaturesEnum = UserSubFeaturesEnum;
  actions: typeof ActionsEnum = ActionsEnum;
  reportType: typeof ReportType = ReportType;
  reportCategory: typeof ReportCategory = ReportCategory;
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
  @Input() operationalModel :any;
  @Input() operationalddlmodel :any;

  constructor(
    private _avRoute: ActivatedRoute,
    private reportService: ReportService) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
   }

  ngDoCheck()
  {
    if(this.operationalddlmodel!=undefined && this.operationalddlmodel.operationalKPIList?.length>0 && !this.isLoaded) {
      this.operationalddlmodel.operationalKPIList[0].sector = null;
      this.isLoaded=true;
      this.reportModel.sectorwiseOperationalKPIs = [this.operationalddlmodel.operationalKPIList[0]];
      this.onOperationalKPIChange();
    }
  }

  onResized(event: any) {
    this.width = event?.newRect?.width;
  }

  onOperationalKPIChange() {
    this.operationalReport_AsOfDate = undefined;
    if(this.operationalddlmodel!=undefined)
      this.operationalddlmodel.selectedOperationalKPI.sector = null;
    this.reportModel.sectorwiseOperationalKPIs = [
      this.operationalddlmodel?.selectedOperationalKPI,
    ];
    let company: object = {
      PortfolioCompanyID: this.operationalModel?.portfolioCompanyID
    }
   const periodType = { type: PeriodTypeQuarterEnum.Last1Year };
    this.reportModel.portfolioCompany = company;
    this.reportModel.Filter = periodType.type;
    this.getCompanyFinancialReports();
  }

  getCompanyFinancialReports() {
    this.reportService.getReportData(this.reportModel).subscribe(
      (result) => {
        this.reportData = result["body"];
        let local = this;
        if (local.reportData?.length > 0) {
          local.reportData.forEach(function (val: any, i: any) {
            let titles = local.reportService.ReportTypeList.filter(function (
              ele: any,
              i: any
            ) {
              return val.ReportType == ele.value;
            });

            if (
              val.ReportType == local.reportType.CompanyOperationalKPIGrowth
            ) {
              val.KPIReports = [];
              let kpiList = Array.from(
                new Set(val.Results.map((item: any) => item.KPI))
              );
              kpiList.forEach(function (el: any) {
                let kpiReport = val.Results.filter(function (rpt: any) {
                  return el == rpt.KPI;
                });
                let asOfDate = new Date();
                let d: any = {
                  data: kpiReport,
                  title: el,
                  operationlReport_AsOfDate: asOfDate,
                };
                if (kpiReport.length > 0) {
                  d.unit = kpiReport[0].Info;
                }
                val.KPIReports.push(d);
              });
              if (val.KPIReports.length > 0 && val.KPIReports[0].data != null)
                local.operationalReport_AsOfDate = val.KPIReports[0].data
                  .map(function (e: any) {
                    return e.AsofDate;
                  })
                  .sort()
                  .reverse()[0];
            }

            if (titles.length > 0) {
              val.title = titles[0].label;
              val.category = titles[0].category;
            }
            val.cols = [];
            val.Columns.forEach(function (value: any, i: any) {
              val.cols.push({ field: value, header: value });
            });
            val.shrinkSize = false;
            val.chartData = val.Results;
            if (
              val.chartData != undefined &&
              val.ReportType == local.reportType.CompanyFinancialKPIReport
            )
              local.financialReport_AsOfDate = val.chartData
                .map(function (e: any) {
                  return e.AsofDate;
                })
                .sort()
                .reverse()[0];

          });
        }
        this.CheckIfNoDataInReport();
      }
    );
  }

  CheckIfNoDataInReport() {
    if (this.reportData != null && this.reportData.length > 0) {
      let availableDataReports = this.reportData.filter(function (data: any) {
        return data.Results != null && data.Results.length > 0;
      });
      if (availableDataReports.length == 0) {
        this.reportService.setDataAvailabilityInReport(false);
      } else {
        this.reportService.setDataAvailabilityInReport(true);
      }
    } else {
      this.reportService.setDataAvailabilityInReport(false);
    }
  }


}
