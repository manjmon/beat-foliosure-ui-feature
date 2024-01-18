import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { FirmService } from '../../services/firm.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';

@Component({
    selector: 'firm',
    templateUrl: './firm-list.component.html',
	styleUrls: ["./firm-list.component.scss"]
})

export class FirmListComponent {
    feature: typeof FeaturesEnum = FeaturesEnum;
    public firms: any=[];
    pagerLength: any;
    dataTable: any;
    blockedTable: boolean = false;
	totalRecords: number;
	totalPage: number;
	globalFilter: string = "";
	paginationFilterClone: any = {};

    constructor(private miscService: MiscellaneousService,private elementRef:ElementRef,private accountService: AccountService, private firmService: FirmService, protected changeDetectorRef: ChangeDetectorRef) {
        this.pagerLength = this.miscService.getPagerLength();
		localStorage.setItem("headerName", '');  
    }

	getFirmList(event: any) {

		if (event == null) {
			event = { first: 0, rows: 20, globalFilter: null, sortField: null, sortOrder: 1 };
        }
        if (event.multiSortMeta == undefined) {
            event.multiSortMeta = [{ field: "FirmName", order: 1 }];
            event.sortField = "FirmName";
        }
		this.paginationFilterClone = JSON.parse(JSON.stringify(event));

        this.blockedTable = true;
		this.firmService.getFirmList({ paginationFilter: event }).subscribe({next:result => {

            let resp = result["body"] ;
			if (resp != null && result.code == "OK") {
				this.firms = resp.firmList;
				this.totalRecords = resp.totalRecords;
				if(this.totalRecords > 20){
					this.totalPage = Math.ceil(this.totalRecords / event.rows);
				}else{
					this.totalPage = 1;
				}
			}
			else {
				this.firms = [];
				this.totalRecords = 0;
			}
			this.blockedTable = false;
        }, error:error => {
            this.blockedTable = false;
        }});
	}

	exportFirmList() {
		let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
		event.globalFilter = this.globalFilter;
		event.filterWithoutPaging = true;
		this.firmService.exportFirmList({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
	}

	loadFirmsLazy(event: LazyLoadEvent) {

		this.getFirmList(event);
	}
	setHeaderName(firmName: any) {
        localStorage.setItem("headerName", firmName);    
    }
	  searchLoadPCLazy() {
		if (this.firms.length != 0) {
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
			this.getFirmList(event);
		}
	}
}

