import { ElementRef, EventEmitter, Output, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { CommonConstants } from 'src/app/common/constants';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { FeaturesEnum, PermissionService } from 'src/app/services/permission.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { Table } from 'primeng/table';
import { AppSettingService } from 'src/app/services/appsettings.service';
import { AppConfig } from "src/app/common/models";

@Component({
  selector: 'pc-published',
  templateUrl: './published.component.html',
  styleUrls: ['./published.component.scss']
})
export class PublishedComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  globalFilter: string = "";
  paginationFilterClone: any = {};
  isLoading: boolean = false;
  pcs: any = [];
  totalRecords: number;
  exportItems: MenuItem[];
  fixedHeight = 600;
  windowHeight = 0;
  isScroll = false;
  reportTypes = [];
  mappedStatus = [];
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Output() onDraftEmitter = new EventEmitter<any>();
  isOpenNewDraft: boolean = false;
  quarterOptions: any[] = CommonConstants.quarterOptions;
  monthlyOptions: any[] = CommonConstants.monthOptions;
  yearOptions: any[];
  reportType:any=null;
  reportPeriod:any=null;
  reportYear:any=null;
  form: FormGroup;
  encryptedPortfolioCompanyId: string = "";
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  draftName: string = "";
  isWorkflow:boolean = false;
  isTaabo:boolean = false;
  message: any;
  dataTable: any;
  blockedTable: boolean = false;
  pagerLength: any;
  isLoader:boolean = false;
  pcStaticConfiguartionData:any =[];
  headers=[];
  appConfig: AppConfig;
  @ViewChild('tblPortfolio', { static: true }) public table: Table;
  totalPage: number;
  constructor(
    private formBuilder: FormBuilder,
    private miscService: MiscellaneousService,
    private toastrService: ToastrService,
    private router: Router,
    private permissionService:PermissionService,
    private elementRef:ElementRef,
    private appSettingService: AppSettingService,
    private portfolioCompanyService: PortfolioCompanyService) {
      this.yearOptions = this.miscService.bindPrevAndNextYearList();
      localStorage.setItem("headerName", '');
  }

  ngOnInit(): void {
    this.toastrService.overlayContainer = this.toastContainer;
    this.form = this.formBuilder.group(
      {
        reportName: ['', [Validators.required]],
        period: ['', [Validators.required]],
        year: ['', [Validators.required]]
      }
    );
    localStorage.removeItem("currentWorkflowId");
    this.isTaabo=this.permissionService.isCheckTaabo();
    this.appSettingService.setGetConfig().then( res => {
      this.appConfig = res;
      if(this.appConfig.IsWorkflowEnable) {
        this.isWorkflow = true;
        this.getReportsType();
        this.getWorkflowMappingStatusByUserId();
      }
     });
   
  }

  getWorkflowMappingStatusByUserId(){
    this.portfolioCompanyService
    .getWorkflowMappingStatusByUserId()
    .subscribe(
      (result) => {
        let resp = result!=null ? result :[];
        this.mappedStatus = resp;
        
      });

  }

  getReportsType() {
    this.portfolioCompanyService
      .getReportsType()
      .subscribe(
        (result) => {

          let resp = result!=null ? result :[];

          this.reportTypes = resp;
        });
  }
  
  searchLoadPCLazy() {
		if (this.pcStaticConfiguartionData.length != 0) {
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
			this.getPortfolioList(event);
		}
	}
  loadPortfolioLazy(event: LazyLoadEvent) {
    this.getPortfolioList(event);
  }
  getPortfolioList(event: any) {
    this.isLoader = true;
    if (event == null) {
      event = {
        first: 0,
        rows: 100,
        globalFilter: null,
        sortField: null,
        sortOrder: 1,
      };
    }
    if (event.multiSortMeta == undefined) {
      event.multiSortMeta = [{ field: "ValueColumn1.Value", order: 1 }];
      event.sortField = "ValueColumn1.Value";
    }
    this.paginationFilterClone = JSON.parse(JSON.stringify(event));
    this.blockedTable = true;
    this.portfolioCompanyService
      .getPortfolioCompanyByGroup({ paginationFilter: this.paginationFilterClone })
      .subscribe({
        next:(result) => {
          let resp = result!=null ? result["body"] :null;
          if(result?.code =="OK")
          {
            this.totalRecords = resp?.totalRecords;
            if(this.totalRecords > 20){
              this.totalPage = Math.ceil(this.totalRecords / event.rows);
            }else{
              this.totalPage = 1;
            }
            this.pcStaticConfiguartionData = resp?.pcStaticConfiguartionData.length != 0 && resp?.pcStaticConfiguartionData != undefined? resp?.pcStaticConfiguartionData:[];
          }
          else{
            this.pcStaticConfiguartionData=[];
            this.totalPage = 0;
            this.totalRecords =0;
          }
          this.headers = resp?.headers;        
          this.isLoading = false;
          this.isLoader = false;
        },
        error:(error) => {
          this.isLoading = false;
          this.isLoader = false;
        }
  });
  }

  exportPortfolioCompanyList() {
      let event = {
        first: 0,
        rows: 0,
        globalFilter: null,
        sortOrder: 1,
        multiSortMeta : [{ field: "PortfolioCompanyID", order: 1 }],
        sortField : "PortfolioCompanyID",
        filterWithoutPaging : true
      };
    event.globalFilter = this.globalFilter;
    event.filterWithoutPaging = true;
    this.portfolioCompanyService
      .exportPortfolioCompanyList({ paginationFilter: event })
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }

  exportPortfolioCompanyKPIDataList() {
    this.portfolioCompanyService
      .exportPortfolioCompanyKPIDataList()
      .subscribe((response) => this.miscService.downloadExcelFile(response));
  }
  openDraft() {
    this.onDraftEmitter.emit(true);
  }
  setCompanyValues(pcItem: any) {   
    let companyName = '';
    Object.keys(pcItem).forEach(key => {
       let column = pcItem[key] ;
       if(column != null &&  column?.name == 'CompanyName' ) {
        companyName =column.value;
       }

    });
    
    sessionStorage.setItem("companyName", JSON.stringify(companyName));
  }
  isEditDraft()
  {
    return this.mappedStatus.filter(x=>x.isStart || !x.isStart).length > 0;
  }
  isCreateDraft()
  {
    return this.mappedStatus.filter(x=>x.isStart).length > 0;
  }
  saveDraft()
  {
    if (this.form.invalid) 
      return;
    this.isLoading = true;
    let mappedStatus =this.mappedStatus.find(x=>x.isStart);
    this.draftName = `${this.reportType.name} - ${this.reportPeriod.text} ${this.reportYear.text}`;
    let model = {
      FeatureId: FeaturesEnum.PortfolioCompany,
      EncryptedRequestId: this.encryptedPortfolioCompanyId,
      WorkflowRequestName: this.draftName,      
      StatusId: mappedStatus.statusId
    };
    this.portfolioCompanyService
      .createDraft(model)
      .subscribe(response => {
        if (response.workFlowRequestId > 0) {
          this.toastrService.success('Draft created successfully', "", { positionClass: "toast-center-center" });
          this.isLoading = false;
          this.redirectToDraft(response.workFlowRequestId);
        }
        else {
          this.isLoading = false;
          this.toastrService.error('Draft already exist', "", { positionClass: "toast-center-center" });
        }
      },
      error => {
        this.isLoading = false;
      }
      );
  }
  redirectToDraft(workFlowRequestId: number) {
    let workFlow = {
      DraftName: this.draftName,
      WorkflowRequestId: workFlowRequestId
    }
    localStorage.setItem("currentWorkflow",JSON.stringify(workFlow));
    this.router.navigate(["/workflow/company-draft", this.encryptedPortfolioCompanyId], {
      state: {
        data: {
          WorkflowRequestId: workFlowRequestId,
          DraftName: this.draftName
        }
      },
    });
  }
  redirectToCompany(pc: any) {
    localStorage.setItem("headerName", pc.companyName);
    this.router.navigate(['/portfolio-company-detail', pc.encryptedPortfolioCompanyId]);
}
}