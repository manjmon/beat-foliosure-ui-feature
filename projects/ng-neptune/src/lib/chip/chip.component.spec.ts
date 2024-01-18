import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Chips } from './chip.component';

describe('Chips', () => {
  let component: Chips;
  let fixture: ComponentFixture<Chips>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [Chips]
    });
    fixture = TestBed.createComponent(Chips);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`selectable has default value`, () => {
    expect(component.selectable).toEqual(true);
  });

  it(`chipitems has default value`, () => {
    expect(component.chipitems).toEqual([]);
  });

  it(`isReadonly has default value`, () => {
    expect(component.isReadonly).toEqual(true);
  });

  it(`addOnBlur has default value`, () => {
    expect(component.addOnBlur).toEqual(false);
  });

  it(`separatorKeysCodes has default value`, () => {
    expect(component.separatorKeysCodes).toEqual([ENTER, COMMA]);
  });

  it(`allItems has default value`, () => {
    expect(component.allItems).toEqual([]);
  });
});
