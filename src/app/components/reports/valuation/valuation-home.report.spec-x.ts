import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { AccountService } from "../../../services/account.service";
import { FundService } from "../../../services/funds.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { ReportService,ReportType } from "../../../services/report.service";
import { FeaturesEnum } from "../../../services/permission.service";
import { ValuationReportsComponent } from "./valuation-home.report";

describe("ValuationReportsComponent", () => {
  let component: ValuationReportsComponent;
  let fixture: ComponentFixture<ValuationReportsComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const activatedRouteStub = () => ({});
    const ngxSpinnerServiceStub = () => ({});
    const messageServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const fundServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      sortArray: (fundList, string) => ({}),
      getCountryListByRegionIds: regionIds => ({ subscribe: f => f({}) }),
      downloadExcelFile: response => ({})
    });
    const portfolioCompanyServiceStub = () => ({});
    const reportServiceStub = () => ({
      dataAvailabilityInReportEvent$: { subscribe: f => f({}) },
      events$: { subscribe: f => f({}) },
      getReportMasterData: () => ({ subscribe: f => f({}) }),
      ReportTypeList: { filter: () => ({ filter: () => ({}), value: {} }) },
      exportReports: model => ({ subscribe: f => f({}) }),
      ReportCategoryList: { filter: () => ({ length: {}, label: {} }) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ValuationReportsComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: ReportService, useFactory: reportServiceStub }
      ]
    });
    spyOn(ValuationReportsComponent.prototype, "getReportMasterData");
    fixture = TestBed.createComponent(ValuationReportsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`filterSection has default value`, () => {
    expect(component.filterSection).toEqual(true);
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

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`types has default value`, () => {
    expect(component.types).toEqual([]);
  });

  it(`subReportTypeList has default value`, () => {
    expect(component.subReportTypeList).toEqual([]);
  });

  it(`isDataAvailableInReports has default value`, () => {
    expect(component.isDataAvailableInReports).toEqual(false);
  });

  it(`showTopBottom has default value`, () => {
    expect(component.showTopBottom).toEqual(true);
  });

  describe("constructor", () => {
    it("makes expected calls", () => {
      expect(
        ValuationReportsComponent.prototype.getReportMasterData
      ).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "changeReportCategory").and.callThrough();
      component.ngOnInit();
      expect(component.changeReportCategory).toHaveBeenCalled();
    });
  });

  describe("onRegionChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "GetCountryListByRegionIds").and.callThrough();
      component.onRegionChange();
      expect(component.GetCountryListByRegionIds).toHaveBeenCalled();
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
      spyOn(miscellaneousServiceStub, "sortArray").and.callThrough();
      component.GetCountryListByRegionIds();
      expect(
        miscellaneousServiceStub.getCountryListByRegionIds
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.sortArray).toHaveBeenCalled();
    });
  });

  describe("exportTopHoldingReport", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      spyOn(reportServiceStub, "exportReports").and.callThrough();
      component.exportTopHoldingReport();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(reportServiceStub.exportReports).toHaveBeenCalled();
    });
  });

  describe("setDefaultReportCategory", () => {
    it("makes expected calls", () => {
      spyOn(component, "setReportTypeList").and.callThrough();
      component.setDefaultReportCategory();
      expect(component.setReportTypeList).toHaveBeenCalled();
    });
  });
});
