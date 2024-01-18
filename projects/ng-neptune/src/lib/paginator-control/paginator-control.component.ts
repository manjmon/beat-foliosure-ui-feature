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
  useExisting: forwardRef(() => PaginatorControlComponent),
  multi: true,
};
@Component({
  selector: "paginator-control",
  templateUrl: "./paginator-control.component.html"
})
export class PaginatorControlComponent {
  pageCount:number =5;
  @Input() totalPage:number;
  @Input() rows:number = 20;
  @Input() rowsPerPage:number = 20;
  @Input() totalRecords:number;
  @Input() inputSearch:any;
  first:number = 0;
  @ViewChild('rightitem') rightitem:ElementRef; 
  @ViewChild('enditem') enditem:ElementRef; 
  @Output() loadPortfolioLazy = new EventEmitter<any>();
  currentTablePageNo: number = 1;
  
  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
  ) {}
  ngOnInit() {
   }
  ngAfterViewInit(){
    let paginatorLeftElement =  document.getElementsByTagName("p-paginator")[0].children[0];
    let paginatorEndElement =  document.getElementsByTagName("p-dropdown")[0].children[0];
    paginatorLeftElement.insertBefore(this.rightitem.nativeElement, paginatorLeftElement.firstChild);
    paginatorEndElement.insertBefore(this.enditem.nativeElement, paginatorEndElement.firstChild);
  }
  loadPortfolioLazyInput(val: number){
    let event = {
      first: (val - 1) * this.rows,
      rows: this.rows,
      page: +val -1,
      globalFilter: this.inputSearch,
      sortField: null,
      sortOrder: 1,
    }; 
    this.getloadPortfolioLazy(event)
  }
  getloadPortfolioLazy(event){
    this.currentTablePageNo = event.page +1;
    event.globalFilter = this.inputSearch;
    this.first =event?.first;
    this.rows = event?.rows;
    this.loadPortfolioLazy.emit(event);
  }
}