import { animate, style, transition, trigger } from "@angular/animations";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { UntypedFormGroup, NgForm } from "@angular/forms";
import * as d3 from "d3";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/api/message";
import { SelectItem } from "primeng/api";
import { AccountService } from "../../../services/account.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import {
  ReportCategory,
  ReportService,
  ReportType,
} from "../../../services/report.service";
import { AbstractFilterStrategy } from "../reports";
import { AppSettingService } from '../../../services/appsettings.service';
import {AppConfig} from "../../../common/models";
import {ConvertValueUnitreport} from "../utils/convertvalueunitreport";
import {NumberDecimalConst } from "src/app/common/constants";
@Component({
  selector: "holding-values",
  templateUrl: "./holding-values.report.html",
  animations: [
    trigger("fadeInOut", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(":leave", [
        // :leave is alias to '* => void'
        animate(500, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class HoldingValuesComponent
  extends AbstractFilterStrategy
  implements OnInit {
  @ViewChild("divBarChart") chartContainer: ElementRef;
  @ViewChild("form") form: NgForm;
  @Input() masterModel: any = {};
  reportForm: UntypedFormGroup;
  fundList: any[];
  fundListClone: any[];
  regionList: any[];
  regionListClone: any[];
  countryList: any[];
  countryListClone: any[];
  strategyList: any[];
  strategyListClone: any[];
  fundHoldingStatusList: any[];
  fundHoldingStatusListClone: any[];
  msgTimeSpan: number;
  fundsLoading: boolean;
  strategyLoading: boolean;
  regionLoading: boolean;
  countryLoading: boolean;
  fundHoldingStatusLoading: boolean;
  showStatusFilter: boolean = true;
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
  hostElement: any;
  svg: any;
  data: any[] = [];
  xField: any = "";
  yField: any = "";
  today: Date;
  loading: boolean = false;
  model: any = {
    fundIds: [],
    strategyIds: [],
    regionIds: [],
    countryIds: [],
    isAscending: false,
    selectedReportTypes: [this.reportType.InvestmentsAboveCost],
    chartMetadetaList: [],
  };
  width:number = 0;
  appConfig: AppConfig;
  NumberDecimalConst = NumberDecimalConst;
  constructor(
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private accountService: AccountService,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private appSettingService : AppSettingService
  ) {
    super();
    this.appConfig = this.appSettingService.getConfig();
    ConvertValueUnitreport.appConfig = this.appConfig;
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    let year = new Date();
    this.today = year;
    this.yearRange = "2000:" + year.getFullYear();

    this.setReportTypeList();
  }
  ngOnInit() {
    this.masterModel.filterSection = false;
    this.Init(4);
  }

  OnStatusChanged(event: any) {
    this.DoEnableFilters();
  }
  bindReportMasterModel() {
    this.fundList = this.masterModel.fundList;
    if (this.fundList) {
      this.fundListClone = JSON.parse(JSON.stringify(this.fundList));
      this.fundsLoading = false;
    }
    this.strategyList = this.masterModel.strategyList;
    if (this.strategyList) {
      this.strategyListClone = JSON.parse(JSON.stringify(this.strategyList));
      this.strategyLoading = false;
    }

    this.fundHoldingStatusList = this.masterModel.fundHoldingStatusList;
    if (this.fundHoldingStatusList) {
      this.fundHoldingStatusListClone = JSON.parse(
        JSON.stringify(this.fundHoldingStatusList)
      );
      this.fundHoldingStatusLoading = false;
    }

    this.regionList = this.masterModel.regionList;
    if (this.regionList) {
      this.regionListClone = JSON.parse(JSON.stringify(this.regionList));
      this.regionLoading = false;
    }

    this.countryList = this.masterModel.countryList;
    if (this.countryList) {
      this.countryListClone = JSON.parse(JSON.stringify(this.countryList));
      this.countryLoading = false;
    }

    this.countryLoading = false;
    this.setReportTypeList();
    this.resetForm(this.form);
    this.masterModel.filterSection = false;
  }
  LoadSavedFilter(item: any) {
    this.countryList=this.countryListClone;
    this.fundList=this.fundListClone
    super.LoadSavedFilter(item);
  }

  getTopHoldingReports() {
    this.loading = true;
    this.reportService.getReportData(this.model).subscribe(
      (result) => {
        this.reportData = result["body"];
        let local = this;

        if (local.reportData.length > 0) {
          local.reportData= ConvertValueUnitreport.toMillion(local.reportData);        
  
          local.reportData.forEach(function (val: any, i: any) {
            let titles = local.reportService.ReportTypeList.filter(function (
              ele: any,
              i: any
            ) {
              return val.ReportType == ele.value;
            });

            if (titles.length > 0) {
              val.title = titles[0].label;
              val.category = titles[0].category;
            }
            val.cols = [];
            val.Columns.forEach(function (value: any, i: any) {
              val.cols.push({ field: value, header: value });
            });

            val.shrinkSize = false;

            local.xField = val.Columns[0];
            local.yField = val.Columns[1];
            local.data = val.Results;
            if (val.category != ReportCategory.InvestmentsByCost) {
              val.chartData = val.Results;
            }
          });

          if (local.reportData != null && local.reportData.length > 0) {
            if (
              this.reportData[0].category !=
              this.reportCategory.InvestmentsByCost
            ) {
              local.model.chartMetadetaList = [
                {
                  chartName: local.reportData[0].title,
                  chartType: "ColumnClustered",
                  colNameX: local.reportData[0].Columns[0],
                  colNameY: local.reportData[0].Columns[1],
                },
              ];
            }
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

  onRegionChange(event: any) {
    if (event.value != null && event.value.length > 0) {
      this.GetCountryListByRegionIds();
      let statusIdArray: any = [];
      this.fundList.forEach(function (fund: any) {
        fund.dealList.forEach(function (val: any) {
          if (val.portfolioCompanyFundHoldingList.length > 0) {
            val.portfolioCompanyFundHoldingList.forEach(function (
              fundStatus: any
            ) {
              if (
                fundStatus.fundHoldingStatus != null &&
                fundStatus.fundHoldingStatus.fundHoldingStatusID > 0
              ) {
                if (
                  statusIdArray.indexOf(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  ) == -1
                ) {
                  statusIdArray.push(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  );
                }
              }
            });
          }
        });
      });
      this.model.fundHoldingStatusIds = [];
      this.fundHoldingStatusList = this.fundHoldingStatusListClone.filter(
        function (status: any) {
          return statusIdArray.indexOf(status.fundHoldingStatusID) >= 0;
        }
      );
    } else {
      this.model.fundHoldingStatusIds = [];
      this.model.countryIds = [];
      this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
      this.model.fundIds = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
      this.model.fundHoldingStatusIds = [];
    }
    this.DoEnableFilters();
  }

  onCountryChange(event: any) {
    if (event.value != null && event.value.length > 0) {
      this.model.fundIds = [];
      this.model.fundHoldingStatusIds = [];
      let countryIds = event.value
        .filter(function (country: any) {
          return country != null;
        })
        .map(function (country: any) {
          return country.countryId;
        });
      this.fundList = this.fundListClone.filter(function (fund: any) {
        return countryIds.indexOf(fund.geographyDetail.country.countryId) >= 0;
      });

      let statusIdArray: any = [];
      this.fundList.forEach(function (fund: any) {
        fund.dealList.forEach(function (val: any) {
          if (val.portfolioCompanyFundHoldingList.length > 0) {
            val.portfolioCompanyFundHoldingList.forEach(function (
              fundStatus: any
            ) {
              if (
                fundStatus.fundHoldingStatus != null &&
                fundStatus.fundHoldingStatus.fundHoldingStatusID > 0
              ) {
                if (
                  statusIdArray.indexOf(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  ) == -1
                ) {
                  statusIdArray.push(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  );
                }
              }
            });
          }
        });
      });
      this.model.fundHoldingStatusIds = [];
      this.fundHoldingStatusList = this.fundHoldingStatusListClone.filter(
        function (status: any) {
          return statusIdArray.indexOf(status.fundHoldingStatusID) >= 0;
        }
      );
    } else {
      this.model.fundIds = [];
      this.model.fundHoldingStatusIds = [];
      this.fundList = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
    }
    this.DoEnableFilters();
  }
  OnFundChanged(event: any) {
    this.DoEnableFilters();
  }
  GetCountryListByRegionIds() {
    this.countryLoading = true;
    this.model.countryIds = [];
    this.countryList = [];
    this.model.fundIds = [];
    this.model.fundHoldingStatusIds = [];

    let regionIds =
      this.model.regionIds != undefined && this.model.regionIds.length > 0
        ? this.model.regionIds
        : [];
    this.miscService.getCountryListByRegionIds(regionIds).subscribe(
      (data) => {
        this.countryList = data["body"];
        this.countryLoading = false;
      },
      (error) => {
        this.countryLoading = false;
      }
    );
  }

  
  onStrategyChanged(event: any) {
    if (event.value != null && event.value.length > 0) {
      let strategyIds = event.value
        .filter(function (strategy: any) {
          return strategy != null;
        })
        .map(function (strategy: any) {
          return strategy.strategyID;
        });
      this.model.fundIds = [];
      this.fundList = [];
      this.fundList = this.fundListClone.filter(function (fund: any) {
        return strategyIds.indexOf(fund.strategyDetail.strategyID) >= 0;
      });

      let regionIds = this.fundList
        .filter(function (fund: any) {
          return (
            fund.geographyDetail != null &&
            fund.geographyDetail.region != null &&
            fund.geographyDetail.region.regionId > 0
          );
        })
        .map(function (fund: any) {
          return fund.geographyDetail.region.regionId;
        });
      let statusIdArray: any = [];
      this.fundList.forEach(function (fund: any) {
        fund.dealList.forEach(function (val: any) {
          if (val.portfolioCompanyFundHoldingList.length > 0) {
            val.portfolioCompanyFundHoldingList.forEach(function (
              fundStatus: any
            ) {
              if (
                fundStatus.fundHoldingStatus != null &&
                fundStatus.fundHoldingStatus.fundHoldingStatusID > 0
              ) {
                if (
                  statusIdArray.indexOf(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  ) == -1
                ) {
                  statusIdArray.push(
                    fundStatus.fundHoldingStatus.fundHoldingStatusID
                  );
                }
              }
            });
          }
        });
      });
      this.model.fundHoldingStatusIds = [];
      this.fundHoldingStatusList = this.fundHoldingStatusListClone.filter(
        function (status: any) {
          return statusIdArray.indexOf(status.fundHoldingStatusID) >= 0;
        }
      );

      let countryIds = this.fundList
        .filter(function (fund: any) {
          return (
            fund.geographyDetail != null &&
            fund.geographyDetail.country != null &&
            fund.geographyDetail.country.countryId > 0
          );
        })
        .map(function (fund: any) {
          return fund.geographyDetail.country.countryId;
        });

      this.model.regionIds = [];
      this.regionList = [];
      this.regionList = this.regionListClone.filter(function (region: any) {
        return regionIds.indexOf(region.regionId) >= 0;
      });

      if (regionIds.length > 0) {
        this.GetCountryListByRegionIds();
      } else {
        this.model.countryIds = [];
        this.countryList = [];
        this.countryList = this.countryListClone.filter(function (
          country: any
        ) {
          return countryIds.indexOf(country.countryId) >= 0;
        });
      }
    } else {
      this.model.strategyIds = [];
      this.strategyList = JSON.parse(JSON.stringify(this.strategyListClone));
      this.model.regionIds = [];
      this.regionList = JSON.parse(JSON.stringify(this.regionListClone));
      this.model.countryIds = [];
      this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
      this.model.fundIds = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
      this.model.fundHoldingStatusIds = [];
      this.fundHoldingStatusList = JSON.parse(
        JSON.stringify(this.fundHoldingStatusListClone)
      );
    }
    this.DoEnableFilters();
  }

  search(form: any) {
    this.getTopHoldingReports();
  }

  changeReportType(e: any) {
    let matchedReportTypes = this.reportService.ReportTypeList.filter(function (
      ele: any,
      i: any
    ) {
      return (
        ele.category == ReportCategory.InvestmentsByCost && ele.value == e.item
      );
    });
    this.showStatusFilter = matchedReportTypes.length > 0;

    this.model.selectedReportTypes = [e.item];
    this.ReportId = this.model.selectedReportTypes[0];
    this.DoEnableFilters();
    this.getTopHoldingReports();
  }

  showParentReport(report: any) {
    report.childChart = undefined;
    report.shrinkSize = false;
  }

  setReportTypeList() {
    let holdingsByList = this.reportService.ReportTypeList.filter(function (
      ele: any,
      i: any
    ) {
      return (
        ele.category == ReportCategory.InvestmentsByCost ||
        ele.category == ReportCategory.ValuationCharts
      );
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
    this.DoEnableFilters();
  }
  resetForm(form: any) {
    let reportTypes: any[] = [];
    if (this.model.selectedReportTypes != undefined) {
      reportTypes = JSON.parse(JSON.stringify(this.model.selectedReportTypes));
    }

    form.resetForm();
    this.changeDetectorRef.detectChanges();

    this.model = {
      fundIds: [],
      strategyIds: [],
      regionIds: [],
      countryIds: [],
      isAscending: false,
      selectedReportTypes: [this.reportType.InvestmentsAboveCost],
    };
    if (reportTypes != null && reportTypes.length > 0) {
      this.model.selectedReportTypes = reportTypes;
    }

    this.minDate = null;
    this.getTopHoldingReports();
  }

  showHideFilter() {
    this.masterModel.filterSection = !this.masterModel.filterSection;
  }

  childChart: any = {};

  onRegionClicked(item: any, parentReport: any) {
    let selectedRegions = this.regionList.filter(function (el, i) {
      return el.region == item.xValue;
    });

    let node: any = d3
      .select("svg") //svg
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node();

    if (selectedRegions.length > 0) {
      let childModel = JSON.parse(JSON.stringify(this.model));
      childModel.regionIds = JSON.parse(JSON.stringify(selectedRegions));
      childModel.selectedReportTypes = [this.reportType.CompanyCountsByCountry];

      let local = this;

      local.reportService.getReportData(childModel).subscribe(
        (result) => {
          local.childChart = result["body"];

          if (local.childChart.length > 0) {
            local.childChart.forEach(function (val: any, i: any) {
              let titles = local.holdingsByList.filter(function (
                ele: any,
                i: any
              ) {
                return ele.value == val.ReportType;
              });
              if (titles.length > 0) {
                val.title = titles[0].label;
              }
              parentReport.parentChart = true;
              parentReport.previousWidth = item.currentWidth;

              if (node != null && node.parentNode != null) {
                let html = node.parentNode.innerHTML;
                let imgsrc = "data:image/svg+xml;base64," + btoa(html);

                d3.select("#svgdataurl").html("");
                d3.select("#svgdataurl")
                  .append("div")
                  .attr("class", "chart-bg")
                  .append("img")
                  .attr("src", imgsrc)
                  .style("width", "100%");
              }
            });
            local.changeDetectorRef.detectChanges();
            parentReport.childChart = local.childChart[0];
          }

          local.spinner.hide();
        },
        (error) => {
          local.accountService.redirectToLogin(error);

          local.spinner.hide();
        }
      );
    }
  }

  onResized(event: any) {
    this.width = event?.newRect?.width;
  }
}
