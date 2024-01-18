import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { FundService } from "../../services/funds.service";
import {
  ErrorMessage,
  MiscellaneousService,
  PeriodTypeEnum,
  PeriodTypeFilterEnum,
} from "../../services/miscellaneous.service";
import { FilterControlComponent } from "../custom-controls/filter-control.component";
import { Filter } from "../custom-controls/Filter.model";
@Component({
  selector: "dataExtraction",
  templateUrl: "./portfolioCompany-DataExtraction.component.html",
})
export class PortfolioCompanyDataExtractionComponent implements OnInit {
  fundList: any[];
  KPIList: any[];
  allPortfolioCompanyList: any[];
  portfolioCompanyList: any[];
  portfolioCompanyLoading: boolean;
  KPITypeList: any[] = [
    { KPITypeId: "1", KPIType: "Investment KPIs", category: "Investment KPIs" },
    { KPITypeId: "2", KPIType: "Company KPIs", category: "Company KPIs" },
    { KPITypeId: "3", KPIType: "Impact KPIs", category: "Impact KPIs" },
    {
      KPITypeId: "4",
      KPIType: "Financials - Balance Sheet",
      category: "Balance Sheet",
    },
    {
      KPITypeId: "5",
      KPIType: "Financials - Profit and Loss",
      category: "Profit and Loss",
    },
    {
      KPITypeId: "6",
      KPIType: "Financials - Cash Flow",
      category: "Cash Flow",
    },
    { KPITypeId: "7", KPIType: "Standing Data", category: "Standing Data" },
  ];
  allKPIList: any[];
  periods = [];
  periodTypes = [];
  yearRange: any;
  totalRecords: any;
  loading = false;
  msgTimeSpan: number;
  message: any;
  selectedFunds: any[];
  selectedPeriod: any = { type: "" };
  selectedKPIType: any;
  selectedPeriodType: any;
  selectedMonths: any = [];
  selectedMonth: any;
  previousSelectedFund: any;
  model: any = {
    selectedCompanies: [],
    selectedKPIs: [],
    selectedPeriods: [],
    selectedPeriodType: "",
  };
  previewDateRangeModel: any = {
    selectedCompanies: [],
    selectedKPIs: [],
    kpiType: "",
  };
  kpiQueryModel: any = {
    portfolioCompanyIds: "",
    kpiType: "",
  };
  IsEnabled: boolean = false;
  Filter: Filter = new Filter();
  ReportId: number = 100;
  yearOptions: any = [];
  monthOptions: any = [];
  quarterOptions: any = [
    { value: "Q1", text: "Q1", number: 1 },
    { value: "Q2", text: "Q2", number: 2 },
    { value: "Q3", text: "Q3", number: 3 },
    { value: "Q4", text: "Q4", number: 4 },
  ];
  NoRecordFound: boolean = false;
  dataFilter: any = {};
  exportFinancialReportLoading: boolean = false;
  settings: any ;
  companyKPIsList: any[] = [];
  @ViewChild("filter") filter: FilterControlComponent;
  constructor(
    private miscService: MiscellaneousService,
    private _fundService: FundService,
    private accountService: AccountService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    let year = new Date();
    this.yearRange = "2000:" + year.getFullYear();
    this.dataFilter.fromQuarter = "";
    this.dataFilter.toQuarter = "";
    this.dataFilter.fromYear = "";
    this.dataFilter.toYear = "";
    this.yearOptions = this.miscService.bindYearList();
    this.monthOptions = this.miscService.bindMonthList();
  }

  ngOnInit() {
    this.settings = {
      disabled: this.KPIList != null && this.KPIList.length > 0 ? false : true,
    };
    this.InitializeDataExtractionPage();
  }

  InitializeDataExtractionPage() {
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.getFundList(null);
    this.getPortfolioCompanyList();
  }

