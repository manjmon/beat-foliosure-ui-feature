import { AfterViewInit, ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { CashflowService } from '../../services/cashflow.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';

@Component({
    selector: 'cashflow-list',
    templateUrl: './cashflow-list.component.html',
    styleUrls: ["./cashflow-list.component.scss"],
})

export class CashflowListComponent implements AfterViewInit {
    feature: typeof FeaturesEnum = FeaturesEnum;
    isOpenUpload = false;
    public cashflows: any;
    closeResult: string;
    blockedTable: boolean = false;
    totalRecords: number;
    dataTable: any;
    pagerLength: any;
    globalFilter: string = "";
    uploadedFileArray: any=[];
    uploadedFiles: any = {
        cashflowUplaodedFiles: [],
        fundName: "",
        isExpanded: false
    }
    windowHeight = 0;
    isLoading:boolean = true;
    constructor(private miscService: MiscellaneousService, private router: Router, private accountService: AccountService, private _cashflowService: CashflowService, protected changeDetectorRef: ChangeDetectorRef, private spinner: NgxSpinnerService) {
        this.pagerLength = this.miscService.getPagerLength();
        localStorage.setItem("headerName", '');  
    }
    paginationFilterClone: any = {};
    getCashflowFileList(event: any) {
        this.isLoading = true;
        if (event == null) {
            event = { first: 0, rows: 10, globalFilter: null, sortField: null, sortOrder: 1 };
        }
		event.rows = 1000;
        this.paginationFilterClone = JSON.parse(JSON.stringify(event));
        this.blockedTable = true;
        this._cashflowService.getCashflowFileList({ paginationFilter: event }).subscribe({next:result => {
            let resp = result["body"];
            if (resp != null && result.code == "OK") {
             this.getCashflowFileListOk(resp);  
            }
            else {
                this.uploadedFileArray = [];
                this.totalRecords = 0;
            }
            this.blockedTable = false;
            this.isLoading = false;
        }, error:error => {
            this.blockedTable = false;
            this.isLoading = false;
        }});
    }
    getCashflowFileListOk(resp:any){
        this.cashflows = resp.cashFlowList;
        let local = this;
        local.uploadedFileArray = [];
        this.cashflows.forEach(function (val: any, key: any) {
            let cashflowUplaodedFile: any = [];
            let objFiles: any = {
                cashflowUplaodedFiles: [],
                fundName: "",
                isExpanded: false
            };
            if (local.uploadedFileArray.length < 1) {
                cashflowUplaodedFile.push(val);
                objFiles.fundName = val.fund.fundName;
                 objFiles.cashflowUplaodedFiles = cashflowUplaodedFile;
                local.uploadedFileArray.push(objFiles);
            }
            else {
                local.uploadedFileArray.forEach(function(v:any,k:any){
                    if (val.fund.fundName == v.fundName) {
                        v.cashflowUplaodedFiles.push(val);
                    }
                })
                let isFundExist: any = local.uploadedFileArray.filter(function (f: any, i: any) { return f.fundName == val.fund.fundName });
                if (isFundExist.length<1) {
                    cashflowUplaodedFile.push(val);
                    objFiles.fundName = val.fund.fundName;
                    objFiles.cashflowUplaodedFiles = cashflowUplaodedFile;
                    local.uploadedFileArray.push(objFiles);
                }
            }
        });
        this.totalRecords = this.uploadedFileArray.length;
    }
    exportCashflowFile(FileUploadDetails: any) {
        this._cashflowService.downloadCashflowFile(FileUploadDetails).subscribe(response => this.miscService.downloadExcelFile(response));
    }
	loadCashflowFileLazy(event: LazyLoadEvent) {
        this.getCashflowFileList(event);
	}
    setActive(cashflow: any) {
        if (cashflow.isExpanded)
            cashflow.isExpanded = false;
        else
            cashflow.isExpanded = true;
    }
    setHeaderName(cashflow: any) {
        localStorage.setItem("headerName", cashflow?.fund?.fundName);        
    }
    ngAfterViewInit() {
        this.windowHeight = window.innerHeight - 147;
      }
      @HostListener('window:resize', ['$event'])
      onResize(event) {
        this.windowHeight = window.innerHeight - 147;
      }
      closePopup(isUploaded: boolean) {
        this.isOpenUpload = false;
        if (isUploaded)
          this.getCashflowFileList(null);
      }
}
