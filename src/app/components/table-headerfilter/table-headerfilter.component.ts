import { ViewChild, Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef, OnChanges } from '@angular/core';
import {
  ErrorMessage,
  MiscellaneousService,
  OrderTypesEnum,
  PeriodTypeEnum,
  FinancialValueUnitsEnum,
  FxRates
} from "../../services/miscellaneous.service";
import { CurrencyService } from "src/app/services/currency.service";
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
const DEFAULT_DURATION = 300;
@Component({
  selector: 'tableheader-filters',
  templateUrl: './table-headerfilter.component.html',
  styleUrls: ['./table-headerfilter.component.scss']
})
export class TableheaderfilterComponent implements OnInit, OnChanges {
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('filterMenuTrigger') menuTrigger: MatMenuTrigger; 
  @Input() selectedtab: string;
  selectedtabclone: string;
  @ViewChild('periodList') periodList;
  @ViewChild('myCalendar') datePicker;
  @ViewChild('currencyUnit') currencyUnittag;
  @Input() isSection: string = "financial";
  @Input() isChildtab: boolean = true;
  @Input() isSearch: boolean = false;
  @Input() isdecimals: boolean = false;
  @Input() isLogs: boolean = false;
  @Input() tabname: string;
  @Input() companyReportingCurrencyCode: any = "";
  @Output() onSubmitEmitter = new EventEmitter<any>();
  @Input() tabName: string = "";
  @Output() onChangeOption = new EventEmitter<any>();
  isDownload: boolean = false;
  isReportingCurrency: boolean = true;
  periodTypes: any;
  orderType: any;
  decimalType: any;
  today: Date;
  yearRange: any;
  minDate: Date | null = null;
  @Input() companymodel: any = {};
  model: any = { selectionChange: {} };
  dateRange: any[];
  en: any;
  iscustom: boolean = false;
  isdate: boolean = false;
  yearOptions: any = [];
  CurrencyList: any[] = [];
  periodErrorMessage: any = "";
  ismatmenu:boolean=true;
  @Input() isMonthly = true;
  @Input() isQuarterly = false;
  @Input() isAnnually = false;
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
    }
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
  tabList: any = [];
  getTabList() {
    this.portfolioCompanyService.getfinancialsvalueTypes().subscribe(x => {
      this.tabList = x.body?.financialTypesModelList;
      if(this.tabList?.length > 0)
        this.tabList[0].active = true;
    });
  }
  selectTab(tab: any) {
    this.tabList.forEach(tab => tab.active = false);
    tab.active = true;
    this.model.selectionChange = "tab";
    localStorage.setItem("resetSubTabs", "1");
    this.model.subtabname = tab.name;
    this.model.subAliasTabName = tab.alias;
    this.onSubmitEmitter.emit(this.model);
  }

  onChangePeriodOption(type){
    if(type == "isMonthly"){
      this.isMonthly = true;
      this.isQuarterly = false;
      this.isAnnually = false;
    } else if(type == "isQuarterly"){
      this.isMonthly = false;
      this.isQuarterly = true;
      this.isAnnually = false;
    } else{
      this.isMonthly = false;
      this.isQuarterly = false;
      this.isAnnually = true;
    }
     this.onChangeOption.emit(type);
  }
  ngDoCheck() {
    if (localStorage.getItem("setIsDownload") && localStorage.getItem("setIsDownload") == "0"){
      this.isDownload = false;
    }
  }

  ngOnChanges(changes:any) {
    if (localStorage.getItem("resetSubTabs") == "0") {
      for (let i = 0; i < this.tabList.length; i++) {
        this.tabList[i].active = false;
      }
      if(this.tabList?.length > 0)
      {
        this.model.subtabname = this.tabList[0]?.name;
        this.tabList[0].active = true;
        this.selectTab(this.tabList[0]);
      }
    }
  }
  constructor(
    private currencyService: CurrencyService,
    private portfolioCompanyService: PortfolioCompanyService,
    protected changeDetectorRef: ChangeDetectorRef,
    private miscService: MiscellaneousService,
  ) {
    let year = new Date();
    this.today =new Date(year.setFullYear(year.getFullYear() + 10));
    this.yearRange = "2000:" + year.getFullYear();
    this.periodTypes = [
      { type: PeriodTypeEnum.Last3Month },
      { type: PeriodTypeEnum.Last6Month },
      { type: PeriodTypeEnum.YearToDate },
      { type: PeriodTypeEnum.Last1Year },
      { type: PeriodTypeEnum.DateRange }
    ];
    if (this.isSection.toLocaleLowerCase() != "financial") {
      this.periodTypes.push({ type: "Custom" })
    }
    this.orderType = [{ type: OrderTypesEnum.LatestOnLeft }, { type: OrderTypesEnum.LatestOnRight }];
    this.model.orderType = [{ type: OrderTypesEnum.LatestOnLeft }];
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    this.model.decimalType = 0;
    this.model.fxRates = { id: FxRates.SystemAPI, type: FxRates[FxRates.SystemAPI] };
    this.model.currecyUnit = {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands]
    };
    this.yearOptions = this.miscService.bindYearList();
    this.getCurrencyLists("");
    this.getTabList();
  }
  onCurrencyChange(e) {
    this.isReportingCurrency = true;
    if (this.companyReportingCurrencyCode != e.value.currencyCode)
      this.isReportingCurrency = false;

  }
  ngOnInit(): void {
    this.model.selectionChange = "load";
    this.model.portfolioCompany = this.companymodel.portfolioCompany;
    delete this.model["currencyCode"];
    window.addEventListener('scroll', this.scrollEvent, true);
  }
  scrollEvent = (event: any): void => {
    if (this.isdate) {
      this.datePicker.showOverlay();
      event.stopPropagation();
      let ui = this.datePicker?.nativeElement?.querySelector(".p-datepicker-monthpicker ").setStyle("top", "unset");
      if (ui)
        this.datePicker.setStyle(ui, "top", "unset");
    }
  }
  ngAfterViewInit() {  
    if (this.uiuxMenu != undefined) {
      (this.uiuxMenu as any).closed = this.uiuxMenu.closed
      this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
   configureMenuClose(old: MatMenu['close']): MatMenu['close'] {
    const upd = new EventEmitter();
    feed(upd.pipe(
      filter(event => {
        if (event === 'click') {
          return false;
        }
        return true;
      }),
    ), old);
    return upd;
  }
  getCurreny(){
    this.currencyService
    .getAllCurrencies()
    .subscribe((result) => {
      let resp = result;
      if (resp != undefined && resp.code == "OK") {
        this.CurrencyList = resp.body;
        this.model.currencyCode = this.CurrencyList.filter(x => x.currencyCode === this.companyReportingCurrencyCode.trim())[0];
      }
    });
  }
  getCurrencyLists(fromCurrency) {
    this.currencyService
      .GetToCurrenciesByFromCurrency(fromCurrency)
      .subscribe((result) => {
        let resp = result;
        if (resp != undefined && resp.code == "OK") {
          this.CurrencyList = resp.body;
          let CurrencyCode = this.CurrencyList.filter(x => x.currencyCode === this.companyReportingCurrencyCode.trim())[0];
          if(CurrencyCode == undefined)
            this.getCurreny();
          this.model.currencyCode = CurrencyCode;
        }
      });
  }
  onFxRateSourceChange() {
    if (this.model.fxRates.type === "BulkUpload") {
      this.getCurrencyLists(this.companyReportingCurrencyCode);
    } else {
      this.getCurrencyLists("");
    }
  }

  onPeriodChange(e) {
    this.iscustom = false;
    this.isdate = false;
    if (e.value.type == "Custom")
      this.iscustom = true;
    if (e.value.type == "Date Range")
      this.isdate = true;
  }
  onSubmit() {
    this.model.selectionChange = "filter";    
    this.onSubmitEmitter.emit(this.model);
    this.ismatmenu=false;
    this.ismatmenu=true;
    this.isdate = false;
    this.menuTrigger.closeMenu();
  }
  
  closeMenu() {
    this.menuTrigger.closeMenu();
  }
  export() {
    this.isDownload = true;
    localStorage.setItem("setIsDownload","1");
    localStorage.setItem("resetSubTabs","1"); 
    this.model.selectionChange = "export";
    this.onSubmitEmitter.emit(this.model);
  }
  removeandAdd_Model() {
    let periodType = this.model.periodType;
    delete this.model["periodType"];
    let currencyCode = this.model.currencyCode;
    delete this.model["currencyCode"];
    let fxRates = this.model.fxRates;
    delete this.model["fxRates"];
    let currecyUnit = this.model.currecyUnit;
    delete this.model["currecyUnit"];
    this.model.currecyUnit = currecyUnit;
    this.model.fxRates = fxRates;
    this.model.currencyCode = currencyCode;
    this.model.periodType = periodType;
  }

  formreset(from: any) {
    from.resetForm();
    this.resetinit();
    this.getCurrencyLists("");
    this.onSubmitEmitter.emit(this.model);

  }
  resetinit() {
    this.model.orderType = [{ type: OrderTypesEnum.LatestOnLeft }];
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    this.model.decimalType = 0;
    this.model.fxRates = { id: FxRates.SystemAPI, type: FxRates[FxRates.SystemAPI] };
    this.model.currecyUnit = {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands]
    };
  }
  validateKPIPeriod(form: any, model: any) {
    if (model.startPeriod != undefined && model.startPeriod.length > 1 && model.startPeriod[0] != null && model.startPeriod[1] != null) {
      this.datePicker.overlayVisible = false;
      this.datePicker.datepickerClick = true;
      if (model.startPeriod[0] > model.startPeriod[1]) {
        this.periodErrorMessage = ErrorMessage.StartDateLessThanEndDate;
      } else {
        this.periodErrorMessage = "";
      }
    }
  }
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe(
    data => to.next(data),
    err => to.error(err),
    () => to.complete(),
  );
}