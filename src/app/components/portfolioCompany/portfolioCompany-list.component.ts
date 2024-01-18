import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { AppSettingService } from '../../services/appsettings.service';
import { AppConfig } from "../../common/models";
@Component({
  selector: "portfolio-company",
  templateUrl: "./portfolioCompany-list.component.html",
  styleUrls:['./portfolioCompany-list.component.scss'],
})
export class PortfolioCompanyListComponent implements OnInit{
  tabList: ITab[] = [];
  tabName: string;
  appConfig: AppConfig;

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    private appSettingService: AppSettingService,
  ) {}

  ngOnInit(): void {
  
    this.appSettingService.setGetConfig().then( res => {
      this.appConfig = res ;
      this.getTabList();
     });
  }

  getTabList() {
    this.tabList.push({
      active: true,
      name: "Published"
    });
    if(this.appConfig?.IsWorkflowEnable)
    {
      this.tabList.push({
        active: false,
        name: "Active Drafts"
      });
    }    
    this.tabName = this.tabList[0].name;
  }
  selectTab(tab: ITab){
    // deactivate all tabs
    this.tabList.forEach(tab => tab.active = false);
    tab.active = true;
    this.tabName=tab.name;
  }
  changesModelevent(isDraftOpen: any) {
    if (isDraftOpen) {
      this.selectTab(this.tabList[1]);
    }
  }
}
