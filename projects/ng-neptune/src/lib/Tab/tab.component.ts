import { ITab } from './tab.model';
import { Component, Input, OnInit, ViewChild, ElementRef, HostListener, EventEmitter, Output, AfterContentInit } from '@angular/core';

@Component({
  selector: 'nep-tab',
  templateUrl: './tab.component.html'
})
export class TabComponent implements OnInit,AfterContentInit {
@Output() OnSelectTab: EventEmitter<any> = new EventEmitter();
@Input() tabList: ITab[];
@Input() isfilter:boolean=false;
@Input() collapsed:boolean=false;
@Output() OnCollapseEvents: EventEmitter<any> = new EventEmitter();
@Input() nav:boolean=false;
tab:any;
tabName:string = "";
  constructor() { }

  ngOnInit() {
  }
  expand()  {
    this.collapsed  =  false;
    this.OnCollapseEvents.emit(this.collapsed);
  }
  collapse()  {
    this.collapsed  =  true;
    this.OnCollapseEvents.emit(this.collapsed);
  }
  selectTab(tab: ITab){
    this.tabList?.forEach(tab => tab.active = false);
    if(tab!=undefined)
    {
      tab.active = true;
      this.tab=tab;
      this.OnSelectTab.emit(tab);
      this.tabName=tab?.name;
    } 
  }
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabList?.filter((tab)=>tab.active);
    
    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabList[0]);
      this.OnSelectTab.emit(this.tabList[0]);
    }
  }
 

}
