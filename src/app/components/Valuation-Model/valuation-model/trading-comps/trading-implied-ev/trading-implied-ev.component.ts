import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ValuationType } from "../../../shared/valuation-type.enum"

@Component({
  selector: 'app-trading-implied-ev',
  templateUrl: './trading-implied-ev.component.html',
  styleUrls: ['./trading-implied-ev.component.scss']
})
export class TradingImpliedEvComponent implements OnInit {
  valuationType: typeof ValuationType = ValuationType;
  @Input() fundDetails: any;
  @Input() selectedCompany: any;
  @Input() quarterAndYear: any;
  @Output() emptyMarketData = new EventEmitter();
  @Input() rawData: any;
  @Input() selectedKPIDropdown: any;
  tabName: string = "Adjustment Details";
  selectedImpliedEVTab: any = null;
  impliedEVTabList: any = [];

  constructor() {
    this.getImpliedEVTabs();
  }

  ngOnInit(): void { this.getImpliedEVTabs(); }

  setImpliedEVTab(tab: any) {
    this.selectedImpliedEVTab = tab;
    this.impliedEVTabList.forEach(tab => tab.isActive = false);
    tab.isActive = true;
  }

  getImpliedEVTabs() {
    if (this.impliedEVTabList.length == 0) {
      this.impliedEVTabList.push(
        {
          name: "Implied EV",
          id: this.valuationType.Adjustment,
          isActive: true,
        },
       
      );
      this.selectedImpliedEVTab = this.impliedEVTabList[0];
    }
  }
}
