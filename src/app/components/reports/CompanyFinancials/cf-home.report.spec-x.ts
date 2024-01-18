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
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { FeaturesEnum } from "../../../services/permission.service";
import { CFReportsComponent } from "./cf-home.report";

describe("CFReportsComponent", () => {
  let component: CFReportsComponent;
  let fixture: ComponentFixture<CFReportsComponent>;

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
      downloadExcelFile: response => ({}),
      getTitle: arg => ({})
    });
    const portfolioCompanyServiceStub = () => ({});
    const reportServiceStub = () => ({
      dataAvailabilityInReportEvent$: { subscribe: f => f({}) },
      events$: { subscribe: f => f({}) },
      getReportMasterData: () => ({ subscribe: f => f({}) }),
      ReportTypeList: {
        filter: () => ({ filter: () => ({}), value: {}, forEach: () => ({}) })
      },
      exportReports: model => ({ subscribe: f => f({}) }),
      ReportCategoryList: { filter: () => ({ length: {}, label: {} }) }
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CFReportsComponent],
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
    spyOn(CFReportsComponent.prototype, "getReportMasterData");
    fixture = TestBed.createComponent(CFReportsComponent);
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

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`kpiTabList has default value`, () => {
    expect(component.kpiTabList).toEqual([]);
  });

  it(`showTopBottom has default value`, () => {
    expect(component.showTopBottom).toEqual(true);
  });

  describe("onTabClick", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const iTabStub: ITab = <any>{};
      spyOn(component, "getCurrentTab").and.callThrough();
      spyOn(miscellaneousServiceStub, "getTitle").and.callThrough();
      component.onTabClick(iTabStub);
      expect(component.getCurrentTab).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getTitle).toHaveBeenCalled();
    });
  });

  describe("constructor", () => {
    it("makes expected calls", () => {
      expect(
        CFReportsComponent.prototype.getReportMasterData
      ).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getTabList").and.callThrough();
      spyOn(component, "changeReportCategory").and.callThrough();
      component.ngOnInit();
      expect(component.getTabList).toHaveBeenCalled();
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

  describe("getTabList", () => {
    it("makes expected calls", () => {
      spyOn(component, "getCurrentTab").and.callThrough();
      component.getTabList();
      expect(component.getCurrentTab).toHaveBeenCalled();
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
