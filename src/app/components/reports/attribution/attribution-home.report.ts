import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import * as d3 from "d3";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/api/message";
import { MessageService, SelectItem} from "primeng/api";
import { AccountService } from "../../../services/account.service";
import { FundService } from "../../../services/funds.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { FeaturesEnum, PermissionService } from "../../../services/permission.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { ReportCategory, ReportService, ReportType } from "../../../services/report.service";
import { AttributionReportsComponent } from "./attribution.report";
import { CommonPCConstants } from "src/app/common/constants";

@Component({
	selector: 'reports',
	templateUrl: './attribution-home.report.html',
	styleUrls: ['./attribution-home.report.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [MessageService]
})

export class AttributionHomeReportsComponent implements OnInit, OnDestroy {
	@ViewChild('attributionReport', { read: AttributionReportsComponent }) ar: AttributionReportsComponent;
	feature: typeof FeaturesEnum = FeaturesEnum;
	@ViewChild("panel", { read: ElementRef }) public panel: ElementRef<any>;
	reportForm: FormGroup;
	fundList: any[];
	regionList: any[];
	countryList: any[];
	strategyList: any[];
	fundHoldingStatusList: any[];
	showLeftScroll: boolean = false;
  	showRightScroll: boolean = true;
	portfolioCompanyList: any[];
	msgTimeSpan: number;
	masterDataLoading: boolean;
	filterSection: boolean = true;
	yearRange: any;
	viewByList: SelectItem[];
	holdingsByList: SelectItem[];
	cols: any[] = [];
	msgs: Message[] = [];
	reportType: typeof ReportType = ReportType;
	reportData: any = [];
	dateRange: any[];
	model: any = {
		fundIds: [],
		strategyIds: [],
		regionIds: [],
		countryIds: [],
		isAscending: false,
		selectedReportTypes: [this.reportType.TopHoldingInvestmentCost],
		chartMetadetaList: []
	};
	types: any = [
		{ label: 'Top', value: false, icon: '' },
		{ label: 'Bottom', value: true, icon: '' },
	];
	masterModel: any = { filterSection:true};
	reportCategory: any;
	reportCategoryTitle: any;
	currentTabId: any;
	subReportTypeList: any = [];
	reportServiceSubscription: any;
	reportServiceDataAvailabilitySubscription: any;
	isDataAvailableInReports: boolean = false;
	isTaabo:boolean = false;
	isLarissa:boolean = false;
	enableright: boolean = true;
	enableleft: boolean = false;
	constructor(
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private accountService: AccountService,
    private fundService: FundService,
    private portfolioService: PortfolioCompanyService,
		private _avRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public messageService: MessageService,
	private permissionService:PermissionService
    ) {
		this.currentTabId = "Attribution";
		this.getReportMasterData(this.bindReport);
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		this.isTaabo=this.permissionService.isCheckTaabo();
		if(window.location.host == CommonPCConstants.LarissaHost)
		{
		  this.isLarissa = true;
		}
	}
	ngOnInit() {
		try{
		this.isDataAvailableInReports = false;
		if (this.currentTabId != null && this.currentTabId != undefined) {
			this.changeReportCategory(ReportCategory[this.currentTabId]);
		}
		else {
			this.changeReportCategory(ReportCategory[ReportCategory.Holdings]);
		}
		this.masterDataLoading; 
		this.reportServiceDataAvailabilitySubscription = this.reportService.dataAvailabilityInReportEvent$.subscribe(
			(val) => {
				!this.masterDataLoading;
				this.isDataAvailableInReports = val;
			}
		);
		this.masterDataLoading; 
		this.reportServiceSubscription = this.reportService.events$.subscribe(
			(cat) => {
				!this.masterDataLoading;
				this.currentTabId = ReportCategory[cat];
				this.changeReportCategory(cat);
			}
		);
		}catch{}
	}


	ngOnDestroy() {
		this.reportServiceSubscription.unsubscribe();
		this.reportServiceDataAvailabilitySubscription.unsubscribe();
	}


	getReportMasterData(callback: any) {
		this.masterDataLoading = true;
		this.reportService.getReportMasterData().subscribe(result => {
			let resp = result["body"];
            if (resp != null) {

				this.fundList = this.miscService.sortArray(resp.fundList, "fundName");
				this.masterModel.fundList = JSON.parse(JSON.stringify(this.fundList));
				this.strategyList = this.miscService.sortArray(resp.strategyList, "strategy");
				this.masterModel.strategyList = JSON.parse(JSON.stringify(this.strategyList));
				this.fundHoldingStatusList = this.miscService.sortArray(resp.fundHoldingStatusList, "status");
				this.masterModel.fundHoldingStatusList = JSON.parse(JSON.stringify(this.fundHoldingStatusList));
				this.portfolioCompanyList = this.miscService.sortArray(resp.portfolioCompanyList, "companyName");
				this.masterModel.portfolioCompanyList = JSON.parse(JSON.stringify(this.portfolioCompanyList));
			    this.regionList = this.miscService.sortArray(resp.regionList, "region");
				this.masterModel.regionList = JSON.parse(JSON.stringify(this.regionList));				
				this.masterModel.regionCountryMappingList =  JSON.parse(JSON.stringify(resp.regionCountryList));
				}
			this.masterDataLoading = false;
			callback(this);
		}, error => {
			this.masterDataLoading = false;
			callback(this);
		})
	}

	ngOnChanges() {
		setTimeout(
		  function (local: any) {
			local.setScrollButtonVisibility();
		  },
		  1000,
		  this
		);
	  }

	bindReport(context: any) {
		if (!context.masterDataLoading) {
			context.bindReportTab();
		}
	}



	onRegionChange() {
		this.GetCountryListByRegionIds();
	}
	loadingCountry: boolean;
	GetCountryListByRegionIds() {
		this.masterDataLoading = true;
		this.loadingCountry = true;
		this.model.countryIds = [];
		this.countryList = [];
		let regionIds = (this.model.regionIds != undefined && this.model.regionIds.length > 0) ? this.model.regionIds : [];
		this.miscService.getCountryListByRegionIds(regionIds)
			.subscribe((data) => {
				this.masterDataLoading = false;
				this.countryList = this.countryList = this.miscService.sortArray(data["body"], "country");
				this.loadingCountry = false;
			}, error => { this.loadingCountry = false;  this.masterDataLoading = false;})
	}





	showTopBottom: boolean = true;
	setReportTypeList() {
		let local = this;
		let reportList = this.isTaabo? this.reportService.ReportTypeList.filter(x=>x.category ==ReportCategory.Attribution && x.label!="By Region" && x.label!="By Realized/Unrealized Status" && x.label!="By Exit Method" && x.label!="By Board Seat" && x.label!="By Security Type" && x.label!="By Deal Sourcing" && x.label!="By Investment Year" && x.label!="By Investment Size" && x.label!="By Ownership Stake" && x.label!="By Holding Period"):this.reportService.ReportTypeList;
		let holdingsByList = reportList.filter(function (ele: any, i: any) {
			if (local.reportCategory == ReportCategory.ValuationCharts) {
				return ele.category == local.reportCategory || ele.category == ReportCategory.InvestmentsByCost;
			} else {
				return ele.category == local.reportCategory;
			}

		})
		this.holdingsByList = JSON.parse(JSON.stringify(holdingsByList));
		if(this.isTaabo)
			this.holdingsByList = this.holdingsByList.filter(x=>x.label!="By Region" && x.label!="By Realized/Unrealized Status" && x.label!="By Exit Method" && x.label!="By Board Seat" && x.label!="By Security Type" && x.label!="By Deal Sourcing" &&x.label!="By Investment Year" && x.label!="By Investment Size" && x.label!="By Ownership Stake" && x.label!="By Holding Period");
		if(this.isLarissa)
		{
			this.holdingsByList = this.holdingsByList.filter(x=>x.label!="By Region" && x.label!="By Investment Size" && x.label!="By Investment Year" && x.label!="By Exit Method" && x.label!="By Board Seat" && x.label!="By Fund" && x.label!="By Deal Sourcing" &&x.label!="By Strategy" && x.label!="By Investment Role" && x.label!="By Currency" && x.label!="By Holding Period" && x.label!="By Ownership Stake");
		}
		if(window.location.host == CommonPCConstants.ExeterHost)
		{
			this.holdingsByList = this.holdingsByList.filter(x=>x.label!="By Region" && x.label!="By Investment Size" && x.label!="By Investment Role" && x.label!="By Investment Year" && x.label!="By Exit Method" && x.label!="By Board Seat" && x.label!="By Fund" && x.label!="By Deal Sourcing" &&x.label!="By Strategy" && x.label!="By Investment Role" && x.label!="By Currency" && x.label!="By Holding Period");
		}
		if(window.location.host == CommonPCConstants.MonmouthHost)
		{
			this.holdingsByList = this.holdingsByList.filter(x=>x.label!="By Region" && x.label!="By Investment Size" && x.label!="By Investment Year" && x.label!="By Exit Method" && x.label!="By Board Seat" && x.label!="By Ownership Stake" && x.label!="By Deal Sourcing" &&x.label!="By Strategy" && x.label!="By Investment Role" && x.label!="By Currency" && x.label!="By Holding Period" && x.label!="By Security Type");
		}
		if(window.location.host == CommonPCConstants.PizarroHost)
		{
			this.holdingsByList = this.holdingsByList.filter(x=>x.label!="By Region"  && x.label!="By Exit Method" && x.label!="By Board Seat" && x.label!="By Ownership Stake" && x.label!="By Deal Sourcing" &&x.label!="By Strategy" && x.label!="By Investment Role" && x.label!="By Currency" && x.label!="By Security Type" && x.label!="By Public/Private Status");
		}
		this.holdingsByList = this.holdingsByList.filter(function (ele: any, i: any) {
			delete ele.category;
			return ele;
		})
		this.model.selectedReportTypes = [this.holdingsByList[0].value];

	}

	onDateSelect() {
		if (this.dateRange.length > 0) {
			let toDate = this.dateRange[1];
			if (toDate == null) {
				this.model.toDate = this.dateRange[0];
			}
			else {
				this.model.fromDate = this.dateRange[0];
				this.model.toDate = this.dateRange[1];
			}
		}
	}
	showCostRelativeInvestments() {
		this.masterModel.reportCategory = "InvestmentsByCost";
    }

	showTopHoldings() {
		this.masterModel.reportCategory = "Holdings";
	///	this.th.filter.selectReport=null;
	//	this.th.bindReportMasterModel();
		//this.model = this.th.model;
	}
	setAttributionReportModel() {
		if (!this.masterDataLoading ) {
			this.ar.bindReportMasterModel();
		}
		this.ar.filter.selectReport=null;
		this.model = this.ar.model;
	}
	
	exportTopHoldingReport() {
		switch (this.reportCategory) {
			// case ReportCategory.Holdings:
			// 	this.model = this.th.model;
			// 	break;
			// case ReportCategory.ValuationCharts:
			// 	this.model =this.hv.model;
			// 	break;
			case ReportCategory.Attribution:
				this.model =this.ar.model;
				break;
			// case ReportCategory.CompanyFinancials:
			// 	this.model =this.cf.model;
			// 	break;
			default:
				break;

		}
		this.reportService.exportReports(this.model).subscribe(response => this.miscService.downloadExcelFile(response));
	}

	setDefaultReportCategory() {
		this.reportCategory = ReportCategory.Holdings;
		this.setReportTypeList();
		let id = ReportCategory[ReportCategory.Holdings];
		this.currentTabId = id;	
		let catList = this.reportService.ReportCategoryList.filter(function (ele: any, i: any) {
			return ele.value == ReportCategory.Holdings
		});
		if (catList.length > 0) {
			this.reportCategoryTitle = catList[0].label;
		}
		d3.select('.nav-tabs a[data-target="#' + id + '"]').dispatch('click');

	}

	changeReportCategory(cat: any) {
		this.reportCategory = cat;
		this.setReportTypeList();
		let catList = this.reportService.ReportCategoryList.filter(function (ele: any, i: any) {
			return ele.value == cat
		});
		if (catList.length > 0) {
			this.reportCategoryTitle = catList[0].label;
		}
		d3.select('.nav-tabs a[data-target="#' + this.currentTabId + '"]').dispatch('click');
	}

	bindReportTab() {

		switch (this.reportCategory) {
			// case ReportCategory.Holdings:
			// 	this.th.bindReportMasterModel();
			// 	break;
			// case ReportCategory.ValuationCharts:
			// 	this.hv.bindReportMasterModel();
			// 	break;
			case ReportCategory.Attribution:
				this.ar.bindReportMasterModel();
				break;
			// case ReportCategory.CompanyFinancials:
			// 	this.cf.bindReportMasterModel();
			// 	break;
			default:
				break;

		}
	}

	changeReportType(reportType: any) {
		switch (this.reportCategory) {
			// case ReportCategory.Holdings:
			// 	this.th.changeReportType({ item: reportType });
			// 	break;
			// case ReportCategory.ValuationCharts:
			// 	this.hv.changeReportType({ item: reportType });
			// 	break;
			case ReportCategory.Attribution:
				this.ar.changeReportType({ item: reportType });
				break;
			// case ReportCategory.CompanyFinancials:
			// 	this.cf.changeReportType({ item: reportType });
			// 	break;
			default:
				break;
		}
	}

	rightScrollTimer: any;
  leftScrollTimer: any;
  startLeftScrolling() {
    this.leftScrollTimer = setInterval(
      function (local: any) {
        local.moveLeft();
      },
      500,
      this
    );
  }
  startRightScrolling() {
    this.rightScrollTimer = setInterval(
      function (local: any) {
        local.moveRight();
      },
      500,
      this
    );
  }
  propagateChange = (_: any) => {};
	stopLeftScrolling() {
		clearInterval(this.leftScrollTimer);
	  }
	  stopRightScrolling() {
		clearInterval(this.rightScrollTimer);
	  }
	
	  selectionChanged() {
		this.propagateChange(this.model);
	  }
	showHideFilter() {
		this.masterModel.filterSection = !this.masterModel.filterSection;

	}
	moveLeft()
	 {
		if(this.panel.nativeElement.scrollLeft > 1){
			this.enableright = false;
			this.enableleft = true;
		}
		else{
			this.enableright = true;
			this.enableleft = false;
		}
		try {
		  this.panel.nativeElement.scrollLeft.scrollTo({
			left: this.panel.nativeElement.scrollLeft - 300,
			top: 0,
			behavior: "smooth",
		  });
		} catch {
		  this.panel.nativeElement.scrollLeft =
			this.panel.nativeElement.scrollLeft - 300;
		}
	
		setTimeout(
		  function (local: any) {
			local.setScrollButtonVisibility();
		  },
		  500,
		  this
		);
	  }
	  moveRight() {
		let scroll = 300;
		let remainingScroll =
		  this.panel.nativeElement.scrollWidth -
		  (this.panel.nativeElement.offsetWidth +
			this.panel.nativeElement.scrollLeft);
			if(remainingScroll > 2){
				this.enableleft = false;
				this.enableright = true;
			}
			else{
				this.enableleft = true;
				this.enableright = false;
			}
		if (remainingScroll > scroll && remainingScroll < scroll * 2) {
		  scroll = remainingScroll;
		}
		try {
		  this.panel.nativeElement.scrollTo({
			left: this.panel.nativeElement.scrollLeft + scroll,
			top: 0,
			behavior: "smooth",
		  });
		} catch {
		  this.panel.nativeElement.scrollLeft =
			this.panel.nativeElement.scrollLeft + scroll;
		}
		setTimeout(
		  function (local: any) {
			local.setScrollButtonVisibility();
		  },
		  500,
		  this
		);
	  }
	  setScrollButtonVisibility() {
		this.changeDetectorRef.detectChanges();
		if (
		  this.panel.nativeElement.offsetWidth +
			this.panel.nativeElement.scrollLeft ==
		  this.panel.nativeElement.scrollWidth
		) {
		  this.stopRightScrolling();
		  this.showRightScroll = false;
		} else {
		  this.showRightScroll = true;
		}
		if (this.panel.nativeElement.scrollLeft == 0) {
		  this.stopLeftScrolling();
		  this.showLeftScroll = false;
		} else {
		  this.showLeftScroll = true;
		}
	  }
}
