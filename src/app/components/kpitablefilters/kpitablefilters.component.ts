import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';

import {  
  FinancialValueUnitsEnum,
  MiscellaneousService,
  OrderTypesEnum,
  PeriodTypeEnum,
} from "../../services/miscellaneous.service";
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {PeriodTypeFilterOptions } from "src/app/common/constants";
import { Subject } from 'rxjs';
const DEFAULT_DURATION = 300;
@Component({
  selector: 'app-kpitablefilters',
  templateUrl: './kpitablefilters.component.html',
  styleUrls: ['./kpitablefilters.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class KpitablefiltersComponent implements OnInit {
  @Output() Kpifilter = new EventEmitter<any>();
  @Output() Valuesfilter = new EventEmitter<any>();
  @Input()
  parentSubject: Subject<any>;
  periodTypes: any;
  collapsed = false;
  orderType: any;
  decimalType: any;
  today: Date;
  yearRange: any;
  minDate: Date | null = null;
  model: any = {};
  dateRange: any[];
  en: any;
  @Input() typeField: string;
  @Input() tabname: string;
  iscustom: boolean = false;
  isdate: boolean = false;
  yearOptions: any = [];
  filterTabNames = new Set(["Trading", "Operational", "Company"]);
  quarterOptions: any = [
    { value: "Q1", text: "Q1", number: 1 },
    { value: "Q2", text: "Q2", number: 2 },
    { value: "Q3", text: "Q3", number: 3 },
    { value: "Q4", text: "Q4", number: 4 },
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
  investmentKpiValueUnit: any;
  isMatMenu:boolean=true;
  @ViewChild('myCalendar') datePicker;
  @Input() isDefaultMillion = false;
  @Input() defaultUnitType :number = FinancialValueUnitsEnum.Millions;
  constructor(private datePipe: DatePipe,
    private miscService: MiscellaneousService) {
    let year = new Date();
    this.today = year;
    this.yearRange = "2000:" + year.getFullYear();
    this.onLoadPeriodTypes();
    this.orderType = [{ type: OrderTypesEnum.LatestOnLeft }, { type: OrderTypesEnum.LatestOnRight }];
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    this.model.orderType = { type: OrderTypesEnum.LatestOnLeft };
    this.intilizedates();
    this.model.decimalType = 0;
    this.calenderbuttons();
    this.yearOptions = this.miscService.bindYearList();
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    };
  }
onLoadPeriodTypes=()=>{
  this.periodTypes = [
    { type: PeriodTypeEnum.Last3Month },
    { type: PeriodTypeEnum.Last6Month },
    { type: PeriodTypeEnum.YearToDate },
    { type: PeriodTypeEnum.Last1Year },
    { type: PeriodTypeEnum.DateRange },
    { type: "Custom" }
  ];
}
filterPeriodTypes=()=> {
  if (this.typeField == PeriodTypeFilterOptions.Monthly ||this.typeField == PeriodTypeFilterOptions.Quarterly || this.typeField == PeriodTypeFilterOptions.Annual) {
    const unwantedPeriodTypes = [PeriodTypeEnum.Last3Month, PeriodTypeEnum.Last6Month, PeriodTypeEnum.YearToDate];
    this.periodTypes = this.periodTypes.filter((item) => !unwantedPeriodTypes.includes(item.type));
  }
}
  onSubmit(event) {
    if( event.submitter.name == "Save" ){
    let searchFilter = {
      sortOrder: null,
      periodType: this.model.periodType.type,
      startPeriod: this.model.fromDate == undefined ? "" : this.model.fromDate,
      endPeriod: this.model.toDate == undefined ? "" : this.model.toDate,
      FromQuarter: this.model.fromQuarter == undefined ? "" : this.model.fromQuarter.value,
      FromYear: this.model.fromYear == undefined ? "" : this.model.fromYear.value,
      ToQuarter: this.model.toQuarter == undefined ? "" : this.model.toQuarter.value,
      ToYear: this.model.toYear == undefined ? "" : this.model.toYear.value,
      UnitType:this.investmentKpiValueUnit
    };
    if (this.model.periodType.type == "Date Range")
      this.validateKPIPeriod(this.model);
    if (this.periodErrorMessage == "")
    { 
      this.Kpifilter.emit(searchFilter);
      this.convertUnitType();
      this.isMatMenu=false;
      this.isMatMenu=true;
    }
  }
  if( event.submitter.name == "Reset" ){
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    this.model.UnitType=this.investmentKpiValueUnit;   
    this.investmentKpiValueUnit= this.isDefaultMillion ? this.unitTypeList[2] : this.unitTypeList.find(x=> x.typeId == this.defaultUnitType);    
    this.minDate = null;
    this.periodErrorMessage = "";
    let searchFilter = {
      sortOrder: null,
      periodType: this.model.periodType.type,
      startPeriod: this.model.fromDate == undefined ? "" : this.model.fromDate,
      endPeriod: this.model.toDate == undefined ? "" : this.model.toDate,
      FromQuarter: this.model.fromQuarter == undefined ? "" : this.model.fromQuarter.value,
      FromYear: this.model.fromYear == undefined ? "" : this.model.fromYear.value,
      ToQuarter: this.model.toQuarter == undefined ? "" : this.model.toQuarter.value,
      ToYear: this.model.toYear == undefined ? "" : this.model.toYear.value,
      UnitType:this.investmentKpiValueUnit
    };
    this.Kpifilter.emit(searchFilter);
    this.convertUnitType();
  }
  }
  fromQuaterevent(event) {

    this.checkvalidation_Qauter_Year(this.model);
  }
  toQuaterevent(event) {
    this.checkvalidation_Qauter_Year(this.model);
  }
  fromYearevent(ev) {
    this.checkvalidation_Qauter_Year(this.model);
  }
  toYearevent(ev) {
    this.checkvalidation_Qauter_Year(this.model);
  }
  checkvalidation_Qauter_Year(model: any) {
    this.periodErrorMessage = "";
    let FromQuarter = this.model.fromQuarter == undefined ? "" : this.model.fromQuarter.number;
    let FromYear = this.model.fromYear == undefined ? "" : this.model.fromYear.value;
    let lToQuarter = this.model.toQuarter == undefined ? "" : this.model.toQuarter.number;
    let ToYear = this.model.toYear == undefined ? "" : this.model.toYear.value;
    if (FromYear != "" && ToYear != "") {
      if (FromYear > ToYear) {
        this.periodErrorMessage = "Invalid Period Range! FromYear cannot be after ToYear!"
      }
      if (FromYear == ToYear) {
        if (FromQuarter > lToQuarter)        
          this.periodErrorMessage = "Invalid period range! To quarter cannot be less than from quarter"
      }

    }
  }

  intilizedates() {
    let lastSixthMonthDate = new Date();
    lastSixthMonthDate.setDate(1);
    lastSixthMonthDate.setMonth(lastSixthMonthDate.getMonth() - 6);
  }
  toggle() {
    this.collapsed = !this.collapsed;
  }
  expand() {
    this.collapsed = false;
  }
  collapse() {
    this.collapsed = true;
  }
  calenderbuttons() {
    this.en = {
      firstDayOfWeek: 0,
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: 'Today',
      clear: 'Clear'
    };
  }
  ngOnInit(): void {
    this.periodErrorMessage="";
    this.investmentKpiValueUnit= this.isDefaultMillion ? this.unitTypeList[2] : 
                                   this.unitTypeList.find(x=> x.typeId == this.defaultUnitType);
    this.setobjectperiodtype(this.tabname);
  }


  setobjectperiodtype(tabname: any) {
    this.periodErrorMessage="";
    if (tabname == "Company"||tabname == "Trading" ||tabname == "Operational" ) {
      this.periodTypes = this.periodTypes.filter((item) => item.type !== 'Custom');
      const exits = this.periodTypes.filter(S => S.type == "Date Range");
      if (exits.length == 0) {
        this.periodTypes.push({ type: PeriodTypeEnum.Last3Month });
        this.periodTypes.push({ type: PeriodTypeEnum.Last6Month });
        this.periodTypes.push({ type: PeriodTypeEnum.YearToDate });
        this.periodTypes.push({ type: PeriodTypeEnum.DateRange });
      }
    } else {
      const exits = this.periodTypes.filter(S => S.type == "Custom");
      if (exits.length == 0) {
        this.periodTypes.push({ type: "Custom" });
      }
      this.periodTypes = this.periodTypes.filter((item) => item.type !== 'Date Range');
      this.periodTypes = this.periodTypes.filter((item) => item.type !== "3M (Last 3 months)");
      this.periodTypes = this.periodTypes.filter((item) => item.type !== "6M (Last 6 months)");
      this.periodTypes = this.periodTypes.filter((item) => item.type !== "YTD (Year to Date)");
    }
    this.model={};
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
  }
  converttransformDate(date) {
    return this.datePipe.transform(date, 'MM/yyyy');
  }
  resetForm(form: any) {
    form.resetForm();
    this.minDate = null;
    this.periodErrorMessage = "";
    this.model.periodType = { type: PeriodTypeEnum.Last1Year };
    this.Kpifilter.emit(null);
    localStorage.setItem("searchFilter", null);
    this.investmentKpiValueUnit = this.isDefaultMillion ? this.unitTypeList[2] : this.unitTypeList.find(x=> x.typeId == this.defaultUnitType);
    this.convertUnitType();
    
  }
  onPeriodChange(event) {
    this.periodErrorMessage = "";
    this.iscustom = false;
    this.isdate = false;
    this.model.periodType = event.value;
    if (event.value.type == "Date Range")
      this.isdate = true;
    if (event.value.type == "Custom")
      this.iscustom = true;
  }
  fromchangeSelect(ev) {
    this.onDateSelect(null);
  }
  onDateSelect(event:any) {
    this.model.fromDate = null;
    this.model.toDate = null;
    if (this.dateRange.length > 0) {
      this.model.fromDate = this.dateRange[0];
      this.model.toDate = this.dateRange[1];
      if(this.model.toDate!=null)
        this.datePicker.overlayVisible = false;
    }
    if (this.model.periodType.type == "Date Range")
      this.validateKPIPeriod(this.model);
    else
      this.periodErrorMessage = "";
  }

  validateKPIPeriod(model: any) {
    this.periodErrorMessage = "";
    if (model.fromDate == null || model.toDate == null) {
      this.periodErrorMessage = "Select Date..!";
    }
  }

  onDateClear() {
    this.minDate = null;
    this.model.fromDate = null;
    this.model.toDate = null;
  }

  periodErrorMessage: string = "";

  tochangeSelect(ev) {
    this.model.toDate = ev;
  }
  convertUnitType() {
    this.Valuesfilter.emit(this.investmentKpiValueUnit);
  }
  ngOnChanges() {
    if (this.filterTabNames.has(this.tabname)) {
      this.filterPeriodTypes();
    }
  }
}


