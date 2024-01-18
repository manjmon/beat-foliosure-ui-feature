import { Component,Input,Output,EventEmitter, OnInit} from '@angular/core';
import { ValuationType } from "../../../shared/valuation-type.enum"

@Component({
  selector: 'app-transaction-implied-ev',
  templateUrl: './transaction-implied-ev.component.html',
  styleUrls: ['./transaction-implied-ev.component.scss']
})
export class TransactionImpliedEvComponent implements OnInit {
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
        {
          name: "Equity Value",
          id: this.valuationType.Equity,
          isActive: false,
        }
      );
      this.selectedImpliedEVTab = this.impliedEVTabList[0];
    }
  }
}
