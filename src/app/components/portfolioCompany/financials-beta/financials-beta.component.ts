import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import {ErrorMessage, FinancialValueUnitsEnum, FxRates, MiscellaneousService, OrderTypesEnum, PeriodTypeEnum, PeriodType } from 'src/app/services/miscellaneous.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ActivatedRoute } from "@angular/router";
import { CurrencyService } from 'src/app/services/currency.service';
import { MatMenu,MatMenuTrigger } from '@angular/material/menu';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: "app-financials-beta",
  templateUrl: "./financials-beta.component.html",
  styleUrls: ["./financials-beta.component.scss"],
})
export class FinancialsBetaComponent implements OnInit, AfterViewInit {
  @ViewChild("menutabs") el: ElementRef;
  @Input() masterModel: any = {};
  @Input() pcCompanyId: any = 0;
  @Input() reportingCurrencyCode: any = "";
  @Input() companyName: any = "";
  @Input() subHeaderName: any = "";
  tabName: string = "";
  tabList: ITab[] = [];
  id: any;
  portfolioCompanyID: any;
  selectedCurrencyCode = "";
  model: any = {
    isAscending: false,
    portfolioCompany: {
      portfolioCompanyID: 0,
      companyName: null,
      companyCurrency: null,
    },
    subTabName:"Actual",
    selectionChange: null,
  };
  @ViewChild("menu") uiuxMenu!: MatMenu;
  @ViewChild("filterMenuTrigger") menuTrigger: MatMenuTrigger;
  @Input() selectedtab: string;
  selectedtabclone: string;
  @ViewChild("periodList") periodList;
  @ViewChild("myCalendar") datePicker;
  @ViewChild("currencyUnit") currencyUnittag;
  isSection: string = "financial";
  isChildtab: boolean = true;
  isLogs: boolean = false;
  isDownload: boolean = false;
  ErrorNotation: boolean = false;
  isReportingCurrency: boolean = true;
  periodTypes: any;
  orderType: any;
  decimalType: any;
  today: Date;
  yearRange: any;
  minDate: Date | null = null;
  dateRange: any[];
  en: any;
  isCustom: boolean = false;
  isdate: boolean = false;
  yearOptions: any = [];
  CurrencyList: any[] = [];
  periodErrorMessage: any = "";
  quarterOptions: any = [
    { value: "Q1", text: "Q1", number: 1 },
    { value: "Q2", text: "Q2", number: 2 },
    { value: "Q3", text: "Q3", number: 3 },
    { value: "Q4", text: "Q4", number: 4 },
  ];
  fxRatesList = [
    {
      id: FxRates.SystemAPI,
      type: FxRates[FxRates.SystemAPI],
    },
    {
      id: FxRates.BulkUpload,
      type: FxRates[FxRates.BulkUpload],
    },
  ];
  unitTypeList = [
    {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    },
    {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands],
    },
    {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    },
    {
      typeId: FinancialValueUnitsEnum.Billions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Billions],
    },
  ];
  KpiValueUnit: { typeId: FinancialValueUnitsEnum; unitType: string };
  tabValueTypeList: any = [];
  selectedPeriodType:number=PeriodType.Monthly;
  isMonthly:boolean = true;
  isQuarterly:boolean = false;
  isAnnually:boolean = false;
  isSubmit:boolean = false;
  constructor(
    private miscService: MiscellaneousService,
    private currencyService: CurrencyService,
    private portfolioCompanyService: PortfolioCompanyService,
    protected changeDetectorRef: ChangeDetectorRef,
    private _avRoute: ActivatedRoute
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.setDefaultModelValue();
  }
  getValueTypeTabList() {
    this.portfolioCompanyService.getfinancialsvalueTypes().subscribe((x) => {
      this.tabValueTypeList = x.body?.financialTypesModelList;
      this.tabValueTypeList[0].active = true;
      this.model.subTabName = this.tabValueTypeList[0].name;
    });
    delete this.model["currencyCode"];
    window.addEventListener("scroll", this.scrollEvent, true);
  }
  ngOnInit() {
    this.selectedCurrencyCode = this.reportingCurrencyCode;
    this.getTabList();
    this.getValueTypeTabList();
    this.KpiValueUnit = {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands],
    };
    this.portfolioCompanyID = this.pcCompanyId;
    this.model.portfolioCompany.portfolioCompanyID = this.pcCompanyId;
    this.model.portfolioCompany.companyName = this.companyName;
    this.model.portfolioCompany.companyCurrency = this.reportingCurrencyCode;
    this.selectedCurrencyCode = this.reportingCurrencyCode;
    window.addEventListener("scroll", this.scrollEvent, true);
  }
  ngAfterViewInit() {
    if (this.uiuxMenu != undefined) {
      (this.uiuxMenu as any).closed = this.uiuxMenu.closed
      this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  getTabList() {
    this.portfolioCompanyService
      .getMasterKPITabs("Financials")
      .subscribe((x) => {
        this.tabList = x.body.kpiListModel;
        if (this.tabList.length > 0) {
          this.tabName = this.tabList[0].name;
          this.tabList[0].active = true;
        }
      });
  }
  changesCurrency(event) {
    this.selectedCurrencyCode = event?.value?.currencyCode;
  }
  selectValueTab(tab: any) {
    this.tabValueTypeList.forEach((tab) => (tab.active = false));
    tab.active = true;
    this.model.subTabName = tab.name;
    this.model.subAliasTabName = tab.alias;
    this.model.selectionChange = "tab";
    if(tab?.name == "IC")
    {
      this.setValueType({
        isMonthly:false,
        isQuarterly:false,
        isAnnually:true
      });
    }
  }
  setValueType(valueType:any)
  {
    this.isMonthly =valueType.isMonthly;
    this.isQuarterly =valueType.isQuarterly;
    this.isAnnually =valueType.isAnnually;
    let type="";
    if (this.isMonthly) 
      type = "isMonthly";
    if (this.isQuarterly) 
      type = "isQuarterly";
    if (this.isAnnually) 
      type = "isAnnually";
    this.setPeriodType(type);
  }
  setDefaultModelValue() {
    let year = new Date();
    this.today = new Date(year.setFullYear(year.getFullYear() + 10));
    this.yearRange = "2000:" + year.getFullYear();
    this.periodTypes = [
      { type: PeriodTypeEnum.Last3Month },
      { type: PeriodTypeEnum.Last6Month },
      { type: PeriodTypeEnum.YearToDate },
      { type: PeriodTypeEnum.Last1Year },
      { type: PeriodTypeEnum.DateRange },
    ];
    if (this.isSection.toLocaleLowerCase() != "financial") {
      this.periodTypes.push({ type: "Custom" });
    }
    this.orderType = [
      { type: OrderTypesEnum.LatestOnLeft },
      { type: OrderTypesEnum.LatestOnRight },
    ];
    this.model.orderType = [{ type: OrderTypesEnum.LatestOnLeft }];
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    this.model.decimalType = 0;
    this.model.fxRates = {
      id: FxRates.SystemAPI,
      type: FxRates[FxRates.SystemAPI],
    };
    this.model.currecyUnit = {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands],
    };
    this.yearOptions = this.miscService.bindYearList();
    this.getCurrencyLists();
  }
  onCurrencyChange(e) {
    this.isReportingCurrency = true;
    if (this.reportingCurrencyCode != e.value.currencyCode)
      this.isReportingCurrency = false;
  }
  scrollEvent = (event: any): void => {
    if (this.isdate) {
      this.datePicker.showOverlay();
      event.stopPropagation();
      let ui = this.datePicker?.nativeElement
        ?.querySelector(".p-datepicker-monthpicker ")
        .setStyle("top", "unset");
      if (ui) this.datePicker.setStyle(ui, "top", "unset");
    }
  };
  configureMenuClose(old: MatMenu["close"]): MatMenu["close"] {
    const upd = new EventEmitter();
    feed(
      upd.pipe(
        filter((event) => {
          if (event === "click") {
            return false;
          }
          return true;
        })
      ),
      old
    );
    return upd;
  }
  getCurrencyLists() {
    this.currencyService
      .getAllCurrencies()
      .subscribe((result) => {
        let resp = result;
        if (resp != undefined && resp.code == "OK") {
          this.CurrencyList = resp.body;
          let CurrencyCode = this.CurrencyList.filter(
            (x) => x.currencyCode === this.reportingCurrencyCode.trim()
          )[0];
          if(CurrencyCode!=undefined)
            this.model.currencyCode = CurrencyCode;
        }
      });
  }
  onFxRateSourceChange() {

  } 
  onPeriodChange(e) {
    this.isCustom = false;
    this.isdate = false;
    if (e.value.type == "Date Range") {
      this.model.startPeriod = null;
      this.isdate = true;
    }
  }
  onSubmit() {
    this.model.selectionChange = "filter";
    this.isdate = false;
    this.menuTrigger.closeMenu();
    if(this.model.periodType?.type=='Date Range' && (this.model.startPeriod == null || this.model.startPeriod == undefined))
    {
      return;
    }
    this.isSubmit = this.isSubmit ? false : true;
  }
  closeMenu() {
    this.menuTrigger.closeMenu();
  }
  export() {
    this.model.selectionChange = "export";
    this.isDownload = true;
  }
  formReset(from: any) {
    from.resetForm();
    this.resetInit();
    this.getCurrencyLists();
  }
  resetInit() {
    this.model.orderType = [{ type: OrderTypesEnum.LatestOnLeft }];
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    this.model.decimalType = 0;
    this.model.fxRates = {
      id: FxRates.SystemAPI,
      type: FxRates[FxRates.SystemAPI],
    };
    this.model.currecyUnit = {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands],
    };
  }
  validateKPIPeriod(form: any, model: any) {
    if (
      model.startPeriod != undefined &&
      model.startPeriod.length > 1 &&
      model.startPeriod[0] != null &&
      model.startPeriod[1] != null
    ) {
      this.datePicker.overlayVisible = false;
      this.datePicker.datepickerClick = true;
      if (model.startPeriod[0] > model.startPeriod[1]) {
        this.periodErrorMessage = ErrorMessage.StartDateLessThanEndDate;
      } else {
        this.periodErrorMessage = "";
      }
    }
  }
  onChangePeriodOption(type) {
    this.setPeriodType(type);
    this.model.selectionChange = "tab";
  }
  setPeriodType(type)
  {
    if (type == "isMonthly") {
      this.selectedPeriodType =  PeriodType.Monthly;
      this.isMonthly = true;
      this.isQuarterly = false;
      this.isAnnually = false;
    } else if (type == "isQuarterly") {
      this.selectedPeriodType =  PeriodType.Quarterly;
      this.isMonthly = false;
      this.isQuarterly = true;
      this.isAnnually = false;
    } else {
      this.selectedPeriodType =  PeriodType.Annually;
      this.isMonthly = false;
      this.isQuarterly = false;
      this.isAnnually = true;
    }
  }
  selectTab(tab: ITab) {
    this.tabList.forEach((tab) => (tab.active = false));
    tab.active = true;
    this.onTabClick(tab);
    this.tabName = tab.name;
    this.model.selectionChange = "tab";
    this.resetTab();
  }
  resetTab()
  {
    this.selectValueTab(this.tabValueTypeList[0]);
    this.onChangePeriodOption('isMonthly');
  }
  onTabClick(tab: ITab) {
    if (tab != null || tab != undefined) {
      this.isDownload = false;
      this.tabName = tab.name;
      this.model = { ...this.model };
    }
  }
  isDownloading(exportProfitLoading) {
    this.isDownload = exportProfitLoading;
  }
  handleChange(e) {
    this.ErrorNotation = e.checked;
  }
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}