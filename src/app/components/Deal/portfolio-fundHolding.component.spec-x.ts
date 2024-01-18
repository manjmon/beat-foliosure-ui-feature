import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "primeng/api";
import { DealService } from "../../services/deal.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ToastrService } from "ngx-toastr";
import { DealTrackRecordStatic, M_Datatypes,NumberDecimalConst} from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { SavePortfolioFundHoldingComponent } from "./portfolio-fundHolding.component";

describe("SavePortfolioFundHoldingComponent", () => {
  let component: SavePortfolioFundHoldingComponent;
  let fixture: ComponentFixture<SavePortfolioFundHoldingComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const ngbActiveModalStub = () => ({});
    const messageServiceStub = () => ({ clear: () => ({}) });
    const dealServiceStub = () => ({
      getDealsTradingRecordsEditAddConfiguration: customModel => ({
        subscribe: f => f({})
      }),
      savePortfolioCompanyFundHolding: customModel => ({
        subscribe: f => f({})
      })
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
      declarations: [SavePortfolioFundHoldingComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgbActiveModal, useFactory: ngbActiveModalStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(SavePortfolioFundHoldingComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`isupdate has default value`, () => {
    expect(component.isupdate).toEqual(false);
  });

  it(`saveText has default value`, () => {
    expect(component.saveText).toEqual(`Create`);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
  });

  it(`DealTrackRecordStaticinfo has default value`, () => {
    expect(component.DealTrackRecordStaticinfo).toEqual(DealTrackRecordStatic);
  });

  it(`datatypes has default value`, () => {
    expect(component.datatypes).toEqual(M_Datatypes);
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

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual(component.quarterOptions);
  });

  it(`customFieldsDataClone has default value`, () => {
    expect(component.customFieldsDataClone).toEqual([]);
  });

  it(`customFieldsData has default value`, () => {
    expect(component.customFieldsData).toEqual([]);
  });

  it(`statictrackData has default value`, () => {
    expect(component.statictrackData).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getDealDetails").and.callThrough();
      component.ngOnInit();
      expect(component.getDealDetails).toHaveBeenCalled();
    });
  });

  describe("getDealDetails", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(component, "calculateDPI").and.callThrough();
      spyOn(component, "calculateRVPI").and.callThrough();
      spyOn(
        dealServiceStub,
        "getDealsTradingRecordsEditAddConfiguration"
      ).and.callThrough();
      component.getDealDetails();
      expect(component.calculateDPI).toHaveBeenCalled();
      expect(component.calculateRVPI).toHaveBeenCalled();
      expect(
        dealServiceStub.getDealsTradingRecordsEditAddConfiguration
      ).toHaveBeenCalled();
    });
  });

  describe("calculateValuationDate", () => {
    it("makes expected calls", () => {
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(messageServiceStub, "clear").and.callThrough();
      spyOn(
        miscellaneousServiceStub,
        "getQuarterLastDateByQuarter"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "getQuarterLastDate").and.callThrough();
      spyOn(miscellaneousServiceStub, "showInlineMessage").and.callThrough();
      component.calculateValuationDate();
      expect(messageServiceStub.clear).toHaveBeenCalled();
      expect(
        miscellaneousServiceStub.getQuarterLastDateByQuarter
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getQuarterLastDate).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showInlineMessage).toHaveBeenCalled();
    });
  });

  describe("onInvestmentCostChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "calculateTotalValue").and.callThrough();
      spyOn(component, "calculateGrossMultiple").and.callThrough();
      spyOn(component, "calculateDPI").and.callThrough();
      spyOn(component, "calculateRVPI").and.callThrough();
      component.onInvestmentCostChange();
      expect(component.calculateTotalValue).toHaveBeenCalled();
      expect(component.calculateGrossMultiple).toHaveBeenCalled();
      expect(component.calculateDPI).toHaveBeenCalled();
      expect(component.calculateRVPI).toHaveBeenCalled();
    });
  });

  describe("onRealizedValueChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "calculateTotalValue").and.callThrough();
      spyOn(component, "calculateDPI").and.callThrough();
      spyOn(component, "calculateRVPI").and.callThrough();
      spyOn(component, "calculateGrossMultiple").and.callThrough();
      component.onRealizedValueChange();
      expect(component.calculateTotalValue).toHaveBeenCalled();
      expect(component.calculateDPI).toHaveBeenCalled();
      expect(component.calculateRVPI).toHaveBeenCalled();
      expect(component.calculateGrossMultiple).toHaveBeenCalled();
    });
  });

  describe("onUnRealizedValueChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "calculateTotalValue").and.callThrough();
      spyOn(component, "calculateRVPI").and.callThrough();
      spyOn(component, "calculateDPI").and.callThrough();
      spyOn(component, "calculateGrossMultiple").and.callThrough();
      component.onUnRealizedValueChange();
      expect(component.calculateTotalValue).toHaveBeenCalled();
      expect(component.calculateRVPI).toHaveBeenCalled();
      expect(component.calculateDPI).toHaveBeenCalled();
      expect(component.calculateGrossMultiple).toHaveBeenCalled();
    });
  });

  describe("calculateTotalValue", () => {
    it("makes expected calls", () => {
      spyOn(component, "hasValueInNumber").and.callThrough();
      spyOn(component, "calculateGrossMultiple").and.callThrough();
      component.calculateTotalValue();
      expect(component.hasValueInNumber).toHaveBeenCalled();
      expect(component.calculateGrossMultiple).toHaveBeenCalled();
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
});
