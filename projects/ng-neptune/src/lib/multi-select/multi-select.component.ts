import { Component } from '@angular/core';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html'
})
export class MultiSelectComponent {
  placeholderText: string = "Search and Select";
  isMultiSearch: boolean = true;
  selectedData = [];
  keyword = 'name';
  multiSelectdata = [
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
  constructor() { /* TODO document why this constructor is empty */  }

  selectMultiEvent(value: any) {
    this.isMultiSearch = false;
    let arrayData = this.selectedData.filter(item => item.id == value.id);
    if (arrayData.length == 0) {
      this.selectedData.push(value);
    }
  }

  onMultiChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  clearMultiText() {
    this.isMultiSearch = true;
  }
  onMultiFocused(e) {
    // do something when input is focused
  }
  removeSelected(value: any) {
    this.selectedData = this.selectedData.filter(item => item.id !== value.id);
  }
}
