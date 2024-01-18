import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ElementRef,Renderer2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { KPIDataService } from 'src/app/services/kpi-data.service';
import { KpiFormulaBuilderComponent } from './kpi-formula-builder.component';
import { of } from 'rxjs';
describe('KpiFormulaBuilderComponent', () => {
  let component: KpiFormulaBuilderComponent;
  let fixture: ComponentFixture<KpiFormulaBuilderComponent>;

  beforeEach(() => {
    const elementRefStub = () => ({});
    const renderer2Stub = () => ({});
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (string, string1, object) => ({})
    });
    const kPIDataServiceStub = () => ({
      getKPIsByType: (type, companyId) => ({ subscribe: f => of({}) }),
      GetKpiFormula: formulaModel => ({ subscribe: f => f({}) }),
      UpdateFormulaByKPIId: formulaModel => ({ subscribe: f => of({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [KpiFormulaBuilderComponent],
      providers: [
        { provide: ElementRef, useFactory: elementRefStub },
        { provide: Renderer2, useFactory: renderer2Stub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: KPIDataService, useFactory: kPIDataServiceStub }
      ]
    });
    fixture = TestBed.createComponent(KpiFormulaBuilderComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`kpiList has default value`, () => {
    expect(component.kpiList).toEqual([]);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`kpiHeaders has default value`, () => {
    expect(component.kpiHeaders.length).toEqual(1);
  });

  it(`kpiId has default value`, () => {
    expect(component.kpiId).toEqual(0);
  });

  it(`kpiMappingId has default value`, () => {
    expect(component.kpiMappingId).toEqual(0);
  });

  it(`isMapping has default value`, () => {
    expect(component.isMapping).toEqual(false);
  });

  it(`isDisplay has default value`, () => {
    expect(component.isDisplay).toEqual(false);
  });

  it(`originalKPIList has default value`, () => {
    expect(component.originalKPIList).toEqual([]);
  });

  it(`kpiDropDownList has default value`, () => {
    expect(component.kpiDropDownList).toEqual([]);
  });

  it(`errorUlMessage has default value`, () => {
    expect(component.errorUlMessage).toEqual(`Unknown Value:`);
  });

  it(`isError has default value`, () => {
    expect(component.isError).toEqual(false);
  });

  it(`isDisabledBtn has default value`, () => {
    expect(component.isDisabledBtn).toEqual(true);
  });

  it(`companyId has default value`, () => {
    expect(component.companyId).toEqual(`0`);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`kpiDynamicId has default value`, () => {
    expect(component.kpiDynamicId).toEqual(0);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getKpiList').and.callThrough();
      spyOn(component, 'getTillCursor').and.callThrough();
      spyOn(component, 'getKpiFormula').and.callThrough();
      component.ngOnInit();
      expect(component.getKpiList).toHaveBeenCalled();
      expect(component.getTillCursor).toHaveBeenCalled();
      expect(component.getKpiFormula).toHaveBeenCalled();
    });
  });

  describe('setExistingFormula', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createEmptyElement').and.callThrough();
      spyOn(component, 'setFocus').and.callThrough();
      spyOn(component, 'setStatus').and.callThrough();
      component.setExistingFormula();
      expect(component.createEmptyElement).toHaveBeenCalled();
      expect(component.setFocus).toHaveBeenCalled();
      expect(component.setStatus).toHaveBeenCalled();
    });
  });

  describe('getKpiFormula', () => {
    it('makes expected calls', () => {
      const kPIDataServiceStub: KPIDataService = fixture.debugElement.injector.get(
        KPIDataService
      );
      spyOn(component, 'setExistingFormula').and.callThrough();
      spyOn(kPIDataServiceStub, 'GetKpiFormula').and.callThrough();
      component.getKpiFormula();
      expect(component.setExistingFormula).toHaveBeenCalled();
    });
  });

  describe('clearFormula', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createEmptyElement').and.callThrough();
      spyOn(component, 'setFocus').and.callThrough();
      spyOn(component, 'setStatus').and.callThrough();
      component.clearFormula();
      expect(component.createEmptyElement).toHaveBeenCalled();
      expect(component.setFocus).toHaveBeenCalled();
      expect(component.setStatus).toHaveBeenCalled();
    });
  });

  describe('saveFormula', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const kPIDataServiceStub: KPIDataService = fixture.debugElement.injector.get(
        KPIDataService
      );
      spyOn(component, 'getKpiType').and.callThrough();
      spyOn(component, 'getFormulas').and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(kPIDataServiceStub, 'UpdateFormulaByKPIId').and.callThrough();
      component.saveFormula();
      expect(component.getKpiType).toHaveBeenCalled();
      expect(component.getFormulas).toHaveBeenCalled();
    });
  });

  describe('getTillCursor', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getCaretCharacterOffsetWithin').and.callThrough();
      component.getTillCursor();
      expect(component.getCaretCharacterOffsetWithin).toHaveBeenCalled();
    });
  });

  describe('getLastWordBeforeCursor', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getTillCursor').and.callThrough();
      component.getLastWordBeforeCursor();
      expect(component.getTillCursor).toHaveBeenCalled();
    });
  });

  describe('getLastElementBeforeCursor', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getTillCursor').and.callThrough();
      component.getLastElementBeforeCursor();
      expect(component.getTillCursor).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setFocus').and.callThrough();
      spyOn(component, 'setListener').and.callThrough();
      component.ngAfterViewInit();
      expect(component.setFocus).toHaveBeenCalled();
      expect(component.setListener).toHaveBeenCalled();
    });
  });

  describe('setFocus', () => {
    it('makes expected calls', () => {
      spyOn(component, 'createEmptyElement').and.callThrough();
      component.setFocus();
      expect(component.createEmptyElement).toHaveBeenCalled();
    });
  });
  
});
