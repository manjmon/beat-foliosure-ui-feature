import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { Message } from "primeng/api/message";
import { LazyLoadEvent, SelectItem } from "primeng/api";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import {
  ReportCategory,
  ReportService,
  ReportType,
} from "../../../services/report.service";
import { AppSettingService } from '../../../services/appsettings.service';
import { AppConfig } from "../../../common/models";
import { ConvertValueUnitreport } from "../utils/convertvalueunitreport";
import { CommonPCConstants, NumberDecimalConst, TopHoldings } from "src/app/common/constants";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from "rxjs/operators";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { isNull, isEmpty } from '../../../utils/utils';
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { Filter } from "../../custom-controls/Filter.model";
import { FilterService } from "src/app/services/filter.services";
import { ToastrService } from "ngx-toastr";
import { DealService } from "src/app/services/deal.service";
@Component({
  selector: "top-holdings",
  templateUrl: "./top-holdings.report.html",
  styleUrls: ['./top-holdings.report.scss'],
})
export class TopHoldingsComponent
  implements OnInit, AfterViewInit {
  masterModel: any = {
    fundIds: [],
    strategyIds: [],
    regionIds: [],
    countryIds: [],
    isAscending: false,
    selectedReportTypes: [],
    chartMetadetaList: [],
    fundHoldingStatusIds: [],
    pCStatusIds: [],
    sortBy: 'desc',
    rowCount: 20,
    quarterYear: ''
  };
  pcStatus = [{ label: 'Private', value: 'Private' }, { label: 'Public', value: 'Public' }]
  isLoader: boolean = false;
  saveFilter: Filter;
  @ViewChild('collapsedevent') collapsedEvent: ElementRef;
  @ViewChild("form") form: NgForm;
  NumberDecimalConst = NumberDecimalConst;
  topholdingsConstants = TopHoldings;
  reportForm: FormGroup;
  fundList: any[];
  regionList: any[];
  countryList: any[];
  strategyList: any[];
  msgTimeSpan: number;
  fundsLoading: boolean;
  strategyLoading: boolean;
  regionLoading: boolean;
  countryLoading: boolean;
  fundHoldingStatusLoading: boolean;
  filterSection: boolean = false;
  yearRange: any;
  viewByList: SelectItem[];
  holdingsByList: SelectItem[];
  cols: any[] = [];
  msgs: Message[] = [];
  reportType: typeof ReportType = ReportType;
  reportData: any = [];
  frozenTableColumns = [];
  tableColumns = [];
  tableData = [];
  collapsed = true;
  topholdingReportId = 0;
  model: any = {
    fundIds: [],
    strategyIds: [],
    regionIds: [],
    countryIds: [],
    fundHoldingStatusIds: [],
    isAscending: false,
    selectedReportTypes: [this.reportType.TopHoldingInvestmentCost],
    chartMetadetaList: [],
    pCStatusIds: [],
    sortBy: 'desc',
    rowCount: 20,
    quarterYear: ''
  };
  types: any = [
    { label: "Top", value: false, icon: "" },
    { label: "Bottom", value: true, icon: "" },
  ];
  sortTypes: any = [
    { label: "Top", value: 'desc' },
    { label: "Bottom", value: 'asc' },
  ];
  isexits = false;
  reportID = 0;
  editMode = false;
  isSaveFilterPopup = false;
  title = "Save Filter";
  placeholderFilterName = "Enter filter Name";
  filterName = "";
  isApplySavePreset = false;
  disableConfirmSave = true;
  saveFiltersOptionsList = [];
  selectedFilterReport: any;
  sortByValue: string = "desc";
  placeholderName: string = 'Number of Companies';
  numberOfCompanies: number = 20;
  numberCount: number = 20;
  today: Date;
  loading: boolean = false;
  appConfig: AppConfig;
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('Trigger') menuTrigger: MatMenuTrigger;
  fundHoldingStatusList = [];
  portfolioCompanyList = [];
  regionCountryMappingList = [];
  fundListClone = [];
  strategyListClone = [];
  regionListClone = [];
  countryListClone = [];
  masterCompaniesCount = 0;
  fundLabel = "";
  regionLabel = "";
  countryLabel = "";
  strategyLabel = "";
  holdingLabel = "";
  confirmDelete = false;
  fundInvestmentLocation: any = {
    regionIds: [],
    countryIds: []
  }
  masterModelClone = [];
  customWidth: any = '301px';
  isLarissa:boolean = false;
  constructor(
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    protected changeDetectorRef: ChangeDetectorRef,
    private appSettingService: AppSettingService,
    private portfolioCompanyService: PortfolioCompanyService,
    private _filterServices: FilterService,
    private toastrService: ToastrService,
    private dealservice: DealService
  ) {
    this.saveFilter = <Filter>{}
    this.appConfig = this.appSettingService.getConfig();
    ConvertValueUnitreport.appConfig = this.appConfig;
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }
  ngOnInit() {
    if(window.location.host == CommonPCConstants.LarissaHost || window.location.host == CommonPCConstants.ExeterHost || window.location.host == CommonPCConstants.MonmouthHost || window.location.host == CommonPCConstants.PizarroHost)
		{
		  this.isLarissa = true;
		}
    this.getReportItems();
    this.getReportMasterData();
  }
  getDealLatestQuarter() {
    this.dealservice.getLatestDealQuarterYear().subscribe(res => {
      if (!isEmpty(res)) {
        this.masterModel.quarterYear = res?.keyValue;
        this.model.quarterYear = res?.keyValue;
      }
      this.defaultMasterModelClone();
      this.dataChangeCheck();
      this.getTopHoldingReports();
    }, error => {
      this.defaultMasterModelClone();
      this.dataChangeCheck();
      this.getTopHoldingReports();
    });
  }
  getFilterCount() {
    this.dealservice.getFilterLatestDealQuarterYearCount(this.model).subscribe(res => {
      if (!isEmpty(res)) {
        this.masterCompaniesCount = res.count;
      }
    });
  }
  defaultMasterModelClone() {
    this.masterModelClone = [];
    this.masterModelClone = JSON.parse(JSON.stringify(this.masterModel));

  }
  isNumericFunction(evt) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  ngAfterViewInit() {
    if (this.uiuxMenu != undefined) {
      (this.uiuxMenu as any).closed = this.uiuxMenu.closed
      this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  configureMenuClose(old: MatMenu['close']): MatMenu['close'] {
    const upd = new EventEmitter();
    feed(upd.pipe(
      filter(event => {
        if (event === 'click') {
          return false;
        }
        return true;
      }),
    ), old);
    return upd;
  }
  tabList = [];
  tabName = "";
  selectTab(tab: ITab) {
    if (tab.name == this.topholdingsConstants.TopHoldingByMostInvested || tab.name == this.topholdingsConstants.TopHoldingsByCompanyValuation)
      this.customWidth = 'calc(100% - 332px)';
    else
      this.customWidth = '301px';
    this.tabList.forEach((res: any) => res.active = false);
    tab.active = true;
    this.tabName = tab.name;
    this.model.selectedReportTypes = [tab.moduleId];
    this.reportID = tab.moduleId;
    this.getTopHoldingReports();
    this.dataChangeCheck();
  }
  getReportItems() {
    let holdingsByList = this.reportService?.ReportTypeList?.filter(function (
      ele: any) {
      return ele.category == ReportCategory.Holdings;
    });
    this.holdingsByList = JSON.parse(JSON.stringify(holdingsByList));
    this.holdingsByList = this.holdingsByList.filter(function (ele: any) {
      delete ele.category;
      return ele;
    });
    this.model.selectedReportTypes = [this.holdingsByList[0].value];
    this.holdingsByList.forEach((x, i) => {
      this.tabList.push({ name: x.label, active: i == 0 ? true : false, moduleId: x.value, aliasname: x.label.replace('Holdings', '') });
    });
    this.getDealLatestQuarter();
  }
  dataChangeCheck() {
    if (JSON.stringify(this.masterModelClone) !== JSON.stringify(this.masterModel)) {
      this.isApplySavePreset = false;
    } else {
      this.isApplySavePreset = true;
    }
  }
  onNumberOfCompaniesUpdate() {
    this.numberOfCompanies = this.numberCount == 0 ? this.numberOfCompanies : this.numberCount;
  }
  isMorethanNumber: boolean = false;
  onNumberOfCompanies(event) {
    this.isMorethanNumber = false;
    if (!isNull(event?.target?.value) && event?.target?.value?.trim() != '' && event?.target?.value?.trim() != 0) {
      this.numberCount = parseInt(event?.target.value);
      this.isMorethanNumber = true;
      if (this.numberCount <= this.masterCompaniesCount) {
        this.isMorethanNumber = false;
        this.model.rowCount = this.numberCount;
      }
    } else {
      this.isMorethanNumber = false;
      this.numberOfCompanies = 20;
    }
  }
  fundItems = [];
  loadFundsList(item) {
    this.fundItems = [];
    const arraylist = item.split('**');
    arraylist.forEach(element => {
      this.fundItems.push({ label: element.split('~')[0], value: element.split('~')[1] })
    });
  }
  onSortChange(event: string) {
    this.model.sortBy = event;
  }
  toCompanyValuationMillion(reportData: any): [] {
    let ReportData = reportData || [];
    ReportData.forEach(i => {
      if (i.Results && i.Results.length > 0) {
        i.Results.forEach(x => {
          x["Company Valuation"] = Object.keys(x["Company Valuation"]).length === 0 && x["Company Valuation"].constructor === Object ? "NA" : (x["Company Valuation"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
        });
      }
    });
    return ReportData;
  }
  toMillion(reportData: any): [] {
    let ReportData = reportData || [];
    ReportData.forEach(i => {
      if (i.Results && i.Results.length > 0) {
        i.Results.forEach(s => {
          s["Total Value"] = Object.values(s["Total Value"]).length == 0 ? null : (s["Total Value"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
          s["Current Invested Capital"] = Object.values(s["Current Invested Capital"]).length == 0 ? null : (s["Current Invested Capital"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
          s["Current Realized Value"] = Object.values(s["Current Realized Value"]).length == 0 ? null : (s["Current Realized Value"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
          s["Current Unrealized Value"] = Object.values(s["Current Unrealized Value"]).length == 0 ? null : (s["Current Unrealized Value"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
          s["Gain/(Loss)"] = Object.values(s["Gain/(Loss)"]).length == 0 ? null : (s["Gain/(Loss)"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
          s["TVPI"] = Object.values(s["TVPI"]).length == 0 ? null : s["TVPI"];
          if (Object.prototype.hasOwnProperty.call(s, "% Contribution")) {
            s["% Contribution"] = Object.values(s["% Contribution"]).length == 0 ? null : s["% Contribution"];
          }
        });
        i.FooterRow["Total Value"] = Object.values(i.FooterRow["Total Value"]).length == 0 ? null : (i.FooterRow["Total Value"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
        i.FooterRow["Current Invested Capital"] = Object.values(i.FooterRow["Current Invested Capital"]).length == 0 ? null : (i.FooterRow["Current Invested Capital"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
        i.FooterRow["Current Realized Value"] = Object.values(i.FooterRow["Current Realized Value"]).length == 0 ? null : (i.FooterRow["Current Realized Value"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
        i.FooterRow["Current Unrealized Value"] = Object.values(i.FooterRow["Current Unrealized Value"]).length == 0 ? null : (i.FooterRow["Current Unrealized Value"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
        i.FooterRow["Gain/(Loss)"] = Object.values(i.FooterRow["Gain/(Loss)"]).length == 0 ? null : (i.FooterRow["Gain/(Loss)"] / ConvertValueUnitreport.appConfig?.DefaultNumberSystem);
        i.FooterRow["TVPI"] = Object.values(i.FooterRow["TVPI"]).length == 0 ? null : i.FooterRow["TVPI"];
        if (Object.prototype.hasOwnProperty.call(i.FooterRow, "% Contribution")) {
          i.FooterRow["% Contribution"] = Object.values(i.FooterRow["% Contribution"]).length == 0 ? null : i.FooterRow["% Contribution"];
        }

      }
    });
    return ReportData;
  }
  getTopHoldingReports() {
    this.isLoader = true;
    this.getFilterCount();
    this.reportService.getReportData(this.model).subscribe(
      (result) => {
        this.reportData = result["body"];
        let local = this;
        if (local?.reportData?.length > 0) {
          if (this.tabName != this.topholdingsConstants.TopHoldingByMostInvested && this.tabName != this.topholdingsConstants.TopHoldingsByCompanyValuation)
            local.reportData = this.toMillion(local.reportData);
          else if (this.tabName == this.topholdingsConstants.TopHoldingsByCompanyValuation)
            local.reportData = this.toCompanyValuationMillion(local.reportData);
          else
            local.reportData = local.reportData;
          this.reportData.filter(function (report: any) {
            let reportType = local.reportService.ReportTypeList.filter(function (
              ele: any
            ) {
              return report.ReportType == ele.value;
            });
            if (reportType.length > 0) {
              report.ReportType = reportType[0].label;
            }
            report.cols = [];
            report.Columns.forEach(function (val: any) {
              report.cols.push({ field: val, header: val });
            });
            return report;
          });
          this.tableData = this.reportData[0]?.Results || [];
          if (this.tableData?.length < 20) {
            this.numberOfCompanies = this.tableData.length;
          }
          if (Object.values(this.reportData[0]?.FooterRow).includes("Total") && this.tableData?.length > 0) {
            this.tableData.push(this.reportData[0]?.FooterRow);
          }
          this.tableColumns = this.reportData[0]?.cols?.filter(
            (x) => (x.field != "Fund" && x.field != "Portfolio Company")
          );
          this.frozenTableColumns = this.reportData[0]?.cols?.filter(
            (x) => (x.field == "Fund" || x.field == "Portfolio Company")
          );
        }
        else {
          this.tableData = [];
        }
        this.isLoader = false;
      }, error => {
        this.isLoader = false;
      }
    );
    this.LoadFilters()
  }
  isNumber(val: any) {
    return typeof val === "number";
  }
  getReportMasterData() {
    this.reportService.getReportMasterData().subscribe(result => {
      let resp = result["body"];
      if (resp != null) {
        this.fundList = this.miscService.sortArray(resp.fundList, "fundName");
        this.strategyList = this.miscService.sortArray(resp.strategyList, "strategy");
        this.fundHoldingStatusList = this.miscService.sortArray(resp.fundHoldingStatusList, "status");
        this.getRegion_Countrys();
        this.bindReportMasterModel();
      }
    });
  }
  getRegion_Countrys(fundIds = []) {
    this.portfolioCompanyService.get_RegionCountrys_ByFundId(fundIds).subscribe(async (res: any) => {
      this.regionList = [];
      this.regionCountryMappingList = [];
      this.regionList = res.regionList;
      this.regionCountryMappingList = res.regionCountryList
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
        if (this.masterModel.regionIds.length > 0) {
          this.masterModel.regionIds = this.masterModel.regionIds.filter(s =>
            regionIds.includes(s["regionId"])
          );
          this.masterModel.countryIds = this.masterModel.countryIds.filter(s =>
            countryIds.includes(s["countryId"]) && this.masterModel.regionIds.find(x => x.regionId == s["regionId"]) != null
          );
          this.countryList = this.countryList.filter(s =>
            this.masterModel.regionIds.find(x => x.regionId == s["regionId"]) != null
          );
        }
      }
    });
  }
  bindReportMasterModel() {
    if (this.fundList) {
      this.fundListClone = JSON.parse(JSON.stringify(this.fundList));
    }
    if (this.strategyList) {
      this.strategyListClone = JSON.parse(JSON.stringify(this.strategyList));
    }
    if (this.regionList) {
      this.regionListClone = JSON.parse(JSON.stringify(this.regionList));
    }
    this.countryList = this.miscService.sortArray(this.regionCountryMappingList, "country");
    if (this.countryList) {
      this.countryListClone = JSON.parse(JSON.stringify(this.countryList))
    }
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
      this.loadAllFilters();
    }
    this.dataChangeCheck();
    this.allLabelSelectionPlusCount();
  }
  isExportLoading = false;
  exportTopHoldingReport() {
    this.isExportLoading = true;
    this.reportService.exportReports(this.model).subscribe(response => {
      this.miscService.downloadExcelFile(response);
      this.isExportLoading = false;
    });
  }
  onPcStatusChanged() {
    this.dataChangeCheck();
    this.allLabelSelectionPlusCount();
  }
  loadAllFilters() {
    this.masterModel.strategyIds = [];
    this.strategyList = JSON.parse(JSON.stringify(this.strategyListClone));
    this.masterModel.regionIds = [];
    this.regionList = JSON.parse(JSON.stringify(this.regionListClone));
    this.masterModel.countryIds = [];
    this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
    this.masterModel.fundIds = [];
    this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
    this.masterModel.fundHoldingStatusIds = [];
  }
  quarterYearPicker(event) {
    this.masterModel.quarterYear = event.quarter + ' ' + event.year;
    this.dataChangeCheck();
  }
  isFundSelected = (): boolean => {
    return this.masterModel.fundIds.length > 0;
  }
  GetCountryListByRegionIds = () => {
    if (this.isFundSelected()) {
      this.masterModel.countryIds = this.masterModel.countryIds.filter(s =>
        this.masterModel.regionIds.find(x => x.regionId == s["regionId"]) != null
      );
      this.countryList = this.fundInvestmentLocation.countryIds.filter(s =>
        this.masterModel.regionIds.find(x => x.regionId == s["regionId"]) != null
      );
    }
    else {
      this.masterModel.countryIds = [];
      this.countryList = [];
      this.countryList = this.regionCountryMappingList.filter(s =>
        this.masterModel.regionIds.find(x => x.regionId == s["regionId"]) != null
      );
    }

  }
  OnFundChanged() {
    if (this.masterModel.fundIds.length > 0) {
      let fundIds = this.masterModel.fundIds.map((s) => s.fundID);
      this.getRegion_Countrys(fundIds || []);
    }
    else {
      this.getRegion_Countrys([]);
      this.masterModel.countryIds = [];
      this.masterModel.regionIds = [];
      this.regionList = this.masterModel.regionList;
      this.countryList = this.miscService.sortArray(this.masterModel.regionCountryMappingList, "country");
    }
    this.dataChangeCheck();
    this.allLabelSelectionPlusCount();
  }
  allLabelSelectionPlusCount() {
    if (this.masterModel.fundIds.length > 0) {
      this.fundLabel = this.masterModel.fundIds.length > 1 ? this.masterModel.fundIds[0]['fundName'] + ' + ' + (this.masterModel.fundIds.length - 1) : (this.masterModel?.fundIds[0]?.fundName != undefined ? this.masterModel?.fundIds[0]?.fundName : '');
    }
    if (this.masterModel.strategyIds.length > 0) {
      this.strategyLabel = this.masterModel.strategyIds.length > 1 ? this.masterModel.strategyIds[0]['strategy'] + ' + ' + (this.masterModel.strategyIds.length - 1) : (this.masterModel?.strategyIds[0]?.strategy != undefined ? this.masterModel?.strategyIds[0]?.strategy : '');
    }
    if (this.masterModel.countryIds.length > 0) {
      this.countryLabel = this.masterModel.countryIds.length > 1 ? this.masterModel.countryIds[0]['country'] + ' + ' + (this.masterModel.countryIds.length - 1) : (this.masterModel?.countryIds[0]?.country != undefined ? this.masterModel?.countryIds[0]?.country : '');
    }
    if (this.masterModel.regionIds.length > 0) {
      this.regionLabel = this.masterModel.regionIds.length > 1 ? this.masterModel.regionIds[0]['region'] + ' + ' + (this.masterModel.regionIds.length - 1) : (this.masterModel?.regionIds[0]?.region != undefined ? this.masterModel?.regionIds[0]?.region : '');
    }
    if (this.masterModel.fundHoldingStatusIds.length > 0) {
      this.holdingLabel = this.masterModel.fundHoldingStatusIds.length > 1 ? this.masterModel.fundHoldingStatusIds[0]['status'] + ' + ' + (this.masterModel.fundHoldingStatusIds.length - 1) : (this.masterModel?.fundHoldingStatusIds[0]?.status != undefined ? this.masterModel?.fundHoldingStatusIds[0]?.status : '');
    }
  }
  onRegionChanged(event: any) {
    if (event.value != null && event.value.length > 0) {
      this.GetCountryListByRegionIds();
    } else {
      this.masterModel.fundHoldingStatusIds = [];
      this.masterModel.countryIds = [];
      this.countryList = JSON.parse(JSON.stringify(this.countryListClone));
      if (!this.isFundSelected()) {
        this.masterModel.fundIds = [];
        this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
      }

      this.masterModel.fundHoldingStatusIds = [];
    }
    this.dataChangeCheck();
    this.allLabelSelectionPlusCount();
  }
  onCountryChange(event: any) {
    if (!this.isFundSelected()) {
      this.masterModel.fundIds = [];
      this.fundList = JSON.parse(JSON.stringify(this.fundListClone));
    }
    if (event.value != null && event.value.length > 0) {
      this.masterModel.fundHoldingStatusIds = [];
    } else {
      this.masterModel.fundHoldingStatusIds = [];
    }
    this.dataChangeCheck();
    this.allLabelSelectionPlusCount();
  }
  OnStatusChanged() {
    this.dataChangeCheck();
    this.allLabelSelectionPlusCount();
  }
  onSaveFilters() {
    this.saveFilter.ReportID = this.topholdingReportId;
    this.saveFilter.UserReportName = this.filterName;
    if (
      this.masterModel.strategyIds.length > 0 ||
      this.masterModel.regionIds.length > 0 ||
      this.masterModel.countryIds.length > 0 ||
      this.masterModel.fundIds.length > 0 ||
      this.masterModel.fundHoldingStatusIds.length > 0 ||
      this.masterModel.pCStatusIds.length > 0
    ) {
      this.saveFilter.reportFilters = [];
      if (this.masterModel.strategyIds.length > 0)
        this.saveFilter.reportFilters.push({
          FilterName: "Strategy",
          FilterValues: this.masterModel.strategyIds
            .map((s) => s.strategy)
            .toString(),
        });
      if (this.masterModel.regionIds.length > 0)
        this.saveFilter.reportFilters.push({
          FilterName: "Region",
          FilterValues: this.masterModel.regionIds.map((s) => s.region).toString(),
        });
      if (this.masterModel.countryIds.length > 0)
        this.saveFilter.reportFilters.push({
          FilterName: "Country",
          FilterValues: this.masterModel.countryIds.map((s) => s.country).toString(),
        });
      if (this.masterModel.fundIds.length > 0) {
        this.saveFilter.reportFilters.push({
          FilterName: "Fund",
          FilterValues: this.masterModel.fundIds.map((s) => s.fundName).toString(),
        });
      }
      if (this.masterModel.fundHoldingStatusIds.length > 0) {
        this.saveFilter.reportFilters.push({
          FilterName: "Status",
          FilterValues: this.masterModel.fundHoldingStatusIds
            .map((s) => s.status)
            .toString(),
        });
      }
      if (this.masterModel.quarterYear != "") {
        this.saveFilter.reportFilters.push({
          FilterName: "QuarterYear",
          FilterValues: this.masterModel.quarterYear,
        });
      }
      if (this.masterModel.pCStatusIds.length > 0) {
        this.saveFilter.reportFilters.push({
          FilterName: "PCStatus",
          FilterValues: this.masterModel.pCStatusIds
            .map((s) => s.value)
            .toString(),
        });
      }
    } else {
      this.saveFilter.reportFilters = [];
    }
    this._filterServices.SaveFilter(this.saveFilter).subscribe(
      (response) => {
        if (response > 0)
          this.toastrService.success("Filter added succesfully", "", { positionClass: "toast-center-center" });
        this.filterName = "";
        this.isSaveFilterPopup = false;
        this.resetForm();
        this.LoadFilters();
      }
    );
  }
  CancelDelete() {
    this.confirmDelete = false;
  }
  onDelete() {
    this.confirmDelete = true;
  }
  deleteFilter() {
    this._filterServices.DeleteFilter(this.selectedFilterReport.userReportId).subscribe(
      (response) => {
        this.confirmDelete = false;
        this.LoadFilters();
        this.resetForm();
      }
    );
  }
  LoadFilters() {
    this.saveFiltersOptionsList = [];
    this._filterServices.getFilters().subscribe(
      (response) => {
        let filtersList = response.filter((s) => s.reportID == this.topholdingReportId);
        this.editMode = true;
        this.saveFiltersOptionsList = filtersList;
      }
    );
  }
  Submit(event) {
    if (event.submitter.name == "Save Preset") {
      this.isSaveFilterPopup = true;

    }
    if (event.submitter.name == "Reset") {
      this.resetForm();
      this.defaultMasterModelClone();
    }
    if (event.submitter.name == "Apply") {
      this.apply();
      let inputElement: HTMLElement = this.collapsedEvent.nativeElement as HTMLElement;
      inputElement.click();
    }
  }
  apply() {
    if (this.masterModel.strategyIds.length > 0) {
      this.model.strategyIds = this.masterModel.strategyIds;
    }
    else {
      this.model.strategyIds = [];
    }
    if (this.masterModel.regionIds.length > 0) {
      this.model.regionIds = this.masterModel.regionIds;
    } else {
      this.model.regionIds = [];
    }
    if (this.masterModel.fundIds.length > 0) {
      this.model.fundIds = this.masterModel.fundIds;
    }
    else {
      this.model.fundIds = [];
    }
    if (this.masterModel.countryIds.length > 0) {
      this.model.countryIds = this.masterModel.countryIds;
    } else {
      this.model.countryIds = [];
    }
    if (this.masterModel.fundHoldingStatusIds.length > 0) {
      this.model.fundHoldingStatusIds = this.masterModel.fundHoldingStatusIds;
    }
    else {
      this.model.fundHoldingStatusIds = [];
    }
    if (this.masterModel.quarterYear != "" && this.masterModel.quarterYear != undefined) {
      this.model.quarterYear = this.masterModel.quarterYear;
    } else {
      this.model.quarterYear = "";
    }
    if (this.masterModel.pCStatusIds.length > 0) {
      this.model.pCStatusIds = this.masterModel.pCStatusIds;
    }
    else {
      this.model.pCStatusIds = [];
    }
    this.getTopHoldingReports();
  }
  resetForm() {
    this.form.resetForm();
    this.selectedFilterReport = null;
    this.model = {
      fundIds: [],
      strategyIds: [],
      regionIds: [],
      countryIds: [],
      fundHoldingStatusIds: [],
      pCStatusIds: [],
      isAscending: false,
      selectedReportTypes: [this.reportID],
      chartMetadetaList: [],
      sortBy: 'desc',
      rowCount: 20,
      quarterYear: ""
    };
    this.masterModel = {
      fundIds: [],
      strategyIds: [],
      regionIds: [],
      countryIds: [],
      fundHoldingStatusIds: [],
      pCStatusIds: [],
      isAscending: false,
      selectedReportTypes: [this.reportID],
      chartMetadetaList: [],
      sortBy: 'desc',
      rowCount: 20,
      quarterYear: ""
    };
    this.getDealLatestQuarter();
  }
  ontemplateChange(event) {
    if (!isNull(event?.target?.value?.trim()) && event?.target?.value?.trim() != '') {
      this.filterName = event.target?.value;
      this.disableConfirmSave = false;
      this.isexits = false;
      if (this.inArray(this.filterName.toLowerCase(), this.saveFiltersOptionsList)) {
        this.isexits = true
        this.disableConfirmSave = true;
      }
    }
    else {
      this.disableConfirmSave = true;
      this.isexits = false;
    }
  }
  onClose() {
    this.filterName = "";
    this.isSaveFilterPopup = false;
    this.disableConfirmSave = true;
    this.isexits = false;
  }
  confirmSave() {
    if (!isNull(this.filterName)) {
      this.onSaveFilters()
    }
    else {
      this.disableConfirmSave = false;
    }
  }
  onselectedFilterReport(item: any) {
    this.loadSelectedFilters();
    this.dataChangeCheck();
  }
  onChangeSelectedFilter(item: any) {
    this.countryList = this.countryListClone;
    this.fundList = this.fundListClone;
    let reportFilters = item.reportFilters;
    if (reportFilters !== undefined) {
      this.masterModel.strategyIds = this.strategyListClone.filter((s) => {
        return (
          getItems("Strategy", reportFilters).indexOf(s.strategy) >= 0
        );
      });
      this.masterModel.regionIds = this.regionListClone.filter((s) => {
        return getItems("Region", reportFilters).indexOf(s.region) >= 0;
      });
      this.countryList = this.countryListClone.filter(s =>
        this.masterModel.regionIds.find(x => x.regionId == s["regionId"]) != null
      );
      this.masterModel.countryIds = this.countryList.filter((s) => {
        return getItems("Country", reportFilters).indexOf(s.country) >= 0;
      });
      this.masterModel.fundIds = this.fundListClone.filter((s) => {
        return getItems("Fund", reportFilters).indexOf(s.fundName) >= 0;
      });
      let quarterYear = getItems("QuarterYear", reportFilters)[0];
      if (quarterYear != "" && quarterYear != undefined) {
        this.masterModel.quarterYear = quarterYear.toString();
      }
      this.masterModel.fundHoldingStatusIds = this.fundHoldingStatusList.filter((s) => {
        return getItems("Status", reportFilters).indexOf(s.status) >= 0;
      });
      this.masterModel.pCStatusIds = this.pcStatus.filter((s) => {
        return getItems("PCStatus", reportFilters).indexOf(s.value) >= 0;
      });
    }
    this.masterModelClone = JSON.parse(JSON.stringify(this.masterModel));
    this.allLabelSelectionPlusCount();
    this.apply();
  }
  loadSelectedFilters() {
    this._filterServices.getFilter(this.selectedFilterReport.userReportId).subscribe(
      (response) => {
        this.onChangeSelectedFilter(response);
      }
    );
  }
  inArray(value, array) {
    for (const element of array) {
      if (element.userReportName.toLowerCase() == value) {
        return true;
      }
    }
    return false;
  }
  loadLazy(event: LazyLoadEvent) {
    this.tableData = this.tableData.slice(event.first, event.first + event.rows);
  }
  toggleableApply() {
    this.getTopHoldingReports();
  }

}
function getItems(item: string, reportFilters: any[]) {
  if (reportFilters != undefined) {
    let values = reportFilters.find((s) => s.filterName === item);
    if (values !== undefined) values = values.filterValues.split(",");
    return values === undefined ? [] : values;
  }
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}
