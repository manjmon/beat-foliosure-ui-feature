import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/api/message";
import { SelectItem } from "primeng/api";
import { AccountService } from "../../../services/account.service";
import { FundService } from "../../../services/funds.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import {
  ReportCategory,
  ReportService,
  ReportType,
} from "../../../services/report.service";
import { Filter } from "../../custom-controls/Filter.model";
import { FilterControlComponent } from "../../custom-controls/filter-control.component";


@Component({
  selector: "company-financials",
  templateUrl: "./company-financials.report.html",
  styleUrls:["./cf-home.report.scss"]
})
export class CompanyFinancialsReportComponent implements OnInit, OnChanges {
  @Input() masterModel: any = {};
  @Input() selectedKpi:any = null;
  reportForm: FormGroup;
  fundList: any[];
  portfolioCompanyList: any[];
  regionList: any[];
  countryList: any[];
  strategyList: any[];
  msgTimeSpan: number;
  fundsLoading: boolean;
  strategyLoading: boolean;
  regionLoading: boolean;
  countryLoading: boolean;
  portfolioCompanyLoading: boolean;
  sectorWiseOperationalKPIsLoading: boolean;
  yearRange: any;
  viewByList: SelectItem[];
  holdingsByList: SelectItem[];
  cols: any[] = [];
  msgs: Message[] = [];
  reportType: typeof ReportType = ReportType;
  reportCategory: typeof ReportCategory = ReportCategory;
  reportData: any = [];
  dateRange: any[];
  filterSection: boolean = true;
  showKPIFilter: boolean = false;
  hostElement: any;
  svg: any;
  data: any[] = [];
  xField: any = "";
  yField: any = "";
  today: Date;
  sectorWiseOperationalKPIs: any[] = [];
  financialReport_AsOfDate: any;
  model: any = {
    fundIds: [],
    strategyIds: [],
    regionIds: [],
    countryIds: [],
    isAscending: false,
    portfolioCompany: null,
    selectedReportTypes: [this.reportType.CompanyRevenueGrowth],
    chartMetadetaList: [],
  };
  IsEnabled: boolean = false;
  Filter: Filter = new Filter();
  ReportId: number = 0;
  width:number = 0;
  @ViewChild("filter") filter: FilterControlComponent;
  loading: boolean = false;
  constructor(
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private accountService: AccountService,
    private fundService: FundService,
    private portfolioCompanyService: PortfolioCompanyService,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    let year = new Date();
    this.today = year;
    this.yearRange = "2000:" + year.getFullYear();
    this.setReportTypeList();
  }
  ngOnInit() {
    this.Filter = new Filter();
    this.Filter.ReportID = 47;
    this.ReportId = 47;
  }
  ngOnChanges(changes:any) {
    if(changes["selectedKpi"])
    {
     this.changeReportType(this.selectedKpi);
    }
  }

