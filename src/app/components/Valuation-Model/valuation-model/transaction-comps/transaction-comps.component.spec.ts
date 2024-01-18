import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ValuationModelService } from '../../../../services/valuation-model.service';
import { ImpliedEvService } from 'src/app/services/implied-ev.service';
import { FormsModule } from '@angular/forms';
import {
    HttpClientTestingModule
  } from "@angular/common/http/testing";
  import { TransactionCompsComponent } from './transaction-comps.component';
import { of } from 'rxjs';
describe('TransactionCompsComponent',() => {
    let component: TransactionCompsComponent;
  let fixture: ComponentFixture<TransactionCompsComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientTestingModule],
        schemas: [NO_ERRORS_SCHEMA],
      declarations: [ TransactionCompsComponent ],      
      providers: [
        
         ValuationModelService, ImpliedEvService,
          
        
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionCompsComponent);
    component = fixture.componentInstance;
    component.fundDetails = {fundId:'116B9465C55DC11EB465F9282CFF1C5C',
         fundName: 'Demo Fund 3'};
         component.companyDetails = {companyCurrency: 'GBP',
                  companyId: '281CF76D0B49154E05CC9BFB3B1E6267',
                companyName: 'demo company 6',
              currencyId: 3};
              component.QuarterAndYear = { quarter: 'Q1', year: 2023}
              component.valuationMultipleOptions.length = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('rowDataTranscomps', () => {
    expect(component.rowDataTransComps).toEqual([]);
  });
  describe('getRawDataTransComps', () => {
    it('makes expectd call', () =>{
      const valuationModelServiceStub: ValuationModelService = fixture.debugElement.injector.get(
        ValuationModelService
      );
      const datas = {
        data: {
          ValuationData:{
            EV: 232224,
            EquityValue: 554456,
            Id: "e6acf0e2-2c03-41ec-8023-fbb19a9c68ce",
            IsSelected: true,
            KpiData:[{
            CellAddress: null,
            DataType: "Actual",
            KpiValue: 23232,
            PeriodName: "2022A",
            Year: 2022
            },
            {
              CellAddress: null,
              DataType: "Estimate",
              KpiValue: 23232,
              PeriodName: "2022E",
              Year: 2022
              },
              {
                CellAddress: null,
                DataType: null,
                KpiValue: 23232,
                PeriodName: "LTM",
                Year: 0
                },
                {
                  CellAddress: null,
                  DataType: null,
                  KpiValue: 23232,
                  PeriodName: "NTM",
                  Year: 0
              }
          ],
            KpiId: 1,
            KpiName: "EV/Revenue",
            PeerSet: "sec2",
            TargetName: "ww2"
          },    
        },
        ValuationData:{
          EV: 232224,
          EquityValue: 554456,
          Id: "e6acf0e2-2c03-41ec-8023-fbb19a9c68ce",
          IsSelected: true,
          KpiData:[{
          CellAddress: null,
          DataType: "Actual",
          KpiValue: 23232,
          PeriodName: "2022A",
          Year: 2022
          },
          {
            CellAddress: null,
            DataType: "Estimate",
            KpiValue: 23232,
            PeriodName: "2022E",
            Year: 2022
            },
            {
              CellAddress: null,
              DataType: null,
              KpiValue: 23232,
              PeriodName: "LTM",
              Year: 0
              },
              {
                CellAddress: null,
                DataType: null,
                KpiValue: 23232,
                PeriodName: "NTM",
                Year: 0
            }
        ],
          KpiId: 1,
          KpiName: "EV/Revenue",
          PeerSet: "sec2",
          TargetName: "ww2"
        },
        unselectedRows:[{
          kpiId: 1,
          recordIds: [
            "4ed03db0-c9c7-43b5-80c5-19477d0af2fe",
            "ce7ff6f2-d6f9-43de-aaac-7bc92812da32"
          ]
        }],
        valuationId:123,
        valuationReportId:"85875c4b-c844-41df-8909-22147111a21d.json"
        }
     spyOn(valuationModelServiceStub, 'getValuationModel').and.returnValue(of(datas));
     component.getRawDataTransComps() 
     expect(component.rowDataTransComps).toEqual(datas.data);
     expect(component.noDataFound).toBe(false);
    })
  });
  describe('selectValueTab',() =>{
    it('makes expected calls',() =>{
      const tab = {
        name: 'Financials',
        id: 1003,
        isActive: false
      };
      spyOn(component,'selectValueTab').and.callThrough();
      component.selectValueTab(tab);
      expect(component.selectValueTab).toHaveBeenCalled();
    })
  });
  describe('closePopup',() =>{
    it('makes expected calls',() =>{
      spyOn(component,'closePopup').and.callThrough();
      component.closePopup();
      expect(component.closePopup).toHaveBeenCalled();
    })
  });
  describe('getSubTabs',() =>{
    it('makes expected calls',() =>{
      spyOn(component,'getSubTabs').and.callThrough();
      component.getSubTabs();
      expect(component.getSubTabs).toHaveBeenCalled();
    })
  });
  describe('ngOnInit',() =>{
    it('makes expected calls',() =>{
      spyOn(component,'ngOnInit').and.callThrough();
      component.ngOnInit();
      expect(component.ngOnInit).toHaveBeenCalled();
    })
  });
  describe('changeKpi',() =>{
    it('makes expected calls',() =>{
      const event = {
        value:'Revenue'
      }
      spyOn(component,'changeKpi').and.callThrough();
      component.changeKpi(event);
      expect(component.changeKpi).toHaveBeenCalled();
    })
  });
});
