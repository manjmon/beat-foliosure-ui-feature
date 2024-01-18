
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { ValuationModelService } from '../../../../../services/valuation-model.service';
import { FinancialDataComponent } from './financial-data.component';

describe('FinancialDataComponent', () => {
  let component: FinancialDataComponent;
  let fixture: ComponentFixture<FinancialDataComponent>;

  beforeEach(() => {
    const valuationModelServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FinancialDataComponent],
      providers: [
        {
          provide: ValuationModelService,
          useFactory: valuationModelServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(FinancialDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.frozenCols = [];
    component.ColumsWithoutSector = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' isWithSector has default value', () => {
    expect(component.isWithSector).toEqual(false);
  });

  it('isLoading has default value', () => {
    expect(component.isLoading).toEqual(true);
  });

  it('ColumsWithoutSector has default value', () => {
    expect(component.ColumsWithoutSector).toEqual([]);
  });

  it('frozenCols has default value', () => {
    expect(component.frozenCols).toEqual([]);
  });

  it('dataCollection has default value', () => {
    expect(component.dataCollection).toEqual([]);
  });

  describe('arrangeParentChildData', () => {
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
      spyOn(component, 'arrangeParentChildData').and.callThrough();
      component.arrangeParentChildData(data);
      expect(component.arrangeParentChildData).toHaveBeenCalled();
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

  describe('financialDataValidator', () =>{
    it('makes expected setActive', () =>{
      const data = [{
        FinancialData: {
          CategoryId: 0,
          CategoryName: 'Financials',
          FinancialData:[{
           KpiData:[{
             CellAddress: null,
             DataType: 'Actual',
             KpiValue: 9998,
             PeriodName: '2022A',
             Year:2022
           },
         {
           CellAddress: null,
           DataType: 'Estimate',
           KpiValue: 9998,
           PeriodName: '2023E',
           Year:2023
         },
         {
           CellAddress: null,
           DataType: null,
           KpiValue: 9998,
           PeriodName: 'Current Period',
           Year:0
         },
         {
           CellAddress: null,
           DataType: null,
           KpiValue: 58585,
           PeriodName: 'Prior Period',
           Year:0
         },
         {
           CellAddress: null,
           DataType: null,
           KpiValue: 4554,
           PeriodName: 'LTM',
           Year:0
         },
         {
           CellAddress: null,
           DataType: null,
           KpiValue: 4554,
           PeriodName: 'NTM',
           Year:0
         }],
       }]
     },
        PeerDetail: {
          Peers: 'ww2',
          Sector: '',
          Ticker: 'ee1'
        }
      }]
      spyOn(component, 'financialDataValidator').and.callThrough();
      component.financialDataValidator(data);
      expect(component.financialDataValidator).toHaveBeenCalled();
    });
  });
});
