import { forwardRef, Component, Renderer2, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
export const USER_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomSelectComponent),
  multi: true,
};

@Component({
  selector: 'app-customselect',
  templateUrl: './customselect.component.html',
  styleUrls: ['./customselect.component.scss'],
  providers: [USER_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CustomSelectComponent implements OnInit, ControlValueAccessor {
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
  actionname: any;
  @ViewChild('customselect') elementRef: ElementRef;
  constructor(private renderer: Renderer2) { }
  ngOnInit() {
    if (this.selectedValue.name === undefined) {
      this.selectedValue = this.selectList[0];
      this.writeValue(this.selectedValue)
      this.onChange(this.selectedValue);
      this.onTouched(this.selectedValue);
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
    this.onChange(this.selectedValue);
    this.onTouched(this.selectedValue);
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
    if (this.selectedValue.name === undefined) {
      this.selectedValue = this.selectList[0];
      this.onChange(this.selectedValue);
      this.onTouched(this.selectedValue);
    }
  }

  @ViewChild('text', { static: true }) text;
  onChange;
  onTouched;
  writeValue(value: any): void {
    //existing functionality
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    if ((this.elementRef !== undefined && this.elementRef.nativeElement.contains(event.target)) || event.currentTarget.activeElement.id === 'customSelectComponent') {
      this.openOption = true;
    } else {
      this.openOption = false;
    }
  }

}
