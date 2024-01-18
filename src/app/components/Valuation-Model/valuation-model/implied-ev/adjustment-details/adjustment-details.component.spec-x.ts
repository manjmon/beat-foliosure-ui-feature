import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from "ngx-toastr";
import { AdjustmentDetailsComponent } from './adjustment-details.component';
import { ValuationModelService } from '../../../../../services/valuation-model.service';
import { MiscellaneousService } from "../../../../../services/miscellaneous.service";
import { ImpliedEvService } from "src/app/services/implied-ev.service";
import { TypeAheadControlComponent } from "src/app/components/custom-controls/typeahead-control.component";
import { Table, TableModule} from 'primeng/table';
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ,  forwardRef, ChangeDetectorRef} from "@angular/core";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AdjustmentType } from "../../../shared/adjustment-types";
import { of } from 'rxjs';

describe('AdjustmentDetailsComponent', () => {
  let component: AdjustmentDetailsComponent;
  let fixture: ComponentFixture<AdjustmentDetailsComponent>;
  const toastrServiceStub = () => ({
    overlayContainer: {},
    error: (message, string, object) => ({}),
    success: (message, string, object) => ({})
  });
  const impliedEVServiceStub = () => ({ 
    checkBoxState$:{ subscribe: f => f({}) },
    getUnselectedRecords: () => ({ subscribe: f => {
      let dummy =
      [
        { 
             recordIds:['',
             'ce7ff6f2-d6f9-43de-aaac-7bc92812da32'],
            kpiId: 1
        },
        { 
          recordIds:['',
          'ce7ff6f2-d6f9-43de-aaac-7bc92812da32'],
         kpiId: 2
       }
    ];
    return dummy;
    } }), 
    getInternalSelectedTabName: fund => ({ subscribe: f => f({}) }),
    getCopmValues: fund => ({ subscribe: f => f({}) }),
    setCopmValues: fund => ({ subscribe: f => f({}) }), 
    getEmpliedEvDetails: fund => ({ subscribe: f => f({}) }), 
    getValuationId: fund => ({ subscribe: f => f({}) }),
    getdropdownValues :fund => ({ subscribe: f => f({}) }),
    getRawDataTradingComps :fund => ({ subscribe: f => {
      const marketData =<any> [{
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
      return marketData;
    } }),
    getHeaders: fund => ({ subscribe: f => {
      let dummy = [{ field: 'peers', header: 'Peers' },
      { field: 'ticker', header: 'Ticker' }];
      return dummy;
    } }),
    saveImpliedEvValue: fund => ({ subscribe: f => f({}) }),
    setKpiData: fund => ({ subscribe: f => f({}) }),
    setColumsWithoutSector: fund => ({ subscribe: f => f({}) }),
    setUnselectedRecords: fund => ({ subscribe: f => f({}) }),
    getTransactionSelectedTab : fund => ({ subscribe: f => f({}) }),
    setCheckBoxStateSubject: fund => ({ subscribe: f => f({}) })      
  });
  const changeDetectorRefStub = () => ({
    markForCheck: () => ({}),
    detectChanges: () => ({})
  });
  const miscellaneousServiceStub = () => ({
    getMessageTimeSpan: () => ({}),
    sortArray :  () => ({}),
    GetPriviousPageUrl: () => ({}),
    getDesignationList: () => ({ subscribe: f => f({}) }),
    getSideBarWidth: () => ({})
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, TableModule, AutoCompleteModule
      ],
      schemas: [ NO_ERRORS_SCHEMA , CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AdjustmentDetailsComponent, TypeAheadControlComponent, Table],
      providers: [       
        { provide: ImpliedEvService, useFactory: impliedEVServiceStub },
        {
          provide: ValuationModelService,
          useValue : { setRedirectionStatus: () => of() }          
        },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub }, 
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => TypeAheadControlComponent),
          multi: true,
        }      
      ]
    });
    
    fixture = TestBed.createComponent(AdjustmentDetailsComponent);
    component = fixture.componentInstance;
    component.frozenColsCompValue = [];
    component.rowHeader = {
      editable: true,
      field: '2021A',
      header: '2021A'
    };
    component.savedAdjustmentFactor = 
      {
        hasValue: false,
        adjFactor:343434 ,
        adjType:1
      }

    component.selectedKpi = 1;
    component.disableCalculate = false;
    component.frozenColsKpi = [];
    component.adjustmentTypes = [
      {
        name: "At Par",
        id: AdjustmentType.AtPar,
      },
      {
        name: "Discount",
        id: AdjustmentType.Discount,
      },
      {
        name: "Premium",
        id: AdjustmentType.Premium,
      }
    ]; 
  
  });

  it('should create', () => {
  
    component.copmValues = [];
    expect(component).toBeTruthy();
  });

  it('frozenColsCompValue should have value', () =>{
    expect(component.frozenColsCompValue).toEqual([]);
  });

  it('frozenColsKpi should have value', () =>{
    expect(component.frozenColsKpi).toEqual([]);
  });

  it('disableCalculate should have value', () =>{
    expect(component.disableCalculate).toEqual(false);
  });

  it('selectedAdjustmentType should have value', () =>{
    expect(component.selectedAdjustmentType).toEqual(100);
  });

  it('txtAdjFactorDisabled should have value', () =>{
    expect(component.txtAdjFactorDisabled).toEqual(true);
  });

  it('kpiValuesToBeSent should have value', () =>{
    expect(component.kpiValuesToBeSent).toEqual([]);
  });

  it('finalValueToBeSent should have value', () =>{
    expect(component.finalValueToBeSent).toEqual([]);
  });

  it('targetCompanyKpiData should have value', () =>{
    expect(component.targetCompanyKpiData).toEqual([]);
  });

  it('finalImpliedEvData should have value', () =>{
    expect(component.finalImpliedEvData).toEqual([]);
  });

  it('loading should have value', () =>{
    expect(component.loading).toEqual(false);
  });
  
  describe('resetAdjustmentComp', () => {
    it('makes expected calls', () => {
      spyOn(component, 'resetAdjustmentComp').and.callThrough();
      component.resetAdjustmentComp();
      expect(component.resetAdjustmentComp).toHaveBeenCalled();
    })
  });

  describe('getUnselectedRecords', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getUnselectedRecords').and.callThrough();
      component.getUnselectedRecords();
      expect(component.getUnselectedRecords).toHaveBeenCalled();
    })
  });

  describe('getVAluationIds', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getVAluationIds').and.callThrough();
      component.getVAluationIds();
      expect(component.getVAluationIds).toHaveBeenCalled();
    })
  });

  describe('IsEditMode', () => {
    it('makes expected calls', () => {
      spyOn(component, 'IsEditMode').and.callThrough();
      component.IsEditMode();
      expect(component.IsEditMode).toHaveBeenCalled();
    })
  });

  describe('validateAdjustmentField', () => {
    it('makes expected calls', () => {
      spyOn(component, 'validateAdjustmentField').and.callThrough();
      component.validateAdjustmentField();
      expect(component.validateAdjustmentField).toHaveBeenCalled();
    })
  });

  describe('getImpliedEvValue', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getImpliedEvValue').and.callThrough();
      component.getImpliedEvValue();
      expect(component.getImpliedEvValue).toHaveBeenCalled();
    })
  });

  describe('calculateImpliedEV', () => {
    it('makes expected calls', () => { 
      component.targetCompanyKpiData = [{
        "2021A": 343,
          LTM: 232,
          NTM: 232
      }];
      component.rowHeader = [{
        editable: true,
        field: '2021A',
        header: '2021A'
      }];
      component.unSelectedRecords =  [
        { 
             recordIds:[],
            kpiId: 1
        },
        { 
          recordIds:[],
         kpiId: 2
       }
    ];
    const marketData =<any> [{

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
      const adjFactor = <any> 5757;
      spyOn(component, 'calculateImpliedEV').and.callThrough();
      spyOn(component, 'updateCompsTableValues').and.returnValue((adjFactor));
      spyOn(component, 'getSavedImpledEvDetails').and.returnValue((marketData));
      component.calculateImpliedEV();
      expect(component.calculateImpliedEV).toHaveBeenCalled();
      expect(component.updateCompsTableValues).toHaveBeenCalled();
      expect(component.getSavedImpledEvDetails).toHaveBeenCalled();
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

  describe('disabledAdjustmentFactorPageLoad', () =>{
    it('makes expected calls', () =>{
      spyOn(component, 'disabledAdjustmentFactorPageLoad').and.callThrough()
      component.disabledAdjustmentFactorPageLoad();
      expect(component.disabledAdjustmentFactorPageLoad).toHaveBeenCalled();
    })
  });

  describe('updateCompsTableValues', () =>{
    it('makes expected calls', () =>{
      const adjFatcot = 123332;
      component.rowHeader = [{
        editable: true,
        field: '2021A',
        header: '2021A'
      }];
      const copmValues = [{
        cssClass: 'over-all-mean',
        LTM: 232,
        NTM: 232,
        peers: 'Mean', 
        ticker: '',
        title: 'Mean - Overall'
      }]
      spyOn(component, 'updateCompsTableValues').and.callThrough()
      spyOn(component, 'getImpliedEvValue').and.returnValue((copmValues));
      component.updateCompsTableValues(adjFatcot);
      expect(component.updateCompsTableValues).toHaveBeenCalled();
    })
  });

  describe('calculateFinalImpliedEvValues', () =>{
    it('makes expected calls', () =>{
      spyOn(component, 'calculateFinalImpliedEvValues').and.callThrough()
      component.calculateFinalImpliedEvValues();
      expect(component.calculateFinalImpliedEvValues).toHaveBeenCalled();
    })
  });

  describe('enableAdjustmentFactor', () =>{
    it('makes expected calls', () =>{
      spyOn(component, 'enableAdjustmentFactor').and.callThrough()
      component.enableAdjustmentFactor();
      expect(component.enableAdjustmentFactor).toHaveBeenCalled();
    })
  });

  describe('getSavedImpledEvDetails', () =>{
    it('makes expected calls', () =>{
      const copmValues = [{
        cssClass: 'over-all-mean',
        LTM: 232,
        NTM: 232,
        peers: 'Mean', 
        ticker: '',
        title: 'Mean - Overall'
      }];
      component.targetCompanyKpiData = [{
        "2021A": 343,
          LTM: 232,
          NTM: 232
      }]
      component.rowHeader = [{
        editable: true,
        field: '2021A',
        header: '2021A'
      }];
      spyOn(component, 'getSavedImpledEvDetails').and.callThrough();
      spyOn(component, 'getImpliedEvValue').and.returnValue((copmValues));
      spyOn(component, 'disabledAdjustmentFactor').and.callThrough();
      component.getSavedImpledEvDetails();
      expect(component.getSavedImpledEvDetails).toHaveBeenCalled();
      expect(component.disabledAdjustmentFactor).toHaveBeenCalled();
    })
  });

  describe('disabledAdjustmentFactor', () =>{
    it('makes expected calls', () =>{
      spyOn(component, 'disabledAdjustmentFactor').and.callThrough();
      spyOn(component, 'validateAdjustmentField').and.callThrough();
      component.disabledAdjustmentFactor();
      expect(component.disabledAdjustmentFactor).toHaveBeenCalled();
      expect(component.validateAdjustmentField).toHaveBeenCalled();
    })
  });

  describe('onAdjustmentTypeChanged', () =>{
    it('makes expected calls', () =>{
      component.savedAdjustmentFactor = 
      {
        hasValue: false,
        adjFactor:343434 ,
        adjType:1
      };
      const adjFactor = <any> 5757;
      spyOn(component, 'onAdjustmentTypeChanged').and.callThrough();
      spyOn(component, 'disabledAdjustmentFactor').and.callThrough();
      spyOn(component, 'getImpliedEvValue').and.callThrough();
      spyOn(component, 'updateCompsTableValues').and.returnValue((adjFactor));
      component.onAdjustmentTypeChanged();
      expect(component.onAdjustmentTypeChanged).toHaveBeenCalled();
      expect(component.disabledAdjustmentFactor).toHaveBeenCalled();
      expect(component.getImpliedEvValue).toHaveBeenCalled();
      expect(component.updateCompsTableValues).toHaveBeenCalled();
    })
  });

  describe('validateAdjustmentFactor', () =>{
    it('makes expected calls', () =>{
      const event = {
        target: {
          value: 1234
        }
      }
      component.savedAdjustmentFactor = 
      {
        hasValue: false,
        adjFactor:343434 ,
        adjType:1
      };
      component.rowHeader = [{
        editable: true,
        field: '2021A',
        header: '2021A'
      }];
      const adjFactor = <any> 5757;
      spyOn(component, 'validateAdjustmentFactor').and.callThrough()
      spyOn(component, 'updateCompsTableValues').and.returnValue((adjFactor))
      component.validateAdjustmentFactor(event);
      expect(component.validateAdjustmentFactor).toHaveBeenCalled();
    })
  });

  describe('ngOnInit', () =>{
    it('makes expected calls', () =>{
      spyOn(component, 'ngOnInit').and.callThrough();
      spyOn(component, 'getVAluationIds').and.callThrough();
      spyOn(component, 'getImpliedEvValue').and.callThrough();
      component.ngOnInit();
      expect(component.ngOnInit).toHaveBeenCalled();
      expect(component.getVAluationIds).toHaveBeenCalled();
      expect(component.getImpliedEvValue).toHaveBeenCalled();  
    })
  });

  describe('disableCalBtnEventHandler', () =>{
    it('makes expected calls', () =>{
      const event = true;
      spyOn(component, 'disableCalBtnEventHandler').and.callThrough()
      component.disableCalBtnEventHandler(event);
      expect(component.disableCalBtnEventHandler).toHaveBeenCalled();
    })
  });

  describe('createDataRow', () =>{
    it('makes expected calls', () =>{
      component.rowHeader = [{
        editable: true,
        field: '2021A',
        header: '2021A'
      }];
      spyOn(component, 'createDataRow').and.callThrough()
      spyOn(component, 'calculateFinalImpliedEvValues').and.callThrough()
      component.createDataRow();
      expect(component.createDataRow).toHaveBeenCalled();
      expect(component.calculateFinalImpliedEvValues).toHaveBeenCalled();
    })
  });

  describe('validateMaxLength', () =>{
    it('makes expected calls', () =>{
      const event = {
        target: {
          value: 1234
        }
      }
      spyOn(component, 'validateMaxLength').and.callThrough();
      component.validateMaxLength(event);
      expect(component.validateMaxLength).toHaveBeenCalled();
    })
  });

  describe('setNAValue', () => {
    it('makes expected call', ()=>{
      const event = {
        target: {
          value: 1234
        }
      };
      const colIndex = 23;
      const col = '2021A';
      const rowIndex =  0;
      component.targetCompanyKpiData = [{
        "2021A": 343,
          LTM: 232,
          NTM: 232
      }];
      component.rowHeader = [{
        editable: true,
        field: '2021A',
        header: '2021A'
      }];
      spyOn(component, 'setNAValue').and.callThrough();
      component.setNAValue(event, colIndex, col, rowIndex);
      expect(component.setNAValue).toHaveBeenCalled();
    })
  });

  describe('onKpiInputChangeEvent', () => {
    it('makes expected call', ()=>{
      const event = {
        target: {
          value: 1234
        }
      };
      const colIndex = 23;
      const col = '2021A';
      const rowIndex =  0;
      component.targetCompanyKpiData = [{
        "2021A": 343,
          LTM: 232,
          NTM: 232
      }];
      component.rowHeader = [{
        editable: true,
        field: '2021A',
        header: '2021A'
      }];
      spyOn(component, 'onKpiInputChangeEvent').and.callThrough();
      spyOn(component, 'setNAValue').and.callThrough();
      spyOn(component, 'calculateFinalImpliedEvValues').and.callThrough();
      component.onKpiInputChangeEvent(event, colIndex, col, rowIndex);
      expect(component.onKpiInputChangeEvent).toHaveBeenCalled();
      expect(component.setNAValue).toHaveBeenCalled();
      expect(component.calculateFinalImpliedEvValues).toHaveBeenCalled();
    })
  });
});
