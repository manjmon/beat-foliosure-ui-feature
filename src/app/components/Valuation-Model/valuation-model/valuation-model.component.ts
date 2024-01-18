import { Component, OnInit, ChangeDetectorRef, QueryList, ViewChildren } from '@angular/core';
import { ValuationModelService } from "../../../services/valuation-model.service";
import { ValuationType } from "../../Valuation-Model/shared/valuation-type.enum";
import { ImpliedEvService } from 'src/app/services/implied-ev.service';
import { ValuationComponentCanDeactivate } from 'src/app/unsaved-changes/can-deactivate/component-can-deactivate';
import { ValuationChangesGuard } from "../shared/valuation-changes-guard";
import { TypeAheadControlComponent } from "src/app/components/custom-controls/typeahead-control.component";
@Component({
  selector: "app-valuation-model",
  templateUrl: "./valuation-model.component.html",
  styleUrls: ["./valuation-model.component.scss"],
  providers: [ValuationChangesGuard]
})
export class ValuationModelComponent extends ValuationComponentCanDeactivate implements OnInit {
  valuationType: typeof ValuationType = ValuationType;
  isOpenUpload: boolean = false;
  disableApply: boolean = true;
  selectedFund: any;
  selectedCompany: any;
  disableQuarterAndYear: boolean = true;
  QuarterAndYear: any;
  fundList: any[];
  companyList: any[];
  qandyear = {};
  showTabs: boolean = false;
  tabName: string = "";
  tabList: any = [];
  selectedTab: any = null;
  childTabName: any;
  canDeactivateStatus: boolean = true;
  currentModelRef: any;
  previousSelectedFund: any;
  subscriptions: any[] = [];

  @ViewChildren(TypeAheadControlComponent) childrenDdlComponent: QueryList<TypeAheadControlComponent>;

  constructor(private _valuationService: ValuationModelService, private _impliedService: ImpliedEvService,
    private _valuationChangesGuard: ValuationChangesGuard, private changeDetectorRef: ChangeDetectorRef) {
    super();
    this._impliedService.setTransactionTabStateSubject(this.selectedTab);

    this.subscriptions.push(this._valuationService.unsavedChanges$.subscribe((status: boolean) => {
      this.canDeactivateStatus = status
    }));
  }

  canDeactivate(): boolean {
    return this.canDeactivateStatus;
  }

  ngOnInit(): void {
    this.canDeactivateStatus = true;
    this.getFundList();
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  receivedChildTabNameHandler(tabName) {
    if (tabName.id === this.valuationType.Valuations) {
      if (this.selectedTab.id === this.valuationType.TradingComps) {
        this.childTabName = 'trading-valuations';
      }
      else if (this.selectedTab.id === this.valuationType.TransactionComps) {
        this.childTabName = 'transaction-valuations';
      }
    }
    else {
      this.childTabName = '';
    }
  }
  getFundList() {
    this._valuationService.getFundList().subscribe((result) => {
      let resp = result;
      if (resp != null) {
        this.fundList = resp;
      } else {
        this.fundList = undefined;
      }
    });
  }
  getCompanyList(fund: string) {
    this._valuationService.getCompanyList(fund).subscribe((result) => {
      let resp = result;
      if (resp != null) {
        this.companyList = resp;
      } else {
        this.companyList = undefined;
      }
    });
  }
  onFundSelection(prevState, currentStat) {
    this._valuationChangesGuard.canDeactivate(this).then((status: boolean) => {
      if (status) {
        this.selectedFund = currentStat.item;
        this.canDeactivateStatus = status;
        if (this.selectedFund != null && this.selectedFund.fundName != null) {
          this.selectedCompany = [];
          this.showTabs = false;
          this.childTabName = '';
          this.getCompanyByFund(this.selectedFund.fundId);
        }
      }
      else {
        this.selectedFund = prevState;
        this.childrenDdlComponent.first.writeValue(this.selectedFund);
      }
    });
  }
  getCompanyByFund(fundId: string) {
    this.getCompanyList(fundId);
  }
  onCompanySelection(prevState, currentStat) {
    this._valuationChangesGuard.canDeactivate(this).then((status: boolean) => {
      if (status) {
        this.selectedCompany = currentStat.item;
        this.canDeactivateStatus = status;
        if (
          this.selectedCompany != null &&
          this.selectedCompany.companyName != null
        ) {
          this.disableQuarterAndYear = false;
          this.showTabs = false;
          this.childTabName = '';
        }
      }
      else {
        this.selectedCompany = prevState;
        this.childrenDdlComponent.last.writeValue(this.selectedCompany);
      }
    });
  }
  quarterYearPicker(prevState: any, currentStat: any) {
    this._valuationChangesGuard.canDeactivate(this).then((status: boolean) => {
      this.QuarterAndYear = currentStat.quarter + " " + currentStat.year;
      this.changeDetectorRef.detectChanges();
      if (status) {
        this.canDeactivateStatus = status
        this.disableApply = false;
        this.qandyear = { quarter: currentStat.quarter, year: currentStat.year };
        this.showTabs = false;
        this.childTabName = '';
      }
      else {
        //reset to the previous value
        this.QuarterAndYear = prevState;
        this.changeDetectorRef.detectChanges();
      }

    });
  }
  onFundClear() {
    this.companyList = undefined;
    this.selectedCompany = undefined;
  }

  onApplyClick() {
    this.getTabs();
    this.showTabs = true;
  }
  getTabs() {
    if (this.tabList.length == 0) {
      this.tabList.push(
        {
          name: "Trading Comps",
          id: this.valuationType.TradingComps,
          isActive: true,
        },
        {
          name: "Transaction Comps",
          id: this.valuationType.TransactionComps,
          isActive: false,
        }
      );
      this.selectedTab = this.tabList[0];
    }
  }

  setTab(tab: any) {
    this._valuationChangesGuard.canDeactivate(this).then((status: boolean) => {
      if (status) {
        this.canDeactivateStatus = status
        this.selectedTab = tab;
        this._impliedService.setTransactionTabStateSubject(tab);
        this.tabList.forEach(tab => tab.isActive = false);
        tab.isActive = true;
        this.childTabName = '';
      }
    });

  }

}
