import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({ selector: "chip", templateUrl: "./chip.component.html" })

export class Chips implements OnInit {
  @Input() placeholder: string = "";
  @Input() maxlen: string = "";
  @Input() selectable: boolean = true;
  @Input() chipitems = [];
  @Input() isReadonly: boolean = true;
  @Input() addOnBlur: boolean = false;
  @Input() customclass: string = "";
  @Input() inputClass: string = "";
  @Output() removeItem = new EventEmitter<any>();
  @Output() addItem = new EventEmitter<any>();
  @Output() addSelectedItem = new EventEmitter<any>();
  itemCtrl = new FormControl();
  filteredItems: Observable<string[]>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() allItems: string[] = [];
  @ViewChild('itemInput') itemInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('automcomplete') autocomplete;

  constructor() {
    this.filteredItems = this.itemCtrl.valueChanges.pipe(
      startWith(null),
      map((item: string | null) => item ? this._filter(item) : this.allItems.slice()));
  }

  ngOnInit() {
  }

  OnRemoveItem(item: any) {
    this.removeItem.emit(item);
    const index = this.chipitems.indexOf(item);
    if (index >= 0) {
      this.chipitems.splice(index, 1);
    }
  }

  checkIfEmpty() {
    let filtered = null;
    if (this.chipitems != null) {
      filtered = this.chipitems.filter(el => {
        return el != null && el.trim() != '' && el != ' ';
      });
    }
    let status = filtered != null && filtered.length > 0;
    this.chipitems = filtered;
    return status;
  }

  OnAddItem(event: MatChipInputEvent) {
    if (this.allItems.length === 0) {
      this.addItem.emit(event);
      this.chipitems.push(event.value);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.itemCtrl.setValue(null);
    if (this.chipitems.find(x => x === event.option.viewValue) === undefined) {
      this.chipitems.push(event.option.viewValue);
      this.addSelectedItem.emit(this.chipitems);
    }
    this.itemInput.nativeElement.value = '';
  }

  openPanel() {
    this.autocomplete.openPanel();
  }

  closePanel() {
    this.autocomplete.closePanel();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allItems.filter(item => item.toLowerCase().includes(filterValue));
  }

}
export class ChipSource { }
