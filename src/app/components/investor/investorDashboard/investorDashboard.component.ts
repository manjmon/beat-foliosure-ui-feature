import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { InvestorDashBoardStatic, NumberDecimalConst } from "src/app/common/constants";
import { InvestorService } from '../../../services/investor.service';
import { MiscellaneousService } from "../../../services/miscellaneous.service";
@Component({
  selector: 'investor-dashboard',
  templateUrl: './investorDashboard.component.html',
  styleUrls: ['./investorDashboard.component.scss',"./../../home/home.component.scss"]
})
export class InvestorDashboardComponent implements OnInit {
  id: any;
  Unit="M";
  Currency="USD";
  dashboarddata: any={};
  sectorData: any[] = [];
  headerData: any[] = [];
  totalFunds: any = [];
  totalPortfolioCompanies: any = [];
  totalInvestedCapital: any;
  totalRealizedValue: any;
  totalUnrealizedValue: any;
  totalValue: any;
  width: number = 0;  
  NumberDecimalConst = NumberDecimalConst;
  dashBoardConstant=InvestorDashBoardStatic;
  isData:boolean=true;
  pageConfigField=[];
  pageConfigFieldClone = [];
  topCompanyData:any[] = [];
  TVPI: any = "0.0";
  DPI: any = "0.0";
  RVPI: any = "0.0";
  enableview: boolean;
  yearOptions: any[] = [];
  FromDate: any = (new Date()).getFullYear()-15;
  ToDate: any = (new Date()).getFullYear();
  isLoader:boolean = false;
  TVPIByVintageYear: any[] = [];
  dashboardContainer: string ="investor-dashboard-container-without-expand";
  model: any;
  constructor(private _investorService: InvestorService, private _avRoute: ActivatedRoute, private miscService: MiscellaneousService,) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
  }
  onResized(event: any) {
    this.width = event?.newRect?.width;
  }
  onResizedDashboard(event: any) {
    this.width = event?.newRect?.width;
    this.dashboardContainer =   this.miscService.getSideBarWidth() == "17.3em" ? "investor-dashboard-container-with-expand" : "investor-dashboard-container-without-expand";
  }
  ngOnInit(): void {
    this.model = {
      FromDate: new Date(this.FromDate,0,2),
      ToDate: new Date()
    }
  this.getInvestorDashboardDetails(false,'','');
    this.yearOptions = this.miscService.bindYearList();
  }
  getInvestorDashboardDetails(val:any, event:any, dateType:any) {
    this.isLoader = true;
    this.loadModelDefault(val,event,dateType);

    this._investorService.getInvestorDashBoard({FromDate: this.model.FromDate,ToDate: this.model.ToDate, encryptedInvestorId: this.id, paginationFilter: null }).subscribe({next:(result:any) => {
      if (result != null) {
        this.pageConfigField=result?.pageFieldValueModel||[];
        if(result?.pageFieldValueModel != null && result?.pageFieldValueModel?.length>0){
        this.totalFunds= result?.pageFieldValueModel.filter(data => data.name == this.dashBoardConstant.TotalFunds);
        this.totalPortfolioCompanies = result?.pageFieldValueModel.filter(data => data.name == this.dashBoardConstant.PortfolioCompanies);
          this.enableview = true;
          let totalValue = this.pageConfigField.filter(row => row.name == this.dashBoardConstant.TotalValue)[0].value;
          let investedCapital = this.pageConfigField.filter(row => row.name == this.dashBoardConstant.InvestedCapital)[0].value;
          if(parseFloat(investedCapital) != 0){            
            this.TVPI = parseFloat((totalValue.indexOf(',') > -1?totalValue.replace(/,/g, ''):totalValue)) / parseFloat((investedCapital.indexOf(',') > -1?investedCapital.replace(/,/g, ''):investedCapital));           
          }
          this.DPI =  this.pageConfigField.filter(row => row.name == "DPI")[0].value!=null?this.pageConfigField.filter(row => row.name == "DPI")[0].value:this.DPI;
          this.RVPI =  this.pageConfigField.filter(row => row.name == "RVPI")[0].value!=null?this.pageConfigField.filter(row => row.name == "RVPI")[0].value:this.RVPI;
        }
        this.dashboarddata=result?.expandoObject||{};
        this.TVPIByVintageYear = this.dashboarddata?.TVPIbyVintageYearofInvestor || [];
        this.sectorData = this.dashboarddata?.sectorwise || [];
        this.topCompanyData=result?.topCompaniesTotalValue||[];
        this.topCompanyData= this.topCompanyData.map(({ companyName,totalValue }) => ({ 'Company Name': companyName, 'Total Value': totalValue }));
        this.isData = false;
      }
    },
    error:(error) => {
      this.isData = false;
    }});
  }
  loadModelDefault(val: any, event: any, date: any) {
    if (val) {
      if (date == 'FromDate') {
        this.FromDate = event?.item;
        this.model.FromDate = new Date(event?.item,0,2);
        if (event?.item > this.ToDate) {
          this.ToDate =event?.item;
          this.model.ToDate = (new Date(event?.item,11,31));
        }
      } else {
        this.ToDate =event?.item;
        this.model.ToDate = (new Date(event?.item,11,31));
        if (event?.item < this.FromDate) {
          this.FromDate = event?.item;
          this.model.FromDate = (new Date(event?.item,0,2));
        }
      }
    } else {
      this.model.FromDate = new Date(this.FromDate,0,2);
      this.model.ToDate = new Date();
    }
  }
}