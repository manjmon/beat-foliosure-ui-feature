import { Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import { FeaturesEnum, KPIModulesEnum, } from "./../../services/permission.service";
import { MiscellaneousService,  ErrorMessage } from "./../../services/miscellaneous.service";
import { getKpiHeaders, getBalanceSheetKpiHeaders, getProfitAndLossKpiHeaders, getCashflowKpiHeaders, getOperationalKpiHeaders, getMasterKpiHeaders, getInvestmentKpiHeaders, getESGKpiHeaders } from "src/app/common/TableHeaders";
import {  KpiTypesConstants, GetKpiInfoTypes } from "src/app/common/constants";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";


@Component({
  selector: "kpi-list",
  templateUrl: "./kpi-list.component.html",
  styleUrls: ["./kpi-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class KPIListComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  showActionCol: boolean = true;
  financialKpiList: any;
  operationalKpiList: any;
  investmentKpiList: any;
  impactKPIList: any;
  sectorwiseKpiList: any;
  companywiseKpiList: any;
  totalFinancialRecords: number;
  totalOperationalRecords: number;
  blockedTable: boolean = false;
  totalSectorwiseRecords: number;
  totalCompanywiseRecords: number;
  id: string;
  selectedKPI: string = "";
  paginationFilterCloneFin: any = {};
  paginationFilterCloneOp: any = {};
  globalFilter: string = "";
  globalFilterSectorwise: string = "";
  globalFilterCompanywise: string = "";
  activeTabId: string = "";
  kpiTypes = [];
  selectedKpiType = { name: KpiTypesConstants.TRADING_RECORDS, field: 'TradingRecords' };
  kpiList = [];
  kpiHeaders = [];
  tabName: string = "";
  tabList: ITab[] = [];
  ShowAddKPI: boolean = false;
  kpiInfoTypes = [];
  selectedAddKpiType:any;
  addKpiDesc = "";
  addKpiName: string = "";
  isHeader:boolean=false;
  isBoldKPI:boolean=false;
  selectedKpiInfoType = { name: 'Currency' };
  placeholderKPIName = 'Enter KPI name';
  ToasterMessage = "";
  disableAdd = true;
  isError = false;
  message: any;
  ErrorMessage = "";
  sectorList = [];
  sector = { name: "Agriculture & Timber", sectorID: 14 };
  UpdateKpi: boolean = false;
  primaryButtonName = "Add";
  modalTitle = "Add New KPI";
  kpiName: string = "";
  kpiDeatils = {};
  methodologyList = [];
  selectedMethodology:any;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  moduleId: number;
  isReload:any=null;
  popupToasterStyle = '';
  deletePopUp = false;
  primaryDeleteButtonName = "Confirm";
  secondaryDeleteButtonName = "Cancel";
  deleteModalTitle = "Delete KPI";
  deleteModalBody1 = "This will delete the KPI, and all related data. If it has child KPI then they will be unmapped as well. Do you confirm?"
  deleteKpi = {};
  isOpenPopUp:boolean = false;
  selectedFormulaKPI:any= null;
  companyId = 0;
  groupModel=[];
  constructor(
    private miscService: MiscellaneousService,
    private toastrService: ToastrService
  ) {
    localStorage.setItem("headerName", 'KPI Mapping');
  }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.kpiHeaders = getKpiHeaders();   
    this.getAllMethodologies();
    this.getTabList();
    this.GetKpiInfoTypes();
    this.getAllSectors();
    if(this.addKpiName.length==0){
      this.disableAdd = true;
    }  
  }
  GetKpiInfoTypes() {
    this.kpiInfoTypes = GetKpiInfoTypes();
  }

  GetSelectedKpiData(kpiType) {
    if(kpiType==null){
      kpiType=this.kpiTypes[0]?.items[0];
    }
    if(kpiType != "" && kpiType !=null){
      this.selectedKpiType = kpiType;
      this.moduleId=kpiType?.moduleID;
   
      switch (kpiType?.name) {
        case KpiTypesConstants.OPERATIONAL_KPI: {
          this.kpiHeaders = getOperationalKpiHeaders();
          this.getOperationalKpiList();
          break;
        }
        case KpiTypesConstants.INVESTMENT_KPI: {
          this.kpiHeaders = getInvestmentKpiHeaders();
          this.getInvestmentKPI();
          break;
        }
        case KpiTypesConstants.COMPANY_KPI: {
          this.kpiHeaders = getKpiHeaders();
          this.getCompanywiseKpiList();
          break;
        }
        case KpiTypesConstants.IMPACT_KPI: {
          this.kpiHeaders = getKpiHeaders();
          this.getImpactKPI();
          break;
        }
        case KpiTypesConstants.PROFIT_LOSS_KPI: {
          this.kpiHeaders = getProfitAndLossKpiHeaders();
          this.getProfitLossKpiList();
          break;
        }
        case KpiTypesConstants.BALANCE_SHEET_KPI: {
          this.kpiHeaders = getBalanceSheetKpiHeaders();
          this.getBalanceSheetKpiList();
          break;
        }
        case KpiTypesConstants.CASHFLOW_KPI: {
          this.kpiHeaders = getCashflowKpiHeaders();
          this.getCashflowKpiList();
          break;
        }
        default:{
          if(kpiType.moduleID > KPIModulesEnum.ESG)
          {
            this.kpiHeaders = getESGKpiHeaders();
            this.getESGKpiList(kpiType.moduleID);
          }
          else{
            this.kpiHeaders = getMasterKpiHeaders();
            if (kpiType?.field == "CreditKPI")        
              this.kpiHeaders = getKpiHeaders();       
            this.getMasterKpiList(this.moduleId);
          }
        }    
      }  
    }
   
  }

  getFinacialKpiList() {
    this.paginationFilterCloneFin = null;
    this.blockedTable = true;
    this.miscService.getFinancialKPIs({ paginationFilter: null }).subscribe({
     next: (result) => {
        let resp = result;
        if (resp != null && resp.code == "OK") {
          this.financialKpiList = resp.body.financialKPIList;
          this.totalFinancialRecords = resp.body.totalRecords;
        } else {
          this.financialKpiList = [];
          this.totalFinancialRecords = 0;
        }
        this.blockedTable = false;
      },
      error:(_error) => {
        this.blockedTable = false;
      }
     } );
  }

  getAllKpiTypes() {
    
    this.selectedKpiType = this.kpiTypes[0]?.items[0];
    this.GetSelectedKpiData(this.selectedKpiType);
  }

  closeUpdatePopUp() {
    if (this.UpdateKpi) {
      this.ShowAddKPI = false;
      this.reset();
      this.toastrService.success("KPI data updated succesfully","",{positionClass:"toast-center-center"});
    }
  }

  getOperationalKpiList() {
    this.paginationFilterCloneFin = null;
    this.blockedTable = true;
    this.miscService.getOperationalKPIs().subscribe({
      next:(result) => {
        let resp = result;
        if (resp != null && result.length > 0) {
          this.kpiList = resp;
          this.operationalKpiList = resp;
          this.totalOperationalRecords = resp.length;
        } else {
          this.kpiList =[];
          this.operationalKpiList = [];
          this.totalOperationalRecords = 0;
        }
        this.blockedTable = false;
      },
     error: (_error) => {
        this.blockedTable = false;
      }
  });
  }

  getImpactKPI() {
    this.paginationFilterCloneFin = null;
    this.blockedTable = true;
    this.miscService.getImpactKPI({ paginationFilter: null }).subscribe({
      next:(result) => {
        let resp = result;
        if (resp != null && resp.code == "OK") {
          this.kpiList = resp.body.impactKPIList;
          this.impactKPIList = resp.body.impactKPIList;
          this.totalOperationalRecords = resp.body.totalRecords;
        } else {
          this.impactKPIList = [];
          this.totalOperationalRecords = 0;
        }
        this.blockedTable = false;
      },
      error:(_error) => {
        this.blockedTable = false;
      }
  });
  }
  getInvestmentKPI() {
    this.paginationFilterCloneFin = null;
    this.blockedTable = true;
    this.miscService.getInvestmentKPI({ paginationFilter: null }).subscribe({
      next:(result) => {
        let resp = result;
        if (resp != null && resp.code == "OK") {
          this.kpiList = resp.body.investmentKPIList;
          this.investmentKpiList = resp.body.investmentKPIList;
          this.totalOperationalRecords = resp.body.totalRecords;
        } else {
          this.investmentKpiList = [];
          this.totalOperationalRecords = 0;
        }
        this.blockedTable = false;
      },
      error:(_error) => {
        this.blockedTable = false;
      }
  });
  }
  getSectorwiseKpiList() {
    this.paginationFilterCloneOp = null;
    this.blockedTable = true;
    this.miscService.getSectorwiseKPIs({ paginationFilter: null }).subscribe({
      next:(result) => {
        let resp = result;
        if (resp != null && resp.code == "OK") {
          this.kpiList = resp.body.sectorwiseKPIList;
          this.sectorwiseKpiList = resp.body.sectorwiseKPIList;
          this.totalSectorwiseRecords = resp.body.totalRecords;

        } else {
          this.sectorwiseKpiList = [];
          this.totalSectorwiseRecords = 0;
        }
        this.blockedTable = false;
      },
      error:(_error) => {
        this.blockedTable = false;
      }
  });
  }

  getCompanywiseKpiList() {
    this.paginationFilterCloneOp = null;
    this.blockedTable = true;
    this.miscService.getCompanyKPIs().subscribe({
      next:(result) => {
        let resp = result;
        if (resp != null && result.length > 0) {
          this.kpiList = result;
          this.companywiseKpiList = result;

        } else {
          this.kpiList = [];
          this.companywiseKpiList = [];
          this.totalCompanywiseRecords = 0;
        }
        this.blockedTable = false;
      },
      error:(_error) => {
        this.blockedTable = false;
      }
  });
  }

  exportFinancialKpiList() {
    let event = JSON.parse(JSON.stringify(this.paginationFilterCloneFin));
    event.globalFilter = this.globalFilter;
    event.filterWithoutPaging = true;
    this.miscService
      .exportFinancialKpiList({ paginationFilter: event })
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  exportOperationalKpiList() {
    let event = JSON.parse(JSON.stringify(this.paginationFilterCloneFin));
    event.globalFilter = this.globalFilter;
    event.filterWithoutPaging = true;
    this.miscService
      .exportOperationalKpiList({ paginationFilter: event })
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  exportSectorwiseKpiList() {
    let event = JSON.parse(JSON.stringify(this.paginationFilterCloneOp));
    event.globalFilter = this.globalFilterSectorwise;
    event.filterWithoutPaging = true;
    this.miscService
      .exportSectorwiseKpiList({ paginationFilter: event })
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  exportCompanyKpiList() {
    let event = JSON.parse(JSON.stringify(this.paginationFilterCloneOp));
    event.globalFilter = this.globalFilterCompanywise;
    event.filterWithoutPaging = true;
    this.miscService
      .exportCompanyKpiList({ paginationFilter: event })
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }
  getTabList() {
    this.tabList = [
      {
        active: true,
        name: "KPI List"
      }
      , {
        active: false,
        name: "Mapping"
      }
    ];
    this.tabName = this.tabList[0].name
  }

  

  onTabClick(tab: ITab) {
    localStorage.setItem("headerName", 'KPI Mapping');
    if (tab != null || tab != undefined) {
      this.tabName = tab.name;
    }
    let self = this
    this.tabList.forEach(function (val: any, key: any) {
      if(val.name == tab.name){
        self.tabList[key].active = true
      }else{
        self.tabList[key].active = false
      }
    });
    if(tab?.name == "KPI List")
      this.GetSelectedKpiData(this.selectedKpiType);

  }
  onSelectKpiGroup(item: any) {
    this.ToasterMessage = "";
    this.popupToasterStyle = "";
    this.selectedAddKpiType = item;
    this.moduleId=item.moduleID;
    this.disableAdd = false;
    
  }
  Openpopup() {
    this.isBoldKPI = false;
    this.isHeader = false;
    this.selectedAddKpiType = this.selectedKpiType;

    
  }

  onSelectKpiInfo(item: any) {
    this.ToasterMessage = "";
    this.popupToasterStyle = "";
    this.selectedKpiInfoType = item;
    this.disableAdd = false;
    this.setUpdatebutton();
  }
  onSelectMethodology(item: any) {
    this.ToasterMessage = "";
    this.popupToasterStyle = "";
    this.selectedMethodology = item;
    this.disableAdd = false;
    this.setUpdatebutton();
  }

  onDescChange() {
    this.ToasterMessage = "";
    this.popupToasterStyle = "";
    this.disableAdd = false;
    this.setUpdatebutton();
    if(this.addKpiName.length==0) 
      this.disableAdd = true;
  }

  getKpiInfo(){
    let kpiInfo = "";
    if (this.selectedKpiInfoType.name === "Currency") {
      kpiInfo = "$";
    } else if (this.selectedKpiInfoType.name === "Number") {
      kpiInfo = "#";
    }
    else {
      kpiInfo = this.selectedKpiInfoType.name;
    }
    return kpiInfo;
  }

  ValidateNameAndDesc(){
    let kpi = this.addKpiName?.trim();
    let desc = this.addKpiDesc;
    switch(true){
      case kpi?.length > KpiTypesConstants.kpiMaxLength && desc?.length > KpiTypesConstants.descritionMaxLength:
          this.toastrService.error(ErrorMessage.KPINameandDescriptionExceed, "", { positionClass: "toast-center-center" });
          return false;
      case kpi?.length > KpiTypesConstants.kpiMaxLength :
          this.toastrService.error(ErrorMessage.KPINameExceed, "", { positionClass: "toast-center-center" });
          return false;
      case desc?.length > KpiTypesConstants.kpiMaxLength :
          this.toastrService.error(ErrorMessage.DescriptionExceed, "", { positionClass: "toast-center-center" });
          return false;
      default:
        return true;
    }
  }
  AddOrUpdateKpi() {
    if (this.addKpiName !== "") {
      if(this.ValidateNameAndDesc()){
        let newKpi;
        this.addKpiName = this.addKpiName.trim();
        this.isError = false;
        let kpiInfo = this.getKpiInfo();
        let kpiDeatils = JSON.parse(JSON.stringify(this.kpiDeatils));    
        switch (this.selectedAddKpiType.name) {
          case KpiTypesConstants.OPERATIONAL_KPI: {
            if (this.UpdateKpi) {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "OperationalKPIDetails": { "kpi": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc, "Sector": { name: '', sectorID: 0 }, "sectorwiseKPIID": kpiDeatils.sectorwiseKPIID,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI,"methodologyId":this.selectedMethodology.id }
              };
            } else {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "OperationalKPIDetails": { "kpi": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc, "Sector": { name: '', sectorID: 0 },"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI,"methodologyId":this.selectedMethodology.id }
              };
            }
            this.saveNewKpi(newKpi);
            break;
          }
          case KpiTypesConstants.INVESTMENT_KPI: {
            if (this.UpdateKpi) {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "InvestmentKPIDetails": { "kpi": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc, "investmentKPIId": kpiDeatils.investmentKPIId,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI,"methodologyID":this.selectedMethodology.id }
              };
            } else {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "InvestmentKPIDetails": { "kpi": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI,"methodologyID":this.selectedMethodology.id }
              };
            }
            this.saveNewKpi(newKpi);
            break;
          }
          case KpiTypesConstants.COMPANY_KPI: {
            if (this.UpdateKpi) {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "CompanyKPIDetails": { "kpi": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc, "companywiseKPIID": kpiDeatils.companywiseKPIID,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI,"methodologyId":this.selectedMethodology.id }
              };
            } else {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "CompanyKPIDetails": { "kpi": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI,"methodologyId":this.selectedMethodology.id }
              };
            }
            this.saveNewKpi(newKpi);
            break;
          }
          case KpiTypesConstants.IMPACT_KPI: {
            if (this.UpdateKpi) {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "ImpactKPIDetails": { "kpi": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc, "impactKPIId": kpiDeatils.impactKPIId,"methodologyId":this.selectedMethodology.id }
              };
            } else {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "ImpactKPIDetails": { "kpi": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc,"methodologyId":this.selectedMethodology.id }
              };
            }
            this.saveNewKpi(newKpi);
            break;
          }
          case KpiTypesConstants.PROFIT_LOSS_KPI: {
            if (this.UpdateKpi) {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "ProfitAndLoss_LineItemDetails": { "ProfitAndLossLineItem": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc, "profitAndLossLineItemID": kpiDeatils.profitAndLossLineItemID,"methodologyID":this.selectedMethodology.id ,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI}
              };
            } else {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "ProfitAndLoss_LineItemDetails": { "ProfitAndLossLineItem": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc,"methodologyID":this.selectedMethodology.id,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI }
              };
            }
            this.saveNewKpi(newKpi);
            break;
          }
          case KpiTypesConstants.BALANCE_SHEET_KPI: {
            if (this.UpdateKpi) {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "BalanceSheet_LineItemsDetails": { "BalanceSheetLineItem": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc, "balanceSheetLineItemID": kpiDeatils.balanceSheetLineItemID,"methodologyID":this.selectedMethodology.id,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI }
              };
            } else {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "BalanceSheet_LineItemsDetails": { "BalanceSheetLineItem": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc,"methodologyID":this.selectedMethodology.id,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI }
              };
              
            }
            this.saveNewKpi(newKpi);
            break;
          }
          case KpiTypesConstants.CASHFLOW_KPI: {
            if (this.UpdateKpi) {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "CashFlow_LineItemsDetails": { "CashFlowLineItem": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc, "cashFlowLineItemID": kpiDeatils.cashFlowLineItemID,"methodologyID":this.selectedMethodology.id,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI }
              };
            } else {
              newKpi = {
                kpiType: this.selectedAddKpiType.field,
                "CashFlow_LineItemsDetails": { "CashFlowLineItem": this.addKpiName, "kpiInfo": kpiInfo, "description": this.addKpiDesc,
                "methodologyID":this.selectedMethodology.id,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI }
              };
            }
            this.saveNewKpi(newKpi);
            break;
          }
          default:{         
            if(this.selectedAddKpiType.moduleID > KPIModulesEnum.CashFlow)
            {
                newKpi = {
                  "SubPageId":this.selectedAddKpiType.moduleID,
                  "ESGKpiId":this.UpdateKpi === true ? this.kpiDeatils['esgKpiId']: 0,
                  "KPI": this.addKpiName, "KpiInfo": kpiInfo, "Description": this.addKpiDesc, "methodologyID": this.selectedMethodology.id,"ModuleID":this.moduleId
                  ,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI
                };
              this.saveNewESGKpi(newKpi);
            }
            else{
              if (this.UpdateKpi) {
                newKpi = {
                  kpiType: this.selectedAddKpiType.field,
                  "MasterKPIDetails": { "KPI": this.addKpiName, "KpiInfo": kpiInfo, "Description": this.addKpiDesc, "MasterKpiID": kpiDeatils.masterKpiID, "methodologyID": this.selectedMethodology.id ,"ModuleID": kpiDeatils.moduleID
                  ,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI}
                };
              } else {
                this.moduleId = this.moduleId== undefined ? 1 : this.moduleId;
                newKpi = {
                  kpiType: this.selectedAddKpiType.field,
                  "MasterKPIDetails": { "KPI": this.addKpiName, "KpiInfo": kpiInfo, "Description": this.addKpiDesc, "methodologyID": this.selectedMethodology.id,"ModuleID":this.moduleId
                  ,"isHeader":this.isHeader,"isBoldKPI":this.isBoldKPI}
                };
              } 
             this.mastersaveNewKpi(newKpi);
            }
          }      
        }   
        this.Openpopup();
      }
    } else {
      this.isError = true;
      this.ErrorMessage = "Please enter KPI name";
      this.disableAdd = true;
    }
  }
  onKpiNameChange(name) {
    this.ToasterMessage = "";
    this.popupToasterStyle = "";
    this.isError = false;
    this.disableAdd = false;
    this.addKpiName = name.target.value?.trim();
    if(this.addKpiName.length==0){
      this.disableAdd = true;
    }    
  }
  onKpiNameUpdate() {
    let kpi = this.kpiName;   
    if (this.UpdateKpi) {
      this.addKpiName = this.addKpiName !== "" ? this.addKpiName : kpi;    
      this.setUpdatebutton();
    }    
  }
  mastersaveNewKpi(newKpi) {
    this.miscService
      .MasterAddNewKpi(newKpi).subscribe(
        {
        next:(result) => {
          if (result !== -1) {
            this.ToasterMessage = this.UpdateKpi ? "" : "KPI data added succesfully";
            this.popupToasterStyle = "custom-toast-confirmModel";
            this.resetAddKpi();
            const refresh:any=newKpi;
            this.isReload={...refresh};
          } else {
            this.isError = true;
            this.ErrorMessage = "Name already exists";
            this.disableAdd = true;
          }
        },
        error:(_error) => {
        }
  });
  }

  saveNewKpi(newKpi) {
    this.miscService
      .AddNewKpi(newKpi).subscribe({
        next:(result) => {
          if (result !== -1) {
            this.ToasterMessage = this.UpdateKpi ? "" : "KPI data added succesfully";
            this.popupToasterStyle = "custom-toast-confirmModel";
            const refresh:any=newKpi;
            this.isReload={...refresh};
            this.resetAddKpi();
          } else {
            this.isError = true;
            this.ErrorMessage = "Name already exists";
            this.disableAdd = true;
          }
        },
        error:(_error) => {
        }
  });
  }


  saveNewESGKpi(newKpi) {
      this.miscService.AddNewESGKpi(newKpi).subscribe(
        {
          next: (result) =>
          {
           if (result !== -1) {
            this.ToasterMessage = this.UpdateKpi ? "" : "KPI data added succesfully";
            this.popupToasterStyle = "custom-toast-confirmModel";
            const refresh:any=newKpi;
            this.isReload={...refresh};
            this.resetAddKpi();
          } else {
            this.isError = true;
            this.ErrorMessage = "Name already exists";
            this.disableAdd = true;
          }
        },
        error:(error)=>
        {
          this.errorMessage(newKpi)
          this.blockedTable = false;
        }
        },       
      ); 
  }

  errorMessage(newKpi){
    switch(true){
      case newKpi?.KPI?.length > KpiTypesConstants.kpiMaxLength && newKpi?.Description?.length > KpiTypesConstants.descritionMaxLength:
      this.toastrService.error(ErrorMessage.KPINameandDescriptionExceed, "", { positionClass: "toast-center-center" });
        break;
      case newKpi?.KPI?.length > KpiTypesConstants.kpiMaxLength :
        this.toastrService.error(ErrorMessage.KPINameExceed, "", { positionClass: "toast-center-center" });
        break;
      default:
        this.toastrService.error(ErrorMessage.DescriptionExceed, "", { positionClass: "toast-center-center" });
        break;
    }
  }

  onCloseAddKpiModal() {
    this.UpdateKpi = false;
    this.reset();
    this.GetSelectedKpiData(this.selectedKpiType);
    this.ShowAddKPI = false;
    this.ToasterMessage="";
    this.popupToasterStyle = "";
  }
  updateReset(){
    this.OnEdit(this.kpiDeatils);
  }
  reset() {
    this.addKpiDesc = "";
    this.addKpiName = "";
    this.selectedKpiInfoType = { name: 'Currency' };
    this.selectedAddKpiType = this.selectedKpiType;
    this.disableAdd = true;
    this.isError = false;
    this.sector = { name: "Agriculture & Timber", sectorID: 14 };
    this.selectedMethodology=this.methodologyList[0];
    this.primaryButtonName = "Add"
    this.modalTitle = "Add New KPI"
    this.UpdateKpi = false;
    this.kpiDeatils = {};
  }

  resetAddKpi() {
    if (this.UpdateKpi) {

      this.closeUpdatePopUp();
      this.GetSelectedKpiData(this.selectedKpiType);
    } else {
      this.reset();
      this.toastrService.success(this.ToasterMessage,"",{positionClass:"toast-center-center"});
    }
  }

  setDisableAdd() {
    if (this.addKpiName?.trim() !== '') {
      this.disableAdd = false
    } else {
      this.disableAdd = true
    }
  }

  getBalanceSheetKpiList() {
    this.blockedTable = true;
    this.miscService
      .exportBalanceSheetList().subscribe({
        next: (result) => {
          let resp = result;
          if (resp != null) {
            this.kpiList = resp.body?.balanceSheet_LineItems;
          }
          this.blockedTable = false;
        },
        error: (_error) => {
          this.blockedTable = false;
        }
      });
  }

  getProfitLossKpiList() {
    this.blockedTable = true;
    this.miscService
      .exportProfitLossList().subscribe({
        next: (result) => {
          let resp = result;
          if (resp != null) {
            this.kpiList = resp?.body?.profitAndLoss_LineItems;
          }
          this.blockedTable = false;
        },
        error: (_error) => {
          this.blockedTable = false;
        }
      });
  }

  getCashflowKpiList() {
    this.blockedTable = true;
    this.miscService
      .exportCashflowList().subscribe({
        next: (result) => {
          let resp = result;
          if (resp != null) {
            this.kpiList = resp?.body?.cashFlow_LineItems;
          }
          this.blockedTable = false;
        },
        error: (_error) => {
          this.blockedTable = false;
        }
      });
  }

  getESGKpiList(subPageId:number) {
    this.blockedTable = true;
    this.miscService
      .exportESGList(subPageId).subscribe(
        {
          next: (result) =>
          {
            if (result?.length > 0) {
                  this.kpiList = result;
                }
                else
                {
                  this.kpiList = [];
                }
                this.blockedTable = false;
          },
          error:(error)=>
          {
            this.blockedTable = false;
          }
        }
     );
  }
  getMasterKpiList(moduleID:number) {
     
    this.blockedTable = true;
    this.miscService
      .exportMasterKPIList(moduleID).subscribe({
        next: (result) => {
          let resp = result;
          if (resp != null) {
            this.kpiList = resp?.body?.masterKpis;
          }
          this.blockedTable = false;
        },
        error: (_error) => {
          this.blockedTable = false;
        }
      });
  }
  getAllSectors() {
    this.blockedTable =  true;
    this.miscService.getSectorList().subscribe({
      next: (result) => {
        this.sectorList = result.body;
        let i;
        for (i = 0; i < this.sectorList?.length; i++) {
          this.sectorList[i].name = this.sectorList[i]['sector'];
          delete this.sectorList[i].sector;
        }
        this.blockedTable =  false;
      },
      error: (_error) => {
        this.blockedTable =  false;
      }
    });
  }
  getAllMethodologies() {
    this.blockedTable =  true;
    this.miscService.getMethodologiesByGroup().subscribe({next:result => {   
      if(result !=null)
      {
        this.methodologyList = result.methodologyModel;
         result.groupModel?.forEach(function(item,index){          
            item.items?.forEach(function(module,index1){          
              module.label=module.name;
              module.value = {
                'field':module.field,
                'isType':module.isType,
                'label':module.label,
                'moduleID':module.moduleID,
                'name':module.name,
                'order':module.order,
                'pageConfigAliasName':module.pageConfigAliasName,
                'subPageId':module.subPageId,

              };
          });
        });

        this.kpiTypes=result.groupModel;     
        this.groupModel=result.groupModel; 
       this.getAllKpiTypes();
       this.selectedMethodology=this.methodologyList[0];
       this.blockedTable =  false;
      }  
    }, error:_error => {
      this.blockedTable =  false;
    }});
  }
 
  onSectorChange(item:any) {
    let kpiDeatils = JSON.parse(JSON.stringify(this.kpiDeatils));
    this.ToasterMessage = "";
    this.popupToasterStyle = "";
    this.sector={ name: item?.name, sectorID: item?.sectorID }
    if(this.sector === undefined){
      this.sector = kpiDeatils.sector === undefined ? { name: "Agriculture & Timber", sectorID: 14 }:{ name: kpiDeatils.sector.sector, sectorID: kpiDeatils.sector.sectorID };
    }    
   this.disableAdd = kpiDeatils.sector.sectorID === this.sector.sectorID ? true :false;   
  }

  OnEdit(kpiDeatils) {
   this.isBoldKPI=kpiDeatils.isBoldKPI==null?false:kpiDeatils.isBoldKPI;
   this.isHeader=kpiDeatils.isHeader==null?false:kpiDeatils.isHeader;
    kpiDeatils.methodologyName= kpiDeatils.methodologyName==null?undefined: kpiDeatils.methodologyName;
    this.addKpiDesc = kpiDeatils.description;
    let kpiName="";
    if (this.selectedKpiType.name !== KpiTypesConstants.PROFIT_LOSS_KPI && this.selectedKpiType.name !== KpiTypesConstants.CASHFLOW_KPI && this.selectedKpiType.name !== KpiTypesConstants.BALANCE_SHEET_KPI) {
      kpiName = kpiDeatils.kpi;
    } else {
      kpiName = this.getFinancialKpiName(kpiDeatils);
      kpiDeatils.kpi = kpiName;
    }
    this.addKpiName = kpiName;
    this.selectedKpiInfoType = kpiDeatils.kpiInfo !== null && kpiDeatils.kpiInfo !== "" ? { name: kpiDeatils.kpiInfoType } : { name: 'Currency' };
    this.kpiName = kpiName;
    this.selectedAddKpiType = this.selectedKpiType;
    this.moduleId=kpiDeatils.moduleID;
    this.selectedMethodology = kpiDeatils.methodologyName !== undefined && kpiDeatils.methodologyName !== null && kpiDeatils.methodologyName !== "" ? { name: kpiDeatils.methodologyName,id:(kpiDeatils.methodologyID || kpiDeatils.methodologyId) } :this.methodologyList[0];
    this.UpdateKpi = true;
    this.primaryButtonName = "Update";
    this.modalTitle = "Update KPI";
    this.kpiDeatils = kpiDeatils;
    this.ShowAddKPI = true;
  }

  getFinancialKpiName(kpiDeatils){
    switch (this.selectedKpiType.name) {
      case KpiTypesConstants.PROFIT_LOSS_KPI: {
        return kpiDeatils.profitAndLossLineItem;
      }
      case KpiTypesConstants.BALANCE_SHEET_KPI: {
        return kpiDeatils.balanceSheetLineItem;
      }
      case KpiTypesConstants.CASHFLOW_KPI: {
        return kpiDeatils.cashFlowLineItem;
      }
    }
  }

  setUpdatebutton(){
    if(this.UpdateKpi){
      let kpiDeatils = JSON.parse(JSON.stringify(this.kpiDeatils));
      const isHeader=kpiDeatils.isHeader==undefined?false:kpiDeatils.isHeader;
      const isBoldKPI=kpiDeatils.isBoldKPI==undefined?false:kpiDeatils.isBoldKPI;
      let methodology = kpiDeatils.methodologyName !== null && kpiDeatils.methodologyName !== "" ? { name: kpiDeatils.methodologyName } :null;     
     if((isBoldKPI==this.isBoldKPI&&isHeader==this.isHeader)&&kpiDeatils.kpi === this.addKpiName?.trim() && kpiDeatils.description === this.addKpiDesc && kpiDeatils.kpiInfoType === this.selectedKpiInfoType.name && (methodology !=null && methodology.name===this.selectedMethodology.name)){
        this.disableAdd = true;
      }else{
        this.disableAdd = false;
      }
    }
  }
  deletePopUpFun(deleteItem){
    this.deletePopUp = true
    this.deleteKpi = deleteItem
  }

  performCancel() {
    this.deletePopUp = false;
    this.deleteKpi = {}
  }

  performDelete(){
    let kpiDeleteData;
    
    switch (this.selectedKpiType.name) {
      case KpiTypesConstants.OPERATIONAL_KPI: {
        kpiDeleteData = {
          "ModuleId" : this.selectedKpiType["moduleID"],
          "KPIId" : this.deleteKpi["sectorwiseKPIID"],
          "KpiType" : this.selectedKpiType["field"]
        }
        break;
      }
      case KpiTypesConstants.INVESTMENT_KPI: {
        kpiDeleteData = {
          "ModuleId" : this.selectedKpiType["moduleID"],
          "KPIId" : this.deleteKpi["investmentKPIId"],
          "KpiType" : this.selectedKpiType["field"]
        }
        break;
      }
      case KpiTypesConstants.COMPANY_KPI: {
       kpiDeleteData = {
          "ModuleId" : this.selectedKpiType["moduleID"],
          "KPIId" : this.deleteKpi["companywiseKPIID"],
          "KpiType" : this.selectedKpiType["field"]
        }
        break;
      }
      case KpiTypesConstants.IMPACT_KPI: {
        kpiDeleteData = {
          "ModuleId" : this.selectedKpiType["moduleID"],
          "KPIId" : this.deleteKpi["impactKPIId"],
          "KpiType" : this.selectedKpiType["field"]
        }
        break;
      }
      case KpiTypesConstants.PROFIT_LOSS_KPI: {
        kpiDeleteData = {
          "ModuleId" : this.selectedKpiType["moduleID"],
          "KPIId" : this.deleteKpi["profitAndLossLineItemID"],
          "KpiType" : this.selectedKpiType["field"]
        }
        break;
      }
      case KpiTypesConstants.BALANCE_SHEET_KPI: {
        kpiDeleteData = {
          "ModuleId" : this.selectedKpiType["moduleID"],
          "KPIId" : this.deleteKpi["balanceSheetLineItemID"],
          "KpiType" : this.selectedKpiType["field"]
        }
        break;
      }
      case KpiTypesConstants.CASHFLOW_KPI: {
        kpiDeleteData = {
          "ModuleId" : this.selectedKpiType["moduleID"],
          "KPIId" : this.deleteKpi["cashFlowLineItemID"],
          "KpiType" : this.selectedKpiType["field"]
        }
        break;
      }
      default:{    
          kpiDeleteData = {
            "KPIId" : this.moduleId > KPIModulesEnum.ESG ? this.deleteKpi["esgKpiId"] :this.deleteKpi["masterKpiID"],
            "KpiType" : this.selectedKpiType["field"],
            "ModuleId" : this.selectedKpiType["moduleID"]
        }
      }      
    }
    this.blockedTable =  true;
      this.miscService
      .softDeleteKPI(kpiDeleteData).subscribe({
       next: (_result) => {
          this.toastrService.success("KPI data deleted succesfully","",{positionClass:"toast-center-center"});
          this.GetSelectedKpiData(this.selectedKpiType);
          this.deletePopUp = false;
          this.deleteKpi = {}
          this.blockedTable =  false;
        },
       error: (_error) => {
          this.toastrService.error("Error","",{positionClass:"toast-center-center"});
          this.deletePopUp = false;
          this.deleteKpi = {}
          this.blockedTable =  false;
        }
  });
    
  }
  closeFormulaPopUp()
  {
    this.isOpenPopUp = false;
    this.GetSelectedKpiData(this.selectedKpiType);
  }
  openFormulaPopup(rowData:any)
  {
    this.selectedFormulaKPI = rowData;
    this.isOpenPopUp = true;
  }
}