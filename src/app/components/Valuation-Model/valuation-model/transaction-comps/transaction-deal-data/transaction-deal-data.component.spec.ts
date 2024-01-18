import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ValuationModelService } from '../../../../../services/valuation-model.service';
import { NumberDecimalConst } from 'src/app/common/constants';
import { TransactionDealDataComponent } from './transaction-deal-data.component';

describe('TransactionDealDataComponent', () => {
  let component: TransactionDealDataComponent;
  let fixture: ComponentFixture<TransactionDealDataComponent>;

  beforeEach(() => {
    const valuationModelServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TransactionDealDataComponent],
      providers: [
        {
          provide: ValuationModelService,
          useFactory: valuationModelServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(TransactionDealDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.frozenCols = [];
    component.scrollableCols = [];
    component.ColumsWithoutSector = [];
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`isWithSector has default value`, () => {
    expect(component.isWithSector).toEqual(true);
  });

  it(`isLoading has default value`, () => {
    expect(component.isLoading).toEqual(true);
  });

  it(`ColumsWithoutSector has default value`, () => {
    expect(component.ColumsWithoutSector).toEqual([]);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([]);
  });

  it(`scrollableCols has default value`, () => {
    expect(component.scrollableCols).toEqual([]);
  });
  describe('arrangeData', () =>{
    it('makes expected arranged data', () => {
      const tempData =[ {
        child : {
            data: {
              equityValue: 500,
              ev: 500,
              LTM: 500,
              name: 'Tech',
              NTM: 500,
              targetname:'sector'
            }
        },
        data : {
        expanded: false,
        isActive: false,
        isHeader: true,
        name:'sector 1'
        },
        children : {
            data: {
              equityValue: 500,
              ev: 500,
              LTM: 500,
              name: 'Tech',
              NTM: 500,
              targetname:'sector'
            }
        },
        datacollect : {
        expanded: false,
        isActive: false,
        isHeader: true,
        name:'sector 1'
        }
    }];
        spyOn(component, 'arrangeData').and.callThrough();
        component.arrangeData(tempData);
        expect(component.arrangeData).toHaveBeenCalled();
      });
  });
  describe('formatData', () =>{
    it('makes expected formatData', () =>{
      const marketData = [{
        DealData: {
          EquityValue: 232300,
          Ev: 232300
        },
        Financial:{
          CategoryId: 0,
          CategoryName: 'Financials'
        },
        FinancialData:{
          KpiData:{
            cellAddress: null,
            DataType: 'Actual',
            KpiValue: 239990,
            PeriodName: '2022A',
            Year: 2022
          },
          KpiId: 0,
          KpiName: 'Revenue'
        },
        PeerDetail: {
          Acqurier: '',
          AnnouncementDate: '1/1/2023 12:00:00 AM',
          Country: '',
          DealCurrency: '',
          PeerSet: 'sec1',
          TargetNae: 'ww1'
        },
        ValuationData: {
          EquityValue: 2323000,
          Ev: 2323000,
          Id: 'eea101be-2319-488e-bfb0-c0903afde736',
          IsSelected: true,
          KpiData:{
            cellAddress: null,
            DataType: 'Actual',
            KpiValue: 239990,
            PeriodName: '2022A',
            Year: 2022
          },
          KpiId: 0,
          KpiName: 'Revenue',
          PeerSet: 'sec!',
          TargetName: 'ww1'
        }
      }];
      spyOn(component, 'formatData').and.callThrough();
      component.formatData(marketData);
      expect(component.formatData).toHaveBeenCalled();
    });
  });
  describe('setActive', () =>{
    it('makes expected setActive', () =>{
      const marketData = [{
        DealData: {
          EquityValue: 232300,
          Ev: 232300
        },
        Financial:{
          CategoryId: 0,
          CategoryName: 'Financials'
        },
        FinancialData:{
          KpiData:{
            cellAddress: null,
            DataType: 'Actual',
            KpiValue: 239990,
            PeriodName: '2022A',
            Year: 2022
          },
          KpiId: 0,
          KpiName: 'Revenue'
        },
        PeerDetail: {
          Acqurier: '',
          AnnouncementDate: '1/1/2023 12:00:00 AM',
          Country: '',
          DealCurrency: '',
          PeerSet: 'sec1',
          TargetNae: 'ww1'
        },
        ValuationData: {
          EquityValue: 2323000,
          Ev: 2323000,
          Id: 'eea101be-2319-488e-bfb0-c0903afde736',
          IsSelected: true,
          KpiData:{
            cellAddress: null,
            DataType: 'Actual',
            KpiValue: 239990,
            PeriodName: '2022A',
            Year: 2022
          },
          KpiId: 0,
          KpiName: 'Revenue',
          PeerSet: 'sec!',
          TargetName: 'ww1'
        }
      }];
      spyOn(component, 'setActive').and.callThrough();
      component.setActive(marketData);
      expect(component.setActive).toHaveBeenCalled();
    });
  });
  describe('convertkpiValue', () =>{
    it('makes expected convertkpiValue', () =>{
      const currencyUnit = 1;
      const kpiVal = 2332220;
      spyOn(component, 'convertKpiValue').and.callThrough()
      component.convertKpiValue(kpiVal, currencyUnit);
      expect(component.convertKpiValue).toHaveBeenCalled();
    });
  });
  describe('isStaticColumnHeader', () =>{
    it('makes expected call isStaticColumnHeader', () =>{
      const val = 'acquirename';
      spyOn(component, 'isStaticColumnHeader').and.callThrough()
      component.isStaticColumnHeader(val);
      expect(component.isStaticColumnHeader).toHaveBeenCalled();
    })
  });
  describe('isNumberCheck', () =>{
    it('makes expected call isNumberCheck', () =>{
      const str = 2323;
      spyOn(component, 'isNumberCheck').and.callThrough()
      component.isNumberCheck(str);
      expect(component.isNumberCheck).toHaveBeenCalled();
    })
  });    
  });