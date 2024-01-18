import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from "../../../services/account.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { ReportService,ReportCategory,ReportType } from "../../../services/report.service";
import { AppSettingService } from "../../../services/appsettings.service";
import { NumberDecimalConst } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { HoldingValuesComponent } from "./holding-values.report";

describe("HoldingValuesComponent", () => {
  let component: HoldingValuesComponent;
  let fixture: ComponentFixture<HoldingValuesComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const ngxSpinnerServiceStub = () => ({ hide: () => ({}) });
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      getCountryListByRegionIds: regionIds => ({ subscribe: f => f({}) })
    });
    const reportServiceStub = () => ({
      getReportData: model => ({ subscribe: f => f({}) }),
      setDataAvailabilityInReport: arg => ({}),
      ReportTypeList: {
        filter: () => ({ length: {}, filter: () => ({}), value: {} })
      }
    });
    const appSettingServiceStub = () => ({ getConfig: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HoldingValuesComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ReportService, useFactory: reportServiceStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub }
      ]
    });
    spyOn(HoldingValuesComponent.prototype, "setReportTypeList");
    fixture = TestBed.createComponent(HoldingValuesComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`showStatusFilter has default value`, () => {
    expect(component.showStatusFilter).toEqual(true);
  });

  it(`cols has default value`, () => {
    expect(component.cols).toEqual([]);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`reportType has default value`, () => {
    expect(component.reportType).toEqual(ReportType);
  });

  it(`reportCategory has default value`, () => {
    expect(component.reportCategory).toEqual(ReportCategory);
  });

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`filterSection has default value`, () => {
    expect(component.filterSection).toEqual(true);
  });

  it(`data has default value`, () => {
    expect(component.data).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  describe("constructor", () => {
    it("makes expected calls", () => {
      expect(
        HoldingValuesComponent.prototype.setReportTypeList
      ).toHaveBeenCalled();
    });
  });

  describe("bindReportMasterModel", () => {
    it("makes expected calls", () => {
      (<jasmine.Spy>component.setReportTypeList).calls.reset();
      spyOn(component, "resetForm").and.callThrough();
      component.bindReportMasterModel();
      expect(component.setReportTypeList).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
    });
  });

  describe("getTopHoldingReports", () => {
    it("makes expected calls", () => {
      const ngxSpinnerServiceStub: NgxSpinnerService = fixture.debugElement.injector.get(
        NgxSpinnerService
      );
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(component, "CheckIfNoDataInReport").and.callThrough();
      spyOn(ngxSpinnerServiceStub, "hide").and.callThrough();
      spyOn(reportServiceStub, "getReportData").and.callThrough();
      component.getTopHoldingReports();
      expect(component.CheckIfNoDataInReport).toHaveBeenCalled();
      expect(ngxSpinnerServiceStub.hide).toHaveBeenCalled();
      expect(reportServiceStub.getReportData).toHaveBeenCalled();
    });
  });

  describe("CheckIfNoDataInReport", () => {
    it("makes expected calls", () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, "setDataAvailabilityInReport").and.callThrough();
      component.CheckIfNoDataInReport();
      expect(reportServiceStub.setDataAvailabilityInReport).toHaveBeenCalled();
    });
  });

  describe("GetCountryListByRegionIds", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "getCountryListByRegionIds"
      ).and.callThrough();
      component.GetCountryListByRegionIds();
      expect(
        miscellaneousServiceStub.getCountryListByRegionIds
      ).toHaveBeenCalled();
    });
  });
});
