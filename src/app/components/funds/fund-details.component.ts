import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren, AfterViewInit, AfterViewChecked, ViewChild, Output, Input, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Message } from "primeng/api/message";
import { LazyLoadEvent } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { DealService } from "../../services/deal.service";
import { FundService } from "../../services/funds.service";
import { FinancialValueUnitsEnum, MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { ReportService, ReportType } from "../../services/report.service";
import { AddFundTrackRecordComponent } from "./fund-trackRecord.component";
import { MenuItem } from "primeng/api/menuitem";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { Observable, Subject,Subscription } from "rxjs";
import { AppSettingService } from '../../services/appsettings.service';
import {AppConfig} from "../../common/models";
import { CompanyInformationConstants, NumberDecimalConst } from "src/app/common/constants";
import { PageConfigurationSubFeature } from "src/app/common/enums";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { filter } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { FundReportService } from "src/app/services/fund-report.service";
@Component({
	selector: 'fund-details',
	templateUrl: './fund-details.component.html',
	styleUrls:["./fund-details.component.scss"],
	providers: [AddFundTrackRecordComponent]
})


export class FundDetailsComponent implements OnInit, AfterViewInit, AfterViewChecked {
	investorList:any =[];
	@ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
	isOpenAddEditTrackRecord:boolean = false;
	NumberDecimalConst = NumberDecimalConst;
	feature: typeof FeaturesEnum = FeaturesEnum;
	financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
	msgs: Message[] = [];
	id: any;
	dataTable: any;
	deals: any = [];
	fundTrackRecords: any = [];
	fundTrackRecordsClone: any[] = [];
	portfolioCompanyFundHolding: any = [];
	portfolioCompanyFundHoldingClone: any[] = [];
	pagerLength: any;
	geographicLocation: any = { isHeadquarter: false };
	model: any = {};
	error="";
	cmodel:any={}
	fundTrackRecordModel: any = {};
	loading = false;
	globalFilter: string = "";
	blockedDealsTable: boolean = false;
	totalDealRecords: number;
	blockedTrackRecordTable: boolean = false;
	blockedPortfolioCompanyFundHoldingTable: boolean = false;
	totalTrackRecords: number;
	totalPortfolioCompanyFundHoldingRecords: number;
	msgTimeSpan: any;
	@ViewChild('menu') uiuxMenu!: MatMenu;
    @ViewChild('iMenuTrigger') menuTrigger: MatMenuTrigger; 
   @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
   @Input() isOpenAdd:boolean = false;
   yearOptions: any = [];
	isOpenTR: boolean = false;
	currentFundHoldingQuarter: string;
	currentFundHoldingYear: number;
	displayCompanyFundHoldingsDialog: boolean = false;
	trackRecordValueUnit: FinancialValueUnitsEnum = FinancialValueUnitsEnum.Thousands;
	showTrackRecordValueDecimals: boolean = true;
	holdingValueUnit: FinancialValueUnitsEnum = FinancialValueUnitsEnum.Thousands;
	showHoldingValueDecimals: boolean = true;
	fundTrakRecordMultiSortMeta: any[] = [{ field: "year", order: -1 }, { field: "quarter", order: -1 }];
	fundHoldingMultiSortMeta: any[] = [{ field: "year", order: -1 }, { field: "quarter", order: -1 }];
	width: number = 0;
	chart1Data: any[] = [{
		'Sector': 'Enregy',
		'Capital Invested': 45.25
	}, {
		'Sector': 'Financials',
		'Capital Invested': 35.01
	}, {
		'Sector': 'Metals & Mining',
		'Capital Invested': 85.78
	}, {
		'Sector': 'Industrials',
		'Capital Invested': 50.00
	}, {
		'Sector': 'Healthcare',
		'Capital Invested': 68.25
	}, {
		'Sector': 'Materials',
		'Capital Invested': 10.22
	}];

	chart2Data: any[] = [{
		'Sector': 'Enregy',
		'Total Value': 50.25
	}, {
		'Sector': 'Financials',
		'Total Value': 40.01
	}, {
		'Sector': 'Metals & Mining',
		'Total Value': 25.78
	}, {
		'Sector': 'Industrials',
		'Total Value': 30.00
	}, {
		'Sector': 'Healthcare',
		'Total Value': 69.25
	}, {
		'Sector': 'Materials',
		'Total Value': 80.22
	}];

	exportItems: MenuItem[];
	exportLoading: boolean = false;
	appConfig: AppConfig;
	fundStaticConfiguartionData =[];
	fundTermsConfiguartionData=[];
	fundLocationConfiguartionData = [];
	fundStaticConfiguartionData_Custom =[];
	fundTermsConfiguartionData_Custom=[];
	countryConfig={displayName:""};
	stratedyDesc={displayName:""};
	fundStaticDataTitle = {displayName:""};
	fundTermsTitle = {displayName:""};
	fundLocationDataTitle = {displayName:""};
	geographicLocationFieldList: any[];
	companyInformationConstants = CompanyInformationConstants;
	isDataUpdated:boolean =false;
	quarterOptions: any = [
		{ value: "Q1", text: "Q1", number: 1 },
		{ value: "Q2", text: "Q2", number: 2 },
		{ value: "Q3", text: "Q3", number: 3 },
		{ value: "Q4", text: "Q4", number: 4 },
	  ];
	  isdownloadfilter:boolean=true;
	@ViewChild('dropdownMenuButton', { read: ElementRef }) myDiv: ElementRef<HTMLElement>;
	isLazyLoad: boolean = false;
	triggerFalseClick() {
		let el: HTMLElement = this.myDiv.nativeElement;
		el.click();
		this.isdownloadfilter=false;
	}
	constructor(
		private router: Router,
		private toastrService: ToastrService,
		private portfolioCompanyService: PortfolioCompanyService,
		private accountService: AccountService, private miscService: MiscellaneousService,
		private fundService: FundService, protected changeDetectorRef: ChangeDetectorRef, private _dealService: DealService, private reportService: ReportService,
		private _avRoute: ActivatedRoute, private modalService: NgbModal,
		private service: FundReportService,
		private appSettingService : AppSettingService
	) {
		if (this._avRoute.snapshot.params["id"]) {
			this.id = this._avRoute.snapshot.params["id"];
		}
	    this.appConfig = this.appSettingService.getConfig();
		this.msgTimeSpan = this.miscService.getMessageTimeSpan();
		this.pagerLength = this.miscService.getSmallPagerLength();
		this.yearOptions = this.miscService.bindYearList();
		this.exportItems = [
			{
				label: "LP Report",
				icon: "fa fa-file-pdf-o",
				command: () => {
					this.CombinedLPReport();
				},
			},
			{
				label: "Fund Report",
				icon: "fa fa-file-pdf-o",
				command: () => {
					this.FundReportLatest();
				},
			},
			{
                label: "Excel Export",
                icon: "fa fa-file-excel-o",
                command: () => {
					this.cmodel = {		
						FQuarter: null,
						FYear:  null,
						TQuarter: null,
						TYear:  null,
						EncryptedFundId:this.id
					  };
                    this.triggerFalseClick();
                },
            }
			
		];

	}
	sourceURL: any;
	ngOnInit() {
		this.sourceURL = this.miscService.GetPriviousPageUrl();
		if (this.id != undefined) {

			this.getFundDetails();
			this.FundGraphsReport();
		}		
	}
	onFundExcelSubmit(){
		this.cmodel  = {		
			FQuarter: this.cmodel.FQuarter == undefined ? "" : this.cmodel.FQuarter.value,
			FYear: this.cmodel.FYear == undefined ? 0 : +this.cmodel.FYear.value,
			ToQuarter: this.cmodel.TQuarter == undefined ? "" : this.cmodel.TQuarter.value,
			ToYear: this.cmodel.TYear == undefined ? 0 : +this.cmodel.TYear.value,
			EncryptedFundId:this.id
		  };
		this.isdownloadfilter=true;
		this.menuTrigger.closeMenu();
		this.ExcelExportFund();
	}
	ExcelExportFund() {
        this.exportLoading = true;
        this.fundService.getFundExcelDownload(this.cmodel).subscribe({next:
            (results) => {
                this.miscService.downloadExcelFile(results);
                this.exportLoading = false;
            },
            error:(_error) => {
            }
	});
    }	
	private blobToString(blob): string {
		const url = URL.createObjectURL(blob);
		let xmlRequest = new XMLHttpRequest();
		xmlRequest.open('GET', url, false);
		xmlRequest.send();
		URL.revokeObjectURL(url);
		return xmlRequest.response;
  }
	checkvalidation_Qauter_Year(_event: any) {
		this.error = "";
		let FromQuarter = this.cmodel.FQuarter == undefined ? "" : this.cmodel.FQuarter.number;
		let FromYear = this.cmodel.FYear == undefined ? "" : this.cmodel.FYear.value;
		let lToQuarter = this.cmodel.TQuarter == undefined ? "" : this.cmodel.TQuarter.number;
		let ToYear = this.cmodel.TYear == undefined ? "" : this.cmodel.TYear.value;
		if (FromYear != "" && ToYear != "") {
			if (FromYear > ToYear) {
				this.error = "Invalid Period Range! FromYear cannot be after ToYear!"
			}
			if (FromYear == ToYear) {
				if (FromQuarter > lToQuarter)
					this.error = "Invalid period range! To quarter cannot be less than from quarter"
			}

		}
	}	  
	FundReport() {
		this.exportLoading = true;
		this.portfolioCompanyService.pdfExport({ Value: 'FundReport', Id: this.id }).subscribe({
			next:(results) => {
				this.miscService.downloadPDFFile(results);
				this.exportLoading = false;
			},
			error:(_error) => {
				this.exportLoading = false;
			}
	});
	}
	FundReportLatest() {
		this.exportLoading = true;
		this.FundGraphsReport();
		this.graphList = [];
		this.generateGraphToHtml();
	}

	CombinedLPReport() {
		this.exportLoading = true;
		this.portfolioCompanyService.pdfExport({ Value: 'CombinedLPReport', Id: this.id }).subscribe({next:
			(results) => {
				this.miscService.downloadPDFFile(results);
				this.exportLoading = false;
			},
			error:(_error) => {
				this.exportLoading = false;
			}
	});
	}

	onResized(event: any) {
		this.width = event?.newRect?.width;
	  }
	  sortByKey(array, key) {
		return array.sort(function(a, b) {
			let x = a[key]; let y = b[key];
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		});
	}
	redirectToInvestor(investor){
		localStorage.setItem("headerName", investor?.investorName);
		this.router.navigate(['/investor-details', investor?.encryptedInvestorId]);
	}
	getFundDetails() {
		this.loading = true;
		this.fundService.getFundById({ EncryptedFundId: this.id, PaginationFilter: null })
			.subscribe({next:result => {
				let resp = result["body"];
				if (resp != null && result.code == "OK") {
					this.model = resp.fundDetails.fundList[0];
					if(document.getElementById("HeaderNameID")){
						this.miscService.getTitle(this.model?.fundName);
					}
					localStorage.setItem("headerName", this.model.fundName);
					this.fundStaticDataTitle = resp.fundStaticDataTitle;
					this.fundStaticConfiguartionData = resp.fundStaticConfiguartionData;
					this.fundTermsConfiguartionData = resp.fundTermsConfiguartionData;
					this.fundLocationConfiguartionData = resp.fundLocationConfiguartionData;
					this.investorList = resp.fundInvestorData;
					this.fundStaticConfiguartionData_Custom = resp.fundStaticConfiguartionData;
					this.fundTermsConfiguartionData_Custom = resp.fundTermsConfiguartionData;
					this.geographicLocationFieldList =this.sortByKey(resp.fundLocationConfiguartionData,"sequence").filter(x=> x.subPageID == PageConfigurationSubFeature.FundGeographicLocations);
					this.countryConfig = resp.fundLocationConfiguartionData.find(x =>x.name == 'Country');
					this.stratedyDesc = resp.fundStaticConfiguartionData.find(x =>x.name == 'StrategyDescription');
					this.fundTermsTitle = resp.fundTermsTitle;
					this.fundLocationDataTitle =  resp.fundLocationDataTitle;
					this.getChartData();
					this.fundTrackRecordModel.fundDetailsID = this.model.fundID
					this.loading = false;
					if(this.isLazyLoad)
						this.getDeals(null);
				}
				else {
					if (resp.status != null && resp.status.message != "") {
						this.msgs = this.miscService.showAlertMessages('error', resp.status.message);
					}
				}

				this.loading = false;
			}, error:_error => {
				this.loading = false;
			}});
	}

	getDeals(event: any) {

		if (event == null) {
			event = { first: 0, rows: 10,FilterWithoutPaging:true, globalFilter: null,
				multiSortMeta:[{field:'companyName',order:1}]
			 };
		}
		this.blockedDealsTable = true;
		this._dealService.getDealsList({ fundID: this.model.fundID, paginationFilter: event }).subscribe({next:result => {

			let resp = result["body"];
			if (resp != null && result.code == "OK") {
				this.deals = resp.dealList;
				this.totalDealRecords = resp.totalRecords;
			}
			else {
				this.deals = [];
				this.totalDealRecords = 0;
			}
			this.blockedDealsTable = false;
		}, error:_error => {
			this.blockedDealsTable = false;
		}});
	}

	getFundTrackRecords(event: any) {
		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null,FilterWithoutPaging:true, multiSortMeta: this.fundTrakRecordMultiSortMeta };
		}

		this.blockedTrackRecordTable = true;
		this.fundService.getFundTrackRecordList({ fundDetailsID: this.model.fundID, paginationFilter: event }).subscribe({next:result => {
			let resp = result["body"];
			if (resp != null && result.code == "OK") {
				this.fundTrackRecords = resp.fundTrackRecordList;
				this.fundTrackRecordsClone = JSON.parse(JSON.stringify(this.fundTrackRecords))
				this.totalTrackRecords = resp.totalRecords;
			}
			else {
				this.fundTrackRecords = [];
				this.totalTrackRecords = 0;
			}
			this.blockedTrackRecordTable = false;
		}, error:_error => {
			this.blockedTrackRecordTable = false;
		}});
	}

	convertTrackRecordValueUnits() {

		setTimeout(function (local: any) {
			local.fundTrackRecords = [];
			local.fundTrackRecordsClone.forEach(function (value: any) {
				let valueClone = JSON.parse(JSON.stringify(value));
				switch (+local.trackRecordValueUnit) {
					case FinancialValueUnitsEnum.Thousands:
						break;
					case FinancialValueUnitsEnum.Millions:
						valueClone.totalInvestedCost = (valueClone.totalInvestedCost / 1000).toFixed(2);
						valueClone.totalRealizedValue = (valueClone.totalRealizedValue / 1000).toFixed(2);
						valueClone.totalUnRealizedValue = (valueClone.totalUnRealizedValue / 1000).toFixed(2);
						valueClone.totalValue = (valueClone.totalValue / 1000).toFixed(2);
						break;
					case FinancialValueUnitsEnum.Billions:
						valueClone.totalInvestedCost = (valueClone.totalInvestedCost / 1000000).toFixed(2);
						valueClone.totalRealizedValue = (valueClone.totalRealizedValue / 1000000).toFixed(2);
						valueClone.totalUnRealizedValue = (valueClone.totalUnRealizedValue / 1000000).toFixed(2);
						valueClone.totalValue = (valueClone.totalValue / 1000000).toFixed(2);
						break;
				}
				local.fundTrackRecords.push(valueClone);
			});
		}, 10, this)

	}

	getPortfolioCompanyFundHoldingList(event: any) {
		this.portfolioCompanyFundHolding = [];
		if (event == null) {
			event = { first: 0, rows: 10, globalFilter: null, multiSortMeta: this.fundHoldingMultiSortMeta };
		}

		this.blockedPortfolioCompanyFundHoldingTable = true;
		this._dealService.getPortfolioCompanyFundHolding({ quarter: this.currentFundHoldingQuarter, year: this.currentFundHoldingYear, fundIds: [this.fundTrackRecordModel.fundDetailsID], DealID: this.model.dealID, paginationFilter: event }).subscribe({next:result => {

			let resp = result["body"];
			if (resp != null && result.code == "OK") {
				this.portfolioCompanyFundHolding = resp.portfolioCompanyFundHoldingList;
				this.portfolioCompanyFundHoldingClone = JSON.parse(JSON.stringify(this.portfolioCompanyFundHolding))
				this.totalPortfolioCompanyFundHoldingRecords = resp.totalRecords;
			}
			else {
				this.portfolioCompanyFundHolding = [];
				this.totalPortfolioCompanyFundHoldingRecords = 0;
			}
			this.blockedPortfolioCompanyFundHoldingTable = false;
		}, error:_error => {
			this.blockedPortfolioCompanyFundHoldingTable = false;
		}});
	}

	convertFundHoldingValueUnits() {

		setTimeout(function (local: any) {
			local.portfolioCompanyFundHolding = [];
			local.portfolioCompanyFundHoldingClone.forEach(function (value: any) {
				let valueClone = JSON.parse(JSON.stringify(value));
				switch (+local.holdingValueUnit) {
					case FinancialValueUnitsEnum.Thousands:
						break;
					case FinancialValueUnitsEnum.Millions:
						valueClone.investmentCost = (valueClone.investmentCost / 1000).toFixed(2);
						valueClone.realizedValue = (valueClone.realizedValue / 1000).toFixed(2);
						valueClone.unrealizedValue = (valueClone.unrealizedValue / 1000).toFixed(2);
						valueClone.totalValue = (valueClone.totalValue / 1000).toFixed(2);
						break;
					case FinancialValueUnitsEnum.Billions:
						valueClone.investmentCost = (valueClone.investmentCost / 1000000).toFixed(2);
						valueClone.realizedValue = (valueClone.realizedValue / 1000000).toFixed(2);
						valueClone.unrealizedValue = (valueClone.unrealizedValue / 1000000).toFixed(2);
						valueClone.totalValue = (valueClone.totalValue / 1000000).toFixed(2);
						break;
				}
				local.portfolioCompanyFundHolding.push(valueClone);
			});
		}, 10, this)

	}

	loadFundHoldingsLazy(event: LazyLoadEvent) {
		if (this.displayCompanyFundHoldingsDialog) {
			this.getPortfolioCompanyFundHoldingList(event);
		}
	}


	loadDealsLazy(event: LazyLoadEvent) {
		if (this.model.fundID) {
			this.isLazyLoad = false;
			this.getDeals(event);
		} else {
			this.isLazyLoad = true;
		}
	}
	toggleMenu(menuInvestor:any)
	{
		menuInvestor.close.closed =false;
	}
	modalOption: NgbModalOptions = {};
	currentModelRef: any
	open(trackRecordModel: any) {
		this.modalOption.backdrop = 'static';
		this.modalOption.keyboard = false;
		this.modalOption.size = 'lg';
		this.modalOption.centered = true;
		let copy = JSON.parse(JSON.stringify(trackRecordModel))
		this.currentModelRef = this.modalService.open(AddFundTrackRecordComponent, this.modalOption);
		this.currentModelRef.componentInstance.model = copy;
		this.currentModelRef.componentInstance.trackRecordList = this.fundTrackRecords;
		this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
			this.close(status);
		});
	}

	close(status: any) {
		this.getFundTrackRecords(null);
		this.currentModelRef.close();
		this.msgs = this.miscService.showAlertMessages('success', status.message);

	}
	closePopup(isClose:boolean)
	{
		if (isClose)
			this.isOpenAddEditTrackRecord = false;
		else
			this.isOpenAddEditTrackRecord = true;
	}
	closeSavePopup(event:any)
	{
		if(event!=undefined && event!=null)
		{
			this.isOpenAddEditTrackRecord =true;
			this.isDataUpdated = false;
		}
	}
	openFunHoldingDetailForQuarter(fundTrackRecord: any) {
		this.currentFundHoldingQuarter = fundTrackRecord.quarter;
		this.currentFundHoldingYear = fundTrackRecord.year;
		this.displayCompanyFundHoldingsDialog = true;
		this.getPortfolioCompanyFundHoldingList(null);
	}
	headerText="Track Record";
	getTrackRecordText(data){
		this.headerText=data;
	}

	sectorwiseHoldingValues: any;
	sectorwiseHoldingValues_AsOfDate: any;
	fundPerformanceData: any;
	fundPerformanceData_AsOfDate: any;
	chartDataLoading: boolean = false;
	getChartData() {
		this.chartDataLoading = true;
		let reportModel = { fundIds: [{ fundID: this.model.fundID }], selectedReportTypes: [ReportType.QuarterlyTVPI_IRR_FundDetails, ReportType.SectorwiseValues_FundDetails] }
		this.reportService.getReportData(reportModel)
			.subscribe({next:result => {
				let local = this;
				result["body"].forEach(function (report: any) {
					if (report.ReportType == ReportType.QuarterlyTVPI_IRR_FundDetails) {
						local.fundPerformanceData = report.Results;
						local.fundPerformanceData_AsOfDate = local.fundPerformanceData.map(function (e: any) { return e.ValuationDate; }).sort().reverse()[0];
					}

					if (report.ReportType == ReportType.SectorwiseValues_FundDetails) {
						local.sectorwiseHoldingValues = report.Results;
						local.sectorwiseHoldingValues.forEach(s => {							
							s["Investment Cost"] = s["Investment Cost"] / local.appConfig.DefaultNumberSystem; 
							s["Total Value"] = s["Total Value"] / local.appConfig.DefaultNumberSystem;  
						});

						local.sectorwiseHoldingValues_AsOfDate = local.sectorwiseHoldingValues.map(function (e: any) { return e.AsofDate; }).sort().reverse()[0];
					}

				});
				this.chartDataLoading = false;
			},error: _error => {
				this.chartDataLoading = false;
	}});

	}
	isPageLoaded = false;
	isPageLoadedAfterView = false;
	reportGraphData = [];
	graphList = [];
	@ViewChildren('button') button: QueryList<ElementRef>;
	observable$: Observable<any>;
	private readonly _stop = new Subject<void>();
	private readonly _start = new Subject<void>();
	ischeckUndefind(type: any) {
		if (type != undefined)
			return type;
		return "";
	}
	multiFilter(array, filters) {
		const filterKeys = Object.keys(filters);
		return array.filter((item) => {
			return filterKeys.every(key => {
				if (!filters[key].length) return true;
				return filters[key].includes(item[key]);
			});
		});
	}
	FundGraphsReport() {
		this.service.fundReportGraphs(this.id).subscribe({next:
			(results) => {
				this.reportGraphData = results?.fundGraphDetails;
				let local = this;

				this.reportGraphData.filter(function (report: any, _reportIndex: any) {
					if (report.data.length > 0) {
						let reportType = local.reportService.ReportTypeList.filter(function (
							ele: any,
							_i: any
						) {
							return report.data[0]?.ReportType == ele.value;
						});
						if (reportType.length > 0) {
							report.data[0].ReportType = reportType[0].label;
						}
						report.data[0].cols = [];
						report.data[0].graphOrder = [];
						report.data[0].Columns.forEach(function (val: any, _i: any) {
							report.data[0].cols.push({ field: val, header: val });
							if (val != "% of Unrealized Value" && val != "% of Realized Value" && val != "# of Companies"
								&& val != "% of Total Capital" && val != "% of Total Value"&&val != "Min"&&val != "Max")
								report.data[0].graphOrder.push(val);
						});
					} else {
						let filtersObj = JSON.parse(report?.config);
						if (filtersObj?.filters != undefined) {
							report.ReportType = JSON.parse(JSON.parse(report?.config).filters)?.attributionType?.label;
						}
					}
					if (report.data[0].graphOrder[0] != null) {
						report.data[0].graphOrder.splice(0, 1);
					}
					let chartsObj = JSON.parse(report?.config);
					if (report.data.length > 0) {
						if (chartsObj != null && chartsObj != undefined) {
							if (JSON.parse(report?.config).charts != undefined) {
								const ChartsArray: any = JSON.parse(JSON.parse(report?.config).charts);
								const StringArray: any = report.data[0].graphOrder;
								if (ChartsArray != null && ChartsArray != undefined) {
									ChartsArray.forEach((element, moveindex) => {
										let label: string = element.label.toString();
										if (label == "Total value Paid in"||label == "Total value Paid in (TVPI)")
											label = "TVPI";
										if (label == "Number of Investments")
											label = "# of Investments";
										if (label == "Realized value")
											label = "Realized Value";
										if (label == "Capital invested")
											label = "Capital Invested";
										if (label == "Total value")
											label = "Total Value";
										if (label == "Unrealized value")
											label = "Unrealized Value";
										let index = StringArray.indexOf(label.toString());
										if (!element.isDisable) {
											if (index !== -1) {
												StringArray.splice(index, 1);
											}
										}
										if (element.isDisable) {
											let tmp = StringArray[index];
											StringArray.splice(index, 1);
											StringArray.splice(moveindex, 0, tmp);
										}
									});
									report.data[0].graphOrder = StringArray;
								}
							}
						}
					}					
					report.data[0].strategies = "";
					report.data[0].regions = "";
					report.data[0].countries = "";
					report.data[0].evaluationDate="";			
					if (chartsObj?.filters != undefined) {
						let filtersObj = JSON.parse(chartsObj?.filters);
						report.data[0].evaluationDate = filtersObj?.evaluationDate;
						if (filtersObj?.strategies != "" && filtersObj?.strategies != undefined) {
							let label = "";
							filtersObj?.strategies.forEach((x: any) => {
								label += x.strategy + ",";
							});
							report.data[0].strategies = label.substring(0, label.length - 1);;
						}
						if (filtersObj?.regions != "" && filtersObj?.regions != undefined) {
							let label = "";
							filtersObj?.regions.forEach((x: any) => {
								label += x.region + ",";
							});
							report.data[0].regions = label.substring(0, label.length - 1);;
						}
						if (filtersObj?.countries != "" && filtersObj?.countries != undefined) {
							let label = "";
							filtersObj?.countries.forEach((x: any) => {
								label += x.country + ",";
							});
							report.data[0].countries = label.substring(0, label.length - 1);;
						}
					}
					return report;
				});
				this.isPageLoaded = true;
				this.isPageLoadedAfterView = true;
			},
			error:(_error) => {
				this.exportLoading = false;
			}
	});
	}
	ngAfterViewInit() {

		this.button.changes.subscribe(_val => {
		});
		this.isPageLoadedAfterView = true;
		if (this.uiuxMenu != undefined) {
			(this.uiuxMenu as any).closed = this.uiuxMenu.closed
			this.configureMenuClose(this.uiuxMenu.closed);
		}
	}
	ngAfterViewChecked() {
		this.button.changes.subscribe(_val => {

		});
	}
	sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	async generateGraphToHtml() {
		await this.sleep(5000);
		if (this.button?.toArray()?.length > 0) {
			let reg = /(\<!--.*?\-->)/g;
			this.button.toArray().forEach((x, _index) => {
				let obj = <any>{};
				obj.FundId = 0;
				obj.Section = x.nativeElement.id.split('///')[0];
				obj.KpiId = x.nativeElement.id.split('///')[1].split('//')[0];
				obj.Order = x.nativeElement.id.split('///')[1].split('//')[1];
				obj.Html = x.nativeElement.innerHTML.replace(reg, "");
				this.graphList.push(obj);
			});
		}
		if (this.graphList == undefined)
			this.graphList = [];
		this.portfolioCompanyService.pdfExport({ Value: 'FundReport', Id: this.id, kpiGraphs: this.graphList }).subscribe({
			next:(results) => {
				this.miscService.downloadPDFFile(results);
				this.exportLoading = false;
			},
			error:(_error) => {
				this.exportLoading = false;
			}
	});
	}
	configureMenuClose(old: MatMenu['closed']): MatMenu['closed'] {
		const upd = new EventEmitter();
		feed(upd.pipe(
			filter(event => {
				if (event === 'click') {
					return false;
				}
				this.isdownloadfilter=true;
				return true;
			}),
		), old);
		return upd;
	}
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
	return from.subscribe({
	  next: data => to.next(data),
	  error: err => to.error(err),
	  complete: () => to.complete(),
	});
}