  getFundList(event: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: null,
        sortOrder: 1,
      };
    }
    this._fundService.getFundsList({ paginationFilter: event }).subscribe({
      next:(result) => {
        let resp = result.body;
        if (resp != null && result.code == "OK") {
          this.fundList = resp.fundList;
          this.totalRecords = resp.totalRecords;
        } else {
          this.fundList = [];
          this.totalRecords = 0;
        }
      },
      error:(error) => {
      }
  });
  }

  public GetItems(item: string, reportFilters: any[]) {
    if (reportFilters != undefined) {
      let values = reportFilters.find((s) => s.filterName === item);
      if (values !== undefined) values = values.filterValues.split(",");
      return values === undefined ? [] : values;
    }
  }

  DoEnableFilters() {
    this.Filter.ReportID = this.ReportId;
    this.Filter.reportFilters = [];
    if (this.model.selectedCompanies.length > 0) {
      this.Filter.reportFilters.push({
        FilterName: "PortfolioCompany",
        FilterValues: this.model.selectedCompanies
          .map((s) => s.portfolioCompanyID)
          .toString(),
      });
    }
    if (this.selectedKPIType !== undefined && this.selectedKPIType !== null) {
      this.Filter.reportFilters.push({
        FilterName: "KPIMaster",
        FilterValues: this.selectedKPIType.KPITypeId.toString(),
      });
    }
    if (this.model.selectedKPIs.length > 0) {
      this.Filter.reportFilters.push({
        FilterName: "KPIType",
        FilterValues: this.model.selectedKPIs.map((s) => s.kpiid).toString(),
      });
    }
    if (
      this.selectedPeriodType !== null &&
      this.selectedPeriodType !== undefined
    ) {
      this.Filter.reportFilters.push({
        FilterName: "PeriodType",
        FilterValues: this.selectedPeriodType.type,
      });
    }
    if (
      this.selectedPeriod !== null &&
      this.selectedPeriod !== undefined &&
      this.selectedPeriod.type !== undefined
    ) {
      if (this.selectedPeriod.type.length > 0) {
        this.Filter.reportFilters.push({
          FilterName: "Period",
          FilterValues: this.selectedPeriod.type.toString(),
        })[0];
      }
    }
    if (
      this.dataFilter.Quarter !== null &&
      this.dataFilter.Quarter !== undefined
    ) {
      this.Filter.reportFilters.push({
        FilterName: "Quarter",
        FilterValues: this.dataFilter.Quarter.text.toString(),
      });
    }
    if (
      this.dataFilter.fromQuarter !== null &&
      this.dataFilter.fromQuarter !== undefined
    ) {
      if (this.dataFilter.fromQuarter.text !== undefined) {
        this.Filter.reportFilters.push({
          FilterName: "fromQuarter",
          FilterValues: this.dataFilter.fromQuarter.text.toString(),
        });
      }
    }

    if (
      this.dataFilter.fromYear !== null &&
      this.dataFilter.fromYear !== undefined
    ) {
      if (this.dataFilter.fromYear.value != undefined) {
        this.Filter.reportFilters.push({
          FilterName: "fromYear",
          FilterValues: this.dataFilter.fromYear.value.toString(),
        });
      }
    }
    if (
      this.dataFilter.toQuarter !== null &&
      this.dataFilter.toQuarter !== undefined
    ) {
      if (this.dataFilter.toQuarter.value !== undefined) {
        if (this.dataFilter.toQuarter.value.length > 0) {
          this.Filter.reportFilters.push({
            FilterName: "toQuarter",
            FilterValues: this.dataFilter.toQuarter.value.toString(),
          });
        }
      }
    }
    if (
      this.dataFilter.toYear !== null &&
      this.dataFilter.toYear !== undefined
    ) {
      if (this.dataFilter.toYear.value !== undefined) {
        this.Filter.reportFilters.push({
          FilterName: "toYear",
          FilterValues: this.dataFilter.toYear.value.toString(),
        });
      }
    }
    if (this.selectedMonth !== undefined && this.selectedMonth !== null) {
      this.Filter.reportFilters.push({
        FilterName: "Month",
        FilterValues: this.selectedMonth.text.toString(),
      });
    }
    if (this.selectedMonths !== undefined && this.selectedMonths !== null) {
      if (this.selectedMonths.length > 0) {
        this.Filter.reportFilters.push({
          FilterName: "Months",
          FilterValues: this.selectedMonths.map((s) => s.number).toString(),
        });
      }
    }

    this.IsEnabled = true;

    if (this.filter.selectReport != null) {
      if(this.filter.SelectedReport.userReportId==undefined){
        this.filter.SelectedReport=this.filter.selectReport;
      }
      this.filter.IsItemSelected = true;
      this.filter.IsEnabled = true;
    }
  }
  validateKPIPeriod(item: any) { 
    //existing functionality 
  }
  LoadSavedFilter(item: any) {

    let reportFilters = item.reportFilters;
    if (reportFilters !== undefined) {
      this.model.selectedCompanies = this.portfolioCompanyList.filter((s) => {
        return (
          this.GetItems("PortfolioCompany", reportFilters).indexOf(
            s.portfolioCompanyID.toString()
          ) >= 0
        );
      });

      if (this.GetItems("KPIMaster", reportFilters).length > 0) {
        this.selectedKPIType = this.KPITypeList.filter((s) => {
          return (
            this.GetItems("KPIMaster", reportFilters).indexOf(
              s.KPITypeId.toString()
            ) >= 0
          );
        })[0];
      }

      this.getPCKPIListByCompany(reportFilters);
      this.SetPeriodTypes();
      if (this.GetItems("Period", reportFilters).length > 0) {
        this.selectedPeriod = this.periods.filter((s) => {
          return (
            this.GetItems("Period", reportFilters).indexOf(s.type.toString()) >=
            0
          );
        })[0];
      }
      if (this.GetItems("Quarter", reportFilters).length > 0) {
        this.dataFilter.Quarter = this.quarterOptions.filter((s) => {
          return (
            this.GetItems("Quarter", reportFilters).indexOf(
              s.text.toString()
            ) >= 0
          );
        })[0];
      }
      if (this.GetItems("fromQuarter", reportFilters).length > 0) {
        this.dataFilter.fromQuarter = this.quarterOptions.filter((s) => {
          return (
            this.GetItems("fromQuarter", reportFilters).indexOf(
              s.text.toString()
            ) >= 0
          );
        })[0];
      }
      if (this.GetItems("fromYear", reportFilters).length > 0) {
        this.dataFilter.fromYear = this.yearOptions.filter((s) => {
          return (
            this.GetItems("fromYear", reportFilters).indexOf(
              s.text.toString()
            ) >= 0
          );
        })[0];
      }
      if (this.GetItems("toQuarter", reportFilters).length > 0) {
        this.dataFilter.toQuarter = this.quarterOptions.filter((s) => {
          return (
            this.GetItems("toQuarter", reportFilters).indexOf(
              s.text.toString()
            ) >= 0
          );
        })[0];
      }
      if (this.GetItems("toYear", reportFilters).length > 0) {
        this.dataFilter.toYear = this.yearOptions.filter((s) => {
          return (
            this.GetItems("fromYear", reportFilters).indexOf(
              s.text.toString()
            ) >= 0
          );
        })[0];
      }
      if (this.GetItems("Months", reportFilters).length > 0) {
        this.selectedMonths = this.monthOptions.filter((s) => {
          return (
            this.GetItems("Months", reportFilters).indexOf(
              s.number.toString()
            ) >= 0
          );
        });
      }
      if (this.GetItems("Month", reportFilters).length > 0) {
        this.selectedMonth = this.monthOptions.filter((s) => {
          return (
            this.GetItems("Month", reportFilters).indexOf(s.text.toString()) >=
            0
          );
        })[0];
      }
    }

  }
  onFundChange(event: any) {
    let selectedFunds = event.value;
    if (selectedFunds.length == 0) {
      this.portfolioCompanyList = this.allPortfolioCompanyList;
      return;
    }
    if (this.model.selectedCompanies.length != 0 && selectedFunds.length != 2) {
      if (
        this.previousSelectedFund != undefined &&
        selectedFunds[0].fundID != this.previousSelectedFund[0].fundID
      ) {
        this.model.selectedCompanies = [];
      }
    }
    this.portfolioCompanyList = [];
    selectedFunds.forEach((element) => {
      this.portfolioCompanyList = this.portfolioCompanyList.concat(
        this.allPortfolioCompanyList.filter(
          (x) => x.fundDetails.fundID == element.fundID
        )
      );
    });
    this.previousSelectedFund = selectedFunds;
  }

  getPortfolioCompanyList() {
    this.portfolioCompanyList = null;
    this.portfolioCompanyLoading = true;
    this.miscService.getPortfolioCompanyList({}).subscribe({
      next:(result) => {
        let resp = result;
        if (resp != null && resp.code == "OK") {
          this.portfolioCompanyList = resp.body.portfolioCompanyList;
          this.allPortfolioCompanyList = resp.body.portfolioCompanyList;
        }
        setTimeout(
          function (local: any) {
            local.portfolioCompanyLoading = false;
          },
          5,
          this
        );
      },
      error:(error) => {
        this.portfolioCompanyLoading = false;
      }
  });
  }
  onPeriodClear() {
    this.selectedPeriod = "";
  }
  onPeriodTypeClear() {
    this.selectedPeriodType = "";
  }
  onCompanySelection(event: any) {
    this.getPCKPIListByCompany(null);
    if (
      this.model.selectedCompanies.length > 1 &&
      this.selectedPeriodType != undefined &&
      this.selectedPeriodType.type == PeriodTypeFilterEnum.YTD
    ) {
      this.selectedPeriodType = "";
    }
    if (
      this.selectedKPIType != undefined &&
      (this.selectedKPIType.KPIType == "Company KPIs" ||
        this.selectedKPIType.KPIType == "Financials - Profit and Loss" ||
        this.selectedKPIType.KPIType == "Financials - Cash Flow")
    ) {
      this.periodTypes =
        this.model.selectedCompanies.length > 1
          ? [
              { type: PeriodTypeFilterEnum.Monthly },
              { type: PeriodTypeFilterEnum.Quarterly },
              { type: PeriodTypeFilterEnum.Annual },
              { type: PeriodTypeFilterEnum.LTM },
            ]
          : [
              { type: PeriodTypeFilterEnum.Monthly },
              { type: PeriodTypeFilterEnum.Quarterly },
              { type: PeriodTypeFilterEnum.YTD },
              { type: PeriodTypeFilterEnum.Annual },
              { type: PeriodTypeFilterEnum.LTM },
            ];
    }
    if (
      this.selectedKPIType != undefined &&
      this.selectedKPIType.KPIType == "Financials - Balance Sheet"
    ) {
      this.periodTypes = [
        { type: PeriodTypeFilterEnum.Monthly },
        { type: PeriodTypeFilterEnum.Quarterly },
        { type: PeriodTypeFilterEnum.Annual },
      ];
    }
    this.GetDateRangeForDataExtractionReport();
    this.DoEnableFilters();
  }

  clearKPIsNotAvailableInSelectedCompanies() {
    let newList: any = [];
    this.model.selectedKPIs.forEach((element) => {
      let found = this.KPIList.filter((y) => y.itemName == element.itemName);
      let item = found.length > 0 ? found[0] : null;
      if (item != null) newList.push(item);
    });
    this.model.selectedKPIs = newList;
  }

  getPCKPIListByCompany(reportFilters: any) {
    let local = this;
    let filterItems = this.GetItems("KPIType", reportFilters);
    if (
      this.model.selectedCompanies.length == 0 ||
      this.selectedKPIType == null ||
      this.selectedKPIType.category == null
    )
      return;
    let companyList = this.model.selectedCompanies;

    if (companyList.length != 0) {
      let portfolioCompanyIdList = Array.prototype.map
        .call(companyList, function (item) {
          return item.portfolioCompanyID;
        })
        .join(",");
      this.kpiQueryModel = {
        portfolioCompanyIds: portfolioCompanyIdList,
        kpiType: this.selectedKPIType.category,
      };
      this.miscService.getKPIListByPCIdsKPIType(this.kpiQueryModel).subscribe({
        next:(response) => {
          this.allKPIList = response.body;
          this.KPIList = response.body;
          this.setting();
          this.clearKPIsNotAvailableInSelectedCompanies();
          if (filterItems != null) {
            local.model.selectedKPIs = local.KPIList.filter((s) => {
              return (
                local
                  .GetItems("KPIType", reportFilters)
                  .indexOf(s.kpiid.toString()) >= 0
              );
            });
            this.GetDateRangeForDataExtractionReport();
            local.selectedPeriodType = local.periodTypes.filter((s) => {
              return (
                local
                  .GetItems("PeriodType", reportFilters)
                  .indexOf(s.type.toString()) >= 0
              );
            })[0];
            local.model.selectedPeriodType = local.selectedPeriodType.type;
          }
        },
        error:(error) => {
          this.message = this.miscService.showAlertMessages(
            "error",
            error.message
          );
        }
    });
    }
  }

  setting() {
    this.settings = {
      singleSelection: false,
      text: "Select Multiple",
      selectAllText: "Select All",
      unSelectAllText: "Select All",
      searchPlaceholderText: "Search KPI",
      enableSearchFilter: true,
      disabled:
        this.KPIList != null || this.KPIList != undefined ? false : true,
      badgeShowLimit: 1,
      groupBy: "category",
    };
  }

  getKPITypesFromKPIs() {
    this.KPITypeList = [];
    let index = 1;
    let distinctElementsByCategory = this.allKPIList.filter((item, i, arr) => {
      return arr.indexOf(arr.find((t) => t.category === item.category)) === i;
    });
    distinctElementsByCategory.forEach((element) => {
      this.KPITypeList.push({ KPITypeId: index, KPIType: element.category });
      index = index + 1;
    });
  }
  onKPITypeSelection(event: any) {
    if (
      this.selectedKPIType != null &&
      this.selectedKPIType.category != null &&
      this.selectedKPIType.category != undefined
    ) {
      this.getPCKPIListByCompany(null);
    }
    this.SetPeriodTypes();
    this.model.selectedKPIs = [];
    this.selectedPeriodType = "";
    this.GetDateRangeForDataExtractionReport();
    this.DoEnableFilters();
  }

  private SetPeriodTypes() {
    if (
      this.selectedKPIType.KPIType == "Company KPIs" ||
      this.selectedKPIType.KPIType == "Financials - Profit and Loss" ||
      this.selectedKPIType.KPIType == "Financials - Cash Flow"
    ) {
      this.selectedPeriod = "";
      this.periods = [
        { type: PeriodTypeEnum.Last1Year },
        { type: PeriodTypeEnum.Last3Years },
        { type: PeriodTypeEnum.Last5Years },
        { type: PeriodTypeEnum.Last10Years },
      ];

      this.periodTypes =
        this.model.selectedCompanies.length > 1
          ? [
              { type: PeriodTypeFilterEnum.Monthly },
              { type: PeriodTypeFilterEnum.Quarterly },
              { type: PeriodTypeFilterEnum.Annual },
              { type: PeriodTypeFilterEnum.LTM },
            ]
          : [
              { type: PeriodTypeFilterEnum.Monthly },
              { type: PeriodTypeFilterEnum.Quarterly },
              { type: PeriodTypeFilterEnum.YTD },
              { type: PeriodTypeFilterEnum.Annual },
              { type: PeriodTypeFilterEnum.LTM },
            ];
    } else if (this.selectedKPIType.KPIType == "Financials - Balance Sheet") {
      this.selectedPeriod = "";
      this.periods = [
        { type: PeriodTypeEnum.Last1Year },
        { type: PeriodTypeEnum.Last3Years },
        { type: PeriodTypeEnum.Last5Years },
        { type: PeriodTypeEnum.Last10Years }
      ];
      this.periodTypes = [
        { type: PeriodTypeFilterEnum.Monthly },
        { type: PeriodTypeFilterEnum.Quarterly },
        { type: PeriodTypeFilterEnum.Annual },
      ];
    } else if (this.selectedKPIType.KPIType == "Impact KPIs") {
      this.periodTypes = [
        // TODO: since Annual report for impact KPI we are not doing as per Rohit { type: PeriodTypeFilterEnum.Annual },
        { type: PeriodTypeFilterEnum.YTD },
      ];
      this.selectedPeriod = "";
      this.periods = [
        { type: PeriodTypeEnum.Last1Year },
        { type: PeriodTypeEnum.Last3Years },
        { type: PeriodTypeEnum.Last5Years },
        { type: PeriodTypeEnum.Last10Years },
      ];
    } else {
      //investment kpi
      this.periodTypes = [
        { type: PeriodTypeFilterEnum.Quarterly },
        { type: PeriodTypeFilterEnum.Annual },
      ];
      this.selectedPeriod = "";
      this.periods = [
        { type: PeriodTypeEnum.Last1Year },
        { type: PeriodTypeEnum.Last3Years },
        { type: PeriodTypeEnum.Last5Years },
        { type: PeriodTypeEnum.Last10Years },
        { type: PeriodTypeEnum.Custom },
      ];
    }
  }

  filterKPIBasedOnKPITypes() {
    if (this.selectedKPIType == undefined || this.allKPIList == undefined)
      return;
    let filteredKPIs = this.allKPIList.filter(
      (x) => x.category == this.selectedKPIType.category
    );
    this.KPIList = filteredKPIs;
  }

  onKPIItemSelect(event: any) {
    if (this.KPIList.length == 0) {
      //existing functionality
    } else {
      this.GetDateRangeForDataExtractionReport();
    }
    this.DoEnableFilters();
  }

  GetDateRangeForDataExtractionReport() {
    if (
      this.model.selectedCompanies.length == 0 ||
      this.model.selectedKPIs.length == 0 ||
      this.selectedKPIType == null ||
      this.selectedKPIType.category == null ||
      this.KPIList == null ||
      this.KPIList.length == 0
    ) {
      this.companyKPIsList = [];
      return;
    }
    this.previewDateRangeModel = {
      selectedCompanies: this.model.selectedCompanies,
      selectedKPIs: this.model.selectedKPIs,
      kpiType: this.selectedKPIType.category,
    };

    this.miscService
      .getDateRangeForDataExtractionReport(this.previewDateRangeModel)
      .subscribe({
       next: (response: any) => {
          if (response.status == 204) {
            this.companyKPIsList = [];
          } else {
            let res = response.body;
            if (
              res != null &&
              res.body != null &&
              res.body.companyKPIDateRangeList != null
            ) {
              this.companyKPIsList = res.body.companyKPIDateRangeList;
            }
          }
        },
       error: (error) => {
          this.companyKPIsList = [];
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.SomethingWentWrong
          );
        }
  });
  }

  OnKPIDeSelect(event: any) {
    // existing functionality
  }

  onKPISelectAll(event: any) {
    if (this.KPIList.length == 0) {
      // existing functionality
    }
  }

  onKPIDeSelectAll(event: any) {}

  onPeriodTypeSelect() {
    this.model.selectedPeriodType = this.selectedPeriodType.type;
    if (this.model.selectedPeriodType.type != PeriodTypeFilterEnum.Monthly) {
      this.selectedMonths = "";
    }
    if (
      this.model.selectedPeriodType.type != PeriodTypeFilterEnum.LTM ||
      this.model.selectedPeriodType.type != PeriodTypeFilterEnum.YTD
    ) {
      this.selectedMonth = undefined;
      this.dataFilter.Quarter = undefined;
    }
    this.DoEnableFilters();
  }

  onPeriodSelect() {
    this.setPeriodDatesForModel();
    this.DoEnableFilters();
  }

  search(form: any) {
    this.setPeriodDatesForModel();
    this.ExportFinancialReport();
  }

  ExportFinancialReport() {
    if (
      this.model.selectedKPIs.length == 0 &&
      (this.KPIList == undefined || this.KPIList.length == 0)
    ) {
      if (this.selectedKPIType != undefined && this.selectedKPIType != "") {
        this.message = this.miscService.showAlertMessages(
          "error",
          ErrorMessage.NoDataAvailableForCompanyKPIType
        );
        return;
      }
      this.message = this.miscService.showAlertMessages(
        "error",
        ErrorMessage.SelectAtleastOneKpi
      );
      return;
    }
    if (
      this.selectedKPIType.KPIType != "Standing Data" &&
      (this.selectedPeriodType == "" ||
        this.model.selectedPeriods.length == 0 ||
        this.model.selectedCompanies.length == 0 ||
        this.model.selectedKPIs.length == 0)
    ) {
      this.message = this.miscService.showAlertMessages(
        "error",
        ErrorMessage.SelectRequiredFields
      );
      return;
    }
    this.exportFinancialReportLoading = true;
    this.miscService.exportFinancialReport(this.model).subscribe({
     next: (response) => {
        if (response.status == 204) {
          this.message = this.miscService.showAlertMessages(
            "error",
            ErrorMessage.NoRecordFoundMessage
          );
          this.NoRecordFound = true;
          this.exportFinancialReportLoading = false;
        } else {
          this.NoRecordFound = false;
          this.miscService.downloadExcelFile(response);
          this.exportFinancialReportLoading = false;
        }
      },
      error:(error) => {
        this.message = this.miscService.showAlertMessages(
          "error",
          ErrorMessage.SomethingWentWrong
        );
        this.exportFinancialReportLoading = false;
      }
  });
  }

  setPeriodDatesForModel() {
    let periodType =
      this.selectedPeriod != undefined || this.selectedPeriod.type != ""
        ? this.selectedPeriod.type
        : null;
    this.model.selectedPeriods = [];
    this.model.isAscending = true;
    if (periodType == PeriodTypeEnum.Last1Year) {
      this.model.selectedPeriods.push(PeriodTypeEnum.Last1Year);
    }
    if (periodType == PeriodTypeEnum.Last3Years) {
      this.model.selectedPeriods.push(PeriodTypeEnum.Last3Years);
    }
    if (periodType == PeriodTypeEnum.Last5Years) {
      this.model.selectedPeriods.push(PeriodTypeEnum.Last5Years);
    }
    if (periodType == PeriodTypeEnum.Last10Years) {
      this.model.selectedPeriods.push(PeriodTypeEnum.Last10Years);
    }
    if (
      this.selectedPeriod != undefined &&
      this.selectedPeriod.type == "Custom"
    ) {
      if (this.dataFilter.fromYear == "" || this.dataFilter.toYear == "")
        return;
      let toDate = new Date(Date.UTC(+this.dataFilter.toYear.value, 11, 31));
      let fromDate = new Date(Date.UTC(+this.dataFilter.fromYear.value, 0, 1));
      if (this.selectedPeriodType.type == PeriodTypeFilterEnum.Quarterly) {
        if (
          this.dataFilter.fromQuarter != "" &&
          this.dataFilter.toQuarter != ""
        ) {
          toDate = this.miscService.getQuarterLastDateByQuarter(
            this.dataFilter.toQuarter.value,
            this.dataFilter.toYear.value
          );
          fromDate = this.miscService.getQuarterLastDateByQuarter(
            this.dataFilter.fromQuarter.value,
            this.dataFilter.fromYear.value
          );
        } else return;
      }

      this.model.fromDate = fromDate;
      this.model.toDate = toDate;
      this.model.isAscending = true;
      this.model.filter = PeriodTypeEnum.Custom;
      this.model.selectedPeriods.push(PeriodTypeEnum.Custom);
    }

    if (this.selectedMonths != undefined) {
      let selectedMonths: any = [];
      if (this.selectedMonths.length > 0) {
        this.selectedMonths.forEach((element) => {
          selectedMonths.push(+this.miscService.getMonthNumber(element.value));
        });
        this.model.selectedMonths = selectedMonths;
      }
    }
    if (this.selectedMonth != undefined) {
      let selectedMonths: any = [];
      selectedMonths.push(
        +this.miscService.getMonthNumber(this.selectedMonth.value)
      );
      this.model.selectedMonths = selectedMonths;
    }
    if (
      this.selectedPeriod != undefined &&
      (this.selectedPeriodType.type == PeriodTypeEnum.YearToDate ||
        this.selectedPeriodType.type == PeriodTypeFilterEnum.LTM) &&
      this.selectedKPIType != undefined &&
      this.selectedKPIType.KPIType == "Impact KPIs" &&
      this.dataFilter.Quarter != undefined
    ) {
      this.model.tradingRecordPeriod = this.dataFilter.Quarter.value;
    }
  }

  validateFromQuarter() {
    this.DoEnableFilters();
    if (this.dataFilter.fromQuarter == "") return;
    if (this.dataFilter.fromQuarter.number > this.dataFilter.toQuarter.number) {
      this.message = this.miscService.showAlertMessages(
        "error",
        "'From Quarter' must be less than or equal to 'To Quarter'"
      );
      this.dataFilter.fromQuarter = "";
      this.changeDetectorRef.detectChanges();
      return;
    }
  }

  validateToQuarter() {
    this.DoEnableFilters();
    if (this.dataFilter.toQuarter == "") return;
    if (this.dataFilter.fromQuarter.number > this.dataFilter.toQuarter.number) {
      this.message = this.miscService.showAlertMessages(
        "error",
        "'To Quarter' must be greater than or equal to 'From Quarter'"
      );
      this.dataFilter.toQuarter = "";
      this.changeDetectorRef.detectChanges();
      return;
    }
  }

  validateSelectedFromYear() {
    this.DoEnableFilters();
    if (this.dataFilter.toYear == "") return;
    if (this.dataFilter.fromYear.value > this.dataFilter.toYear.value) {
      this.message = this.miscService.showAlertMessages(
        "error",
        "'From year' must be less than or equal to 'To Year'"
      );
      this.dataFilter.fromYear = "";
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.setPeriodDatesForModel();
  }

  validateSelectedToYear() {
    this.DoEnableFilters();
    if (this.dataFilter.fromYear == "") return;
    if (this.dataFilter.toYear.value < this.dataFilter.fromYear.value) {
      this.message = this.miscService.showAlertMessages(
        "error",
        "'To year' must be greater than or equal to 'From Year'"
      );
      this.dataFilter.toYear = "";
      this.changeDetectorRef.detectChanges();
      return;
    }
    this.setPeriodDatesForModel();
  }

  onMonthsSelect(event: any) {
    this.DoEnableFilters();
  }
  onMonthSelect(event: any) {
    this.DoEnableFilters();
  }

  resetForm(form: any) {
    form.resetForm();
    this.InitializeDataExtractionPage();
    this.fundList = [];
    this.allPortfolioCompanyList = [];
    this.allKPIList = [];
    this.KPIList = [];
    this.periodTypes = [];
    this.selectedFunds = [];
    this.selectedKPIType = undefined;
    this.selectedPeriod = "";
    this.selectedPeriodType = undefined;
    this.model.selectedCompanies = [];
    this.model.selectedKPIs = [];
    this.model.selectedPeriods = [];
    this.model.selectedPeriodType = undefined;
    this.model.selectedMonths = [];
    this.selectedMonths = [];
    this.companyKPIsList = [];
    this.NoRecordFound = false;
  }
}
