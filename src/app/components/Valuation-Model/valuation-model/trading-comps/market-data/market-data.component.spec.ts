import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ValuationModelService } from '../../../../../services/valuation-model.service';
import { MarketDataComponent } from './market-data.component';

describe('MarketDataComponent', () => {
  let component: MarketDataComponent;
  let fixture: ComponentFixture<MarketDataComponent>;

  beforeEach(() => {
    const valuationModelServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MarketDataComponent],
      providers: [
        {
          provide: ValuationModelService,
          useFactory: valuationModelServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(MarketDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.frozenCols = [];
    component.scrollableCols = [];
    component.marketDataWithoutSectors = [];
    component.ColumsWithoutSector = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('marketDataWithoutSectors has default value', () => {
    expect(component.marketDataWithoutSectors).toEqual([]);
  });

  it('isWithSector has default value', () => {
    expect(component.isWithSector).toEqual(true);
  });

  it('isLoading has default value', () => {
    expect(component.isLoading).toEqual(true);
  });

  it('scrollableCols has default value', () => {
    expect(component.scrollableCols).toEqual([]);
  });

  it('ColumsWithoutSector has default value', () => {
    expect(component.ColumsWithoutSector).toEqual([]);
  });

  it('frozenCols has default value', () => {
    expect(component.frozenCols).toEqual([]);
  });

  describe('arrangeData', () => {
    it('makes expected calls', () => {
      const data = [{
        children:[{
          data:[{ 
           name: 'ww1',
           peers: 'ww1',
          }]
        }],
        data: {
        isActive:false,
        isHeader:true,
        name:'sec1'
        }
      }]
      spyOn(component, 'arrangeData').and.callThrough();
      component.arrangeData(data);
      expect(component.arrangeData).toHaveBeenCalled();
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

  describe('convertkpiValue', () =>{
    it('makes expected convertkpiValue', () =>{
      const currencyUnit = 1;
      const kpiVal = 2332220;
      spyOn(component, 'convertKpiValue').and.callThrough()
      component.convertKpiValue(kpiVal, currencyUnit);
      expect(component.convertKpiValue).toHaveBeenCalled();
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

  describe('isStaticColumnHeader', () =>{
    it('makes expected call isStaticColumnHeader', () =>{
      const val = 'acquirename';
      spyOn(component, 'isStaticCloumnHeader').and.callThrough()
      component.isStaticCloumnHeader(val);
      expect(component.isStaticCloumnHeader).toHaveBeenCalled();
    })
  });

  describe('ngOnChanges', () =>{
    it('makes expected call isStaticColumnHeader', () =>{
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, 'ngOnChanges').and.callThrough()
      component.ngOnChanges(simpleChangesStub);
      expect(component.ngOnChanges).toHaveBeenCalled();
    })
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
});

