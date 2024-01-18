import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ValuationModelService } from '../../../../../services/valuation-model.service';
import { TradingImpliedEvComponent } from './trading-implied-ev.component';

describe('TradingImpliedEvComponent', () => {
  let component: TradingImpliedEvComponent;
  let fixture: ComponentFixture<TradingImpliedEvComponent>;

  beforeEach(() => {
    const valuationModelServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TradingImpliedEvComponent],
      providers: [
        {
          provide: ValuationModelService,
          useFactory: valuationModelServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(TradingImpliedEvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.impliedEVTabList = [];
    component.selectedImpliedEVTab = [];
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it(`ImpliedevTablist does not has default value`, () => {
    expect(component.impliedEVTabList).toEqual([]);
  });
  it(`selectedImpliedEVTab default value`, () => {
    expect(component.selectedImpliedEVTab).toEqual([]);
  });
  describe('ngOnInint', () => {
    it('ngOnInit', () =>{
      spyOn(component, 'getImpliedEVTabs').and.callThrough();
      component.ngOnInit();
      expect(component.getImpliedEVTabs).toHaveBeenCalled()
    })
  })
  describe('getImpliedEVTabs', () => {
    it('getImpliedEvTabs', () => {
      spyOn(component, 'getImpliedEVTabs').and.callThrough();
      component.getImpliedEVTabs();
      expect(component.getImpliedEVTabs).toHaveBeenCalled()
    })
  });
 describe('setImpliedEvTab', () => {
  it('makes expected call', () =>{
    const tab = {
      id: 7575,
      isActive: true,
      name: 'Adjustment details'
    };
    spyOn(component, 'setImpliedEVTab').and.callThrough();
    component.setImpliedEVTab(tab);
    expect(component.setImpliedEVTab).toHaveBeenCalled();
  })
 })
  });
