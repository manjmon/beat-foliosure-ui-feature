import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { WorkflowAccessService } from 'src/app/services/workflow-access.service';

@Component({
  selector: 'app-workflow-group-access',
  templateUrl: './workflow-group-access.component.html',
  styleUrls: ['./workflow-group-access.component.scss']
})
export class WorkflowGroupAccessComponent implements OnInit,AfterViewInit {

  groupList: any = [];
  tabList: ITab[] = [];
  tabName: string;
  windowHeight = 0;
  selectedGroupData = {};
  selectedGroupId: string = '0';
  isReloadGroups = false;
  constructor(private workflowAccessService: WorkflowAccessService) { }

  ngOnInit() {
    this.getTabList();
  }
  ngAfterViewInit() {
    this.windowHeight = window.innerHeight - 255;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowHeight = window.innerHeight - 255;
  }

  ReloadGroups(){
    this.isReloadGroups = true;
  }

  unsetReloadGroups(){
    this.isReloadGroups = false;
  }
 
  getTabList() {
    this.tabList.push({
      active: true,
      name: "Users"
    });
    this.tabList.push({
      active: false,
      name: "Features"
    });
    this.tabList.push({
      active: false,
      name: "Sub features"
    });
    this.tabList.push({
      active: false,
      name: "Workflow"
    });
    this.tabName = this.tabList[0].name;
  }
  selectTab(tab: ITab) {
    // deactivate all tabs
    this.tabList.forEach(tab => tab.active = false);
    tab.active = true;
    this.tabName = tab.name;
  }

  setGroupandSubgroupId(data){
    this.selectedGroupData = data;
    this.selectedGroupId = data?.encryptedGroupID == undefined ? '0' : data?.encryptedGroupID;
    if( this.selectedGroupId == undefined ||  this.selectedGroupId == null || this.selectedGroupId == '0'){
      this.selectedGroupId = data?.groupID.toString();
    }
  }




}
