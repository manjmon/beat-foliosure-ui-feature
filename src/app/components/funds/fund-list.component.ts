import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { FundService } from '../../services/funds.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';


@Component({
	selector: 'fund-list',
	templateUrl: './fund-list.component.html',
	styleUrls: ["./fund-list.component.scss"],
})

export class FundListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
	public funds: any=[];
	closeResult: string;
    pagerLength: any;
	dataTable: any;
	blockedTable: boolean = false;
	totalRecords: number;
	totalPage: number;
	globalFilter: string = "";
	paginationFilterClone: any = {};
	isLoader:boolean = false;
	model: any = {};
	fundStaticConfiguartionData = [];
	headers = [];
	constructor(private router: Router,private accountService: AccountService,private elementRef:ElementRef, private _fundService: FundService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private miscService: MiscellaneousService) {
		this.pagerLength = this.miscService.getPagerLength();
		localStorage.setItem("headerName", '');
	}

	exportFundList() {
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
		this._fundService.exportFundList({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
	}


	loadFundsLazy(event: LazyLoadEvent) {
		this.getAllFundDetails(event);
	}
	redirectToFund(fund: any) {
		localStorage.setItem("headerName", fund.fundName);
        this.router.navigate(['/fund-details', fund.encryptedFundId]);
    }

	getAllFundDetails(event: any) {
		this.isLoader = true;
		if (event == null) {
			event = { first: 0, rows: 20, globalFilter: null, sortField: null, sortOrder: 1 };
        }
        if (event.multiSortMeta == undefined) {
            event.multiSortMeta = [{ field: "ValueColumn1.Value", order: 1 }];
            event.sortField = "ValueColumn1.Value";
        }
		this.paginationFilterClone = JSON.parse(JSON.stringify(event));
		this._fundService.getFundsListData({paginationFilter: event })
			.subscribe({next:result => {
				let resp = result != null ? result["body"] : null;
				if (resp != null && result.code == "OK") {
					this.headers = resp.headers;
					if(document.getElementById("HeaderNameID")){
						this.miscService.getTitle(this.model?.fundName);
					}
					localStorage.setItem("headerName", this.model.fundName);
					this.fundStaticConfiguartionData = resp.fundStaticConfiguartionData;
					this.totalRecords = resp.totalRecords;
					if (this.totalRecords > 20) {
						this.totalPage = Math.ceil(this.totalRecords / event.rows);
					} else {
						this.totalPage = 1;
					}
					this.isLoader = false;
				}
				else {
					this.totalRecords = 0;
				}
				this.blockedTable = false;
				this.isLoader = false;
			}, error:error => {
				this.isLoader = false;
			}});
	}
	searchLoadPCLazy() {
		if (this.fundStaticConfiguartionData.length != 0) {
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
			this.getAllFundDetails(event);
		}
	}
}
