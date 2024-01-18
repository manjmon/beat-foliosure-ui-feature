import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { AccountService } from '../../services/account.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';
import { PipelineService } from '../../services/pipeline.service';


@Component({
    selector: 'pipeline-list',
    styleUrls: ['./pipeline-list.component.scss'],
    templateUrl: './pipeline-list.component.html'
})

export class PipelineListComponent implements OnInit {
    feature: typeof FeaturesEnum = FeaturesEnum;
    pipelineList: any = [];
    closeResult: string;
    pagerLength: any;
    dataTable: any;
    blockedTable: boolean = false;
    totalRecords: number;
    totalPage: number;
    globalFilter: string = "";
    paginationFilterClone: any = {};
    tabName: string = "Pipeline Dashboard";
    tabList: ITab[] = [];
    isLoader:boolean=false;
    constructor(private accountService: AccountService, private elementRef:ElementRef, private router: Router, private _pipelineService: PipelineService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService, private miscService: MiscellaneousService) {
        this.pagerLength = this.miscService.getPagerLength();
        localStorage.setItem("headerName", 'Pipeline Dashboard'); 
    }

    ngOnInit() {
        this.getTabList();
    }
    onTabClick(tab: ITab) {
        if(document.getElementById("HeaderNameID")){
			this.miscService.getTitle(tab?.name);
        }
        if (tab != null || tab != undefined) {
            this.tabName = tab.name;
           
        }
    }
    getPipelineList(event: any) {
      
        if (event == null) {
            event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }
        this.paginationFilterClone = JSON.parse(JSON.stringify(event));
        this.blockedTable = true;
        this.isLoader=true;
        this._pipelineService.getPipelineList({ paginationFilter: event }).subscribe({next:result => {
            if (result != null) {
                this.pipelineList = result?.pipelineList;
                this.totalRecords = result?.totalRecords;
                if(this.totalRecords > 20){
                    this.totalPage = Math.ceil(this.totalRecords / event.rows);
                  }else{
                    this.totalPage = 1;
                  }
            }
            else {
                this.pipelineList = [];
                this.totalRecords = 0;
            }
            this.blockedTable = false;
           this.isLoader=false;
        }, error:error => {
            this.blockedTable = false;
            this.isLoader=false;
        }});
    }
    exportPipelineList() {
        let event = JSON.parse(JSON.stringify(this.paginationFilterClone));
        event.globalFilter = this.globalFilter;
        event.filterWithoutPaging = true;
        this._pipelineService.exportPipelineList({ paginationFilter: event }).subscribe(response => this.miscService.downloadExcelFile(response));
    }
    loadPipelinesLazy(event: LazyLoadEvent) {

        this.getPipelineList(event);
    }
    getTabList() {
        this.tabList = [
            {
                active: true,
                name: "Pipeline Dashboard"
            }
            , {
                active: false,
                name: "Pipeline Details"
            }
        ];
    }
    setHeaderName(pipeline: any) {
        localStorage.setItem("headerName", pipeline.name);     
    }
    redirectToPipeline(pipeline: any) {
        this.router.navigate(['/pipeline-details', pipeline.encryptedPipelineId]);
    }
    searchLoadPCLazy() {
		if (this.pipelineList.length != 0) {
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
			this.getPipelineList(event);
		}
	}
}
