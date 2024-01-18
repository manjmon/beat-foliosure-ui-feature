import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { AccountService } from "../../../services/account.service";
import { FundService } from "../../../services/funds.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { PermissionService,FeaturesEnum } from "../../../services/permission.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { ReportService ,ReportType} from "../../../services/report.service";
import { FormsModule } from "@angular/forms";
import { AttributionHomeReportsComponent } from "./attribution-home.report";

describe("AttributionHomeReportsComponent", () => {
  let component: AttributionHomeReportsComponent;
  let fixture: ComponentFixture<AttributionHomeReportsComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
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
    const permissionServiceStub = () => ({ isCheckTaabo: () => ({}) });
    const portfolioCompanyServiceStub = () => ({});
    const reportServiceStub = () => ({
      dataAvailabilityInReportEvent$: { subscribe: f => f({}) },
      events$: { subscribe: f => f({}) },
      getReportMasterData: () => ({ subscribe: f => f({}) }),
      ReportTypeList: { filter: () => ({}) },
      exportReports: model => ({ subscribe: f => f({}) }),
      ReportCategoryList: { filter: () => ({ length: {}, label: {} }) }
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AttributionHomeReportsComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: ReportService, useFactory: reportServiceStub }
      ]
    });
    spyOn(AttributionHomeReportsComponent.prototype, "getReportMasterData");
    fixture = TestBed.createComponent(AttributionHomeReportsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`showLeftScroll has default value`, () => {
    expect(component.showLeftScroll).toEqual(false);
  });

  it(`showRightScroll has default value`, () => {
    expect(component.showRightScroll).toEqual(true);
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

  it(`isTaabo has default value`, () => {
    expect(component.isTaabo).toEqual(false);
  });

  it(`isLarissa has default value`, () => {
    expect(component.isLarissa).toEqual(false);
  });

  it(`enableright has default value`, () => {
    expect(component.enableright).toEqual(true);
  });

  it(`enableleft has default value`, () => {
    expect(component.enableleft).toEqual(false);
  });

  it(`showTopBottom has default value`, () => {
    expect(component.showTopBottom).toEqual(true);
  });

  describe("constructor", () => {
    it("makes expected calls", () => {
      expect(
        AttributionHomeReportsComponent.prototype.getReportMasterData
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

  describe("setScrollButtonVisibility", () => {
    it("makes expected calls", () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      spyOn(component, "stopRightScrolling").and.callThrough();
      spyOn(component, "stopLeftScrolling").and.callThrough();
      spyOn(changeDetectorRefStub, "detectChanges").and.callThrough();
      component.setScrollButtonVisibility();
      expect(component.stopRightScrolling).toHaveBeenCalled();
      expect(component.stopLeftScrolling).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
    });
  });
});
