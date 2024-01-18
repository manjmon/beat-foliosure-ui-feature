import { Component,ViewEncapsulation, Input, OnInit,EventEmitter, Output, ViewChild } from '@angular/core';
import { FxRates, InvestorSections,MiscellaneousService } from "../../../services/miscellaneous.service";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { CurrencyService } from 'src/app/services/currency.service';
import { DataAnalyticsService } from "src/app/services/data-analytics.service";
import { FilterService } from "src/app/services/filter.services";
import { AbstractFilterStrategy } from "src/app/components/reports/reports";
import { ToastrService } from "ngx-toastr";
import { FundEnum, Constants, DataAnalyticsConstants } from "src/app/common/constants";
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
@Component({
  selector: "app-data-analytics-filter",
  templateUrl: "./data-analytics-filter.component.html",
  styleUrls: ["./data-analytics-filter.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DataAnalyticsFilterComponent extends AbstractFilterStrategy implements OnInit {
  collapsed = true;
 model: any ={}
  portfolioCompanyModel:any ={
    fundList:[],
    companyList:[],
    period:[],
    moduleList:[],
    kpiItems:[],
    currenceList:[],
    fxRates:[],
  };
  fundModel:any ={
    fundList:[],
    period:[]
  };
  dealModel:any ={
    fundList:[],
    companyList:[],
    period:[],
    moduleList:[],
    kpiItems:[]
  };
  investorModel:any ={
    fundList:[],
    investorList:[],
    companyList:[],
    period:[],
    investorSections:[]
  };
  portfolioCompanyList:any ={
    fundList:[],
    companyList:[],
    period:[],
    moduleList:[],
    kpiItems:[],
    currenceList:[],
    fxRates:[],
    investorSections:[]
  }
  ESGList:any ={
    fundList:[],
    companyList:[],
    period:[],
    moduleList:[],
    kpiItems:[],
    currenceList:[],
    fxRates:[],
    investorSections:[]
  }
  fundList:any ={
    fundList:[],
    period:[]
  }
  dealList:any ={
    fundList:[],
    companyList:[],
    period:[],
    moduleList:[],
    kpiItems:[],
  }
  investorList:any ={
    fundList:[],
    investorList:[],
    companyList:[],
    period:[],
    investorSections:[]
  }
  ESGModel:any ={
    fundList:[],
    companyList:[],
    period:[],
    moduleList:[],
    kpiItems:[],
    currenceList:[],
    fxRates:[],
  };
  FundEnum = FundEnum;
  yearRange: any = "2000:2050";
  dateRange: any[];
  @Output() onInputChanges: EventEmitter<any> = new EventEmitter();
  tabList: ITab[] = [];
  paginationFilterClone: any = {};
  selectedModule: any = "companyName";
  @Input() dataAnalyticsFilterdata: any = [];
  @Input() saveFiltersOptionsList:any = [];
  enabledPCControl: boolean = false;
  disabledControl:boolean =  false;
  defaultControl: boolean = false;
  tabName: string = "Portfolio Company";
  optionsList:any = [];
  dataAnalyticsFeatures: any[];
  SelectedReport: any = [];
  dataAnalyticsReportId = 999;
  confirmDelete: boolean = false;
  cloneCompanyList: any[];
  @ViewChild('myCalendar') myCalendar;
  constructor(private PortfolioCompanyService:PortfolioCompanyService,private MiscellaneousService:MiscellaneousService, private toastrService: ToastrService, private filterService: FilterService,private _currencyService: CurrencyService, private dataAnalyticService: DataAnalyticsService) {
    super();
    this.getCurreny();
    this.getTabList();
    this.GetAllFilterData();
    this.getESGModuleList();
    this.getFxRates();
    this.getInvestorsList();
    this.getInvestorSections();
  }
  
 
  ngOnInit(): void {
    if (this.dataAnalyticsFilterdata != undefined && this.dataAnalyticsFilterdata?.portfolioCompanyModel != undefined && this.dataAnalyticsFilterdata?.portfolioCompanyModel != null) {
      this.model = this.dataAnalyticsFilterdata;
      this.setFilterValue();
      this.setModelValue();
      this.tabName = this.model.currentTabName;
    } else {
      this.resetObjects();
    }
  }
  setModelValue(){
    if (this.portfolioCompanyModel?.moduleList?.length > 0 && this.portfolioCompanyModel?.companyList?.length > 0) {
      this.GetKpisByModuleId()
    }
    if (this.dealModel?.moduleList?.length > 0 && this.dealModel?.companyList?.length > 0) {
      this.GetDealKpisByModuleId()
    }
    this.setInvestorModelValue();
    if (this.model.SelectedReport != null && this.model.SelectedReport != undefined) {
      this.SelectedReport = this.model.SelectedReport;
      this.OnFiltersSelected();
    } else {
      this.SelectedReport = [];
    }
    this.setCurrentTabName();
  }
  setCurrentTabName(){
    if (this.model.currentTabName != undefined && this.model.currentTabName != "" && this.tabList?.length > 0) {
      this.tabList.forEach(element => {
        if (element.name == this.model.currentTabName)
          element.active = true;
        else
          element.active = false;
      });
    } 
  }
  setInvestorModelValue(){
    if(this.investorModel.investorList.length > 0){
      this.GetFundsByInvestor("reset");

      setTimeout(() => {
        if(this.investorModel.fundList.length>0)  
          this.GetCompanies("InvestorCompany","reset")
      }, 300);
    }
    else  {
      this.investorList.fundList=[];
      this.investorModel.fundList=[];
    }
  }
  resetObjects(){
    this.model = [];
    this.model.currentTabName = "Portfolio Company";
    this.model.portfolioCompanyModel = this.portfolioCompanyModel;
    this.model.ESGModel = this.ESGModel;
    this.model.dealModel = this.dealModel;
    this.model.fundModel = this.fundModel;
    this.model.investorModel = this.investorModel;
    this.portfolioCompanyModel.period = null;
    this.ESGModel.period = null;
    this.fundModel.period = null;
    this.dealModel.period = null;
    this.investorModel.period = null;
  }
  setPortfolioCompanyModel() {
    if (this.dataAnalyticsFilterdata.portfolioCompanyModel) {
        this.portfolioCompanyModel = this.dataAnalyticsFilterdata.portfolioCompanyModel;
        if(this.portfolioCompanyModel.kpiItems.length > 0 && this.portfolioCompanyList.kpiItems.length == 0){
            this.portfolioCompanyList.kpiItems = this.portfolioCompanyModel.kpiItems;
        }
        if(this.portfolioCompanyModel?.fundList?.length == 0 && this.cloneCompanyList?.length>0){
            this.portfolioCompanyList.companyList = this.cloneCompanyList;
        }
    }
}

setESGModel() {
    if (this.dataAnalyticsFilterdata.ESGModel) {
        this.ESGModel = this.dataAnalyticsFilterdata.ESGModel;
        if(this.ESGModel.kpiItems.length > 0 && this.ESGList.kpiItems.length == 0){
            this.ESGList.kpiItems = this.ESGModel.kpiItems;
        }
        if(this.ESGModel?.fundList?.length == 0 && this.cloneCompanyList?.length>0){
            this.ESGList.companyList = this.cloneCompanyList;
        }
    }
}

setFundModel() {
    if (this.dataAnalyticsFilterdata.fundModel) {
        this.fundModel = this.dataAnalyticsFilterdata.fundModel;
    }
}

setDealModel() {
    if (this.dataAnalyticsFilterdata.dealModel) {
        this.dealModel = this.dataAnalyticsFilterdata.dealModel;
        if(this.dealModel?.fundList?.length == 0 && this.cloneCompanyList?.length>0){
            this.dealList.companyList = this.cloneCompanyList;
        }
        if(this.dealModel?.kpiItems.length > 0 && this.dealList?.kpiItems.length == 0){
            this.dealList.kpiItems = this.dealModel.kpiItems;
        }
    }
}

setInvestorModel() {
    if (this.dataAnalyticsFilterdata.investorModel) {
        this.investorModel = this.dataAnalyticsFilterdata.investorModel;
        if(this.investorModel?.fundList?.length == 0 && this.cloneCompanyList?.length>0){
            this.investorList.companyList = this.cloneCompanyList;
        }
    }
}

setSelectedReport() {
    if(this.dataAnalyticsFilterdata && this.dataAnalyticsFilterdata?.SelectedReport){
        this.SelectedReport = this.dataAnalyticsFilterdata.SelectedReport;
    }
}

setFilterValue() {
    this.setPortfolioCompanyModel();
    this.setESGModel();
    this.setFundModel();
    this.setDealModel();
    this.setInvestorModel();
    this.setSelectedReport();
}
  ngDoCheck() {
    this.setFilterValue();
  }
  getCurreny(){
    this._currencyService
    .getAllCurrencies()
    .subscribe({
      next:(result) => {
      let resp = result;
      if (resp != undefined && resp.code == "OK" && resp.body.length>0) {
        let filterCurrencyList = result.body.filter((x) => x.currencyCode == 'USD' ||  x.currencyCode == 'ZAR');
        if(filterCurrencyList.length>0){
          this.portfolioCompanyList.currenceList = filterCurrencyList;
          this.portfolioCompanyList.currenceList = filterCurrencyList;
        }
      }
    },
    error(err) {
      
    },});
  }
  getInvestorsList(){
    this.dataAnalyticService
    .getInvestorsList()
    .subscribe({
      next:(result) => {
      let resp = result;
      if (resp != undefined) {
        this.investorList.investorList = resp;
      }
    },error(err) {
      
    }});
  }
  getFxRates(){
    this.portfolioCompanyList.fxRates = [
      {
        id: FxRates.SystemAPI,
        type: FxRates[FxRates.SystemAPI],
      },
      {
        id: FxRates.BulkUpload,
        type: FxRates[FxRates.BulkUpload],
      },
    ];
  }
  getInvestorSections(){
    this.investorList.investorSections = [
      {
        id: InvestorSections.InvestedFunds,
        type: InvestorSections.InvestedFunds,
      },
      {
        id: InvestorSections.InvestorFundDetails,
        type: InvestorSections.InvestorFundDetails,
      },
      {
        id: InvestorSections.CompanyPerformance,
        type: InvestorSections.CompanyPerformance,
      },
      {
        id: InvestorSections.InvestorCompanyDetails,
        type: InvestorSections.InvestorCompanyDetails,
      },
      {
        id: InvestorSections.ValuationData,
        type: InvestorSections.ValuationData,
      },
    ];
  }
  getTabList() {
    this.tabList = [
      {
        active: true,
        name: "Portfolio Company",
      }, {
        active: false,
        name: "Deal"
      }, {
        active: false,
        name: "Fund"
      },
      {
        active: false,
        name: "Investor"
      },
      {
        active: false,
        name: "ESG"
      }
      
    ];
  }
  onTabClick(tab: ITab) {
    if (tab) {
        this.tabName = tab.name;
        this.model.currentTabName = tab.name;
        this.onInputChanges.emit(this.model);
    }
  }

  GetAllFilterData() {
		this.dataAnalyticService.GetAllFilterData().subscribe({next:(result) => {
    if(result != null)
    {
      this.portfolioCompanyList.moduleList = result?.modules?.filter(x => x.sectionName != Constants.DealTrackRecord);;
      this.portfolioCompanyList.fundList = result?.funds;
      this.ESGList.fundList = result?.funds;
      this.dealList.fundList = result?.funds;
      this.dealList.moduleList = result?.modules?.filter(x => x.staticSection && x.sectionName != Constants.InvestmentProfessionals);
      this.fundList.fundList =result?.funds;
      this.portfolioCompanyList.companyList = result?.companies;
      this.ESGList.companyList = result?.companies;
      this.cloneCompanyList =  result?.companies;
      this.dealList.companyList =result?.companies;
      this.dataAnalyticsFeatures=result?.dataAnalyticsFeatures;
      if(this.portfolioCompanyModel?.fundList?.length > 0){
        this.GetCompanies("PCCompany","reset");
      }
      if(this.ESGModel?.fundList?.length > 0){
        this.GetCompanies("ESGCompany","reset");
      }
      if(this.dealModel?.fundList?.length > 0){
        this.GetCompanies("DealCompany","reset");
      }
      if(this.investorModel?.fundList?.length > 0){
        this.GetCompanies("InvestorCompany","reset");
      }
    }   
		}, 
    error:(error) => {
		}})
	}

  filterFunds(module:string){
    let filterdFundList;
    if(module =="PCCompany")
      filterdFundList = this.portfolioCompanyModel.fundList.map(function (fund) { return fund.fundID });
    else if( module == "DealCompany") 
      filterdFundList = this.dealModel.fundList.map(function (fund) { return fund.fundID });
    else if( module == "InvestorCompany") 
      filterdFundList = this.investorModel.fundList.map(function (fund) { return fund.fundID });
    else if( module == "ESGCompany") 
      filterdFundList = this.ESGModel.fundList.map(function (fund) { return fund.fundID });
    return filterdFundList.toString();
  }
  setCompanies(result: any, module: string,type:string) {
    if (module == "PCCompany") {
      this.portfolioCompanyList.companyList = result;
      if (type != "reset")
        this.portfolioCompanyModel.companyList = [];
    }
    else if (module == "DealCompany") {
      this.dealList.companyList = result;
      if (type != "reset")
        this.dealModel.companyList = [];
    }
    else if (module == "InvestorCompany") {
      this.investorList.companyList = result;
      if (type != "reset")
        this.investorModel.companyList = [];
    }
    else if (module == "ESGCompany") {
      this.ESGList.companyList = result;
      if (type != "reset")
        this.ESGModel.companyList = [];
    }
  }
  getESGModuleList() {
    this.MiscellaneousService.getMethodologiesByGroup().subscribe({next:result => {   
      if(result !=null)
      {
        this.ESGList.moduleList = result.groupModel.filter(x => x.name == "ESG")[0].items;
      }  
    }, error: _error => {
    }});
  }
  GetCompanies(module:string,type:string) {
    let filter = {
      FundIds: this.filterFunds(module).length!=0?this.filterFunds(module):null
    }
		this.dataAnalyticService.GetCompanies(filter).subscribe({
      next:(result) => {
    if(result != null)
    {
      this.setCompanies(result,module,type)
    }   
		}, 
    error:(error) => {
		}});
	}
  GetFundsByInvestor(type:string) {
      let investorId =  this.investorModel.investorList?.map(function (investor) { return investor.investorId }).toString();
		this.dataAnalyticService.GetFundsByInvestor([investorId]).subscribe({
      next: (result) => {
    if(result != null)
    {
        this.investorList.fundList = result;
        if(type != "reset")
          this.investorModel.fundList = [];
    }   
		}, 
    error:(error) => {
		}})
	}
  GetKpisByModuleId(){
    let CompanyIds = this.portfolioCompanyModel.companyList?.map(function (company) { return company.companyId });
    let ModuleIds =  this.portfolioCompanyModel.moduleList?.filter(module => !module.staticSection).map(function (module) { return module.moduleId });
    const subPageIds =  this.portfolioCompanyModel.moduleList?.filter(module => module.staticSection).map(function (module) { return module.moduleId });
    if(CompanyIds.length > 0  && (ModuleIds.length > 0 || subPageIds.length>0)){
      let filter = {
        CompanyIds: CompanyIds.toString(),
        ModuleIds: ModuleIds.toString(),
        SubPageIds:subPageIds.toString()
      }
      this.dataAnalyticService.GetKpisByModuleId(filter).subscribe({
        next:(result) => {
        if(result != null && result.length > 0)
        {
          this.getKpiItemList(result);
        }   
        }, 
        error:(error) => {
        }})
    }
    
  }
  GetKpisByESGModuleId(){
    let CompanyIds = this.ESGModel.companyList?.map(function (company) { return company.companyId });
    let ModuleIds =  this.ESGModel.moduleList?.map(function (module) { return module.moduleID });
    if(CompanyIds.length > 0  && (ModuleIds.length > 0 )){
      let filter = {
        CompanyIds: CompanyIds.toString(),
        ModuleIds: ModuleIds.toString(),
        SubPageIds:""
      }
      this.dataAnalyticService.GetESGKpisByModuleId(filter).subscribe({
        next:(result) => {
        if(result != null && result.length > 0)
        {
          this.ESGList.kpiItems = result;
        }   
        }, 
        error:(error) => {
        }})
    }
    
  }

  GetDealKpisByModuleId(){
    let CompanyIds = this.dealModel.companyList?.map(function (company) { return company.companyId });
    let ModuleIds =  [];
    const subPageIds =  this.dealModel.moduleList?.filter(module => module.staticSection).map(function (module) { return module.moduleId });
    if(CompanyIds.length > 0  && (ModuleIds.length > 0 || subPageIds.length>0)){
      let filter = {
        CompanyIds: CompanyIds.toString(),
        ModuleIds: ModuleIds.toString(),
        SubPageIds:subPageIds.toString()
      }
      this.dataAnalyticService.GetKpisByModuleId(filter).subscribe({
        next:(result) => {
        if(result != null && result.length > 0)
        {
          this.getDealKpiItemList(result);
        }   
        }, 
        error:(error) => {
        }})
    }
    
  }
  getDealKpiItemList(result:any){
    this.dealList.kpiItems = [];
    this.dealModel.moduleList.forEach(element => {
      let filterItems = [];
      if (!element.staticSection)
        filterItems = result?.filter(item => item.moduleId === element.moduleId && item.moduleName !== DataAnalyticsConstants.PageConfig);
      if (element.staticSection)
        filterItems = result?.filter(item => item.moduleId === element.moduleId && item.moduleName === DataAnalyticsConstants.PageConfig && item.kpiFieldName != DataAnalyticsConstants.CompanyName && item.kpiFieldName != DataAnalyticsConstants.FundName);
      if(filterItems.length > 0){
        this.dealList.kpiItems.push(this.returnKpiItem(element,filterItems)); 
      }
             
    });
  }

  getKpiItemList(result:any){
    this.portfolioCompanyList.kpiItems = [];
    this.portfolioCompanyModel.moduleList.forEach(element => {
      let filterItems = [];
      if (!element.staticSection)
        filterItems = result?.filter(item => item.moduleId === element.moduleId && item.moduleName !== DataAnalyticsConstants.PageConfig);
      if (element.staticSection)
        filterItems = result?.filter(item => item.moduleId === element.moduleId && item.moduleName === DataAnalyticsConstants.PageConfig  && item.kpiFieldName != DataAnalyticsConstants.CompanyName && item.kpiFieldName != DataAnalyticsConstants.FundName);
      if(filterItems.length > 0){
        this.portfolioCompanyList.kpiItems.push(this.returnKpiItem(element,filterItems)); 
      }
             
    });
  }
  returnKpiItem(element:any, filterItems:any){
    return {
      "moduleId":element.moduleId,
      "moduleName":element.name,
      "items":filterItems
    }
  }
  switchForPC(event:any,control:string){
    switch (control) {
      case "PCCompany":
        this.portfolioCompanyModel.companyList= event.value;
        this.model.portfolioCompanyModel.companyList = event.value;
        if(this.model.portfolioCompanyModel.companyList.length > 0 && this.model.portfolioCompanyModel.moduleList.length>0){
          this.GetKpisByModuleId();
        }else{
          this.portfolioCompanyList.kpiItems = [];
          this.portfolioCompanyModel.kpiItems = [];
          this.portfolioCompanyModel.moduleList = [];
        }
        break;
      case "PCFunds":
        this.portfolioCompanyModel.fundList = event.value;
        this.model.portfolioCompanyModel.fundList = event.value;
        this.portfolioCompanyModel.moduleList = [];
        this.portfolioCompanyModel.kpiItems = [];
        this.portfolioCompanyList.kpiItems = [];
        if(this.model.portfolioCompanyModel.fundList.length > 0){
          this.GetCompanies("PCCompany","Change");
        }else{
          this.portfolioCompanyModel.companyList = [];
          this.portfolioCompanyList.companyList = this.cloneCompanyList;
        }
        break;
      case "PCModule":
        this.portfolioCompanyModel.moduleList = event.value;
        this.model.portfolioCompanyModel.moduleList = event.value;
        if(this.model.portfolioCompanyModel.companyList.length > 0 && this.model.portfolioCompanyModel.moduleList.length>0){
          this.GetKpisByModuleId();
          this.portfolioCompanyModel.kpiItems = [];
        }else{
          this.portfolioCompanyList.kpiItems = [];
          this.portfolioCompanyModel.kpiItems = [];
        }
        break;
      case "PCKpiItem":
        this.portfolioCompanyModel.kpiItems = event.value;
        this.model.portfolioCompanyModel.kpiItems = event.value;
        break;
      case "PCCurrency":
        this.portfolioCompanyModel.currenceList = event.value;
        this.model.portfolioCompanyModel.currenceList = event.value;
        break;
      case "PCFxRates":
        this.portfolioCompanyModel.fxRates = event.value;
        this.model.portfolioCompanyModel.fxRates = event.value;
        break;
      case "PCPeriod":
        this.portfolioCompanyModel.period = event;
        this.model.portfolioCompanyModel.period = event;
        if(event.length > 0 && event[0] != null && event[1] != null){
          this.myCalendar.hideOverlay();
        }
        break;
    }
  }
  switchForESG(event:any,control:string){
    switch (control) {
      case "ESGCompany":
        this.ESGModel.companyList= event.value;
        this.model.ESGModel.companyList = event.value;
        if(this.model.ESGModel.companyList.length > 0 && this.model.ESGModel.moduleList.length>0){
          this.GetKpisByESGModuleId();
        }else{
          this.ESGList.kpiItems = [];
          this.ESGModel.kpiItems = [];
          this.ESGModel.moduleList = [];
        }
        break;
      case "ESGFunds":
        this.ESGModel.fundList = event.value;
        this.model.ESGModel.fundList = event.value;
        this.ESGModel.moduleList = [];
        this.ESGModel.kpiItems = [];
        this.ESGList.kpiItems = [];
        if(this.model.ESGModel.fundList.length > 0){
          this.GetCompanies("ESGCompany","Change");
        }else{
          this.ESGModel.companyList = [];
          this.ESGList.companyList = this.cloneCompanyList;
        }
        break;
      case "ESGModule":
        this.ESGModel.moduleList = event.value;
        this.model.ESGModel.moduleList = event.value;
        if(this.model.ESGModel.companyList.length > 0 && this.model.ESGModel.moduleList.length>0){
          this.GetKpisByESGModuleId();
          this.ESGModel.kpiItems = [];
        }else{
          this.ESGList.kpiItems = [];
          this.ESGModel.kpiItems = [];
        }
        break;
      case "ESGKpiItem":
        this.ESGModel.kpiItems = event.value;
        this.model.ESGModel.kpiItems = event.value;
        break;
      case "ESGCurrency":
        this.ESGModel.currenceList = event.value;
        this.model.ESGModel.currenceList = event.value;
        break;
      case "ESGFxRates":
        this.ESGModel.fxRates = event.value;
        this.model.ESGModel.fxRates = event.value;
        break;
      case "ESGPeriod":
        this.ESGModel.period = event;
        this.model.ESGModel.period = event;
        if(event.length > 0 && event[0] != null && event[1] != null){
          this.myCalendar.hideOverlay();
        }

        break;
    }
  }
  switchForFund(event:any,control:string){
    switch (control) {
      case "FundsList":
        this.fundModel.fundList = event.value; 
        this.model.fundModel.fundList = event.value; 
        break;
      case "FundPeriod":
        this.fundModel.period = event;
        this.model.fundModel.period = event;
        if(event.length > 0 && event[0] != null && event[1] != null){
          this.myCalendar.hideOverlay();
        }
        break;
    }
  }
  switchForDeal(event:any,control:string){
    switch (control) {
      case "DealFunds":
        this.dealModel.fundList = event.value;
        this.model.dealModel.fundList = event.value;
        this.GetCompanies("DealCompany","Change");
        break;
      case "DealCompany":
        this.dealModel.companyList = event.value;
        this.model.dealModel.companyList = event.value;
        break;
      case "DealPeriod":
        this.dealModel.period = event;
        this.model.dealModel.period = event;
        if(event.length > 0 && event[0] != null && event[1] != null){
          this.myCalendar.hideOverlay();
        }
        break;
      case "DealModule":
        this.dealModel.moduleList = event.value;
        this.model.dealModel.moduleList = event.value;
        if (this.model.dealModel.companyList.length > 0 && this.model.dealModel.moduleList.length > 0) {
          this.GetDealKpisByModuleId();
          this.dealModel.kpiItems = [];
        } else {
          this.dealList.kpiItems = [];
          this.dealModel.kpiItems = [];
        }
        break;
        case "DealKpiItem":
          this.dealModel.kpiItems = event.value;
          this.model.dealModel.kpiItems = event.value;
          break;
    }
  }
  switchForInvestor(event:any,control:string){
    switch (control) {
      case "InvestorList":
        this.investorModel.investorList = event.value; 
        if(this.investorModel.investorList.length > 0){
          this.GetFundsByInvestor("change");
        }
        else  {
          this.investorList.fundList=[];
          this.investorModel.fundList=[];
        }
        break;
      case "InvestorFunds":
        this.investorModel.fundList = event.value;
        this.model.investorModel.fundList = event.value;
        if(this.model.investorModel.fundList.length>0){
          this.GetCompanies("InvestorCompany","Change");
        }else{
          this.investorModel.companyList = [];
        }
        break;
      case "InvestorCompany":
        this.investorModel.companyList = event.value;
        this.model.investorModel.companyList = event.value;
        break;
      case "InvestorPeriod":
        this.investorModel.period = event;
        this.model.investorModel.period = event;
        if(event.length > 0 && event[0] != null && event[1] != null){
          this.myCalendar.hideOverlay();
        }
        break;
      case "InvestorSections":
        this.investorModel.investorSections = event.value;
        this.model.investorModel.investorSections = event.value;
      break;
    }
  }
  onChangeModel(event:any,control:string){
      switch (control) {
      case "PCCompany": case "PCFunds": case "PCModule": case "PCKpiItem":case "PCCurrency":case "PCFxRates":case "PCPeriod":
        this.switchForPC(event,control);
        break;
      case "DealFunds": case "DealCompany":  case "DealPeriod": case "DealModule": case "DealKpiItem":
        this.switchForDeal(event,control);
        break;
      case "FundsList": case "FundPeriod":
        this.switchForFund(event,control);
        break;
      case "InvestorList": case "InvestorFunds": case "InvestorCompany": case "InvestorPeriod":  case "InvestorSections":
       this.switchForInvestor(event,control);
      break;
      case "ESGCompany": case "ESGFunds": case "ESGModule": case "ESGKpiItem":case "ESGCurrency":case "ESGFxRates":case "ESGPeriod":
        this.switchForESG(event,control);
        break;
    }
    this.onInputChanges.emit(this.model);
  }
 
  OnFiltersSelected() {
    this.model.SelectedReport =  this.SelectedReport;
    this.filterService.getFilter(this.SelectedReport.userReportId).subscribe({
      next: (response) => {
        this.LoadSavedFilter(response)
      },
      error: (_error) => { }}
    );
  }
  LoadSavedFilter(res:any){
    let reportFilters = res.reportFilters;
    this.setFilterPortfolioCompany(reportFilters);
    this.setFilterDeal(reportFilters);
    this.setFilterFund(reportFilters);
    this.setFilterInvestor(reportFilters);
    this.setFilterESG(reportFilters);
    setTimeout(() => {
      this.triggerApplyFunctions();
    }, 2000);
  }
  triggerApplyFunctions(){
    this.model.portfolioCompanyModel = this.portfolioCompanyModel;
    this.model.ESGModel = this.ESGModel;
    this.model.dealModel = this.dealModel;
    this.model.investorModel = this.investorModel;
    this.model.fundModel = this.fundModel;
    this.model.SelectedReport = this.SelectedReport;
    this.onInputChanges.emit(this.model);
  }
  setFilterPortfolioCompany(reportFilters: any) {
    this.portfolioCompanyModel.companyList = this.portfolioCompanyList.companyList.filter((s) => {
      return this.GetItems("PCCompany", reportFilters).some(item => item == s.companyId);
    });
    this.portfolioCompanyModel.fundList = this.portfolioCompanyList.fundList.filter((s) => {
      return this.GetItems("PCFunds", reportFilters).some(item => item == s.fundID);
    });
    this.portfolioCompanyModel.moduleList = this.portfolioCompanyList.moduleList.filter((s) => {
      return this.GetItems("PCModule", reportFilters).some(item => item == s.moduleId);
    });
    let kpiItemFilter = reportFilters.find((s) => s.filterName === "PCKpiItem")
    if (kpiItemFilter != undefined && kpiItemFilter.length != 0) {
      if (kpiItemFilter != undefined && kpiItemFilter.filterValues != undefined && kpiItemFilter.filterValues != null) {
        this.portfolioCompanyList.kpiItems = JSON.parse(kpiItemFilter?.filterValues);
      }
    }
    this.portfolioCompanyModel.currenceList = this.portfolioCompanyList.currenceList.filter((s) => {
      return this.GetItems("PCCurrency", reportFilters).some(item => item == s.currencyID);
    })[0];
    this.portfolioCompanyModel.fxRates = this.portfolioCompanyList.fxRates.filter((s) => {
      return this.GetItems("PCFxRates", reportFilters).some(item => item == s.id);
    })[0];
    let pcPeriodFilter = reportFilters.find((s) => s.filterName === "PCPeriod");
    if (pcPeriodFilter != undefined && pcPeriodFilter.length > 0) {
      this.portfolioCompanyModel.period = [];
      this.portfolioCompanyModel.period.push(new Date(this.GetItems("PCPeriod", reportFilters)[0]));
      this.portfolioCompanyModel.period.push(new Date(this.GetItems("PCPeriod", reportFilters)[1]));
    } else {
      this.portfolioCompanyModel.period = null;
    }
  }
  setFilterESG(reportFilters: any) {
    this.ESGModel.companyList = this.ESGList.companyList.filter((s) => {
      return this.GetItems("ESGCompany", reportFilters).some(item => item == s.companyId);
    });
    this.ESGModel.fundList = this.ESGList.fundList.filter((s) => {
      return this.GetItems("ESGFunds", reportFilters).some(item => item == s.fundID);
    });
    this.ESGModel.moduleList = this.ESGList.moduleList.filter((s) => {
      return this.GetItems("ESGModule", reportFilters).some(item => item == s.moduleId);
    });
    let kpiItemFilter = reportFilters.find((s) => s.filterName === "ESGKpiItem")
    if (kpiItemFilter != undefined && kpiItemFilter.length != 0) {
      if (kpiItemFilter != undefined && kpiItemFilter.filterValues != undefined && kpiItemFilter.filterValues != null) {
        this.ESGList.kpiItems = JSON.parse(kpiItemFilter?.filterValues);
      }
    }
    this.ESGModel.currenceList = this.ESGList.currenceList.filter((s) => {
      return this.GetItems("ESGCurrency", reportFilters).some(item => item == s.currencyID);
    })[0];
    this.ESGModel.fxRates = this.ESGList.fxRates.filter((s) => {
      return this.GetItems("ESGFxRates", reportFilters).some(item => item == s.id);
    })[0];
    let ESGPeriodFilter = reportFilters.find((s) => s.filterName === "ESGPeriod");
    if (ESGPeriodFilter != undefined && ESGPeriodFilter.length > 0) {
      this.ESGModel.period = [];
      this.ESGModel.period.push(new Date(this.GetItems("ESGPeriod", reportFilters)[0]));
      this.ESGModel.period.push(new Date(this.GetItems("ESGPeriod", reportFilters)[1]));
    } else {
      this.ESGModel.period = null;
    }
  }
  setFilterDeal(reportFilters: any) {
    this.dealModel.companyList = this.dealList.companyList.filter((s) => {
      return this.GetItems("DealCompany", reportFilters).some(item => item == s.companyId);
    });
    this.dealModel.fundList = this.dealList.fundList.filter((s) => {
      return this.GetItems("DealFunds", reportFilters).some(item => item == s.fundID);
    });
    this.dealModel.moduleList = this.dealList.moduleList.filter((s) => {
      return this.GetItems("DealModule", reportFilters).some(item => item == s.moduleId);
    });
    let kpiItemFilter = reportFilters.find((s) => s.filterName === "DealKpiItem")
    if (kpiItemFilter != undefined && kpiItemFilter.length != 0) {
      if (kpiItemFilter != undefined && kpiItemFilter.filterValues != undefined && kpiItemFilter.filterValues != null) {
        this.dealList.kpiItems = JSON.parse(kpiItemFilter?.filterValues);
      }
    }
    let dealPeriodFilter = reportFilters.find((s) => s.filterName === "DealPeriod");
    if (dealPeriodFilter != undefined && dealPeriodFilter.length > 0) {
      this.dealModel.period = [];
      this.dealModel.period.push(new Date(this.GetItems("DealPeriod", reportFilters)[0]));
      this.dealModel.period.push(new Date(this.GetItems("DealPeriod", reportFilters)[1]));
    }
    else {
      this.dealModel.period = null;
    }
  }
  setFilterFund(reportFilters: any) {
    this.fundModel.fundList = this.fundList.fundList.filter((s) => {
      return this.GetItems("FundsList", reportFilters).some(item => item == s.fundID);
    });
    let fundPeriodFilter = reportFilters.find((s) => s.filterName === "FundPeriod");
    if (fundPeriodFilter != undefined && fundPeriodFilter.length > 0) {
      this.fundModel.period = [];
      this.fundModel.period.push(new Date(this.GetItems("FundPeriod", reportFilters)[0]));
      this.fundModel.period.push(new Date(this.GetItems("FundPeriod", reportFilters)[1]));
    } else {
      this.fundModel.period = null;
    }
  }
  getFilterAvailableorNot(reportFilters:any, filterName:string){
    return reportFilters.find((s) => s.filterName === filterName);
  }
  setFilterInvestor(reportFilters: any) {
    this.investorModel.investorList = this.investorList.investorList.filter((s) => {
      return this.GetItems("InvestorList", reportFilters).some(item => item == s.investorId);
    });
    if(this.investorModel.investorList.length > 0){
      this.GetFundsByInvestor("reset");
    }
    else  {
      this.investorList.fundList=[];
      this.investorModel.fundList=[];
    }
    setTimeout(() => {
      this.investorModel.fundList = this.investorList.fundList.filter((s) => {
        return this.GetItems("InvestorFunds", reportFilters).some(item => item == s.fundID);
      });
      if(this.investorModel.investorList.length > 0 && this.investorModel.fundList.length > 0){
      this.GetCompanies("InvestorCompany","Change");
      setTimeout(() => {
        this.investorModel.companyList = this.investorList.companyList.filter((s) => {
          return this.GetItems("InvestorCompany", reportFilters).some(item => item == s.companyId);
        });
      }, 500);
      
    }
    }, 500);
    this.investorModel.investorSections = this.investorList.investorSections.filter((s) => {
      return this.GetItems("InvestorSections", reportFilters).some(item => item == s.id);
    })[0];
    let investorPeriodFilter = reportFilters.find((s) => s.filterName === "InvestorPeriod");
    if (investorPeriodFilter != undefined && investorPeriodFilter.filterValues != null) {
      this.investorModel.period = [];
      this.investorModel.period.push(new Date(this.GetItems("InvestorPeriod", reportFilters)[0]));
      this.investorModel.period.push(new Date(this.GetItems("InvestorPeriod", reportFilters)[1]));
    } else {
      this.investorModel.period = null
    }
  }
  OnDeleteFilter() {
    this.confirmDelete = true;
  }
  CancelDelete() {
    this.confirmDelete = false;
  }
  Delete() {
    this.confirmDelete = false;
    this.filterService.DeleteFilter(this.SelectedReport.userReportId).subscribe({
      next:(_response) => {
        this.toastrService.success(this.FundEnum.FilterDeletedSuccesfully, "", { positionClass: "toast-center-center" });
        this.LoadFilters();
        this.resetDataAnalyticsModel();
      },
      error: (_error) => { }}
    );
  }

  LoadFilters() {
    this.saveFiltersOptionsList = [];
    this.filterService.getFilters().subscribe(
      (response) => {
        let filtersList = response.filter((s) => s.reportID == this.dataAnalyticsReportId);
        this.saveFiltersOptionsList = filtersList;
      }
    );
  }
  resetDataAnalyticsModel(){
      this.dataAnalyticsFilterdata.portfolioCompanyModel = {
        fundList:[],
        companyList:[],
        period:[],
        moduleList:[],
        kpiItems:[],
        currenceList:[],
        fxRates:[],
      };
      this.dataAnalyticsFilterdata.ESGModel = {
        fundList:[],
        companyList:[],
        period:[],
        moduleList:[],
        kpiItems:[],
        currenceList:[],
        fxRates:[],
      };
      this.dataAnalyticsFilterdata.fundModel ={
        fundList:[],
        period:[]
      };
      this.dataAnalyticsFilterdata.dealModel ={
        fundList:[],
        companyList:[],
        period:[]
    
      };
      this.dataAnalyticsFilterdata.investorModel ={
        fundList:[],
        investorList:[],
        companyList:[],
        period:[],
        investorSections:[]
      };
    }
}
