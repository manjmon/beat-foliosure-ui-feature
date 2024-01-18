import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit{
  openOption: boolean = false;
  isSearch: boolean = true;
  isMultiSearch: boolean = true;
  @Input() selectedValue: any = {
  };
  placeholderText: string = "Search and Select";
  keyword = 'name';
  data = [];
  @Output() OnSelect: EventEmitter<any> = new EventEmitter();
  @Input() selectList = [];
  @Input() lpreportSelect: boolean = false;
  @Input() imagePath = "";
  @ViewChild('select') elementRef: ElementRef;
  
  constructor() { }

  ngOnInit() {
    if (this.selectedValue?.name === undefined) {
      this.selectedValue = this.selectList[0];
    }
  }
  openSelect() {
    if (this.openOption)
      this.openOption = false;
    else
      this.openOption = true;
  }
  selectedOption(option: any) {
    this.selectedValue = option;
    this.OnSelect.emit(this.selectedValue);
  }
  selectEvent(item: any) {
    this.isSearch = false;
    // do something with selected item
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  clearText() {
    this.isSearch = true;
  }
  onFocused(e) {
    // do something when input is focused
  }
  ngOnChanges(changes: any) {
    if (this.selectedValue?.name === undefined) {
      this.selectedValue = this.selectList[0];
    }
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    if ((this.elementRef !== undefined && this.elementRef.nativeElement.contains(event.target)) || event.currentTarget.activeElement.id === 'selectComponent') {
      this.openOption = true;
    } else {
      this.openOption = false;
    }
  }

}
