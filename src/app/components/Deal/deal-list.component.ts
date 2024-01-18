import { ChangeDetectorRef, Component, ElementRef, ViewChild, EventEmitter } from "@angular/core";
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { DealService } from '../../services/deal.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';
import {DealDetailsConstants} from "../../common/constants";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { filter } from "rxjs/operators";
import { Observable, Subject,Subscription } from "rxjs";

@Component({
	selector: 'deal-list',
	templateUrl: './deal-list.component.html',
	styleUrls: ["./deal-list.component.scss"]
})

export class DealListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
	public deals: any;
	closeResult: string;
	blockedTable: boolean = false;
	totalRecords: number;
    dataTable: any;
	pagerLength: any;
	globalFilter: string = "";
	dealData = [];
	isLoader:boolean=false;
	isExportLoading:boolean = false;
	dealDetailsConstants = DealDetailsConstants;
	isdownloadfilter:boolean=true;
	@ViewChild('iMenuTrigger') menuTrigger: MatMenuTrigger;
	@ViewChild('menu') uiuxMenu!: MatMenu;
	show = false;
	disableConfirm = false;
	YearQuarter = null;
	year = null;
	quarter = null;
	newInvestmentsNotFound = false;
	totalPage: number;
    constructor(private miscService: MiscellaneousService, private elementRef:ElementRef, private accountService: AccountService, private _dealService: DealService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService) {
        this.pagerLength = this.miscService.getPagerLength();
		localStorage.setItem("headerName", '');
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

	paginationFilterClone: any = {};

	getDealList(event: any) {
		this.isLoader = true;
		if (event == null) {
			event = { first: 0, rows: 20, globalFilter: null, sortField: null,FilterWithoutPaging: false, sortOrder: 1 };
        }
        if (event.multiSortMeta == undefined) {
            event.multiSortMeta = [{ field: "dealCustomID", order: 1 }];
            event.sortField = "dealCustomID";
        }
		this.paginationFilterClone = JSON.parse(JSON.stringify(event));
		this.blockedTable = true;
		this._dealService.getDealsQuery({ paginationFilter: event,encryptedDealID: null, includeAllPageConfiguration : false }).subscribe({
			next:result => {
			if (result != null && result?.dealDetails?.dealList?.length>0) {
				this.deals = result?.dealDetails?.dealList;
				this.totalRecords = result?.dealDetails?.totalRecords;
				if(this.totalRecords > 20){
					this.totalPage = Math.ceil(this.totalRecords / event.rows);
				  }else{
					this.totalPage = 1;
				  }
				this.dealData = result?.staticFieldValueList.filter(x => x.name == DealDetailsConstants.FundName || 
					x.name == DealDetailsConstants.DealCustomID || x.name == DealDetailsConstants.CompanyName);
				this.blockedTable = false;
				this.changeDetectorRef.detectChanges();
			}
			else {
				this.blockedTable = false;
				this.deals = [];
				this.totalRecords = 0;
			}
			this.isLoader = false;
		}, error:(error) => {
			this.blockedTable = false;
			this.isLoader = false;
		}});

	}

	downloadNewInvestment(){
		this.exportDealNewInvestment(this.year, this.quarter);
	}

	exportDealNewInvestment(year,quarter){
		this.isExportLoading = true;
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
		this._dealService.exportDealNewTransaction({ paginationFilter: event, includeAllDetails: true, year: year, quarter:quarter}).subscribe({next:(response) => {
			this.miscService.downloadExcelFile(response);
			this.isExportLoading = false;
			this.year = null;
			this.quarter = null;
			this.YearQuarter = null;
			this.closeQuarterYearSelectionPopup();
		},error:(error) => {
			this.newInvestmentsNotFound = true;
			this.disableConfirm = true;
			this.isExportLoading = false;
			}
	});
	}

	exportDealList() {
		this.isExportLoading = true;
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
		this._dealService.exportDealList({ paginationFilter: event, includeAllDetails: true}).subscribe({next:(response) => {
			this.miscService.downloadExcelFile(response);
			this.isExportLoading = false;
		},error:(error) => {
			this.isExportLoading = false;
			}
	});
	}

	loadDealsLazy(event: LazyLoadEvent) {
		this.getDealList(event);
	}
	setHeaderName(dealName: any) {
        localStorage.setItem("headerName", dealName);        
    }

	openQuarterYearSelectionPopup(){
		this.year = null;
		this.quarter = null;
		this.YearQuarter = null;
		this.newInvestmentsNotFound = false;
		this.disableConfirm = true;
		this.show = true;
	}

	closeQuarterYearSelectionPopup(){
		this.year = null;
		this.quarter = null;
		this.YearQuarter = null;
		this.newInvestmentsNotFound = false;
		this.disableConfirm = true;
		this.show = false;
	}

	QuarterYear(event: any) {
		this.YearQuarter = event.quarter + ' ' + event.year;
		this.year = event.year;
		this.quarter = event.quarter;
		this.newInvestmentsNotFound = false;
		this.disableConfirm = false;
	  }
	  searchLoadPCLazy() {
		if (this.deals.length != 0) {
			this.miscService.GetPaginatorEvent(this.elementRef);
		}
		else {
			let event = {
				first: 0,
				rows: 20,
				globalFilter: this.globalFilter != "" ? this.globalFilter : null,
				sortField: null,
				sortOrder: 1
			};
			this.getDealList(event);
		}
	}
}

function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
	return from.subscribe({
	  next: data => to.next(data),
	  error: err => to.error(err),
	  complete: () => to.complete(),
	});
}
