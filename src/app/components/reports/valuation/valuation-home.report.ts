import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import * as d3 from "d3";
import { NgxSpinnerService } from "ngx-spinner";
import { Message } from "primeng/api/message";
import { MessageService,SelectItem } from "primeng/api";
import { AccountService } from "../../../services/account.service";
import { FundService } from "../../../services/funds.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { FeaturesEnum } from "../../../services/permission.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { ReportCategory, ReportService, ReportType } from "../../../services/report.service";
import { HoldingValuesComponent } from "./holding-values.report";
@Component({
	selector: 'reports',
	templateUrl: './valuation-home.report.html',
	providers: [MessageService]
})

export class ValuationReportsComponent implements OnInit, OnDestroy {
	@ViewChild('holdingValues', { read: HoldingValuesComponent }) hv: HoldingValuesComponent;
	feature: typeof FeaturesEnum = FeaturesEnum;
	reportForm: FormGroup;
	fundList: any[];
	regionList: any[];
	countryList: any[];
	strategyList: any[];
	fundHoldingStatusList: any[];
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

	constructor(
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private accountService: AccountService,
    private fundService: FundService,
    private portfolioService: PortfolioCompanyService,
		private _avRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    public messageService: MessageService
    ) {
		this.currentTabId = "ValuationCharts";		
		this.getReportMasterData(this.bindReport);
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();

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
		this.reportServiceDataAvailabilitySubscription = this.reportService.dataAvailabilityInReportEvent$.subscribe(
			(val) => {
				this.isDataAvailableInReports = val;
			}
		);

		this.reportServiceSubscription = this.reportService.events$.subscribe(
			(cat) => {
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
				this.regionList = this.miscService.sortArray(resp.regionList, "region");
				this.masterModel.regionList = JSON.parse(JSON.stringify(this.regionList));
				this.countryList = this.miscService.sortArray(resp.countryList, "country");
				this.masterModel.countryList = JSON.parse(JSON.stringify(this.countryList));
				this.portfolioCompanyList = this.miscService.sortArray(resp.portfolioCompanyList, "companyName");
				this.masterModel.portfolioCompanyList = JSON.parse(JSON.stringify(this.portfolioCompanyList));
			}
			this.masterDataLoading = false;
			callback(this);
		}, error => {
			this.masterDataLoading = false;
			callback(this);
		})
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

		this.loadingCountry = true;
		this.model.countryIds = [];
		this.countryList = [];
		let regionIds = (this.model.regionIds != undefined && this.model.regionIds.length > 0) ? this.model.regionIds : [];
		this.miscService.getCountryListByRegionIds(regionIds)
			.subscribe((data) => {
				this.countryList = this.countryList = this.miscService.sortArray(data["body"], "country");
				this.loadingCountry = false;
			}, error => { this.loadingCountry = false;  })
	}





	showTopBottom: boolean = true;
	setReportTypeList() {
		let local = this;
		let holdingsByList = this.reportService.ReportTypeList.filter(function (ele: any, i: any) {
			if (local.reportCategory == ReportCategory.ValuationCharts) {
				return ele.category == local.reportCategory || ele.category == ReportCategory.InvestmentsByCost;
			} else {
				return ele.category == local.reportCategory;
			}

		})
		this.holdingsByList = JSON.parse(JSON.stringify(holdingsByList));
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
	}
	setHoldingCostReportModel() {
		if (!this.masterDataLoading) {
			this.hv.bindReportMasterModel();
		}
		this.hv.filter.selectReport=null;
		this.model = this.hv.model;
	}

	exportTopHoldingReport() {
		switch (this.reportCategory) {
			case ReportCategory.ValuationCharts:
				this.model =this.hv.model;
				break;
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
			case ReportCategory.ValuationCharts:
				this.hv.bindReportMasterModel();
				break;
			default:
				break;

		}
	}

	changeReportType(reportType: any) {
		switch (this.reportCategory) {
			case ReportCategory.ValuationCharts:
				this.hv.changeReportType({ item: reportType });
				break;
			default:
				break;
		}
	}

	showHideFilter() {
		this.masterModel.filterSection = !this.masterModel.filterSection;

	}

}
