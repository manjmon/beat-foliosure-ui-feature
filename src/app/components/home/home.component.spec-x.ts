import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ReportService } from "../../services/report.service";
import { AppSettingService } from "../../services/appsettings.service";
import { PermissionService } from "src/app/services/permission.service";
import { NumberDecimalConst } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      bindYearList: () => ({}),
      getJSON: string => ({ subscribe: f => f({}) }),
      getRegionList: () => ({ subscribe: f => f({}) })
    });
    const reportServiceStub = () => ({
      getReportData: model => ({ subscribe: f => f({}) }),
      getTotalCounts: () => ({ subscribe: f => f({}) })
    });
    const appSettingServiceStub = () => ({ getConfig: () => ({}) });
    const permissionServiceStub = () => ({ isCheckTaabo: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HomeComponent],
      providers: [
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ReportService, useFactory: reportServiceStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub }
      ]
    });
    spyOn(HomeComponent.prototype, "getTotalCounts");
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`fundgrowthPieChartData has default value`, () => {
    expect(component.fundgrowthPieChartData).toEqual([]);
  });

  it(`fundgrowthBarChartData has default value`, () => {
    expect(component.fundgrowthBarChartData).toEqual([]);
  });

  it(`fundgrowthLineChartData has default value`, () => {
    expect(component.fundgrowthLineChartData).toEqual([]);
  });

  it(`strategyUnrealizedValueData has default value`, () => {
    expect(component.strategyUnrealizedValueData).toEqual([]);
  });

  it(`strategyTotalValueData has default value`, () => {
    expect(component.strategyTotalValueData).toEqual([]);
  });

  it(`sectorWiseAttributionData has default value`, () => {
    expect(component.sectorWiseAttributionData).toEqual([]);
  });

  it(`sectorData has default value`, () => {
    expect(component.sectorData).toEqual([]);
  });

  it(`regionData has default value`, () => {
    expect(component.regionData).toEqual([]);
  });

  it(`topCompanyData has default value`, () => {
    expect(component.topCompanyData).toEqual([]);
  });

  it(`TVPIByVintageYear has default value`, () => {
    expect(component.TVPIByVintageYear).toEqual([]);
  });

  it(`regionList has default value`, () => {
    expect(component.regionList).toEqual([]);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`dataLoaded has default value`, () => {
    expect(component.dataLoaded).toEqual(false);
  });

  it(`isWorldMapVisible has default value`, () => {
    expect(component.isWorldMapVisible).toEqual(true);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });
  it(`FromDate has default value`, () => {
    expect(component.FromDate).toEqual(2007);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual([]);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`QuarterYear has default value`, () => {
    expect(component.QuarterYear).toEqual([]);
  });

  describe("constructor", () => {
    it("makes expected calls", () => {
      expect(HomeComponent.prototype.getTotalCounts).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(component, "getFundWiseGrowthReports").and.callThrough();
      spyOn(component, "getRegionList").and.callThrough();
      spyOn(miscellaneousServiceStub, "bindYearList").and.callThrough();
      spyOn(miscellaneousServiceStub, "getJSON").and.callThrough();
      spyOn(permissionServiceStub, "isCheckTaabo").and.callThrough();
      component.ngOnInit();
      expect(component.getFundWiseGrowthReports).toHaveBeenCalled();
      expect(component.getRegionList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.bindYearList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getJSON).toHaveBeenCalled();
      expect(permissionServiceStub.isCheckTaabo).toHaveBeenCalled();
    });
  });

  describe("getFundWiseGrowthReportsNextLoad", () => {
    it("makes expected calls", () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, "getReportData").and.callThrough();
      component.getFundWiseGrowthReportsNextLoad();
      expect(reportServiceStub.getReportData).toHaveBeenCalled();
    });
  });

  describe("getRegionList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getRegionList").and.callThrough();
      component.getRegionList();
      expect(miscellaneousServiceStub.getRegionList).toHaveBeenCalled();
    });
  });

  describe("getTotalCounts", () => {
    it("makes expected calls", () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, "getTotalCounts").and.callThrough();
      (<jasmine.Spy>component.getTotalCounts).and.callThrough();
      component.getTotalCounts();
      expect(reportServiceStub.getTotalCounts).toHaveBeenCalled();
    });
  });
});
