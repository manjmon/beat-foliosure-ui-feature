import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-select',
  templateUrl: './search-select.component.html'
})
export class SearchSelectComponent implements OnInit {
  openOption: boolean = false;
  isSearch: boolean = true;
  isMultiSearch: boolean = true;
  selectedValue: any = {
  };
  placeholderText:string="Search and Select";
  selectData: any = ["red", "orange", "yellow", "green", "cyan", "blue", "violet"];
  keyword = 'name';
  data = [
     {
       id: 1,
       name: 'Advertising & Media'
     },
     {
       id: 2,
       name: 'Administration'
     },
     {
      id: 3,
      name: 'Adwords'
    },
    {
      id: 4,
      name: 'Additional Support'
    },
    {
      id: 5,
      name: 'Finance'
    },
    {
     id: 6,
     name: 'Sales'
   },
   {
     id: 7,
     name: 'Marketing'
   }
     
  ];
  constructor() { }

  ngOnInit() {
    this.selectedValue = this.selectData[0];
  }
  openSelect()
  {
    if (this.openOption)
      this.openOption = false;
    else
      this.openOption = true;
  }
  selectedOption(option: string) {
   // this.selectedValue = option;
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
  onFocused(e){
    // do something when input is focused
  }

}
