import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "primeng/api";
import { FundService } from "../../services/funds.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ToastrService } from "ngx-toastr";
import { FundTrackRecordStatic,NumberDecimalConst,M_Datatypes} from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { AddFundTrackRecordComponent } from "./fund-trackRecord.component";

describe("AddFundTrackRecordComponent", () => {
  let component: AddFundTrackRecordComponent;
  let fixture: ComponentFixture<AddFundTrackRecordComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const ngbActiveModalStub = () => ({ close: () => ({}) });
    const messageServiceStub = () => ({ clear: () => ({}) });
    const fundServiceStub = () => ({
      getFundTrackRecordConfiguration: model => ({ subscribe: f => f({}) }),
      saveFundTrackRecord: model => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      bindYearList: () => ({}),
      getQuarterLastDateByQuarter: (quarter, year) => ({}),
      getQuarterLastDate: arg => ({}),
      showInlineMessage: (messageService, string, string1) => ({})
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      error: (string, string1, object) => ({}),
      success: (string, string1, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddFundTrackRecordComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgbActiveModal, useFactory: ngbActiveModalStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    
    fixture = TestBed.createComponent(AddFundTrackRecordComponent);

    component = fixture.componentInstance;
    
  });
 
  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`saveText has default value`, () => {
    expect(component.saveText).toEqual(`Create`);
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual(component.yearOptions);
  });

  it(`mDataTypes has default value`, () => {
    expect(component.mDataTypes).toEqual(M_Datatypes);
  });

  it(`FundTrackRecordStaticinfo has default value`, () => {
    expect(component.FundTrackRecordStaticinfo).toEqual(FundTrackRecordStatic);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual(component.quarterOptions);
  });

  it(`isupdate has default value`, () => {
    expect(component.isupdate).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`customFieldsData has default value`, () => {
    expect(component.customFieldsData).toEqual([]);
  });

  it(`fundtrackData has default value`, () => {
    expect(component.fundtrackData).toEqual([]);
  });

 describe("calculateDPI", () => {
    it("makes expected calls", () => {
      spyOn(component, "hasValueInNumber").and.callThrough();
      component.calculateDPI();
      expect(component.hasValueInNumber).toHaveBeenCalled();
    });
  });

  describe("calculateRVPI", () => {
    it("makes expected calls", () => {
      spyOn(component, "hasValueInNumber").and.callThrough();
      component.calculateRVPI();
      expect(component.hasValueInNumber).toHaveBeenCalled();
    });
  });

  describe("onClose", () => {
    it("makes expected calls", () => {
      const ngbActiveModalStub: NgbActiveModal = fixture.debugElement.injector.get(
        NgbActiveModal
      );
      spyOn(ngbActiveModalStub, "close").and.callThrough();
      component.onClose();
      expect(ngbActiveModalStub.close).toHaveBeenCalled();
    });
  });

  describe("onInvestmentCostChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "calculateGrossMultiple").and.callThrough();
      spyOn(component, "calculateDPI").and.callThrough();
      spyOn(component, "calculateRVPI").and.callThrough();
      component.onInvestmentCostChange();
      expect(component.calculateGrossMultiple).toHaveBeenCalled();
      expect(component.calculateDPI).toHaveBeenCalled();
      expect(component.calculateRVPI).toHaveBeenCalled();
    });
  });
  describe("onUnRealizedValueChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "calculateTotalValue").and.callThrough();
      spyOn(component, "calculateRVPI").and.callThrough();
      component.onUnRealizedValueChange();
      expect(component.calculateTotalValue).toHaveBeenCalled();
      expect(component.calculateRVPI).toHaveBeenCalled();
    });
  });

 

  describe("calculateRealizedValue", () => {
    it("makes expected calls", () => {
      spyOn(component, "hasValueInNumber").and.callThrough();
      component.calculateRealizedValue();
      expect(component.hasValueInNumber).toHaveBeenCalled();
    });
  });

  describe("calculateUnRealizedValue", () => {
    it("makes expected calls", () => {
      spyOn(component, "hasValueInNumber").and.callThrough();
      component.calculateUnRealizedValue();
      expect(component.hasValueInNumber).toHaveBeenCalled();
    });
  });  
});
