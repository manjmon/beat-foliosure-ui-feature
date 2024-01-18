import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { isEmpty } from '../../../utils/utils';
import * as d3 from "d3";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/api/message";
import { SelectItem } from "primeng/api";
import { AccountService } from "../../../services/account.service";
import { DealService } from "src/app/services/deal.service";
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import {
  ReportCategory,
  ReportService,
  ReportType,
} from "../../../services/report.service";
import { AbstractFilterStrategy } from "../reports";
import { FilterControlComponent } from "../../custom-controls/filter-control.component";
import { AppSettingService } from '../../../services/appsettings.service';
import { AppConfig } from "../../../common/models";
import { ConvertValueUnitreport } from "../utils/convertvalueunitreport";
import { PermissionService } from "src/app/services/permission.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { NumberDecimalConst,FundEnum, CommonPCConstants } from "src/app/common/constants";
import { FilterService } from "src/app/services/filter.services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "attribution-reports",
  templateUrl: './attribution.report.html',
  styleUrls: ['./attribution.report.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AttributionReportsComponent
  extends AbstractFilterStrategy
  implements OnInit {
  reportForm: FormGroup;
  @Input() masterModel: any = {};
  @ViewChild("form") form: NgForm;
  @ViewChild("pDialog") pDialog: ElementRef;
  @ViewChild("filter") filter: FilterControlComponent;
  fundList: any[];
  fundListClone: any[];
  optionsList: any[];
  regionList: any[];
  regionListClone: any[];
  disablePrimaryButton: boolean = true;
  userReportName: string = "";
  selectReport: any = {};
  DuplicateRecord: boolean = false;
  EditDuplicateRecord: boolean = false;
  countryList: any[];
  countryListClone: any[];
  strategyList: any[];
  strategyListClone: any[];
  msgTimeSpan: number;
  fundsLoading: boolean;
  strategyLoading: boolean;
  customWidth: any = '303px';
  regionLoading: boolean;
  countryLoading: boolean;
  filterSection: boolean = true;
  showRangeFilter: boolean = false;
  confirmSave: boolean = false;
  confirmDelete: boolean = false;
  yearRange: any;
  viewByList: SelectItem[];
  SelectedReport: any = {};
  NewlyAddedId: number = 0;
  holdingsByList: SelectItem[];
  EditMode: boolean = false;
  cols: any[] = [];
  msgs: Message[] = [];
  reportType: typeof ReportType = ReportType;
  reportData: any = [];
  collapsed = true;
  dateRange: any[];
  today: Date;
  rangeInvalid: boolean = false;
  partsRequired: boolean = false;
  isReportDataVisible: boolean = false;
  DeleteDisabled: boolean = true;
  IsItemSelected: boolean = false;
  width: number = 0;
  model: any = {
    fundIds: [],
    strategyIds: [],
    regionIds: [],
    countryIds: [],
    isAscending: false,
    selectedReportTypes: [this.reportType.AttributionBySector],
    chartMetadetaList: [],
  };
  types: any = [
    { label: "Top", value: false, icon: "" },
    { label: "Bottom", value: true, icon: "" },
  ];
  loading: boolean = false;
  appConfig: AppConfig;
  isTaabo: boolean = false;
  isDisplayCountry:boolean = true;
  isDisplayRegion:boolean = true;
  regionCountryMappingList =  [];
  fundInvestmentLocation: any = {
    regionIds: [],
    countryIds: []
  }
  NumberDecimalConst = NumberDecimalConst;
  FundEnum = FundEnum;
  enableTab: any = 'Graphs';
  tabList: ITab[] = [];
  ShowFilterUpdated: boolean = false;
  frozenTableColumns: any = [];
  tableColumns: any = [];
  tableData: any =[];
  isLarissa:boolean = false;
  constructor(
    private reportService: ReportService,
    private dealservice:DealService,
    private filterService: FilterService,
    private miscService: MiscellaneousService,
    private accountService: AccountService,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private appSettingService: AppSettingService,
    private permissionService: PermissionService,
    private portfolioCompanyService: PortfolioCompanyService,
    private toastrService: ToastrService,
  ) {
    super();
    if(window.location.host == CommonPCConstants.LarissaHost || window.location.host == CommonPCConstants.PizarroHost)
		{
		  this.isLarissa = true;
		}
    this.appConfig = this.appSettingService.getConfig();
    ConvertValueUnitreport.appConfig = this.appConfig;
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    let year = new Date();
    this.today = year;
    this.yearRange = "2000:" + year.getFullYear();
    this.isTaabo = this.permissionService.isCheckTaabo();
    this.getTabList()
    this.setReportTypeList();
  }
  ngOnInit() {
    this.getDealLatestQuarter();
    this.masterModel.filterSection = false;
    this.isTaabo = this.permissionService.isCheckTaabo();
    this.Init(14);
  }
  getTabList() {
    this.tabList = [
        {
            active: true,
            name: "Graphs"
        }
        , {
            active: false,
            name: "Data"
        }
    ];
}

  onResized(event: any) {
    this.width = event?.newRect?.width;
  }

  LoadSavedFilter(item: any) {
    this.countryList = this.countryListClone;
    this.fundList = this.fundListClone;
    let reportFilters = item.reportFilters;
    if (reportFilters !== undefined) {
      this.model.strategyIds = this.strategyListClone.filter((s) => {
        return (
          this.GetItems("Strategy", reportFilters).indexOf(s.strategy) >= 0
        );
      });
      this.model.regionIds = this.regionListClone.filter((s) => {
        return this.GetItems("Region", reportFilters).indexOf(s.region) >= 0;
      });
      this.countryList = this.countryListClone.filter(s =>
        this.model.regionIds.find(x => x.regionId == s["regionId"]) != null
      );
      this.model.countryIds = this.countryList.filter((s) => {
        return this.GetItems("Country", reportFilters).indexOf(s.country) >= 0;
      });
      this.model.fundIds = this.fundListClone.filter((s) => {
        return this.GetItems("Fund", reportFilters).indexOf(s.fundName) >= 0;
      });
      let ToDate = this.GetItems("EvaluationDate", reportFilters);
      this.model.toDate = null;
      this.model.fromDate = null;
      this.dateRange = null;
      if (ToDate.length > 0) {
        ToDate = ToDate[0].split("=");
        this.model.toDate = new Date(ToDate[0]);
        this.dateRange = [];
        this.dateRange.push(new Date(ToDate[0]));
        if (ToDate.length > 1) {
          this.model.toDate = new Date(ToDate[1]);
          this.dateRange.push(new Date(ToDate[1]));
        }
      } else {
        this.model.toDate == null;
      }
    }
  }
  DoEnableFilters() {
    this.Filter.ReportID = this.model.selectedReportTypes[0];
    if (this.model.fundHoldingStatusIds === undefined)
      this.model.fundHoldingStatusIds = []; //patch
    if (
      this.model.strategyIds.length > 0 ||
      this.model.regionIds.length > 0 ||
      this.model.countryIds.length > 0 ||
      this.model.fundIds.length > 0 ||
      this.model.fundHoldingStatusIds.length > 0 ||
      this.model.toDate !== undefined ||
      this.model.quarterYear !== undefined

    ) {
      this.Filter.reportFilters = [];
      if (this.model.strategyIds.length > 0)
        this.Filter.reportFilters.push({
          FilterName: "Strategy",
          FilterValues: this.model.strategyIds
            .map((s) => s.strategy)
            .toString(),
        });
      if (this.model.regionIds.length > 0)
        this.Filter.reportFilters.push({
          FilterName: "Region",
          FilterValues: this.model.regionIds.map((s) => s.region).toString(),
        });
      if (this.model.countryIds.length > 0)
        this.Filter.reportFilters.push({
          FilterName: "Country",
          FilterValues: this.model.countryIds.map((s) => s.country).toString(),
        });
      if (this.model.fundIds.length > 0) {
        this.Filter.reportFilters.push({
          FilterName: "Fund",
          FilterValues: this.model.fundIds.map((s) => s.fundName).toString(),
        });
      }
      if (this.model.fundHoldingStatusIds.length > 0) {
        this.Filter.reportFilters.push({
          FilterName: "Status",
          FilterValues: this.model.fundHoldingStatusIds
            .map((s) => s.status)
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
      if (this.filter?.selectReport != null) {
        this.filter.IsItemSelected = true;
        this.filter.IsEnabled = true;
      }
    } else {
      this.IsEnabled = false;
      this.Filter.reportFilters = [];
    }
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

    this.regionCountryMappingList = this.masterModel.regionCountryMappingList;

    this.regionList = this.masterModel.regionList;
    if (this.regionList) {
      this.regionListClone = JSON.parse(JSON.stringify(this.regionList));
      this.regionLoading = false;
    }

    this.countryList = this.miscService.sortArray(this.masterModel.regionCountryMappingList, "country");
    if (this.countryList) {
      this.countryListClone = JSON.parse(JSON.stringify(this.countryList));
      this.countryLoading = false;
    }
    this.setReportTypeList();
    this.resetForm(this.form);
    this.masterModel.filterSection = false;
  }

  getAttributionReports() {
    this.rangeInvalid = false;
    this.partsRequired = false;
    this.loading = true;
    if (this.model.quarterYear == undefined || this.model.quarterYear == null)
      this.model.quarterYear = this.masterModel?.quarterYear;
    this.loading = true;
    this.reportData = [];
    this.reportService.getReportData(this.model).subscribe({
      next:(result) => {
        this.tableData = [];
        this.reportData = result["body"];
        let local = this;

        if (local.reportData.length > 0) {
          local.reportData = ConvertValueUnitreport.toMillion(local.reportData);

          this.reportData.filter(function (report: any, _reportIndex: any) {
            let reportType = local.reportService.ReportTypeList.filter(function (
              ele: any,
              _i: any
            ) {
              return report.ReportType == ele.value;
            });
            if (reportType.length > 0) {
              report.ReportType = reportType[0].label;
            }
            report.cols = [];
            report.Columns.forEach(function (val: any, _i: any) {
              report.cols.push({ field: val, header: val });
            });
            return report;
          });

          if (this.reportData != null && this.reportData[0]?.Results.length > 0) {
            this.tableData = Object.assign([], this.reportData[0]?.Results);
            if (Object.values(this.reportData[0]?.FooterRow) && this.tableData?.length > 0) {
              this.tableData.push(this.reportData[0]?.FooterRow);
            }  

            this.tableColumns = this.reportData[0]?.cols?.filter(
              (x) => (x.field != this.reportData[0]?.cols[0]['field'])
            );
            this.frozenTableColumns = this.reportData[0]?.cols?.filter(
              (x) => (x.field == this.reportData[0]?.cols[0]['field'])
            );
            if (this.reportData[0].FooterRow.Min != undefined) {
              this.model.rangeStart = this.reportData[0].FooterRow.Min;
              this.model.rangeEnd = this.reportData[0].FooterRow.Max;
            } else {
              this.model.rangeStart = null;
              this.model.rangeEnd = null;
            }

            this.model.chartMetadetaList = [
              {
                chartName: "Capital Invested",
                chartType: "Pie",
                colNameX: this.reportData[0].Columns[0],
                colNameY: "% of Total Capital",
              },
              {
                chartName: "Unrealized Value",
                chartType: "Pie",
                colNameX: this.reportData[0].Columns[0],
                colNameY: "% of Unrealized Value",
              },
              {
                chartName: "Realized Value",
                chartType: "Pie",
                colNameX: this.reportData[0].Columns[0],
                colNameY: "% of Realized Value",
              },
              {
                chartName: "Total Value",
                chartType: "Pie",
                colNameX: this.reportData[0].Columns[0],
                colNameY: "% of Total Value",
              },
              {
                chartName: "TVPI",
                chartType: "ColumnClustered",
                colNameX: this.reportData[0].Columns[0],
                colNameY: "TVPI",
              },
              {
                chartName: "Number of Companies",
                chartType: "ColumnClustered",
                colNameX: this.reportData[0].Columns[0],
                colNameY: "# of Companies",
              },
            ];
          }
        }
        this.spinner.hide();
        this.CheckIfNoDataInReport();
        this.loading = false;
      },
      error:(_error) => {

        this.CheckIfNoDataInReport();
        this.spinner.hide();
        this.loading = false;
      }
  });
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
    } else {
      this.model.fundHoldingStatusIds = [];
      this.model.countryIds = [];
      this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
      if(!this.isFundSelected()) {
        this.model.fundIds = [];
        this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
      }
     
      this.model.fundHoldingStatusIds = [];
    }
    this.DoEnableFilters();
  }
  onCountryChange(event: any) {
    if(!this.isFundSelected()) {
      this.model.fundIds = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
    }
    if (event.value != null && event.value.length > 0) {      
      this.model.fundHoldingStatusIds = [];
      
    } else {     
     
      this.model.fundHoldingStatusIds = [];
     
    }
    this.DoEnableFilters();
  }

  isFundSelected = (): boolean => {
    return this.model.fundIds.length > 0;
  }

  getRegion_Countrys(fundIds = []) {
    this.loading = true;
    this.portfolioCompanyService.get_RegionCountrys_ByFundId(fundIds).subscribe(async (res: any) => {
      this.loading = false;
      this.regionList = [];
      this.regionCountryMappingList = [];
      this.regionList = res?.regionList;
      this.regionCountryMappingList = res?.regionCountryList
      if (fundIds.length > 0) {
        let regionIds = this.miscService.removeDuplicates(this.regionCountryMappingList.map(s => s.regionId) || []);
        this.regionList = this.regionList.filter(s =>
          regionIds.includes(s["regionId"])
        );
        this.fundInvestmentLocation.regionIds = this.regionList;
        let countryIds = this.miscService.removeDuplicates(this.regionCountryMappingList.map(s => s.countryId) || []);
        this.countryList = this.regionCountryMappingList.filter(s =>
          countryIds.includes(s["countryId"])
        );
        this.fundInvestmentLocation.countryIds = this.countryList.map(s => s);
        if (this.masterModel?.regionIds?.length > 0) {
          this.masterModel.regionIds = this.masterModel?.regionIds.filter(s =>
            regionIds.includes(s["regionId"])
          );
          this.masterModel.countryIds = this.masterModel?.countryIds.filter(s =>
            countryIds.includes(s["countryId"]) && this.masterModel?.regionIds.find(x => x.regionId == s["regionId"]) != null
          );
          this.countryList = this.countryList.filter(s =>
            this.masterModel.regionIds.find(x => x.regionId == s["regionId"]) != null
          );
        }
      }
    });
  }
  OnFundChanged = (_event: any) => {
  if (this.model.fundIds.length > 0) {
    let fundIds = this.model.fundIds.map((s) => s.fundID);
    this.getRegion_Countrys(fundIds)
    this.DoEnableFilters();
  }
  else {
    this.model.countryIds = [];
    this.model.regionIds = [];
    this.regionList = this.masterModel.regionList;
    this.countryList = this.miscService.sortArray(this.masterModel.regionCountryMappingList, "country");
    this.DoEnableFilters();
  }
  }
  
  GetCountryListByRegionIds = () => {
    this.countryLoading = true;   
    if (this.isFundSelected()) {
      this.model.countryIds = this.model.countryIds.filter(s =>
        this.model.regionIds.find(x => x.regionId == s["regionId"]) != null
      );
      this.countryList = this.fundInvestmentLocation.countryIds.filter(s =>
        this.model.regionIds.find(x => x.regionId == s["regionId"]) != null
      );
    }
    else {
      this.model.countryIds = [];
      this.countryList = [];
      this.countryList = this.regionCountryMappingList.filter(s =>
        this.model.regionIds.find(x => x.regionId == s["regionId"]) != null
      );
    }
    this.countryLoading = false;
    this.DoEnableFilters();
  }

  GetCountryListByRegionId() {
    this.countryLoading = true;
    this.model.countryIds = [];
    this.countryList = [];
    let regionIds =
      this.model.regionIds != undefined && this.model.regionIds.length > 0
        ? this.model.regionIds
        : [];
        this.loading = true;
    this.miscService.getCountryListByRegionIds(regionIds).subscribe(
      (data) => {
        this.loading = false;
        this.countryList = data["body"];
        this.countryLoading = false;
      },
      (_error) => {
        this.loading = false;
        this.countryLoading = false;

      }
    );
    this.DoEnableFilters();
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
    this.masterModel.fundIds = [];
    this.fundList = [];
    this.fundList = this.fundListClone.filter(function (fund: any) {
      return strategyIds.indexOf(fund.strategyDetail.strategyID) >= 0;
    });
    let fundIds = this.fundList.map((s) => s.fundID);
    this.getRegion_Countrys(fundIds);
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
    }
    this.DoEnableFilters();
  }

  search(_form: any) {
    this.getAttributionReports();
  }

  changeReportType(e: any) {
    if (
      e.item == this.reportType.AtributionByOwnershipStake ||
      e.item == this.reportType.AttributionByHoldingPeriod ||
      e.item == this.reportType.AttributionByInvestmentSize ||
      e.item == this.reportType.AttributionByInvestmentYear
    ) {
      this.showRangeFilter = true;
    } else {
      this.showRangeFilter = false;
      this.model.rangeStart = this.model.rangeEnd = this.model.rangeParts = null;
    }
    if (
      (e.item == this.reportType.AttributionByFund ||
      e.item == this.reportType.AttributionByStrategy) && this.isTaabo
    ) {
      this.isDisplayCountry = false;
      this.isDisplayRegion = false;
    }
    else{
      this.isDisplayCountry = true;
      this.isDisplayRegion = true;
    }
    
    this.model.selectedReportTypes = [e.item];
    this.ReportId = this.model.selectedReportTypes[0];
    this.resetForm(this.form);
  }

  setReportTypeList() {
    let reportList = this.isTaabo ? this.reportService.ReportTypeList.filter(x => x.category == ReportCategory.Attribution && x.label != "By Region" && x.label != "By Realized/Unrealized Status" && x.label != "By Exit Method" && x.label != "By Board Seat" && x.label != "By Security Type" && x.label != "By Deal Sourcing" && x.label != "By Investment Year" && x.label != "By Investment Size" && x.label != "By Ownership Stake" && x.label != "By Holding Period") : this.reportService.ReportTypeList;
    let holdingsByList = reportList.filter(function (
      ele: any,
      _i: any
    ) {
      return ele.category == ReportCategory.Attribution;
    });
    this.holdingsByList = JSON.parse(JSON.stringify(holdingsByList));
    if (this.isTaabo)
      this.holdingsByList = this.holdingsByList.filter(x => x.label != "By Region" && x.label != "By Realized/Unrealized Status" && x.label != "By Exit Method" && x.label != "By Board Seat" && x.label != "By Security Type" && x.label != "By Deal Sourcing" && x.label != "By Investment Year" && x.label != "By Investment Size" && x.label != "By Ownership Stake" && x.label != "By Holding Period");
    if(window.location.host == CommonPCConstants.ExeterHost)
    {
      this.holdingsByList = this.holdingsByList.filter(x => x.label !="By Currency");
    }
    if(window.location.host == CommonPCConstants.MonmouthHost)
    {
      this.holdingsByList = this.holdingsByList.filter(x => x.label !="By Currency");
    }
    this.holdingsByList = this.holdingsByList.filter(function (
      ele: any,
      _i: any
    ) {
      delete ele.category;
      return ele;
    });

    this.model.selectedReportTypes = [this.holdingsByList[0].value];
  }

  minDate: Date | null = null;
  onDateSelect() {
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
      this.DoEnableFilters();
    }
  }

  onDateClear() {
    this.minDate = null;
    this.model.fromDate = null;
    this.model.toDate = null;
    this.DoEnableFilters();
  }

  exportAttributionReport() {
    this.reportService
      .exportReports(this.model)
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  showHideFilter() {
    this.masterModel.filterSection =
    !this.masterModel.filterSection;
  }
  resetForm(form: any) {
    this.selectReport = null;
    this.EditDuplicateRecord = false;
    this.IsItemSelected = false;
    this.tableData = [];
    this.tableColumns = [];
    this.frozenTableColumns=[];
    this.regionList = this.masterModel.regionList;
    this.countryList = this.masterModel.regionCountryMappingList;
    this.strategyList = this.masterModel.strategyList;
    this.fundList = this.masterModel.fundList;
    this.IsEnabled = false;
    this.LoadFilters();
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
      selectedReportTypes: [this.reportType.AttributionBySector],
    };
    if (reportTypes != null && reportTypes.length > 0) {
      this.model.selectedReportTypes = reportTypes;
    }
    this.minDate = null;
    this.getAttributionReports();
  }

  displayFullView: boolean = false;
  fullViewModel: any = {};
  fullViewWidth: any;
  showFullView(model: any) {
    //Full View we are disable for Mobile and tablet view
    if (screen.width <= 480) {
      return;
    }
    this.fullViewModel = model;
    this.displayFullView = true;
    this.fullViewWidth = window.innerWidth * 0.9;
  }

  hideFullView() {
    this.displayFullView = false;
  }

  // onResized(event: any) {

  // }

  onShowDislog(_event: any) {
  }

  showParentReport(report: any) {
    report.childChart = undefined;
    report.shrinkSize = false;
  }

  onRegionClicked(item: any, parentReport: any) {
    let selectedRegions = this.regionList.filter(function (el, _i) {
      return el.region == item.xValue;
    });

    let node: any = d3
      .select("#divCompanyCountBarChart")
      .select("svg") //svg
      .attr("version", 1.1)
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node();

    if (selectedRegions.length > 0) {
      let childModel = JSON.parse(JSON.stringify(this.model));
      childModel.regionIds = JSON.parse(JSON.stringify(selectedRegions));
      childModel.selectedReportTypes = [this.reportType.CompanyCountsByCountry];

      let local = this;
      this.loading = true;
      local.reportService.getReportData(childModel).subscribe({
        next:(result) => {
          this.loading = false;
          let childChart = result["body"];

          if (childChart.length > 0) {
            childChart.forEach(function (val: any, _i: any) {
              let titles = local.holdingsByList.filter(function (
                ele: any,
                _i: any
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

                d3.select("#divChildDonutChart").html("");
                d3.select("#divChildDonutChart")
                  .append("div")
                  .attr("class", "chart-bg")
                  .append("img")
                  .attr("src", imgsrc)
                  .style("width", "100%");
              }
            });
            local.changeDetectorRef.detectChanges();
            parentReport.childChart = childChart[0];
          }

          local.spinner.hide();
        },
        error:(error) => {
          local.accountService.redirectToLogin(error);

          local.spinner.hide();
        }
    });
    }
  }
  quarterYearPicker(event) {
    this.model.quarterYear = event.quarter + ' ' + event.year;
    this.DoEnableFilters();
  }
  selectTab(tab:any){
    if(tab.name == 'Graphs'){
      this.enableTab= 'Graphs'
    }else{
      this.enableTab='Data';
    }

  }

  OnFilterNamedChanged(event) {
    this.disablePrimaryButton = event.target.value.trim().length <= 0;
    this.userReportName = event.target.value;
    this.DuplicateRecord = false;
  }
  SaveFilters() {
    this.userReportName = "";
    this.confirmSave = true;
    this.disablePrimaryButton = true;
  }
  onCancel() {
    this.confirmSave = false;
    this.DuplicateRecord = false;
    this.EditDuplicateRecord = false;
  }
  OnDeleteFilter() {
    this.confirmDelete = true;
  }
  CancelDelete() {
    this.confirmDelete = false;
  }
  
  onSave() {
    delete this.Filter.ReportID;
    delete this.Filter.UserReportName;
    this.Filter.UserReportName = this.userReportName.trim();
    this.Filter.ReportID = this.ReportId;
    this.loading = true;
    this.filterService.SaveFilter(this.Filter).subscribe({
      next:(response) => {
        this.loading = false;
        if (response > 0) {
          this.toastrService.success(this.FundEnum.FilterAddedSuccesfully, "", { positionClass: "toast-center-center" });
          this.confirmSave = false;
          this.NewlyAddedId = response;
          this.IsItemSelected = false;
          this.LoadFilters();
        }
        if (response === -1) {
          this.DuplicateRecord = true;
        }
      },
      error:(_error) => { this.loading = false}
  });
  }
  Delete() {
    this.confirmDelete = false;
    this.loading = true;
    this.filterService.DeleteFilter(this.selectReport.userReportId).subscribe({
      next:(_response) => {
        this.loading = false;
        this.toastrService.success(this.FundEnum.FilterDeletedSuccesfully, "", { positionClass: "toast-center-center" });
        this.LoadFilters();
       this.resetForm(this.form);
        this.IsItemSelected = false;
      },
      error:(_error) => { this.loading = false;}
  });
    this.selectReport = null;
  }
  Update() {
    this.loading = true;
    let local = this;
    let temp = this.selectReport.userReportName;
    if (temp === undefined) {
      temp = this.selectReport;
      this.filterService
        .getFilter(this.SelectedReport.userReportId)
        .subscribe({
          next:(response) => {
            this.loading = false;
            delete response.UserReportName;
            response.UserReportName = temp;
            response.userReportId = this.SelectedReport.userReportId;
            this.loading = true;
            this.filterService.UpdateFilter(response).subscribe({
              next:(response) => {
                this.loading = false;
                this.IsItemSelected = false;
                if (response === -1) {
                  this.EditDuplicateRecord = true;
                } else {
                  this.ShowFilterUpdated = true;
                  local.IsEnabled = false;
                  this.EditDuplicateRecord = false;
                  setTimeout(() => {
                    local.ShowFilterUpdated = false;
                  }, 2000);
                }
              },
              error:(_error) => { this.loading = false;}
          });
          },
          error:(_error) => { this.loading = false;}
    });
    } else {
      this.loading = false;
      this.Filter.ReportID = this.SelectedReport.userReportId;
      this.Filter.UserReportName = temp;
      this.loading = true;
      this.filterService.UpdateFilter(this.Filter).subscribe({
        next:(response) => {
          this.loading = false;
          this.ShowFilterUpdated = true;
          local.IsEnabled = false;
          this.optionsList = response;
          this.IsItemSelected = false;
          setTimeout(() => {
            this.ShowFilterUpdated = false;
          }, 2000);
        },
        error:(_error) => { this.loading = false;}
    });
    }
  }
  OnFiltersSelected() {
    this.DeleteDisabled = false;
    this.SelectedReport = this.selectReport;
    this.loading = true;
    this.filterService.getFilter(this.selectReport.userReportId).subscribe({
      next:(response) => {
        this.loading = false;
        this.LoadSavedFilter(response)
        this.getAttributionReports();
      },
      error:(_error) => { this.loading = false;}
  });
  }
  LoadFilters() {
    let local = this;
    this.loading = true;
    this.filterService.getFilters().subscribe({
      next:(response) => {
        this.loading = false;
        let SavedFilters = response.filter((s) => s.reportID == this.ReportId);
        if (SavedFilters !== undefined) {
          if (SavedFilters.length > 0) {
            this.EditMode = true;
            local.optionsList = SavedFilters;
            this.DeleteDisabled = true;
            if (local.NewlyAddedId > 0) {
              local.selectReport = SavedFilters.find(
                (s) => s.userReportId == local.NewlyAddedId
              );
              local.NewlyAddedId = 0;
              this.DeleteDisabled = false;
              this.IsEnabled = false;
            }
          } else {
            this.loading = false;
            this.EditMode = false;
          }
        }
      },
      error:(error) => this.accountService.redirectToLogin(error)
  });
  }
  getDealLatestQuarter(){
    this.loading = true;
    this.dealservice.getLatestDealQuarterYear().subscribe({ next:res => {
      this.loading = false;
      if (!isEmpty(res)) {
        this.masterModel.quarterYear=res?.keyValue;
        this.model.quarterYear=res?.keyValue;
      }
    },error:error=>{
      this.loading = false;
      console.log(error);
  }});
  }
  keyPressNumbers(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
