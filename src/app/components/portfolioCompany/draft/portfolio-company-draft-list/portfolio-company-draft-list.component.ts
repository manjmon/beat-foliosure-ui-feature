import { Component, OnInit , ViewChild, AfterViewInit, NgZone} from '@angular/core';
import { PortfolioCompanyDraftService } from 'src/app/services/portfolio-company-draft.service';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { Router } from '@angular/router';
import { AppSettingService } from 'src/app/services/appsettings.service';
import {AppConfig} from "src/app/common/models";
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { map, pairwise, filter,throttleTime} from 'rxjs/operators';

@Component({
  selector: 'app-portfolio-company-draft-list',
  templateUrl: './portfolio-company-draft-list.component.html',
  styleUrls: ['./portfolio-company-draft-list.component.scss']
})
export class PortfolioCompanyDraftComponent implements OnInit, AfterViewInit {

  @ViewChild('scroller') scroller: CdkVirtualScrollViewport;

  isLoader: boolean = false;
  pcDraftListHeaderData: any[] = [];
  pcDraftListData: any[] = [];
  paginationFilterDraftClone: any = {};
  toolTipString: any = '';
  panelWidth: any = '';
  masterSectionList: any = [];
  filterSearch: string = "";
  tablePosition:string = "unset"
  appConfig : AppConfig;
  pageNumber: number = 1;
  searching: boolean = false;
  RecordsPerPage: number = 100;

  constructor(
    private portfolioCompanyDraftService: PortfolioCompanyDraftService,
    private pageConfigurationService: PageConfigurationService,
    private router: Router,
    private appSettingService : AppSettingService,
    private ngZone: NgZone,
  ) {
    this.appConfig = this.appSettingService.getConfig();

  }
  ngOnInit(): void {
    let event = JSON.parse(JSON.stringify(this.paginationFilterDraftClone));
    event.PageNumber = this.pageNumber;
    event.RecordsPerPage = this.RecordsPerPage;
    event.SearchText = ''

    this.getConfigurationList(event);
    
    this.getWidth();
  }

