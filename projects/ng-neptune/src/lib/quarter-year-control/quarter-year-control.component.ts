import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  ElementRef,
  Output, EventEmitter,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener,
  SimpleChanges,
} from "@angular/core";
import { Dropdown } from "primeng/dropdown";

import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { timeHours } from "d3";
import { element } from "protractor";
export const USER_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QuarterYearControlComponent),
  multi: true,
};


@Component({
  selector: "quarter-year-control",
  templateUrl: "./quarter-year-control.component.html",
  styleUrls: ["./quarter-year-control.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [USER_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class QuarterYearControlComponent implements OnInit {

  @ViewChild('dropdown') dropdown: Dropdown;
  @ViewChild("block") ElementRef: ElementRef;
  @HostListener("window:scroll", [])
  @Input() isRequired: boolean = false;
  @Input() placeHolder: any ='Select quarter & year';
  @Input() width: any=240;
  @Input() ControlName: any;
  @Input() QuarterYear:string="";
  @Output() onCalendarYearPicked = new EventEmitter<any>();
  calendarYear: any[];
  showHideYearModal: boolean =false;
  allYears: any = [];
  showDropDown:boolean = false;
  disabledNextYear: boolean;
  startYear:any =  1987;
  selectedYear:any = new Date().getFullYear();
  lastYear:any =  new Date().getFullYear();
  enableInitButton: boolean = false;
  initialInput:boolean = true;
  enableModalTop: boolean = false;
  @Input() isReLoad:boolean = false;
  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    this.calendarYear = [
      {
        year: null,
        quarter: "",
      }
    ];
    this.allYears = [
        [{year:2011},{year:2015},{year:2019}],
        [{year:2012},{year:2016},{year:2020}],
        [{year:2013},{year:2017},{year:2021}],
        [{year:2014},{year:2018},{year:2022}]
      ]
  }
  
  @HostListener('window:click', ['$event.target'])
    onClick(targetElement: any) {
    if(targetElement.matches('.'+this.ControlName)){
            if(this.showDropDown){
              this.showDropDown = true;
            }else{
              this.showDropDown = false;
        }
    }
    else{
      if(this.calendarYear != undefined && this.calendarYear.length != 0 && this.calendarYear[0]?.quarter == ""){
          this.calendarYear[0].year = "";
          this.initialInput = true;
          this.enableInitButton = false;
          this.selectedYear = new Date().getFullYear();
      }
        this.showDropDown = false;
        this.showHideYearModal=false;
    }
  }
  ngOnInit() {
    this.onLoad();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes["QuarterYear"])
      this.onLoad();
    if (changes["isReLoad"])
      this.reLoadChange();
  }
  reLoadChange() {
    this.placeHolder ='Select quarter & year';
    this.initialInput = true;
    this.calendarYear = [
      {
        year: null,
        quarter: "",
      }
    ];
  }
  onLoad(){
    if (this.QuarterYear?.length > 0) {
      this.selectedYear = this.QuarterYear.split(' ')[1];
      this.calendarYear[0].year =this.QuarterYear.split(' ')[1];
      this.calendarYear[0].quarter = this.QuarterYear.split(' ')[0];
      this.enableInitButton = true;
      this.initialInput = false;
    }
  }
  showHideButton(initialInput:boolean,event:any){
    var body = document.body,
    html = document.documentElement;
    var height = Math.max( body.scrollHeight, body.offsetHeight,html.clientHeight, html.scrollHeight, html.offsetHeight );
    var scrollY = event.target.getClientRects()[0].y;
    if ((250 + scrollY) >= height) {
      this.enableModalTop = true;
  }else{
    this.enableModalTop = false;
  }

    if(initialInput){
      this.initialInput =false;
      this.showDropDown = true;
    }else{
      this.initialInput =true;
      this.enableInitButton = true;
      //this.showDropDown = true;
    }
    return this.showDropDown
  }
  showHideModal(showDropDown:boolean,event:any){
    
    if(this.calendarYear[0]?.year != null){
      this.enableInitButton = true;
    }
    if(showDropDown){
      this.showDropDown =false;
    }else{
      this.showDropDown =true;
    }
    return this.showDropDown
  }
  showHideYear(showHideYearModal: any,event){
    if(showHideYearModal){
      this.showHideYearModal = false;
    }else{
      this.showHideYearModal = true;
    }
  }

  selectQuarter(quarter:any){
    this.calendarYear[0].year = this.selectedYear;
    this.calendarYear[0].quarter = quarter;
    this.enableInitButton = true;
    this.showDropDown=false;
     if(this.calendarYear.length>0){
      this.onCalendarYearPicked.emit(this.calendarYear[0]);
     }
  }
  selectYear(year:any,event:any){
    this.calendarYear[0].year = year;
    this.enableInitButton = true;
    this.selectedYear = year;
    this.showHideYearModal = false;
    if(this.calendarYear.length>0){
      this.onCalendarYearPicked.emit(this.calendarYear[0]);
     }
  }

  calendarAllYear(arrow:any){
    if(this.allYears && this.allYears.length > 0){
      if(arrow == 'left'){
        if(this.startYear < this.allYears[0][0].year){
          for (let i = 0; i < this.allYears.length; i++) {
            for (let j = 0; j < this.allYears[i].length; j++) {
              const previousYear = parseInt(this.allYears[i][j].year) - 12;
              this.allYears[i][j].year = previousYear;
            }
          }
        }
      }else{
        if(this.lastYear > this.allYears[3][2].year){
          for (let i = 0; i < this.allYears.length; i++) {
            for (let j = 0; j < this.allYears[i].length; j++) {
              const nextYear = parseInt(this.allYears[i][j].year) + 12;
              this.allYears[i][j].year = nextYear;
            }
          }
        }
      }
    }else{
    }

  }
  
  nextPreviousYear(arrow:any,yearType:any){
    if (yearType == 'allYear') {
      this.calendarAllYear(arrow);
    } else {
      if (arrow == 'left') {
        if(this.startYear < this.selectedYear){
          const previousYear = parseInt(this.selectedYear) - 1;
          this.calendarYear[0].year = previousYear;
          this.selectedYear = previousYear;
          if(this.calendarYear.length>0){
            this.onCalendarYearPicked.emit(this.calendarYear[0]);
           }
        }

      } else {
        if(this.lastYear > this.selectedYear){
          const nextYear = parseInt(this.selectedYear) + 1;
          this.calendarYear[0].year = nextYear;
          this.selectedYear = nextYear;
          if(this.calendarYear.length>0){
            this.onCalendarYearPicked.emit(this.calendarYear[0]);
           }
        }
        
      }
    }
  }
  
}
