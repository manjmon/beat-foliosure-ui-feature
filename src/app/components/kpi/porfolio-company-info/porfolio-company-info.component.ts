import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { Component, EventEmitter, forwardRef,  Input, OnChanges, OnInit, Output,AfterViewInit, ViewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-porfolio-company-info",
  templateUrl: "./porfolio-company-info.component.html",
  styleUrls: ["./porfolio-company-info.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PorfolioCompanyInfoComponent),
      multi: true,
    },
  ],
})
export class PorfolioCompanyInfoComponent implements ControlValueAccessor ,OnInit,OnChanges,AfterViewInit {
  PCDetail: any;
  @Input() companyList: any;
  @Output() OnSelectCompany: EventEmitter<any> = new EventEmitter();
  filteredCompanyList = [];
  company: string;
  selectedCompany: any;
  @Input() companyHeight: any;
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  writeValue(obj: any): void {
    if (obj !== undefined) this.PCDetail = obj;
  }
  registerOnChange(fn: any): void {
    //existing functions
  }
  registerOnTouched(fn: any): void {
    //existing functions
  }
  setDisabledState?(isDisabled: boolean): void {
    //existing functions
  }
  selectcompany(company: any, event: any) {
    let index = this.filteredCompanyList.indexOf(this.selectedCompany);
    if (index > -1)
      this.filteredCompanyList[index].editable = false;
    company.editable = true;
    this.selectedCompany = company;
    this.OnSelectCompany.emit(company.encryptedPortfolioCompanyId);
  }
  setInActive(company:any) {
    this.filteredCompanyList.forEach(row => !row.editable  && row.portfolioCompanyID!=company.portfolioCompanyID);
  }
  filterItem(value:string) {
    if (value == '') {
      this.assignCopy();
    }
    this.filteredCompanyList = this.companyList.filter(item => item.companyName.toLowerCase().includes(value.toLowerCase()));
  }
  assignCopy() {
    this.filteredCompanyList = Object.assign([], this.companyList);
  }
  ngOnInit() {
    this.assignCopy();
  }
  ngOnChanges(changes: any) {
    if (changes["companyList"]) 
      this.filterCompanies();
  }
  filterCompanies()
  {
    this.filteredCompanyList = this.companyList;
    if (this.filteredCompanyList != undefined && this.filteredCompanyList != null && this.filteredCompanyList.length > 0) {
      this.filteredCompanyList[0]['editable'] = true;
      this.selectedCompany = this.filteredCompanyList[0];
    }
  }
  ngAfterViewInit() {
    this.companyHeight = (window.innerHeight - 250) + "px";
  }
  onResized(event: any) {
    this.companyHeight = (window.innerHeight - 250) + "px";
    this.filterCompanies();
  }
}
