import { Component, OnInit } from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ReportService, ReportType } from "../../services/report.service";
import { AppSettingService } from '../../services/appsettings.service';
import { AppConfig } from "../../common/models";
import { Filter } from "../custom-controls/Filter.model";
import { FilterService } from "src/app/services/filter.services";
import { CommonPCConstants, DataAnalyticsConstants, NumberDecimalConst } from "src/app/common/constants";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { ToastrService } from "ngx-toastr";
import { isNull } from '../../utils/utils';
import { PermissionService,FeaturesEnum } from "src/app/services/permission.service";
@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  isOpened:boolean = false;
  model: any = [];
  reportData: any[];
  fundgrowthPieChartData: any[] = [];
  fundgrowthBarChartData: any[] = [];
  fundgrowthLineChartData: any[] = [];
  strategyUnrealizedValueData: any[] = [];
  strategyTotalValueData: any[] = [];
  sectorWiseAttributionData: any[] = [];
  sectorData: any[] = [];
  saveFiltersOptionsList = [];
  sectorWiseInvestements_AsOfDate: any;
  sectorWiseAttribution_AsOfDate: any;
  regionWiseInvestements_AsOfDate: any;
  strategyTotalValueData_AsOfDate: any;
  strategyUnrealizedValue_AsOfDate: any;
  top10PC_AsOfDate: any;
  TVPIByVintageYear_AsOfDate: any;
  regionData: any[] = [];
  topCompanyData: any[] = [];
  TVPIByVintageYear: any[] = [];
  regionList: any[] = [];
  defaultFund: any;
  selectedRegion: any;
  totalFunds: any;
  totalPortfolioCompanies: any;
  totalInvestedCapital: any;
  totalRealizedValue: any;
  totalUnrealizedValue: any;
  isLoader: boolean = false;
  totalValue: any;
  Currency="USD";
  TVPI: any = 'NA';
  DPI: any = 'NA';
  RVPI: any = 'NA';
  dataLoaded: boolean = false;
  isWorldMapVisible: boolean = true;
  width: number = 0;
  appConfig: AppConfig;
  FromDate: any =(new Date()).getFullYear()-15;
  ToDate: any = (new Date()).getFullYear();
  yearOptions: any[] = [];
  activeLink:any = null;
  NumberDecimalConst = NumberDecimalConst;
  selectedRegionId: any;
  QuarterYear: any = [];
  isSelected:boolean = false;
  configuration:any=[];
  tabName: string = DataAnalyticsConstants.GeneralTabName;
  tabList: ITab[] = [];
  sideNavBaseClass: string;
  dataAnalyticsModel: any = [];
  enabledApplybtn: boolean = false;
  triggerApplyEvent: boolean = false;
  isMenuOpen: boolean = false;
  saveFilter: Filter;
  dataAnalyticsReportId = 999;
  filterName = "";
  isSaveFilterPopup: boolean = false;
  title = "Save Filter";
  isexits: boolean = false;
  selectReport: any[];
  enabledResetButton: boolean = false;
  isPizarro: boolean = false;
  isOpenUpload: boolean = false;
  dataAnalyticsUploadModel: any[];
  isNewDashboard:boolean = false;
  GeneralTabName:string = DataAnalyticsConstants.GeneralTabName;
  CommonTabName:string = DataAnalyticsConstants.CommonTabName;
  MyDashboardTabName:string = DataAnalyticsConstants.MyDashboardTabName;
  isTabEnabled: boolean = false;
  enabledAddButton: boolean = false;
  enabledUploadButton: boolean = false;
  constructor(
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private appSettingService: AppSettingService,
    private _filterServices: FilterService,
    private toastrService: ToastrService,
    private permissionService: PermissionService,
  ) {
    this.saveFilter = <Filter>{}
    this.appConfig = this.appSettingService.getConfig();
    this.getDashboardConfiguration();
    if (window.location.host == CommonPCConstants.PizarroHost){
      this.isPizarro = true;
      this.Currency = "ZAR";
    }
    else
      this.Currency = "USD";
  }
  ngOnInit() {
    this.getTotalCounts();
    this.QuarterYear = [
      {
        year: 2017,
        quarter: "Q1",
      }
    ];
    this.yearOptions = this.miscService.bindYearList();
    this.model = {
      selectedReportTypes: [
        ReportType.SectorWiseInvestmentAndGrowth_DB,
        ReportType.RegionWiseInvestementAndGrowth_DB,
        ReportType.TVPIByVintageYear
      ],

    };
    this.miscService.getJSON("assets/config.json").subscribe(
      (data) => {
        this.isWorldMapVisible = data.IsWorldMapVisibleOnDashboard == "true";
        if (!this.isWorldMapVisible) {
          let index = this.model.selectedReportTypes.indexOf(
            ReportType.AttributionBySector
          );
          this.model.selectedReportTypes.splice(index, 1);
        }
        this.getFundWiseGrowthReports(false, '', '');
      }
    );
    this.getRegionList();
    this.LoadFilters();
    this.getTabList();
    this.setAddDashboard();
    this.setUploadButton();
  }
  setAddDashboard() {
    this.enabledAddButton = false;
    const featureId =
        this.tabName === DataAnalyticsConstants.CommonTabName? this.feature.Common : this.feature.MyDashboard;
      const editPermissionCheck = this.permissionService.checkFeaturePermission({
        featureId,
        action: "edit",
      });
     
      if (editPermissionCheck) {
        this.enabledAddButton = true;
      }
  }
  setUploadButton() {
    this.enabledUploadButton = false;
    const featureId =
        this.tabName === DataAnalyticsConstants.CommonTabName? this.feature.Common : this.feature.MyDashboard;
      const uploadPermissionCheck = this.permissionService.checkFeaturePermission({
        featureId,
        action: "import",
      });
     
      if (uploadPermissionCheck) {
        this.enabledUploadButton = true;
      }
  }
  getTabList() {
    this.tabList = [];
    if (this.permissionService.checkFeaturePermission({featureId:this.feature.General,action:"view"})) {
      if(this.tabName == "")
        this.tabName = this.GeneralTabName;
      this.tabList.push({active: true,name: this.GeneralTabName});
		};
    if (this.permissionService.checkFeaturePermission({featureId:this.feature.Common,action:"view"})) {
      if(this.tabName == "")
        this.tabName = this.CommonTabName;
      this.tabList.push({active: false,name: this.CommonTabName})
		}
    if (this.permissionService.checkFeaturePermission({featureId:this.feature.MyDashboard,action:"view"})) {
      if(this.tabName == "")
        this.tabName = this.MyDashboardTabName;
      this.tabList.push({active: false,name: this.MyDashboardTabName})
		}
    this.isTabEnabled = true;
}
onTabClick(tab: ITab,element:any) {
  this.isLoader = true;
  this.isTabEnabled = false;
  this.tabName = null;
  if(document.getElementById("HeaderNameID")){
  this.miscService.getTitle(tab?.name);
  }
  if (tab != null || tab != undefined) {
      this.tabName = tab.name;
     
  }
  element.hide(tab);
  this.isLoader = false;
  this.isTabEnabled = true;
  this.setAddDashboard();
  this.setUploadButton();
}
  getDashboardConfiguration()
  {
    this.reportService.getDashboardConfiguration().subscribe({
      next:(result) => {
        this.configuration = result;
      },
      error:(error) => {
        this.isLoader = false;
        this.configuration = [];
      }}
    );
  }
  onSavePresetButton(){
    this.isSaveFilterPopup = true;
  }
  inArray(value, array) {
    for (const element of array) {
      if (element.userReportName.toLowerCase() == value) {
        return true;
      }
    }
    return false;
  }
  ontemplateChange(event) {
    if (!isNull(event?.target?.value?.trim()) && event?.target?.value?.trim() != '') {
      this.filterName = event.target?.value;
      this.isexits = false;
      if (this.inArray(this.filterName.toLowerCase(), this.saveFiltersOptionsList)) {
       this.isexits = true
        this.isSaveFilterPopup = true;
      }
    }
    else {
      this.isSaveFilterPopup = true;
      this.isexits = false;
    }
  }
  onClose() {
    this.filterName = "";
    this.isSaveFilterPopup = false;
    this.isexits = false;
  }
  confirmSave() {
  
    if (!isNull(this.filterName)) {
      this.confirmSavePreset()
    }
    else {
      this.isSaveFilterPopup = false;
    }
  }
  getFilterData() {
    if (this.dataAnalyticsModel.portfolioCompanyModel != undefined && this.dataAnalyticsModel.portfolioCompanyModel != null)
      this.saveFilter.reportFilters = this.getFilterDataPortfolioCompany(this.saveFilter.reportFilters, this.dataAnalyticsModel.portfolioCompanyModel)
    if (this.dataAnalyticsModel.dealModel != undefined && this.dataAnalyticsModel.dealModel != null)
      this.saveFilter.reportFilters = this.getFilterDataDeal(this.saveFilter.reportFilters, this.dataAnalyticsModel.dealModel)
    if (this.dataAnalyticsModel.fundModel != undefined && this.dataAnalyticsModel.fundModel != null)
      this.saveFilter.reportFilters = this.getFilterDataFund(this.saveFilter.reportFilters, this.dataAnalyticsModel.fundModel)
    if (this.dataAnalyticsModel.investorModel != undefined && this.dataAnalyticsModel.investorModel != null)
      this.saveFilter.reportFilters = this.getFilterDataInvestor(this.saveFilter.reportFilters, this.dataAnalyticsModel.investorModel)
    if (this.dataAnalyticsModel.ESGModel != undefined && this.dataAnalyticsModel.ESGModel != null)
      this.saveFilter.reportFilters = this.getFilterDataESG(this.saveFilter.reportFilters, this.dataAnalyticsModel.ESGModel)
  }
  confirmSavePreset() {
    this.saveFilter.ReportID = this.dataAnalyticsReportId;
    this.saveFilter.UserReportName = this.filterName;
    this.saveFilter.reportFilters = [];
    if (this.dataAnalyticsModel != undefined && this.dataAnalyticsModel != null) {
      this.getFilterData();
      if (this.saveFilter.reportFilters.length > 0)
        this.saveFilterFunction();
    }
  }
  saveFilterFunction(){
    this._filterServices.SaveFilter(this.saveFilter).subscribe(
      (response) => {
        if (response > 0)
          this.toastrService.success("Filter added succesfully", "", { positionClass: "toast-center-center" });
        this.isSaveFilterPopup = false;
        this.LoadFilters();
      }
    );
  }
  resetDataModelPC() {
    this.dataAnalyticsModel.portfolioCompanyModel = {
      fundList: [],
      companyList: [],
      period: null,
      moduleList: [],
      kpiItems: [],
      currenceList: [],
      fxRates: [],
    };
  }
  resetDataModelESG() {
    this.dataAnalyticsModel.ESGModel = {
      fundList: [],
      companyList: [],
      period: null,
      moduleList: [],
      kpiItems: [],
      currenceList: [],
      fxRates: [],
    };
  }
  resetDataModelDeal() {
    this.dataAnalyticsModel.dealModel = {
      fundList: [],
      companyList: [],
      period: null,
      moduleList: [],
      kpiItems: [],
    };
  }
  resetDataModelFund() {
    this.dataAnalyticsModel.fundModel = {
      fundList: [],
      period: null
    };
  }
  resetDataModelInvestor() {
    this.dataAnalyticsModel.investorModel = {
      fundList: [],
      investorList: [],
      companyList: [],
      period: null
    };
  }
  resetDataAnalyticsModel() {
    this.triggerApplyEvent = false;
    this.enabledApplybtn = false;
    this.enabledResetButton = false;
    this.dataAnalyticsModel.SelectedReport = [];
    switch (this.dataAnalyticsModel.currentTabName) {
      case "Portfolio Company":
       this.resetDataModelPC();
        break;
      case "Deal":
        this.resetDataModelDeal();
        break;
      case "Fund":
       this.resetDataModelFund();
        break;
      case "Investor":
        this.resetDataModelInvestor();
        break;
      case "ESG":
        this.resetDataModelESG();
        break;
    }
  }
  changeInputPC(){
    this.enabledResetButton = this.validResetPortfolioCompany(this.dataAnalyticsModel.portfolioCompanyModel)?true:false;;
    this.enabledApplybtn = this.validMandatoryPortfolioCompany(this.dataAnalyticsModel.portfolioCompanyModel)?true:false;
  }
  changeInputESG(){
    this.enabledResetButton = this.validResetESG(this.dataAnalyticsModel.ESGModel)?true:false;;
    this.enabledApplybtn = this.validMandatoryESG(this.dataAnalyticsModel.ESGModel)?true:false;
  }
  changeInputDeal(){
    this.enabledResetButton = this.validResetDeal(this.dataAnalyticsModel.dealModel)?true:false;
    this.enabledApplybtn = this.validMandatoryDeal(this.dataAnalyticsModel.dealModel)?true:false;
  }
  changeInputFund(){
    this.enabledResetButton = this.validResetFund(this.dataAnalyticsModel.fundModel)?true:false;
    this.enabledApplybtn = this.validMandatoryFund(this.dataAnalyticsModel.fundModel)?true:false;
  }
  changeInputInvestor(){
    this.enabledResetButton = this.validResetInvestor(this.dataAnalyticsModel.investorModel)?true:false;
    this.enabledApplybtn = this.validMandatoryInvestor(this.dataAnalyticsModel.investorModel)?true:false;
  }
  ChangeInput(event: any) {
    this.dataAnalyticsModel = event;
    this.enabledResetButton = false;
    let currentTabName = this.dataAnalyticsModel.currentTabName;
    switch (currentTabName) {
      case "Portfolio Company":
       this.changeInputPC();
        break;
      case "Deal":
        this.changeInputDeal();
        break;
      case "Fund":
       this.changeInputFund();
        break;
      case "Investor":
        this.changeInputInvestor();
        break;
      case "ESG":
        this.changeInputESG();
        break;
      
    }
  }
  LoadFilters() {
    this.saveFiltersOptionsList = [];
    this._filterServices.getFilters().subscribe(
      (response) => {
        let filtersList = response.filter((s) => s.reportID == this.dataAnalyticsReportId);
        this.saveFiltersOptionsList = filtersList;
        if(this.saveFilter?.UserReportName && this.saveFiltersOptionsList.length > 0){
          this.dataAnalyticsModel.SelectedReport=[];
          let filterData = this.saveFiltersOptionsList.filter(x=> x.userReportName == this.saveFilter?.UserReportName);
          if(filterData.length!=0)
            this.dataAnalyticsModel.SelectedReport = filterData[0];
        }
      }
    );
  }
  Apply(){
    this.triggerApplyEvent = true;
  }
  
  onResized(event: any) {
    this.width = event?.newRect?.width;
    this.sideNavBaseClass =   this.miscService.getSideBarWidth() == "17.3em" ? "data-analytics-panel-without-expand data-analytics-panel" : "data-analytics-panel-with-expand data-analytics-panel";
  }
  fromQuarterYear(event: any) {
    this.QuarterYear = [
      {
        year: 2017,
        quarter: "Q1",
      }
    ];
    return this.QuarterYear
  }
   loadModelDefault(val: any, event: any, date: any) {
    if(this.model.FromDate==undefined){
      this.model.FromDate = (new Date(this.FromDate.toString()));
    }
    if(this.model.ToDate==undefined){
      this.model.ToDate = (new Date(this.ToDate.toString()));
    }
    if (val) {
      this.model.selectedReportTypes = [
        ReportType.TVPIByVintageYear
      ];
      if (date == 'FromDate') {
        this.FromDate = event?.item;
        this.model.FromDate = new Date(event?.item);
        if (event?.item > this.ToDate) {
          this.ToDate = (new Date(event?.item)).getFullYear();
          this.model.ToDate = (new Date(event?.item));
        }
      } else {
        this.ToDate = (new Date(event?.item)).getFullYear();
        this.model.ToDate = (new Date(event?.item));
        if (event?.item < this.FromDate) {
          this.FromDate = event?.item;
          this.model.FromDate = (new Date(event?.item));
        }

      }
    } else {
      this.model.FromDate = new Date(this.FromDate,0,2);
      this.model.ToDate = new Date();
    }
  }
  getFundWiseGrowthReports(val: any, event: any, date: any) {
    this.loadModelDefault(val, event, date);
    this.isLoader = true;
    this.reportService.getReportData(this.model).subscribe({
      next:(result) => {
        this.reportData = result["body"];
        let local = this;
        if (this.reportData != null) {
          this.reportData?.forEach(function (report: any) {

            if (
              report.ReportType == ReportType.SectorWiseInvestmentAndGrowth_DB
            ) {
              local.sectorData = report.Results;
              local.sectorData?.forEach(s => {
                s["Total Value"] = s["Total Value"] / 1000000;

              });
              local.sectorWiseInvestements_AsOfDate = local.sectorData
                .map(function (e: any) {
                  return e.AsOfDate;
                })
                .sort()
                .reverse()[0];
            }
            if (report.ReportType == ReportType.TVPIByVintageYear) {
              local.TVPIByVintageYear = report.Results; // local.miscService.sortArrayDesc(report.Results, "TotalValue"); ;\
              local.TVPIByVintageYear_AsOfDate = local.TVPIByVintageYear
                .map(function (e: any) {
                  return e.AsOfDate;
                })
                .sort()
                .reverse()[0];
            }
            if (
              report.ReportType == ReportType.RegionWiseInvestementAndGrowth_DB
            ) {
              local.regionData = report.Results;
              local?.regionData?.forEach(s => {
                s["Total Value"] = s["Total Value"] / 1000000;


              });
              local.regionWiseInvestements_AsOfDate = local?.regionData
                .map(function (e: any) {
                  return e.AsOfDate;
                })
                .sort()
                .reverse()[0];
            }
          });
        }
        this.dataLoaded = true;
        this.isLoader = false;
      },
      error:(error) => {
        this.isLoader = false;
      }}
    );
    this.model.selectedReportTypes = [ReportType.Top10CompanyByTotalValue_DB,
    ReportType.TotalValueByStrategy_DB,
    ReportType.UnrealizedValueByStrategy_DB,
    ReportType.AttributionBySector];
    this.getFundWiseGrowthReportsNextLoad();
  }
  getFundWiseGrowthReportsNextLoad() {
    this.isLoader = true;
    this.reportService.getReportData(this.model).subscribe({
      next:(result) => {
        this.reportData = result["body"];
        let local = this;
        if (this.reportData != null) {
          this.reportData?.forEach(function (report: any) {
            if (report.ReportType == ReportType.Top10CompanyByTotalValue_DB) {
              local.topCompanyData = report.Results;
              local.topCompanyData.forEach((s) => {
                s["Total Value"] = s["Total Value"] / 1000000;
              });
              local.top10PC_AsOfDate = local.topCompanyData
                .map(function (e: any) {
                  return e.AsOfDate;
                })
                .sort()
                .reverse()[0];
            }
            if (report.ReportType == ReportType.TotalValueByStrategy_DB) {
              local.strategyTotalValueData = report.Results;
              local?.strategyTotalValueData?.forEach((s) => {
                s["TotalValue"] = Math.round(s["TotalValue"] / 1000000);
              });
              local.strategyTotalValueData_AsOfDate = local.strategyTotalValueData
                .map(function (e: any) {
                  return e.AsOfDate;
                })
                .sort()
                .reverse()[0];
            }
            if (report.ReportType == ReportType.UnrealizedValueByStrategy_DB) {
              local.strategyUnrealizedValueData = report.Results;
              local?.strategyUnrealizedValueData?.forEach(
                (s) =>
                (s["TotalUnrealizedValue"] = Math.round(
                  s["TotalUnrealizedValue"] / 1000000
                ))
              );
              local.strategyUnrealizedValue_AsOfDate = local.strategyUnrealizedValueData
                .map(function (e: any) {
                  return e.AsOfDate;
                })
                .sort()
                .reverse()[0];
            }
          });
        }
        this.dataLoaded = true;
        this.isLoader = false;
      },
      error:(_error) => {
        this.isLoader = false;
      }}
    );
  }
  dividedFunction=(numerator:any,denominator:any)=>{
    const result = parseFloat(numerator) / parseFloat(denominator);
    return isFinite(result) ? result : "NA";
  }
  getRegionList() {
    this.miscService.getRegionList().subscribe({

      next: (result) => {
        if (result != null) {
          this.regionList = result["body"];
          if (this.regionList?.length > 0) {
            this.regionList.sort((r1, r2) => (r1.region ?? 0) > (r2.region ?? 0) ? 1 : -1);
            this.selectedRegionId = this.regionList[0].regionId
            this.selectedRegion = this.regionList[0].region;
            if(this.regionList.length > 0){
              this.model.regionId = this.regionList[0];
              this.onMapRegionChanged(this.model.regionId);
            }
            this.regionList[0].isActive = true;
            this.activeLink = this.selectedRegion;
          }
        }
      },
      error: (error) => {
      }}
    );
  }

  getTotalCounts() {
    this.reportService.getTotalCounts().subscribe({
      next: (result) => {
           let local = this;
        result["body"]?.totalCounts?.forEach(function (val: any) {

          if (val.moduleName == "Fund") {
            local.totalFunds = val.count;
          }
          if (val.moduleName == "TotalPortfolioCompany") {
            local.totalPortfolioCompanies = val.count;
          }
          if (val.moduleName == "TotalValue") {
            local.totalValue = val.count / 1000000;
          }
          if (val.moduleName == "TotalInvestment") {
            local.totalInvestedCapital = val.count / 1000000;
          }
          if (val.moduleName == "TotalRealizedValue") {
            local.totalRealizedValue = val.count / 1000000;
          }
          if (val.moduleName == "TotalUnrealizedValue") {
            local.totalUnrealizedValue = val.count / 1000000;
          }
        });
        this.TVPI = this.dividedFunction(local.totalValue,local.totalInvestedCapital);
        this.DPI = this.dividedFunction(local.totalRealizedValue,local.totalInvestedCapital);
        this.RVPI = this.dividedFunction(local.totalUnrealizedValue,local.totalInvestedCapital);
      },
      error: (error) => {
        // Handle error
      },}
    );
  }
