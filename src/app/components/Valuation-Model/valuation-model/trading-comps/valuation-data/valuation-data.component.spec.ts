import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ValuationModelService } from '../../../../../services/valuation-model.service';
import { FormsModule } from '@angular/forms';
import {
    HttpClientTestingModule
  } from "@angular/common/http/testing";
import { ValuationDataComponent } from "./valuation-data.component";

describe('ValuationDataComponent',() => {
    let component: ValuationDataComponent;
  let fixture: ComponentFixture<ValuationDataComponent>;
  beforeEach(async () => {
    const valuationModelServiceStub = () => ({
        getFundList: () => ({ subscribe: f => f({}) }),
        getCompanyList: fund => ({ subscribe: f => f({}) })
      });
    await TestBed.configureTestingModule({
        imports: [FormsModule, HttpClientTestingModule],
        schemas: [NO_ERRORS_SCHEMA],
      declarations: [ ValuationDataComponent ],
      providers: [
        {
          provide: ValuationModelService,
          useFactory: valuationModelServiceStub
        },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    })
    .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.frozenCols = [];
    component.termsToCalculate = [];
  });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('frozenCols has default values', () => {
      expect(component.frozenCols).toEqual([]);
     });

  it('ColumsWithoutSector', () => {
    expect(component.ColumsWithoutSector).toEqual([]);
   });

   it('isWithSector', () => {
    expect(component.isWithSector).toEqual(false);
      });

      it('isLoading', () => {
        expect(component.isLoading).toEqual(true);
    });

    it('termsToCalculate', () => {
      expect(component.termsToCalculate).toEqual([]);
  });

  it('dataCollection', () => {
    expect(component.dataCollection).toEqual([]);
});

it('masterArray', () => {
  expect(component.masterArray).toEqual([]);
});

it('sectorList', () => {
  expect(component.sectorList).toEqual([]);
});

it('rowHeader', () => {
  expect(component.rowHeader).toEqual([]);
});

it('dataTOSendForImpliedEV', () => {
  expect(component.dataTOSendForImpliedEV).toEqual([]);
});

it('dataSentToImpliedEv', () => {
  expect(component.dataSentToImpliedEv).toEqual(true);
});

it('dropDownKpi', () => {
  expect(component.dropDownKpi).toEqual([]);
});
it('valuationDataSource', () => {
  expect(component.valuationDataSource).toEqual([]);
});

it('makes expected calls', () => {
  const dataCollection = [
      {
          TargetName: "All Comps",
          sector: "",
          cssClass: "over-all",
        },
        {
          TargetName: "Mean - Overall",
          sector: "",
          cssClass: "over-all-mean",
        },
        {
          TargetName: "Median - Overall",
          sector: "",
          cssClass: "over-all-median",
        },
  ];
 spyOn(component, 'addOverAllSectionWithoutSector').and.callThrough();
 component.addOverAllSectionWithoutSector(dataCollection);
 expect(component.addOverAllSectionWithoutSector).toHaveBeenCalledWith(dataCollection);
});
it('add over all section for sector', () => {
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
  spyOn(component, 'addOverAllSectionForSector').and.callThrough();
  component.addOverAllSectionForSector(tempData);
  expect(component.addOverAllSectionForSector).toHaveBeenCalled();
});
it('print NA with sector', () => {
  const rowData = {
     cssClass: 'sector-mean',
     LTM: 500,
     name: 'Mean',
     NTM: 500,
     sector: 'sector',
     TargetName: 'Global'
  };
  const col = {
      field: "ev",
      fieldtwo: "equityValue"
  }
  spyOn(component, 'printNAForSector').and.callThrough();
  component.printNAForSector(rowData, col)
  expect(component.printNAForSector).toHaveBeenCalled();
});

it('print NA without sector', () => {
  const rowData = {
     cssClass: 'sector-mean',
     LTM: 500,
     name: 'Mean',
     NTM: 500,
     sector: '',
     TargetName: 'Global'
  };
  const col = {
      field: "ev",
      fieldtwo: "equityValue"
  }
  spyOn(component, 'printNAForWithoutSector').and.callThrough();
  component.printNAForWithoutSector(rowData, col)
  expect(component.printNAForWithoutSector).toHaveBeenCalled();
});
describe('getImpliedEvData', () =>{
  it('makes expected calls', () => {
      const data = <any>{
         "2022A": 2323,
         "2023E": 323,
          cssClass: 'over-all-mean',
          LTM: 2323,
          name: 'Mean - Overall',
          NTM: 2323,
          sector: '',
          TargetName: '',
          title: 'Mean - Overall'
      }
      spyOn(component, 'getImpliedEvData').and.callThrough();
      component.getImpliedEvData(data);
      expect(component.getImpliedEvData).toHaveBeenCalled();
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
describe('addMeanandMedian', () =>{
  it('makes expected calls', () =>{
      const headers = <any> [
          {
          field: '2022A',
          header: '2022A'
          },
          {
              field: '2023E',
              header: '2023E'
          },
          {
              field: 'LTM',
              header: 'LTM'
          },
          {
              field: 'NTM',
              header: 'NTM'
          }
  ];
  const sectorData = [{
      children: [{
          data:{
              "2022A": 2323,
              "2023E": 2323,
              cssClass: '',
              EquityValue: 2323,
              Ev: 2323,
              Id: 'eea101be-2319-488e-bfb0-c0903afde736',
              IsSelected: true,
              KpiId: 1,
              KpiName: 'EV/Revenue',
              LTM: 2323,
              name: 'ww1',
              NTM: 2323,
              parentName: 'sec1',
              PeerSet: 'sec1',
              TargetName: 'ww1'  
          }
      },
      {
          data:{
              
                  "2022A": 2323,
                  "2023E": 2323,
                  cssClass: '',
                  EquityValue: 2323,
                  Ev: 2323,
                  Id: 'eea101be-2319-488e-bfb0-c0903afde736',
                  IsSelected: true,
                  KpiId: 1,
                  KpiName: 'EV/Revenue',
                  LTM: 2323,
                  name: 'ww1',
                  NTM: 2323,
                  parentName: 'sec1',
                  PeerSet: 'sec1',
                  TargetName: 'ww1'  
              }
          }
         ],
       data:{
          expanded: true,
          isActive: true,
          isHeader: true,
          name: 'sec1'
       }  
  }];
  spyOn(component, 'addMeanAndMedianForEachSector').and.callThrough();
  component.addMeanAndMedianForEachSector(sectorData, headers);
  expect(component.addMeanAndMedianForEachSector).toHaveBeenCalled();
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
describe('isNumberCheck', () =>{
  it('makes expected call isNumberCheck', () =>{
    const str = 2323;
    spyOn(component, 'isNumberCheck').and.callThrough()
    component.isNumberCheck(str);
    expect(component.isNumberCheck).toHaveBeenCalled();
  })
});
describe('calculationforwithourtsector', () =>{
  it('makes expected calls', () =>{
      const dataCollection = [
          {
              TargetName: "All Comps",
              sector: "",
              cssClass: "over-all",
            },
            {
              TargetName: "Mean - Overall",
              sector: "",
              cssClass: "over-all-mean",
            },
            {
              TargetName: "Median - Overall",
              sector: "",
              cssClass: "over-all-median",
            }
      ];
      const headers = <any> [
          {
          field: '2022A',
          header: '2022A'
          },
          {
              field: '2023E',
              header: '2023E'
          },
          {
              field: 'LTM',
              header: 'LTM'
          },
          {
              field: 'NTM',
              header: 'NTM'
          }
  ];
  spyOn(component,'calculationForWithoutSectorData').and.callThrough();
  component.calculationForWithoutSectorData(dataCollection, headers);
  expect(component.calculationForWithoutSectorData).toHaveBeenCalled()
  })
});
describe('calculationForsectorDat', () =>{
  it('makes expected calls', () =>{
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
      const headers = <any> [
          {
          field: '2022A',
          header: '2022A'
          },
          {
              field: '2023E',
              header: '2023E'
          },
          {
              field: 'LTM',
              header: 'LTM'
          },
          {
              field: 'NTM',
              header: 'NTM'
          }
  ];
  spyOn(component, 'calculationForSectorData').and.callThrough();
  component.calculationForSectorData(tempData, headers);
  expect(component.calculationForSectorData).toHaveBeenCalled();
  })
});
describe('addOverAllSectionWithoutSector', () =>{
  it('makes expected calls', () =>{
      const dataCollection = [
          {
              TargetName: "All Comps",
              sector: "",
              cssClass: "over-all",
            },
            {
              TargetName: "Mean - Overall",
              sector: "",
              cssClass: "over-all-mean",
            },
            {
              TargetName: "Median - Overall",
              sector: "",
              cssClass: "over-all-median",
            }
      ];
  spyOn(component, 'addOverAllSectionWithoutSector').and.callThrough();
  component.addOverAllSectionWithoutSector(dataCollection);
  expect(component.addOverAllSectionWithoutSector).toHaveBeenCalled();
  })
});
describe('manageSelectedRecordIds', () => {
  it('manageSelectedRecordIds', () =>{
      const recordId = 'value';
    spyOn(component, 'manageSelectedRecordIds').and.callThrough();
    component.manageSelectedRecordIds(recordId);
    expect(component.manageSelectedRecordIds).toHaveBeenCalled()
  })
});
  });