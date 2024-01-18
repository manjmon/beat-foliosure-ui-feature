import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ValuationType } from '../../shared/valuation-type.enum';
import { ValuationModelService } from '../../../../services/valuation-model.service';
import { ImpliedEvService } from "src/app/services/implied-ev.service";
import { ValuationCalclation } from "../../shared/valuation-calculation";
import { ValuationChangesGuard } from "../../shared/valuation-changes-guard";
import { ValuationComponentCanDeactivate } from 'src/app/unsaved-changes/can-deactivate/component-can-deactivate';
@Component({
  selector: 'app-transaction-comps',
  templateUrl: './transaction-comps.component.html',
  styleUrls: ['./transaction-comps.component.scss', '../../valuation-model/valuation-model.component.scss'],
  providers: [ValuationChangesGuard]
})
export class TransactionCompsComponent extends ValuationComponentCanDeactivate implements OnInit {
  isOpenUpload: boolean = false;
  @Input() fundDetails: any;
  @Input() companyDetails: any;
  @Input() QuarterAndYear: any;
  @Input() selectedKPIDropdown: any;
  @Output() childTabNameEvent = new EventEmitter();
  isLoading: boolean = true;
  rowDataTransComps: any = [];
  noDataFound: boolean = true;
  tabName: string = 'Deal Data';
  valueTypeList: any = [];
  selectedTab: any = null;
  valuationType: typeof ValuationType = ValuationType;
  valuationMultipleOptions: any = [];
  selectedValuationItem: any = {};
  canDeactivateStatus: boolean = true;
  subscriptions:  any = [];
  constructor(private _valuationService: ValuationModelService, private _impliedEvService: ImpliedEvService,
    private _valuationChangesGuard: ValuationChangesGuard) {
    super();
    this.subscriptions.push(this._valuationService.unsavedChanges$.subscribe((status: boolean) => {
      this.canDeactivateStatus = status
    }));
  }

  canDeactivate(): boolean {
    return this.canDeactivateStatus;
  }

  ngOnInit() {
    this.canDeactivateStatus=true;  
    this.getSubTabs();
    this.getRawDataTransComps();
  }
  ngOnDestroy(){
    // prevent memory leak when component destroyed
    this.subscriptions.forEach(s => s.unsubscribe());
 }
  closePopup() {
    this.isOpenUpload = false;
    this.noDataFound = true;
    this.tabName = 'Deal Data';
    this.selectValueTab(this.valueTypeList[0])
    this.getRawDataTransComps();
  }
  getSubTabs() {
    if (this.valueTypeList.length == 0) {
      this.valueTypeList.push(
        {
          name: "Deal Data",
          id: this.valuationType.DealData,
          isActive: true,
        },
        {
          name: "Financials",
          id: this.valuationType.Financials,
          isActive: false,
        },
        {
          name: "Valuations",
          id: this.valuationType.Valuations,
          isActive: false,
        }
      );
      this.selectedTab = this.valueTypeList[0];
    }
  }
  selectValueTab(tab: any) {
    this.valueTypeList.forEach((tab) => (tab.isActive = false));
    tab.isActive = true;
    this.tabName = tab.name;
    this.childTabNameEvent.emit(tab);
    this._impliedEvService.setInternalSelectedTabName(tab);
  }

  getRawDataTransComps() {
    this.isLoading = true
    const formData = new FormData();
    formData.append("fundId", this.fundDetails.fundId);
    formData.append("companyId", this.companyDetails?.companyId);
    formData.append("quarter", this.QuarterAndYear.quarter);
    formData.append("year", this.QuarterAndYear.year);
    formData.append("valuationTypeId", this.valuationType.TransactionComps.toString());

    this._valuationService.getValuationModel(formData).subscribe({next:(result: any) => {
      if (result?.value?.code !== 'NoContent') {
        this.isLoading = false
        this.rowDataTransComps = result.data;
        this._impliedEvService.setRawDataTradingComps(result.data);
        this._impliedEvService.setValuationId(result.valuationId, result.valuationReportId);
        this._impliedEvService.setUnselectedRecords(result.unselectedRows);
        if (this.rowDataTransComps.length > 0) {
          this.valuationMultipleOptions = [];
          this.rowDataTransComps[0].ValuationData.forEach((kpi: any) => {
            this.valuationMultipleOptions.push({
              displayName: kpi.KpiName,
              key: kpi.KpiName,
              kpiId: kpi.KpiId
            });
          });
          this.selectedValuationItem = this.valuationMultipleOptions[0];
          this.selectedKPIDropdown = this.valuationMultipleOptions[0];
        }
        this.noDataFound = false;
      } else {
        this.noDataFound = true;
        this.isLoading = false
      }
    },error: _error => {
      this.isLoading = false

    }});
  }

  changeKpi(event) {
    this._valuationChangesGuard.canDeactivate(this).then((status: boolean) => {
      if (status) {
        this.canDeactivateStatus = status;
        this.selectedKPIDropdown = event;
        let vals = ValuationCalclation.getfinancialkpi.find(f => f.kpiName == this.selectedKPIDropdown?.displayName);
        this._impliedEvService.setdropdownvalues(vals?.financial, this.selectedKPIDropdown.kpiId);
        localStorage.removeItem("tempEVData");
      }
      else{
        this.selectedValuationItem = this.selectedKPIDropdown ;
      }
    });
  }
}
