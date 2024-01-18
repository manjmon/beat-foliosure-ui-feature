import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ITab } from './tab.model';
import { TabComponent } from './tab.component';

describe('TabComponent', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TabComponent]
    });
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isfilter has default value`, () => {
    expect(component.isfilter).toEqual(false);
  });

  it(`collapsed has default value`, () => {
    expect(component.collapsed).toEqual(false);
  });

  it(`nav has default value`, () => {
    expect(component.nav).toEqual(false);
  });

  describe('ngAfterContentInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'selectTab').and.callThrough();
      component.ngAfterContentInit();
      expect(component.selectTab).toHaveBeenCalled();
    });
  });
});
