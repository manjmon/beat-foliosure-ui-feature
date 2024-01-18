import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from "../../../services/account.service";
import { DealService } from "src/app/services/deal.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { ReportService,ReportType } from "../../../services/report.service";
import { AppSettingService } from "../../../services/appsettings.service";
import { PermissionService } from "src/app/services/permission.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { FilterService } from "src/app/services/filter.services";
import { ToastrService } from "ngx-toastr";
import { NumberDecimalConst ,FundEnum} from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { AttributionReportsComponent } from "./attribution.report";

describe("AttributionReportsComponent", () => {
  let component: AttributionReportsComponent;
  let fixture: ComponentFixture<AttributionReportsComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const ngxSpinnerServiceStub = () => ({ hide: () => ({}) });
    const accountServiceStub = () => ({ redirectToLogin: error => ({}) });
    const dealServiceStub = () => ({
      getLatestDealQuarterYear: () => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      sortArray: (regionCountryMappingList, string) => ({}),
      removeDuplicates: arg => ({ includes: () => ({}), filter: () => ({}) }),
      getCountryListByRegionIds: regionIds => ({ subscribe: f => f({}) }),
      downloadExcelFile: response => ({})
    });
    const reportServiceStub = () => ({
      getReportData: model => ({ subscribe: f => f({}) }),
      setDataAvailabilityInReport: arg => ({}),
      ReportTypeList: { filter: () => ({}) },
      exportReports: model => ({ subscribe: f => f({}) })
    });
    const appSettingServiceStub = () => ({ getConfig: () => ({}) });
    const permissionServiceStub = () => ({ isCheckTaabo: () => ({}) });
    const portfolioCompanyServiceStub = () => ({
      get_RegionCountrys_ByFundId: fundIds => ({ subscribe: f => f({}) })
    });
    const filterServiceStub = () => ({
      SaveFilter: filter => ({ subscribe: f => f({}) }),
      DeleteFilter: userReportId => ({ subscribe: f => f({}) }),
      getFilter: userReportId => ({ subscribe: f => f({}) }),
      UpdateFilter: response => ({ subscribe: f => f({}) }),
      getFilters: () => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      success: (filterAddedSuccesfully, string, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AttributionReportsComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ReportService, useFactory: reportServiceStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: FilterService, useFactory: filterServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    spyOn(AttributionReportsComponent.prototype, "getTabList");
    spyOn(AttributionReportsComponent.prototype, "setReportTypeList");
    fixture = TestBed.createComponent(AttributionReportsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`disablePrimaryButton has default value`, () => {
    expect(component.disablePrimaryButton).toEqual(true);
  });

  it(`DuplicateRecord has default value`, () => {
    expect(component.DuplicateRecord).toEqual(false);
  });

  it(`EditDuplicateRecord has default value`, () => {
    expect(component.EditDuplicateRecord).toEqual(false);
  });

  it(`customWidth has default value`, () => {
    expect(component.customWidth).toEqual(`303px`);
  });

  it(`filterSection has default value`, () => {
    expect(component.filterSection).toEqual(true);
  });

  it(`showRangeFilter has default value`, () => {
    expect(component.showRangeFilter).toEqual(false);
  });

  it(`confirmSave has default value`, () => {
    expect(component.confirmSave).toEqual(false);
  });

  it(`confirmDelete has default value`, () => {
    expect(component.confirmDelete).toEqual(false);
  });

  it(`NewlyAddedId has default value`, () => {
    expect(component.NewlyAddedId).toEqual(0);
  });

  it(`EditMode has default value`, () => {
    expect(component.EditMode).toEqual(false);
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

  it(`collapsed has default value`, () => {
    expect(component.collapsed).toEqual(true);
  });

  it(`rangeInvalid has default value`, () => {
    expect(component.rangeInvalid).toEqual(false);
  });

  it(`partsRequired has default value`, () => {
    expect(component.partsRequired).toEqual(false);
  });

  it(`isReportDataVisible has default value`, () => {
    expect(component.isReportDataVisible).toEqual(false);
  });

  it(`DeleteDisabled has default value`, () => {
    expect(component.DeleteDisabled).toEqual(true);
  });

  it(`IsItemSelected has default value`, () => {
    expect(component.IsItemSelected).toEqual(false);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  it(`types has default value`, () => {
    expect(component.types).toEqual(component.types);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`isTaabo has default value`, () => {
    expect(component.isTaabo).toEqual(component.isTaabo);
  });

  it(`isDisplayCountry has default value`, () => {
    expect(component.isDisplayCountry).toEqual(true);
  });

  it(`isDisplayRegion has default value`, () => {
    expect(component.isDisplayRegion).toEqual(true);
  });

  it(`regionCountryMappingList has default value`, () => {
    expect(component.regionCountryMappingList).toEqual([]);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`FundEnum has default value`, () => {
    expect(component.FundEnum).toEqual(FundEnum);
  });

  it(`enableTab has default value`, () => {
    expect(component.enableTab).toEqual(`Graphs`);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`ShowFilterUpdated has default value`, () => {
    expect(component.ShowFilterUpdated).toEqual(false);
  });

  it(`frozenTableColumns has default value`, () => {
    expect(component.frozenTableColumns).toEqual([]);
  });

  it(`tableColumns has default value`, () => {
    expect(component.tableColumns).toEqual([]);
  });

  it(`tableData has default value`, () => {
    expect(component.tableData).toEqual([]);
  });

  it(`displayFullView has default value`, () => {
    expect(component.displayFullView).toEqual(false);
  });

  describe("constructor", () => {
    it("makes expected calls", () => {
      expect(
        AttributionReportsComponent.prototype.getTabList
      ).toHaveBeenCalled();
      expect(
        AttributionReportsComponent.prototype.setReportTypeList
      ).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(component, "getDealLatestQuarter").and.callThrough();
      spyOn(permissionServiceStub, "isCheckTaabo").and.callThrough();
      component.ngOnInit();
      expect(component.getDealLatestQuarter).toHaveBeenCalled();
      expect(permissionServiceStub.isCheckTaabo).toHaveBeenCalled();
    });
  });

  describe("bindReportMasterModel", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      (<jasmine.Spy>component.setReportTypeList).calls.reset();
      spyOn(component, "resetForm").and.callThrough();
      spyOn(miscellaneousServiceStub, "sortArray").and.callThrough();
      component.bindReportMasterModel();
      expect(component.setReportTypeList).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
      expect(miscellaneousServiceStub.sortArray).toHaveBeenCalled();
    });
  });

  describe("getAttributionReports", () => {
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
      component.getAttributionReports();
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

  describe("GetCountryListByRegionId", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "DoEnableFilters").and.callThrough();
      spyOn(
        miscellaneousServiceStub,
        "getCountryListByRegionIds"
      ).and.callThrough();
      component.GetCountryListByRegionId();
      expect(component.DoEnableFilters).toHaveBeenCalled();
      expect(
        miscellaneousServiceStub.getCountryListByRegionIds
      ).toHaveBeenCalled();
    });
  });

  describe("onDateSelect", () => {
    it("makes expected calls", () => {
      spyOn(component, "DoEnableFilters").and.callThrough();
      component.dateRange.push(new Date());
      component.onDateSelect();
      expect(component.DoEnableFilters).toHaveBeenCalled();
    });
  });

  describe("onDateClear", () => {
    it("makes expected calls", () => {
      spyOn(component, "DoEnableFilters").and.callThrough();
      component.onDateClear();
      expect(component.DoEnableFilters).toHaveBeenCalled();
    });
  });

  describe("exportAttributionReport", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      spyOn(reportServiceStub, "exportReports").and.callThrough();
      component.exportAttributionReport();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(reportServiceStub.exportReports).toHaveBeenCalled();
    });
  });

  describe("onSave", () => {
    it("makes expected calls", () => {
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, "LoadFilters").and.callThrough();
      spyOn(filterServiceStub, "SaveFilter").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      component.onSave();
      expect(component.LoadFilters).toHaveBeenCalled();
      expect(filterServiceStub.SaveFilter).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });

  describe("Delete", () => {
    it("makes expected calls", () => {
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, "LoadFilters").and.callThrough();
      spyOn(component, "resetForm").and.callThrough();
      spyOn(filterServiceStub, "DeleteFilter").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      component.Delete();
      expect(component.LoadFilters).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
      expect(filterServiceStub.DeleteFilter).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });

  describe("Update", () => {
    it("makes expected calls", () => {
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(filterServiceStub, "getFilter").and.callThrough();
      spyOn(filterServiceStub, "UpdateFilter").and.callThrough();
      component.Update();
      expect(filterServiceStub.getFilter).toHaveBeenCalled();
      expect(filterServiceStub.UpdateFilter).toHaveBeenCalled();
    });
  });

  describe("OnFiltersSelected", () => {
    it("makes expected calls", () => {
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(component, "LoadSavedFilter").and.callThrough();
      spyOn(component, "getAttributionReports").and.callThrough();
      spyOn(filterServiceStub, "getFilter").and.callThrough();
      component.OnFiltersSelected();
      expect(component.LoadSavedFilter).toHaveBeenCalled();
      expect(component.getAttributionReports).toHaveBeenCalled();
      expect(filterServiceStub.getFilter).toHaveBeenCalled();
    });
  });

  describe("LoadFilters", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(accountServiceStub, "redirectToLogin").and.callThrough();
      spyOn(filterServiceStub, "getFilters").and.callThrough();
      component.LoadFilters();
      expect(accountServiceStub.redirectToLogin).toHaveBeenCalled();
      expect(filterServiceStub.getFilters).toHaveBeenCalled();
    });
  });

  describe("getDealLatestQuarter", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(dealServiceStub, "getLatestDealQuarterYear").and.callThrough();
      component.getDealLatestQuarter();
      expect(dealServiceStub.getLatestDealQuarterYear).toHaveBeenCalled();
    });
  });
});