  ngAfterViewInit(): void {

      this.scroller.elementScrolled().pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
    filter(([y1, y2]) => (y2 < y1 && y2 < 140)),
    throttleTime(200) 
      ).subscribe(() => {
        this.ngZone.run(() => {
          let event = JSON.parse(JSON.stringify(this.paginationFilterDraftClone));
             event.PageNumber = ++this.pageNumber;
             event.RecordsPerPage = this.RecordsPerPage;
             event.SearchText = this.filterSearch
                this.getPcDraftListPageWise(event)              
        });
      }
      );
    }

  getConfigurationList(event:any) {
    Promise.all([this.getPageConfiguration()]).then((results) => {
      let subFeatureData = results[0];
      this.getSubpageList(subFeatureData);
      this.getPcDraftList(event);
    });
  }

  getPageConfiguration = (): Promise<any[]> => {

    return new Promise<any[]>((resolve, reject) => {
      this.pageConfigurationService.getPageConfiguration()
        .subscribe({
          next:(result: any) => {
            let finalPCSections = this.parseJsonResponse(result);
            resolve(finalPCSections);
          }, error:(error) => {
            this.isLoader = false;
          }});
    });

  }

  parseJsonResponse = (result: any[]) => {

    if ((result == null || undefined)) return;
    let pcField = result.filter(x => x.isActive && x.name == "Portfolio Company");
    let subPageDetails = pcField[0].subPageDetailList.filter(x => x.isActive).map(x => ({ id: x.id, name: x.name, displayName: x.displayName }));;
    let supportedSubFeatureSection = ["Static Information", "Company Financials", "Commentary"]
    let kpiSection = pcField[0].subPageDetailList.filter(x => x.name == "Key Performance Indicator");
    let kpiFields = kpiSection[0].subPageFieldList.filter(x => x.isActive).map(x => ({ id: x.id, name: x.name, displayName: x.displayName }));

    let finalPCSections = [];
    subPageDetails.forEach(x => {
      if (supportedSubFeatureSection.includes(x.name)) {
        finalPCSections.push(x);
      }
    });
    kpiFields.forEach(x => {
      finalPCSections.push(x);
    });
    return finalPCSections;
  }

  getSubpageList(pageConfigData: any[]) {
    let activePCSections = pageConfigData;

    let mappingSubFeaturePageConfig = [
      {
        source: "Static Data Business Desciption Investment Professional", target: "Static Information"
      },
      {
        source: "Trading Records", target: "TradingRecords"
      },
      {
        source: "Operational KPIs", target: "OperationalKPIs"
      },
      {
        source: "Investment KPIs", target: "InvestmentKPIs"
      },
      {
        source: "Company KPIs", target: "CompanyKPIs"
      },
      {
        source: "Impact KPIs", target: "ImpactKPIs"
      },
      {
        source: "Credit KPI", target: "CreditKPI"
      },
      {
        source: "Financials", target: "Company Financials"
      },
      {
        source: "Commentary", target: "Commentary"
      }
    ];

    let filterPCSection = [];    
    activePCSections.filter(x => {
      let item = mappingSubFeaturePageConfig.find(i=> i.target == x.name);
      if( item != null){
        this.masterSectionList.push(Object.assign({}, x, item));
      }
    });
  }

  getPcDraftList(event: any) {
    this.isLoader = true ; 
    let local = this;
    this.portfolioCompanyDraftService
      .getPortfolioCompanyDraftList(event)
      .subscribe({
        next:(result) => {
          let resp = result != null ? result["body"] : null;

          if (resp != null && result.code == "OK") {
            this.draftHeaderDataFactory(resp?.columns,resp?.statuscount);      
             let temp :any[]= (resp?.draftData.length != 0 ?
                                         resp?.draftData : []);
                                         this.pcDraftListData = temp;
                                         this.pcDraftListData = [...this.pcDraftListData, temp];
           temp.forEach(function (e) {
              if (typeof e === "object") {
                e.workFlowSubfeatureModel.forEach(function (k) {
                  if (typeof k === "object") {
                    let findRecord = local.masterSectionList.find(i=> i.source == k.subFeature);
                    k["displayName"] = (findRecord?.displayName || "");
                  }
                });
              }
            });
          }
          this.isLoader = false;
          this.tablePosition = 'sticky';
        },
        error:(error) => {
          this.isLoader = false;
        }
  });
  }

  
  getPcDraftListPageWise(event: any) {
    let local = this;
    this.isLoader = true ; 
    this.portfolioCompanyDraftService
      .getPortfolioCompanyDraftList(event)
      .subscribe({
        next:(result) => {
          let resp = result != null ? result["body"] : null;
          if (resp != null && result.code == "OK") {
            this.draftHeaderDataFactory(resp?.columns,resp?.statuscount);
            this.pcDraftListData = this.pcDraftListData.concat(resp?.draftData.length > 0 ? resp?.draftData : []);
            this.pcDraftListData.length > 0 ? this.pcDraftListData.forEach(function (e) {
              if (typeof e === "object") {
                e.workFlowSubfeatureModel != undefined ? e.workFlowSubfeatureModel.forEach(function (k) {
                  if (typeof k === "object") {
                    let findRecord = local.masterSectionList.find(i=> i.source == k.subFeature);
                    k["displayName"] = (findRecord?.displayName || "");
                  }
                }):"";
              }
            }): "";
          }
          this.isLoader = false;
        },
        error:(error) => {
          this.isLoader = false;
        }
  });
  }
  

  draftHeaderDataFactory(rawData:any, columnCount:any){
    rawData.forEach(x => {
      let item = columnCount.find(i => i.statusId == x.statusId);
      x.totalRecord = (item?.count || 0);
    });

    this.pcDraftListHeaderData = rawData?.length != 0 ? rawData : [];
    if (this.pcDraftListHeaderData?.length < 4) {
      let count_header = 4 - this.pcDraftListHeaderData?.length;

      for (let index = 0; index < count_header; index++) {
        this.pcDraftListHeaderData.push({});
      }
    }
  }

  mouseEnter(data) {
    this.toolTipString = '';
    if (data?.workFlowSubfeatureModel?.length) {
      this.toolTipString+='<ul style="padding-left:10px;margin-bottom: 0px !important;">'
      for (let val of data.workFlowSubfeatureModel) {
        this.toolTipString += `<li>${val.displayName}</li>`
      }
      this.toolTipString+='</ul>'
    }
  }

  getWidth() {
    this.panelWidth = (((window.innerWidth - 108) - 16 * 5) / 4) + 16 + "px"
  }

  setCompanyValues(pcItem: any) {
    let companyName = '';
    companyName = pcItem.companyName;
    sessionStorage.setItem("companyName", JSON.stringify(companyName));

    let workFlow = {
      DraftName: pcItem.workflowRequestName,
      WorkflowRequestId: pcItem.workflowRequestId
    }
    localStorage.setItem("currentWorkflow", JSON.stringify(workFlow));

    this.router.navigate(["/workflow/company-draft/", pcItem.encryptedPortfolioCompanyID], {
      state: {
        data: {
          WorkflowRequestId: pcItem.workflowRequestId,
          DraftName: pcItem.workflowRequestName
        }
      },
    });
  }

  searchDraftList(){
    this.searching= true;
    this.tablePosition = 'unset';
    let event = JSON.parse(JSON.stringify(this.paginationFilterDraftClone));
    event.PageNumber = this.pageNumber = 1;
    event.RecordsPerPage = this.RecordsPerPage;
    event.SearchText = this.filterSearch
    this.getPcDraftList(event)
  }
}