  public DoEnableFilters() {
    this.Filter.reportFilters = [];
    if (
      this.model.portfolioCompany !== null &&
      this.model.portfolioCompany !== undefined
    )
      this.Filter.reportFilters.push({
        FilterName: "PortfolioCompany",
        FilterValues: this.model.portfolioCompany.portfolioCompanyID.toString(),
      });
    if (
      this.model.sectorwiseOperationalKPIs !== null &&
      this.model.sectorwiseOperationalKPIs !== undefined
    ) {
      this.Filter.reportFilters.push({
        FilterName: "KPI",
        FilterValues: this.model.sectorwiseOperationalKPIs
          .map((s) => s.sectorwiseKPIID)
          .toString(),
      });
    }
    if (this.model.toDate != undefined) {
      let tempDate = this.model.toDate;
      if (this.model.fromDate !== null && this.model.fromDate !== undefined) {
        tempDate = this.model.fromDate + "=" + this.model.toDate;
      }
      this.Filter.reportFilters.push({
        FilterName: "EvaluationDate",
        FilterValues: tempDate,
      });
    }
    this.IsEnabled = true;
  }
  public GetItems(item: string, reportFilters: any[]) {
    if (reportFilters != undefined) {
      let values = reportFilters.find((s) => s.filterName === item);
      if (values !== undefined) values = values.filterValues.split(",");
      return values === undefined ? [] : values;
    }
  }
  bindReportMasterModel() {
    this.fundList = this.masterModel.fundList;
    this.fundsLoading = false;
    this.strategyList = this.masterModel.strategyList;
    this.strategyLoading = false;
    this.regionList = this.masterModel.regionList;
    this.regionLoading = false;
    this.countryList = this.masterModel.countryList;
    this.countryLoading = false;
    this.portfolioCompanyList = this.masterModel.portfolioCompanyList;
    this.portfolioCompanyLoading = false;
    this.setReportTypeList();
    this.getCompanyFinancialReports();
    this.masterModel.filterSection = true;
  }
  getCompanyFinancialReports() {
    this.loading = true;
    this.reportService.getReportData(this.model).subscribe(
      (result) => {
        this.selectedKPIs = this.model.sectorwiseOperationalKPIs;
        this.reportData = result["body"];
        let local = this;
        if (local.reportData.length > 0) {
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
              let asOfDate = "";
              let kpiList = Array.from(
                new Set(val.Results.map((item: any) => item.KPI))
              );
              kpiList.forEach(function (el: any) {
                let kpiReport = val.Results.filter(function (rpt: any) {
                  return el == rpt.KPI;
                });
                asOfDate = kpiReport
                  .map(function (e: any) {
                    return e.AsofDate;
                  })
                  .sort()
                  .reverse()[0];
                let d: any = { data: kpiReport, title: el, asOfDate: asOfDate };
                if (kpiReport.length > 0) {
                  d.unit = kpiReport[0].Info;
                }
                val.KPIReports.push(d);
              });
            }
            if (titles.length > 0) {
              val.title = titles[0].label;
              val.category = titles[0].category;
            }
            val.cols = [];
            val.Columns.forEach(function (value: any) {
              val.cols.push({ field: value, header: value });
            });

            val.shrinkSize = false;

            val.chartData = val.Results;
            if (
              val.chartData != undefined &&
              local.reportType.CompanyFinancialKPIReport
            )
              local.financialReport_AsOfDate = val.chartData
                .map(function (e: any) {
                  return e.AsofDate;
                })
                .sort()
                .reverse()[0];
          });
          if (local.reportData != null && local.reportData.length > 0) {
            local.model.chartMetadetaList = [
              {
                chartName: local.reportData[0].title,
                chartType: "LineMarkers",
                colNameX: local.reportData[0].Columns[0],
                colNameY: local.reportData[0].Columns[2],
              },
              {
                chartName: local.reportData[0].title,
                chartType: "ColumnClustered",
                colNameX: local.reportData[0].Columns[0],
                colNameY: local.reportData[0].Columns[1],
              },
            ];
          }
        }
        this.spinner.hide();
        this.CheckIfNoDataInReport();
        this.loading = false;
      },
      (error) => {
        this.CheckIfNoDataInReport();
        this.spinner.hide();
        this.loading = false;
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
  getOperationalKPIs(FilterItems: any) {
    let local = this;
    this.sectorWiseOperationalKPIsLoading = true;
    this.portfolioCompanyService
      .GetOperationalKPIList(
        this.model.portfolioCompany.portfolioCompanyID.toString()
      )
      .subscribe(
        (result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            this.sectorWiseOperationalKPIs = resp;
          }
          this.sectorWiseOperationalKPIsLoading = false;
          if (FilterItems !== null && FilterItems !== undefined) {
            local.model.sectorwiseOperationalKPIs = local.sectorWiseOperationalKPIs.filter(
              (s) => {
                return FilterItems.indexOf(s.sectorwiseKPIID.toString()) >= 0;
              }
            );
          }
        },
        (error) => {
          this.sectorWiseOperationalKPIsLoading = false;
        }
      );
  }
  onCompanyChange() {
    this.getOperationalKPIs(null);
    if (!this.showKPIFilter) {
      this.getCompanyFinancialReports();
    } 
    this.DoEnableFilters();
  }
  OnKPIChanged() {
   this.DoEnableFilters();
  }
  selectedKPIs: any[] = [];
  search(form: any) {
    this.getCompanyFinancialReports();
  }
  changeReportType(item: any) {
    if (item?.value == this.reportType.CompanyOperationalKPIGrowth) {
      this.showKPIFilter = true;
    } else {
      this.showKPIFilter = false;
    }
      this.model.selectedReportTypes = [item?.value];
      this.ReportId = this.model.selectedReportTypes[0];
      this.getCompanyFinancialReports();
  }
  setReportTypeList() {
    let holdingsByList = this.reportService.ReportTypeList.filter(function (
      ele: any,
      i: any
    ) {
      return ele.category == ReportCategory.CompanyFinancials;
    });
    this.holdingsByList = JSON.parse(JSON.stringify(holdingsByList));
    this.holdingsByList = this.holdingsByList.filter(function (
      ele: any,
      i: any
    ) {
      delete ele.category;
      return ele;
    });

    this.model.selectedReportTypes = [this.holdingsByList[0].value];
  }
  minDate: Date | null = null;
  onDateSelect() {
    this.model.fromDate = null;
    this.model.toDate = null;
    if (this.dateRange.length > 0) {
      let toDate = this.dateRange[1];
      if (
        new Date(this.dateRange[0]).toDateString() ==
          new Date(this.dateRange[1]).toDateString() &&
        new Date(this.dateRange[0]).toDateString() ==
          new Date(this.today).toDateString()
      ) {
        this.model.fromDate = this.dateRange[0];
        this.model.toDate = this.dateRange[1];
      } else if (
        new Date(this.dateRange[0]).toDateString() ==
        new Date(this.today).toDateString()
      ) {
        this.model.fromDate = null;
        this.model.toDate = this.dateRange[0];
        this.minDate = this.today;
      } else if (toDate == null) {
        this.model.fromDate = null;
        this.model.toDate = this.dateRange[0];
        this.minDate = new Date(this.model.toDate);
        this.minDate.setDate(this.minDate.getDate() + 1);
      } else {
        if (
          new Date(this.dateRange[0]).toDateString() ==
          new Date(this.dateRange[1]).toDateString()
        ) {
          this.dateRange.pop();
          this.model.toDate = this.dateRange[0];
          this.minDate = new Date(this.model.toDate);
          this.minDate.setDate(this.minDate.getDate() + 1);
        } else {
          this.model.fromDate = this.dateRange[0];
          this.model.toDate = this.dateRange[1];
          this.minDate = null;
        }
      }
    }
    this.DoEnableFilters();
  }
  onDateClear() {
    this.minDate = null;
    this.model.fromDate = null;
    this.model.toDate = null;
  }
  onResized(event: any) {
    this.width = event?.newRect?.width;
  }
}