setCollapse()
{
  if(this.isOpened)
   this.isOpened = false;
  else
    this.isOpened = true;
}
  onMapRegionChanged(reg: any) {
    this.isLoader = true;
    this.activeLink = reg;
    this?.regionList?.forEach((row) => (row.isActive = false));
    reg.isActive = true;
    this.selectedRegion = reg.region;
    this.selectedRegionId = reg.regionId;
    let regionIds = this.regionList.filter(function (val) {
      return val.regionId == reg.regionId;
    });
    this.model = {
      selectedReportTypes: [ReportType.AttributionBySector],
      regionIds: regionIds,
    };
    this.reportService.getReportData(this.model).subscribe({
      next: (result) => {
        this.reportData = result["body"];
        let local = this;
        this.reportData?.forEach(function (report: any, reportIndex: any) {
          local.sectorWiseAttributionData = [];
          if (report.ReportType == ReportType.AttributionBySector) {
            local.sectorWiseAttributionData = report.Results;
            local.getSectorWiseAttributionData(report.Results);
          }
        });
        this.isLoader = false;
        this.dataLoaded = true;
      },
      error: (error) => {
        this.isLoader = false;
      }}
    );
  }
  getSectorWiseAttributionData(result: any){
    let local = this;
    local.sectorWiseAttributionData = result;
    local?.sectorWiseAttributionData?.forEach(s => {
      s["Realized Value"] = Math.round(s["Realized Value"] / 1000000);
      s["Total Value"] = Math.round(s["Total Value"] / 1000000);
      s["Capital Invested"] = Math.round(s["Capital Invested"] / 1000000);
    });
    local.sectorWiseAttribution_AsOfDate = local.sectorWiseAttributionData
      .map(function (e: any) {
        return e.AsOfDate;
      })
      .sort()
      .reverse()[0];
  }
  getFilterDataPortfolioCompany(reportFilters:any,portfolioCompanyModel:any){
    if(portfolioCompanyModel.fundList.length > 0){
      reportFilters.push({
        FilterName: "PCFunds",
        FilterValues: portfolioCompanyModel.fundList
          .map((s) => s.fundID)
          .toString(),
      });
    } 
    if(portfolioCompanyModel.companyList.length > 0){
      reportFilters.push({
        FilterName: "PCCompany",
        FilterValues: portfolioCompanyModel.companyList
          .map((s) => s.companyId)
          .toString(),
      });
    } 
    if(portfolioCompanyModel.moduleList.length > 0){
      reportFilters.push({
        FilterName: "PCModule",
        FilterValues: portfolioCompanyModel.moduleList
          .map((s) => s.moduleId)
          .toString(),
      });
    } 
    if(portfolioCompanyModel.kpiItems.length > 0){
      reportFilters.push({
        FilterName: "PCKpiItem",
        FilterValues: JSON.stringify(portfolioCompanyModel.kpiItems.map(({ kpiId, moduleId }) => ({ kpiId, moduleId })))});
    } 
    if(portfolioCompanyModel.currenceList != null && portfolioCompanyModel.currenceList.length !=0){
      reportFilters.push({
        FilterName: "PCCurrency",
        FilterValues: portfolioCompanyModel.currenceList.currencyID.toString(),
      });
    } 
    if(portfolioCompanyModel.fxRates != null && portfolioCompanyModel.fxRates.length != 0){
      reportFilters.push({
        FilterName: "PCFxRates",
        FilterValues: portfolioCompanyModel.fxRates.id.toString()})
    } 
    if(portfolioCompanyModel.period != null && portfolioCompanyModel.period.length > 0){
      reportFilters.push({
        FilterName: "PCPeriod",
        FilterValues: portfolioCompanyModel.period[0] + "," + portfolioCompanyModel.period[1]})
    } 
    return reportFilters;
  }
  getFilterDataESG(reportFilters:any,ESGModel:any){
    if(ESGModel.fundList.length > 0){
      reportFilters.push({
        FilterName: "ESGFunds",
        FilterValues: ESGModel.fundList
          .map((s) => s.fundID)
          .toString(),
      });
    } 
    if(ESGModel.companyList.length > 0){
      reportFilters.push({
        FilterName: "ESGCompany",
        FilterValues: ESGModel.companyList
          .map((s) => s.companyId)
          .toString(),
      });
    } 
    if(ESGModel.moduleList.length > 0){
      reportFilters.push({
        FilterName: "ESGModule",
        FilterValues: ESGModel.moduleList
          .map((s) => s.moduleId)
          .toString(),
      });
    } 
    if(ESGModel.kpiItems.length > 0){
      reportFilters.push({
        FilterName: "ESGKpiItem",
        FilterValues: JSON.stringify(ESGModel.kpiItems.map(({ kpiId, moduleId }) => ({ kpiId, moduleId })))});
    } 
    if(ESGModel.currenceList != null && ESGModel.currenceList.length !=0){
      reportFilters.push({
        FilterName: "ESGCurrency",
        FilterValues: ESGModel.currenceList.currencyID.toString(),
      });
    } 
    if(ESGModel.fxRates != null && ESGModel.fxRates.length != 0){
      reportFilters.push({
        FilterName: "ESGFxRates",
        FilterValues: ESGModel.fxRates.id.toString()})
    } 
    if(ESGModel.period != null && ESGModel.period.length > 0){
      reportFilters.push({
        FilterName: "ESGPeriod",
        FilterValues: ESGModel.period[0] + "," + ESGModel.period[1]})
    } 
    return reportFilters;
  }
  getFilterDataDeal(reportFilters:any,dealModel:any){
    if(dealModel.fundList.length > 0){
      reportFilters.push({
        FilterName: "DealFunds",
        FilterValues: dealModel.fundList
          .map((s) => s.fundID)
          .toString(),
      });
    } 
    if(dealModel.companyList.length > 0){
      reportFilters.push({
        FilterName: "DealCompany",
        FilterValues: dealModel.companyList
          .map((s) => s.companyId)
          .toString(),
      });
    } 
    if(dealModel.period != null && dealModel.period.length > 0){
      reportFilters.push({
        FilterName: "DealPeriod",
        FilterValues: dealModel.period[0] + "," + dealModel.period[1]})
    } 
    return reportFilters;
  }
  getFilterDataFund(reportFilters:any,fundModel:any){
    if(fundModel.fundList.length > 0){
      reportFilters.push({
        FilterName: "FundsList",
        FilterValues: fundModel.fundList
          .map((s) => s.fundID)
          .toString(),
      });
    } 
    if(fundModel.period != null && fundModel.period.length > 0){
      reportFilters.push({
        FilterName: "FundPeriod",
        FilterValues: fundModel.period[0] + "," + fundModel.period[1]})
    } 
    return reportFilters;
  }
  getFilterDataInvestor(reportFilters:any,investorModel:any){
    
    if(investorModel.fundList.length > 0){
      reportFilters.push({
        FilterName: "InvestorFunds",
        FilterValues: investorModel.fundList
          .map((s) => s.fundID)
          .toString(),
      });
    } 
    if(investorModel.companyList.length > 0){
      reportFilters.push({
        FilterName: "InvestorCompany",
        FilterValues: investorModel.companyList
          .map((s) => s.companyId)
          .toString(),
      });
    } 
    if(investorModel.investorList.length > 0){
      reportFilters.push({
        FilterName: "InvestorList",
        FilterValues: investorModel.investorList
          .map((s) => s.investorId)
          .toString(),
      });
    } 
    if(investorModel.period != null && investorModel.period.length > 0){
      reportFilters.push({
        FilterName: "InvestorPeriod",
        FilterValues: investorModel.period[0] + "," + investorModel.period[1]})
    } 
    if(investorModel.investorSections != undefined && investorModel.investorSections != null){
      reportFilters.push({
        FilterName: "InvestorSections",
        FilterValues: investorModel.investorSections.id.toString()})
    } 
    return reportFilters;
  }
  hasNonStaticModules(portfolioCompanyModel) {
    const moduleIds = portfolioCompanyModel.moduleList?.filter(module => !module.staticSection).map(function (module) { return module.moduleId });
    return moduleIds && moduleIds.length > 0;
  }
  validMandatoryInvestor(investorModel: any) {
    if (investorModel != undefined) {
      if ((investorModel.companyList != undefined && investorModel.companyList.length > 0)
        && (investorModel.fundList != undefined && investorModel.fundList.length > 0)
        && (investorModel.investorList != undefined && investorModel.investorList.length > 0)
        && (investorModel.investorSections != undefined && investorModel.investorSections.id != undefined && investorModel.investorSections.id != null)
        && (investorModel.period != undefined && investorModel.period.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validResetInvestor(investorModel: any) {
    if (investorModel != undefined) {
      if ((investorModel.companyList != undefined && investorModel.companyList.length > 0)
        || (investorModel.fundList != undefined && investorModel.fundList.length > 0)
        || (investorModel.investorList != undefined && investorModel.investorList.length > 0)
        || (investorModel.investorSections != undefined && investorModel.investorSections.id != undefined && investorModel.investorSections.id != null)
        || (investorModel.period != undefined && investorModel.period.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validMandatoryPortfolioCompany(portfolioCompanyModel: any) {
    if (portfolioCompanyModel != undefined) {
      if ((portfolioCompanyModel.companyList != undefined && portfolioCompanyModel.companyList.length > 0)
        && (portfolioCompanyModel.moduleList != undefined && portfolioCompanyModel.moduleList.length > 0)
        && (portfolioCompanyModel.period != undefined && portfolioCompanyModel.period.length > 0)
        && (portfolioCompanyModel.kpiItems != undefined && portfolioCompanyModel.kpiItems.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validMandatoryESG(ESGModel: any) {
    if (ESGModel != undefined) {
      if ((ESGModel.companyList != undefined && ESGModel.companyList.length > 0)
        && (ESGModel.moduleList != undefined && ESGModel.moduleList.length > 0)
        && (ESGModel.period != undefined && ESGModel.period.length > 0)
        && (ESGModel.kpiItems != undefined && ESGModel.kpiItems.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validResetESG(ESGModel: any) {
    if (ESGModel != undefined) {
      if ((ESGModel.companyList != undefined && ESGModel.companyList.length > 0)
      || (ESGModel.fundList != undefined && ESGModel.fundList.length > 0)
      || (ESGModel.moduleList != undefined && ESGModel.moduleList.length > 0)
      || (ESGModel.period != undefined && ESGModel.period.length > 0)
      || (ESGModel.fxRates != undefined && ESGModel.fxRates !=null)
      || (ESGModel.kpiItems != undefined && ESGModel.kpiItems.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validResetPortfolioCompany(portfolioCompanyModel: any) {
    if (portfolioCompanyModel != undefined) {
      if ((portfolioCompanyModel.companyList != undefined && portfolioCompanyModel.companyList.length > 0)
      || (portfolioCompanyModel.fundList != undefined && portfolioCompanyModel.fundList.length > 0)
      || (portfolioCompanyModel.moduleList != undefined && portfolioCompanyModel.moduleList.length > 0)
      || (portfolioCompanyModel.period != undefined && portfolioCompanyModel.period.length > 0)
      || (portfolioCompanyModel.fxRates != undefined && portfolioCompanyModel.fxRates !=null)
      || (portfolioCompanyModel.kpiItems != undefined && portfolioCompanyModel.kpiItems.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validMandatoryDeal(dealModel: any) {
    if (dealModel != undefined) {
      if ((dealModel.companyList != undefined && dealModel.companyList.length > 0)
        && (dealModel.fundList != undefined && dealModel.fundList.length > 0)
        && (dealModel.period != undefined && dealModel.period.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validResetDeal(dealModel: any) {
    if (dealModel != undefined) {
      if ((dealModel.companyList != undefined && dealModel.companyList.length > 0)
        || (dealModel.fundList != undefined && dealModel.fundList.length > 0)
        || (dealModel.period != undefined && dealModel.period.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validMandatoryFund(fundModel: any) {
    if (fundModel != undefined) {
      if ((fundModel.fundList != undefined && fundModel.fundList.length > 0)
        && (fundModel.period != undefined && fundModel.period.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  validResetFund(fundModel: any) {
    if (fundModel != undefined) {
      if ((fundModel.fundList != undefined && fundModel.fundList.length > 0)
        || (fundModel.period != undefined && fundModel.period.length > 0)) {
        return true;
      } else {
        return false;
      }
    }
  }
  OpenUploadModal(tab: ITab,element:any) {
    this.isOpenUpload = true;
    element.hide(tab);
  }
  ChangeInputFileUpload(data: any) {
    this.triggerApplyEvent = true;
    this.dataAnalyticsUploadModel = data;
    this.isOpenUpload = false;
  }
  closePopup(event:any){
    this.isOpenUpload = event;
  }
  onSaveDashboardEvent(event:any){
    this.isNewDashboard = event;
  }
}
