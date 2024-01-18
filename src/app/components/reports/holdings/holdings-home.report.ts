import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Message } from "primeng/api/message";
import { MessageService } from "primeng/api";
import { FeaturesEnum } from "../../../services/permission.service";
import { ReportType } from "../../../services/report.service";
import { TopHoldingsComponent } from "./top-holdings.report";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { CommonPCConstants } from "src/app/common/constants";
@Component({
	selector: 'reports',
	templateUrl: './holdings-home.report.html',
	styleUrls: ['./holdings-home.report.scss'],
	providers: [MessageService]
})

export class HoldingsReportsComponent implements OnInit {
	@ViewChild('topHoldings', { read: TopHoldingsComponent }) th: TopHoldingsComponent;
	feature: typeof FeaturesEnum = FeaturesEnum;
	@Output() outputFromChild: EventEmitter<string> = new EventEmitter();
	reportForm: FormGroup;
	tabList: ITab[] = [];
	tabName: string = "Funds";
	fundList: any[] = [];
	regionList: any[] = [];
	countryList: any[] = [];
	strategyList: any[] = [];
	fundHoldingStatusList: any[] = [];
	portfolioCompanyList: any[] = [];
	msgTimeSpan: number;
	masterDataLoading: boolean;
	filterSection: boolean = true;
	yearRange: any;
	cols: any[] = [];
	msgs: Message[] = [];
	reportType: typeof ReportType = ReportType;
	reportData: any = [];
	dateRange: any[];
	collapsed=true;
	tabToggle: boolean = false;
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
	masterModel: any = { filterSection: true };
	reportCategory: any;
	reportCategoryTitle: any;
	currentTabId: any;
	subReportTypeList: any = [];
	reportServiceSubscription: any;
	reportServiceDataAvailabilitySubscription: any;
	isDataAvailableInReports: boolean = false;
	optionListData = [];
	fundListClone = [];
	strategyListClone = [];
	regionCountryMappingList = [];
	regionListClone = [];
	countryListClone = [];
	fundInvestmentLocation: any = {
		regionIds: [],
		countryIds: []
	}
	isLarissa:boolean = false;
	constructor(
		protected changeDetectorRef: ChangeDetectorRef,
		public messageService: MessageService
	) {

	}
	ngOnInit() {
		if(window.location.host == CommonPCConstants.LarissaHost || window.location.host == CommonPCConstants.ExeterHost || window.location.host == CommonPCConstants.MonmouthHost || window.location.host == CommonPCConstants.PizarroHost)
		{
		  this.isLarissa = true;
		}
		this.getTabList();
	}
	onTabClick(tab: ITab) {
		if (tab != null || tab != undefined) {
			this.tabName = tab.name;
			this.tabToggle = !this.tabToggle;
		}
	}
	getTabList() {
		if(this.isLarissa)
		{
			this.tabList = [
				{
					active: true,
					name: "Funds",
				}
			];
		}
		else{
			this.tabList = [
				{
					active: true,
					name: "Funds",
				},
				{
					active: false,
					name: "Investors",
				},
			];
		}
	}

}
